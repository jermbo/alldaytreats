import { getCartItems, getCartSubtotal, clearCart } from "./cart.js";
import {
	validateRequired,
	validateEmail,
	validatePhone,
	validateAddress,
	validateZipCode,
	validateForm,
} from "./validation.js";
import {
	showFieldError,
	clearFieldError,
	clearAllErrors,
	focusFirstInvalidField,
} from "./validation-ui.js";
import { initPhoneFormatter } from "./phone-formatter.js";
import { getToppingById, calculateToppingPrice } from "../config/toppings.ts";
import { getDeliveryOptions, getDeliveryFee } from "../config/delivery.ts";

// Modal element references
let checkoutModal = null;
let checkoutForm = null;

// Step elements
let stepInfo = null;
let stepInstructions = null;
let stepSuccess = null;

// Cached DOM references
let summaryItemsContainer = null;
let summarySubtotalEl = null;
let summaryDeliveryEl = null;
let summaryTotalEl = null;
let submitBtn = null;
let countdownEl = null;
let zipCodeField = null;

// State
let currentStep = "info";
let formattedOrderText = "";
let orderId = "";
let autoCloseTimer = null;
let countdownInterval = null;
let selectedDeliveryFee = null;

/**
 * Initialize checkout UI
 * @param {HTMLElement} modalElement - Checkout modal element
 * @returns {void}
 */
export const initCheckoutUI = (modalElement) => {
	checkoutModal = modalElement;

	if (!checkoutModal) return;

	// Cache step elements
	stepInfo = checkoutModal.querySelector('[data-step="info"]');
	stepInstructions = checkoutModal.querySelector('[data-step="instructions"]');
	stepSuccess = checkoutModal.querySelector('[data-step="success"]');

	// Cache DOM references
	summaryItemsContainer = checkoutModal.querySelector(
		".checkout-modal__summary-items"
	);
	summarySubtotalEl = checkoutModal.querySelector(
		".checkout-modal__summary-subtotal"
	);
	summaryDeliveryEl = checkoutModal.querySelector(
		".checkout-modal__summary-delivery"
	);
	summaryTotalEl = checkoutModal.querySelector(
		".checkout-modal__summary-total"
	);
	checkoutForm = checkoutModal.querySelector("#checkout-form");
	submitBtn = checkoutModal.querySelector(".checkout-modal__btn--primary");
	countdownEl = checkoutModal.querySelector(".checkout-modal__countdown-value");
	zipCodeField = checkoutModal.querySelector("#checkout-zipcode");

	// Populate zip code dropdown
	if (zipCodeField) {
		populateZipCodeDropdown(zipCodeField);
	}

	// Setup button handlers using data-action attributes
	checkoutModal.addEventListener("click", handleModalClick);

	// Form submission handler
	if (checkoutForm) {
		checkoutForm.addEventListener("submit", handleFormSubmit);

		// Initialize phone number formatter
		const phoneField = checkoutForm.querySelector("#checkout-phone");
		if (phoneField) {
			initPhoneFormatter(phoneField);
		}

		setupFieldValidation(checkoutForm);
	}

	// Direct click handler on submit button for mobile compatibility
	// Some mobile browsers don't properly trigger form submit on button click
	if (submitBtn) {
		submitBtn.addEventListener("click", () => {
			if (!submitBtn.disabled && checkoutForm) {
				const submitEvent = new Event("submit", {
					bubbles: true,
					cancelable: true,
				});
				checkoutForm.dispatchEvent(submitEvent);
			}
		});

		// Touchend handler for mobile devices where click might not fire
		submitBtn.addEventListener("touchend", (e) => {
			if (!submitBtn.disabled && checkoutForm) {
				e.preventDefault();
				const submitEvent = new Event("submit", {
					bubbles: true,
					cancelable: true,
				});
				checkoutForm.dispatchEvent(submitEvent);
			}
		});
	}

	// Note: ESC key and backdrop click are NOT handled - modal is non-dismissable
};

/**
 * Populate zip code dropdown with delivery options
 * @param {HTMLSelectElement} selectElement - The zip code select element
 * @returns {void}
 */
const populateZipCodeDropdown = (selectElement) => {
	if (!selectElement) return;

	const options = getDeliveryOptions();

	options.forEach((option) => {
		const optionEl = document.createElement("option");
		optionEl.value = option.zipCode;
		optionEl.textContent = `${option.zipCode} - ${option.area} ($${option.fee} delivery)`;
		selectElement.appendChild(optionEl);
	});
};

/**
 * Handle zip code selection change
 * Updates the delivery fee display in the order summary
 * @returns {void}
 */
const handleZipCodeChange = () => {
	if (!zipCodeField) return;

	const selectedZip = zipCodeField.value;

	if (selectedZip) {
		selectedDeliveryFee = getDeliveryFee(selectedZip);
	} else {
		selectedDeliveryFee = null;
	}

	// Update the delivery display
	updateDeliveryDisplay();
};

/**
 * Update the delivery fee display in the order summary
 * @returns {void}
 */
const updateDeliveryDisplay = () => {
	if (!summaryDeliveryEl || !summaryTotalEl || !summarySubtotalEl) return;

	const subtotal = getCartSubtotal();

	if (selectedDeliveryFee !== null) {
		summaryDeliveryEl.textContent = `$${selectedDeliveryFee.toFixed(2)}`;
		const total = subtotal + selectedDeliveryFee;
		summaryTotalEl.textContent = `$${total.toFixed(2)}`;
	} else {
		summaryDeliveryEl.textContent = "--";
		summaryTotalEl.textContent = `$${subtotal.toFixed(2)}`;
	}
};

/**
 * Handle clicks on modal buttons via data-action
 * @param {Event} e - Click event
 * @returns {void}
 */
const handleModalClick = (e) => {
	const action = e.target.closest("[data-action]")?.dataset.action;
	if (!action) return;

	switch (action) {
		case "cancel":
			closeCheckout();
			break;
		case "back":
			goToStep("info");
			break;
		case "copy":
			copyOrderToClipboard(e.target.closest("[data-action]"));
			break;
		case "email":
			openEmailClient();
			break;
		case "confirm":
			confirmOrderSent();
			break;
		case "close":
			closeCheckout();
			break;
	}
};

/**
 * Navigate to a specific step
 * @param {string} step - Step name: "info", "instructions", or "success"
 * @returns {void}
 */
const goToStep = (step) => {
	currentStep = step;

	// Hide all steps
	if (stepInfo) stepInfo.hidden = true;
	if (stepInstructions) stepInstructions.hidden = true;
	if (stepSuccess) stepSuccess.hidden = true;

	// Show the target step
	switch (step) {
		case "info":
			if (stepInfo) stepInfo.hidden = false;
			// Focus on first form field
			if (checkoutForm) {
				const firstField = checkoutForm.querySelector("#checkout-name");
				if (firstField) {
					setTimeout(() => firstField.focus(), 100);
				}
			}
			break;
		case "instructions":
			if (stepInstructions) stepInstructions.hidden = false;
			break;
		case "success":
			if (stepSuccess) stepSuccess.hidden = false;
			startAutoCloseCountdown();
			break;
	}
};

/**
 * Trim whitespace from field value
 * @param {HTMLInputElement|HTMLTextAreaElement} field - Form field
 * @returns {void}
 */
const trimFieldValue = (field) => {
	if (!field) return;
	field.value = field.value.trim();
};

/**
 * Check if form is valid and update submit button state
 * @param {HTMLFormElement} form - Form element
 * @returns {void}
 */
const updateSubmitButtonState = (form) => {
	if (!form || !submitBtn) return;

	const nameField = form.querySelector("#checkout-name");
	const emailField = form.querySelector("#checkout-email");
	const phoneField = form.querySelector("#checkout-phone");
	const zipCodeFieldLocal = form.querySelector("#checkout-zipcode");
	const addressField = form.querySelector("#checkout-address");

	// Check if all required fields have valid values
	const nameValid = validateRequired(nameField?.value.trim() || "").isValid;
	const emailValid = validateEmail(emailField?.value.trim() || "").isValid;
	const phoneValid = validatePhone(phoneField?.value.trim() || "").isValid;
	const zipCodeValid = validateZipCode(zipCodeFieldLocal?.value || "").isValid;
	const addressValid = validateAddress(
		addressField?.value.trim() || ""
	).isValid;

	const allValid =
		nameValid && emailValid && phoneValid && zipCodeValid && addressValid;

	// Enable/disable submit button
	submitBtn.disabled = !allValid;
};

/**
 * Setup field validation (on blur)
 * @param {HTMLFormElement} form - Form element
 * @returns {void}
 */
const setupFieldValidation = (form) => {
	if (!form) return;

	const nameField = form.querySelector("#checkout-name");
	const emailField = form.querySelector("#checkout-email");
	const phoneField = form.querySelector("#checkout-phone");
	const zipCodeFieldLocal = form.querySelector("#checkout-zipcode");
	const addressField = form.querySelector("#checkout-address");
	const notesField = form.querySelector("#checkout-notes");

	// Validate zip code on change
	if (zipCodeFieldLocal) {
		zipCodeFieldLocal.addEventListener("change", () => {
			const validation = validateZipCode(zipCodeFieldLocal.value);
			if (!validation.isValid) {
				showFieldError(zipCodeFieldLocal, validation.message);
			} else {
				clearFieldError(zipCodeFieldLocal);
			}
			// Update delivery fee display
			handleZipCodeChange();
			updateSubmitButtonState(form);
		});
	}

	// Validate on blur
	if (nameField) {
		nameField.addEventListener("blur", () => {
			trimFieldValue(nameField);
			const validation = validateRequired(nameField.value);
			if (!validation.isValid) {
				showFieldError(nameField, validation.message);
			} else {
				clearFieldError(nameField);
			}
			updateSubmitButtonState(form);
		});

		// Clear error on input if field becomes valid
		nameField.addEventListener("input", () => {
			const validation = validateRequired(nameField.value.trim());
			if (
				validation.isValid &&
				nameField.getAttribute("aria-invalid") === "true"
			) {
				clearFieldError(nameField);
			}
			updateSubmitButtonState(form);
		});
	}

	if (emailField) {
		emailField.addEventListener("blur", () => {
			trimFieldValue(emailField);
			const validation = validateEmail(emailField.value);
			if (!validation.isValid) {
				showFieldError(emailField, validation.message);
			} else {
				clearFieldError(emailField);
			}
			updateSubmitButtonState(form);
		});

		emailField.addEventListener("input", () => {
			const validation = validateEmail(emailField.value.trim());
			if (
				validation.isValid &&
				emailField.getAttribute("aria-invalid") === "true"
			) {
				clearFieldError(emailField);
			}
			updateSubmitButtonState(form);
		});
	}

	if (phoneField) {
		phoneField.addEventListener("blur", () => {
			trimFieldValue(phoneField);
			const validation = validatePhone(phoneField.value);
			if (!validation.isValid) {
				showFieldError(phoneField, validation.message);
			} else {
				clearFieldError(phoneField);
			}
			updateSubmitButtonState(form);
		});

		phoneField.addEventListener("input", () => {
			const validation = validatePhone(phoneField.value.trim());
			if (
				validation.isValid &&
				phoneField.getAttribute("aria-invalid") === "true"
			) {
				clearFieldError(phoneField);
			}
			updateSubmitButtonState(form);
		});
	}

	if (addressField) {
		addressField.addEventListener("blur", () => {
			trimFieldValue(addressField);
			const validation = validateAddress(addressField.value);
			if (!validation.isValid) {
				showFieldError(addressField, validation.message);
			} else {
				clearFieldError(addressField);
			}
			updateSubmitButtonState(form);
		});

		addressField.addEventListener("input", () => {
			const validation = validateAddress(addressField.value.trim());
			if (
				validation.isValid &&
				addressField.getAttribute("aria-invalid") === "true"
			) {
				clearFieldError(addressField);
			}
			updateSubmitButtonState(form);
		});
	}

	// Character counter for notes field
	const charCountValue = form.querySelector(
		".checkout-modal__char-count-value"
	);
	const updateCharCount = () => {
		if (charCountValue && notesField) {
			const length = notesField.value.length;
			charCountValue.textContent = length;

			// Add warning class if approaching limit
			const charCountContainer = charCountValue.closest(
				".checkout-modal__char-count"
			);
			if (charCountContainer) {
				if (length > 400) {
					charCountContainer.classList.add(
						"checkout-modal__char-count--warning"
					);
				} else {
					charCountContainer.classList.remove(
						"checkout-modal__char-count--warning"
					);
				}
			}
		}
	};

	// Trim notes field on blur and update character count on input
	if (notesField) {
		notesField.addEventListener("blur", () => {
			trimFieldValue(notesField);
		});

		notesField.addEventListener("input", updateCharCount);
		notesField.addEventListener("paste", () => {
			setTimeout(updateCharCount, 0);
		});
	}

	// Initial check on form setup
	updateSubmitButtonState(form);
};

/**
 * Handle form submission - validates and moves to step 2
 * @param {Event} e - Submit event
 * @returns {void}
 */
const handleFormSubmit = async (e) => {
	e.preventDefault();

	if (!checkoutForm) return;

	const websiteField = checkoutForm.querySelector("#checkout-website");
	const timestampField = checkoutForm.querySelector("#checkout-form-ts");

	if (websiteField && websiteField.value) {
		return;
	}

	if (timestampField && timestampField.value) {
		const loadTime = parseInt(timestampField.value, 10);
		const elapsedSeconds = (Date.now() - loadTime) / 1000;

		if (elapsedSeconds < 3) {
			return;
		}
	}

	// Get form data (trim all values)
	const formData = {
		name: (checkoutForm.querySelector("#checkout-name")?.value || "").trim(),
		email: (checkoutForm.querySelector("#checkout-email")?.value || "").trim(),
		phone: (checkoutForm.querySelector("#checkout-phone")?.value || "").trim(),
		zipcode: checkoutForm.querySelector("#checkout-zipcode")?.value || "",
		address: (
			checkoutForm.querySelector("#checkout-address")?.value || ""
		).trim(),
		notes: (checkoutForm.querySelector("#checkout-notes")?.value || "").trim(),
	};

	// Validate form
	const validation = validateForm(formData);

	// Clear previous errors
	clearAllErrors(checkoutForm);

	if (!validation.isValid) {
		// Show errors for each invalid field
		Object.entries(validation.errors).forEach(([fieldName, errorMessage]) => {
			const field = checkoutForm.querySelector(`#checkout-${fieldName}`);
			if (field) {
				showFieldError(field, errorMessage);
			}
		});

		// Focus first invalid field
		focusFirstInvalidField(checkoutForm);
		return;
	}

	// Form is valid, prepare order and go to instructions step
	setLoadingState(true);

	try {
		// Generate order ID and format the order
		orderId = generateOrderId();

		// Get delivery fee from selected zip code
		const deliveryFee = getDeliveryFee(formData.zipcode) || 0;
		const subtotal = getCartSubtotal();

		const orderData = {
			...formData,
			items: getCartItems(),
			subtotal,
			deliveryFee,
			total: subtotal + deliveryFee,
		};

		const subject = `Treat Order #${orderId}`;
		const body = formatOrderEmail(orderData);
		formattedOrderText = `${subject}\n\n${body}`;

		// Go to instructions step
		goToStep("instructions");
	} catch (error) {
		console.error("Error during checkout:", error);
	} finally {
		setLoadingState(false);
	}
};

/**
 * Copy text to clipboard with fallback for mobile/HTTP
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Whether copy succeeded
 */
const copyToClipboard = async (text) => {
	// Try modern clipboard API first (requires HTTPS)
	if (
		navigator.clipboard &&
		typeof navigator.clipboard.writeText === "function"
	) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch (err) {
			// Fall through to legacy method
		}
	}

	// Fallback: use legacy execCommand with temporary textarea
	try {
		const textarea = document.createElement("textarea");
		textarea.value = text;
		// Prevent scrolling to bottom on iOS
		textarea.style.position = "fixed";
		textarea.style.top = "0";
		textarea.style.left = "0";
		textarea.style.width = "2em";
		textarea.style.height = "2em";
		textarea.style.padding = "0";
		textarea.style.border = "none";
		textarea.style.outline = "none";
		textarea.style.boxShadow = "none";
		textarea.style.background = "transparent";
		textarea.style.fontSize = "16px"; // Prevent zoom on iOS

		document.body.appendChild(textarea);
		textarea.focus();
		textarea.select();

		// For iOS
		textarea.setSelectionRange(0, textarea.value.length);

		const success = document.execCommand("copy");
		document.body.removeChild(textarea);
		return success;
	} catch (err) {
		console.error("Fallback copy failed:", err);
		return false;
	}
};

/**
 * Copy order text to clipboard
 * @param {HTMLElement} button - The copy button element
 * @returns {Promise<void>}
 */
const copyOrderToClipboard = async (button) => {
	const success = await copyToClipboard(formattedOrderText);

	if (success) {
		// Show "Copied!" feedback
		if (button) {
			const textEl = button.querySelector(".checkout-modal__btn-text");
			const copiedEl = button.querySelector(".checkout-modal__btn-copied");

			if (textEl) textEl.hidden = true;
			if (copiedEl) copiedEl.hidden = false;

			// Reset after 2 seconds
			setTimeout(() => {
				if (textEl) textEl.hidden = false;
				if (copiedEl) copiedEl.hidden = true;
			}, 2000);
		}
	} else {
		alert(
			"Could not copy to clipboard. Please manually copy the order details."
		);
	}
};

/**
 * Open email client with order details
 * Also copies to clipboard as fallback
 * @returns {void}
 */
const openEmailClient = () => {
	const businessEmail = "alldaytreats@gmail.com";
	const subject = `Treat Order #${orderId}`;
	const zipcode = checkoutForm?.querySelector("#checkout-zipcode")?.value || "";
	const deliveryFee = getDeliveryFee(zipcode) || 0;
	const subtotal = getCartSubtotal();
	const body = formatOrderEmail({
		name: (checkoutForm?.querySelector("#checkout-name")?.value || "").trim(),
		email: (checkoutForm?.querySelector("#checkout-email")?.value || "").trim(),
		phone: (checkoutForm?.querySelector("#checkout-phone")?.value || "").trim(),
		zipcode,
		address: (
			checkoutForm?.querySelector("#checkout-address")?.value || ""
		).trim(),
		notes: (checkoutForm?.querySelector("#checkout-notes")?.value || "").trim(),
		items: getCartItems(),
		subtotal,
		deliveryFee,
		total: subtotal + deliveryFee,
	});

	// Copy to clipboard as fallback (in case email client doesn't open)
	copyToClipboard(formattedOrderText).catch(() => {
		// Silently fail - this is just a backup
	});

	// Create mailto link
	const mailtoLink = `mailto:${businessEmail}?subject=${encodeURIComponent(
		subject
	)}&body=${encodeURIComponent(body)}`;

	// Try to open email client
	const anchor = document.createElement("a");
	anchor.href = mailtoLink;
	anchor.target = "_blank";
	anchor.rel = "noopener noreferrer";
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
};

/**
 * Confirm order has been sent - clears cart and shows success
 * @returns {void}
 */
const confirmOrderSent = () => {
	// Clear cart
	clearCart();

	// Reset form
	if (checkoutForm) {
		checkoutForm.reset();
		clearAllErrors(checkoutForm);
	}

	// Go to success step
	goToStep("success");
};

/**
 * Start auto-close countdown for success step
 * @returns {void}
 */
const startAutoCloseCountdown = () => {
	let countdown = 5;

	// Update countdown display
	if (countdownEl) {
		countdownEl.textContent = countdown;
	}

	// Clear any existing timers
	if (countdownInterval) clearInterval(countdownInterval);
	if (autoCloseTimer) clearTimeout(autoCloseTimer);

	// Start countdown
	countdownInterval = setInterval(() => {
		countdown--;
		if (countdownEl) {
			countdownEl.textContent = countdown;
		}
		if (countdown <= 0) {
			clearInterval(countdownInterval);
		}
	}, 1000);

	// Auto-close after 5 seconds
	autoCloseTimer = setTimeout(() => {
		clearInterval(countdownInterval);
		closeCheckout();
	}, 5000);
};

/**
 * Generate unique order ID with broad browser compatibility
 * @returns {string} - 8 character unique ID
 */
const generateOrderId = () => {
	// Try crypto.randomUUID first (modern browsers with HTTPS)
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return crypto.randomUUID().substring(0, 8);
	}

	// Fallback: use crypto.getRandomValues (broader support)
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.getRandomValues === "function"
	) {
		const array = new Uint8Array(4);
		crypto.getRandomValues(array);
		return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
			""
		);
	}

	// Final fallback: timestamp + random
	return (
		Date.now().toString(36).substring(-4) +
		Math.random().toString(36).substring(2, 6)
	);
};

/**
 * Format order details for email body
 * @param {Object} orderData - Order data with customer info and items
 * @returns {string} - Formatted email body
 */
const formatOrderEmail = (orderData) => {
	const {
		name,
		email,
		phone,
		zipcode,
		address,
		notes,
		items,
		subtotal,
		deliveryFee,
		total,
	} = orderData;

	let body = `Name - ${name}\n`;
	body += `Email - ${email}\n`;
	body += `Phone - ${phone}\n`;
	body += `Zip Code - ${zipcode}\n`;
	body += `Address - ${address}\n`;
	if (notes) {
		body += `Special Instructions - ${notes}\n`;
	}

	body += `\n------\nOrder:\n------\n\n`;

	items.forEach((item, index) => {
		const sku = item.sku ? ` [${item.sku}]` : "";
		body += `${index + 1}. ${item.name}${sku} - ${item.count}ct × ${
			item.quantity
		}\n`;
		body += `   Price: $${(item.unitPrice * item.quantity).toFixed(2)}\n`;

		// Add toppings to order email
		if (item.toppings) {
			const toppingsText = formatToppingsForEmail(item.toppings, item.count);
			if (toppingsText) {
				body += `   Toppings: ${toppingsText}\n`;
			}
		}

		if (item.specialInstructions) {
			body += `   Notes: ${item.specialInstructions}\n`;
		}
		body += `\n`;
	});

	body += `------\n`;
	body += `Subtotal: $${subtotal.toFixed(2)}\n`;
	body += `Delivery: $${deliveryFee.toFixed(2)}\n`;
	body += `------\n`;
	body += `Total: $${total.toFixed(2)}\n`;
	body += `------`;

	return body;
};

/**
 * Set loading state on submit button
 * @param {boolean} isLoading - Loading state
 * @returns {void}
 */
const setLoadingState = (isLoading) => {
	if (!submitBtn) return;

	if (isLoading) {
		submitBtn.classList.add("checkout-modal__btn--loading");
		submitBtn.disabled = true;
	} else {
		submitBtn.classList.remove("checkout-modal__btn--loading");
		submitBtn.disabled = false;
	}
};

/**
 * Open checkout modal
 * @returns {void}
 */
export const openCheckout = () => {
	if (!checkoutModal) return;

	// Make sure we have items in cart
	const cartItems = getCartItems();
	if (cartItems.length === 0) {
		console.warn("Cannot open checkout with empty cart");
		return;
	}

	// Reset state
	currentStep = "info";
	formattedOrderText = "";
	orderId = "";
	selectedDeliveryFee = null;

	// Reset zip code dropdown
	if (zipCodeField) {
		zipCodeField.value = "";
	}

	// Clear any existing timers
	if (countdownInterval) clearInterval(countdownInterval);
	if (autoCloseTimer) clearTimeout(autoCloseTimer);

	// Reset to step 1
	goToStep("info");

	// Render order summary
	renderOrderSummary();

	// Reset submit button state
	if (checkoutForm) {
		updateSubmitButtonState(checkoutForm);
	}

	const timestampField = checkoutForm?.querySelector("#checkout-form-ts");
	if (timestampField) {
		timestampField.value = Date.now().toString();
	}

	// Show modal
	checkoutModal.hidden = false;
	checkoutModal.classList.add("checkout-modal--open");
	document.body.style.overflow = "hidden";
};

/**
 * Close checkout modal
 * @returns {void}
 */
export const closeCheckout = () => {
	if (!checkoutModal) return;

	// Clear timers
	if (countdownInterval) clearInterval(countdownInterval);
	if (autoCloseTimer) clearTimeout(autoCloseTimer);

	checkoutModal.classList.remove("checkout-modal--open");
	document.body.style.overflow = "";

	// Hide modal after animation
	setTimeout(() => {
		if (!checkoutModal.classList.contains("checkout-modal--open")) {
			checkoutModal.hidden = true;
		}
	}, 300);
};

/**
 * Check if checkout is open
 * @returns {boolean}
 */
const isCheckoutOpen = () => {
	return checkoutModal?.classList.contains("checkout-modal--open");
};

/**
 * Render order summary
 * @returns {void}
 */
const renderOrderSummary = () => {
	if (!summaryItemsContainer || !summarySubtotalEl || !summaryTotalEl) return;

	const cartItems = getCartItems();
	const subtotal = getCartSubtotal();

	// Clear existing items
	summaryItemsContainer.innerHTML = "";

	// Render each item
	cartItems.forEach((item) => {
		const quantity = item.quantity || 1;
		const unitPrice =
			item.unitPrice !== undefined ? item.unitPrice : item.price;
		const lineTotal = unitPrice * quantity;

		// Format toppings for display
		const toppingsText = formatToppingsForDisplay(item.toppings, item.count);

		const itemEl = document.createElement("div");
		itemEl.className = "checkout-modal__summary-item";
		itemEl.innerHTML = `
			<div class="checkout-modal__summary-item-details">
				<span class="checkout-modal__summary-item-name">${escapeHtml(item.name)}</span>
				<span class="checkout-modal__summary-item-meta">${
					item.count
				}ct × ${quantity}</span>
				${
					toppingsText
						? `<span class="checkout-modal__summary-item-toppings">${toppingsText}</span>`
						: ""
				}
			</div>
			<span class="checkout-modal__summary-item-price">$${lineTotal.toFixed(2)}</span>
		`;
		summaryItemsContainer.appendChild(itemEl);
	});

	// Update subtotal
	summarySubtotalEl.textContent = `$${subtotal.toFixed(2)}`;

	// Update delivery and total display
	updateDeliveryDisplay();
};

/**
 * Format toppings for display in checkout summary
 * @param {Array|Object} toppings - Toppings array or legacy object with included and premium arrays
 * @param {number} count - Product count for price calculation
 * @returns {string} Formatted toppings text
 */
const formatToppingsForDisplay = (toppings, count) => {
	if (!toppings) {
		return "";
	}

	// Handle both new format (array) and old format (object)
	let allToppingIds = [];
	if (Array.isArray(toppings)) {
		allToppingIds = toppings;
	} else if (toppings.included || toppings.premium) {
		// Legacy format support
		allToppingIds = [...(toppings.included || []), ...(toppings.premium || [])];
	}

	if (allToppingIds.length === 0) {
		return "";
	}

	const toppingNames = allToppingIds
		.map((id) => {
			const topping = getToppingById(id);
			if (!topping) return null;

			// Calculate dynamic price based on count
			const price = calculateToppingPrice(topping.price, count);
			if (price > 0) {
				return `${topping.name} (+$${price})`;
			}
			return topping.name;
		})
		.filter(Boolean);

	if (toppingNames.length === 0) {
		return "";
	}

	return `+ ${escapeHtml(toppingNames.join(", "))}`;
};

/**
 * Format toppings for email body
 * @param {Array|Object} toppings - Toppings array or legacy object with included and premium arrays
 * @param {number} count - Product count for price calculation
 * @returns {string} Formatted toppings text for email
 */
const formatToppingsForEmail = (toppings, count) => {
	if (!toppings) {
		return "";
	}

	// Handle both new format (array) and old format (object)
	let allToppingIds = [];
	if (Array.isArray(toppings)) {
		allToppingIds = toppings;
	} else if (toppings.included || toppings.premium) {
		// Legacy format support
		allToppingIds = [...(toppings.included || []), ...(toppings.premium || [])];
	}

	if (allToppingIds.length === 0) {
		return "";
	}

	const toppingDetails = allToppingIds
		.map((id) => {
			const topping = getToppingById(id);
			if (!topping) return null;

			// Calculate dynamic price based on count
			const price = calculateToppingPrice(topping.price, count);
			// Include SKU for verification
			if (price > 0) {
				return `${topping.name} [${topping.sku}] (+$${price})`;
			}
			return `${topping.name} [${topping.sku}]`;
		})
		.filter(Boolean);

	return toppingDetails.join(", ");
};

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string}
 */
const escapeHtml = (text) => {
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
};
