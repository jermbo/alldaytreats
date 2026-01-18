import { getCartItems, getCartSubtotal, clearCart } from "./cart.js";
import { products } from "./products.js";
import {
	validateRequired,
	validateEmail,
	validatePhone,
	validateAddress,
	validateForm,
} from "./validation.js";
import {
	showFieldError,
	clearFieldError,
	clearAllErrors,
	focusFirstInvalidField,
} from "./validation-ui.js";
import { initPhoneFormatter } from "./phone-formatter.js";

let checkoutPanel = null;
let checkoutForm = null;

// Cached DOM references
let summaryItemsContainer = null;
let summarySubtotalEl = null;
let summaryTotalEl = null;
let contentSection = null;
let successSection = null;
let errorSection = null;
let submitBtn = null;

/**
 * Initialize checkout UI
 * @param {HTMLElement} panelElement - Checkout panel element
 * @returns {void}
 */
export const initCheckoutUI = (panelElement) => {
	checkoutPanel = panelElement;

	if (!checkoutPanel) return;

	// Cache DOM references
	summaryItemsContainer = checkoutPanel.querySelector(".checkout__summary-items");
	summarySubtotalEl = checkoutPanel.querySelector(".checkout__summary-subtotal");
	summaryTotalEl = checkoutPanel.querySelector(".checkout__summary-total");
	contentSection = checkoutPanel.querySelector(".checkout__content");
	successSection = checkoutPanel.querySelector(".checkout__success");
	errorSection = checkoutPanel.querySelector(".checkout__error-state");
	checkoutForm = checkoutPanel.querySelector("#checkout-form");
	submitBtn = checkoutPanel.querySelector(".checkout__submit-btn");

	const closeBtn = checkoutPanel.querySelector(".checkout__close");
	const backdrop = checkoutPanel.querySelector(".checkout__backdrop");
	const retryBtn = checkoutPanel.querySelector(".checkout__retry-btn");

	// Close button handler
	if (closeBtn) {
		closeBtn.addEventListener("click", closeCheckout);
	}

	// Backdrop click handler
	if (backdrop) {
		backdrop.addEventListener("click", closeCheckout);
	}

	// Retry button handler
	if (retryBtn) {
		retryBtn.addEventListener("click", () => {
			showContent();
		});
	}

	// Form submission handler
	if (checkoutForm) {
		checkoutForm.addEventListener("submit", handleFormSubmit);
		setupFieldValidation(checkoutForm);

		// Initialize phone number formatter
		const phoneField = checkoutForm.querySelector("#checkout-phone");
		if (phoneField) {
			initPhoneFormatter(phoneField);
		}
	}

	// Close on ESC key
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && isCheckoutOpen()) {
			closeCheckout();
		}
	});
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
	const addressField = form.querySelector("#checkout-address");

	// Check if all required fields have valid values
	const nameValid = validateRequired(nameField?.value.trim() || "").isValid;
	const emailValid = validateEmail(emailField?.value.trim() || "").isValid;
	const phoneValid = validatePhone(phoneField?.value.trim() || "").isValid;
	const addressValid = validateAddress(addressField?.value.trim() || "").isValid;

	const allValid = nameValid && emailValid && phoneValid && addressValid;

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
	const addressField = form.querySelector("#checkout-address");
	const notesField = form.querySelector("#checkout-notes");

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
			if (validation.isValid && nameField.getAttribute("aria-invalid") === "true") {
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
			if (validation.isValid && emailField.getAttribute("aria-invalid") === "true") {
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
			if (validation.isValid && phoneField.getAttribute("aria-invalid") === "true") {
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
			if (validation.isValid && addressField.getAttribute("aria-invalid") === "true") {
				clearFieldError(addressField);
			}
			updateSubmitButtonState(form);
		});
	}

	// Character counter for notes field
	const charCountValue = form.querySelector(".checkout__char-count-value");
	const updateCharCount = () => {
		if (charCountValue && notesField) {
			const length = notesField.value.length;
			charCountValue.textContent = length;

			// Add warning class if approaching limit
			const charCountContainer = charCountValue.closest(".checkout__char-count");
			if (charCountContainer) {
				if (length > 400) {
					charCountContainer.classList.add("checkout__char-count--warning");
				} else {
					charCountContainer.classList.remove("checkout__char-count--warning");
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
 * Handle form submission
 * @param {Event} e - Submit event
 * @returns {void}
 */
const handleFormSubmit = async (e) => {
	e.preventDefault();

	if (!checkoutForm) return;

	// Check honeypot field
	const honeypot = checkoutForm.querySelector("#checkout-honeypot");
	if (honeypot && honeypot.value) {
		// Likely spam, silently fail
		console.warn("Honeypot field filled, ignoring submission");
		return;
	}

	// Get form data (trim all values)
	const formData = {
		name: (checkoutForm.querySelector("#checkout-name")?.value || "").trim(),
		email: (checkoutForm.querySelector("#checkout-email")?.value || "").trim(),
		phone: (checkoutForm.querySelector("#checkout-phone")?.value || "").trim(),
		address: (checkoutForm.querySelector("#checkout-address")?.value || "").trim(),
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

	// Form is valid, proceed with submission
	setLoadingState(true);

	try {
		const result = await submitOrder({
			...formData,
			items: getCartItems(),
			subtotal: getCartSubtotal(),
		});

		// Show success state with instructions
		const successMessage = "Your email client has been opened with your order details. Please review and click send to complete your order.";
		showSuccess(successMessage, result.formattedOrder);

		// Clear cart
		clearCart();

		// Reset form
		checkoutForm.reset();
		clearAllErrors(checkoutForm);
	} catch (error) {
		// Show error state
		showError(error.message || "An error occurred while preparing your order. Please try again.");
	} finally {
		setLoadingState(false);
	}
};

/**
 * Generate unique order ID using Web Crypto API
 * @returns {string} - 8 character unique ID
 */
const generateOrderId = () => {
	return crypto.randomUUID().substring(0, 8);
};

/**
 * Format order details for email body
 * @param {Object} orderData - Order data with customer info and items
 * @returns {string} - Formatted email body
 */
const formatOrderEmail = (orderData) => {
	const { name, phone, address, notes, items, subtotal } = orderData;

	let body = `Name - ${name}\n`;
	body += `Phone - ${phone}\n`;
	body += `Address - ${address}\n`;
	if (notes) {
		body += `Special Instructions - ${notes}\n`;
	}

	body += `\n------\nOrder:\n------\n\n`;

	items.forEach((item, index) => {
		body += `${index + 1}. ${item.name} - ${item.count}ct × ${item.quantity}\n`;
		body += `   Price: $${(item.unitPrice * item.quantity).toFixed(2)}\n`;
		if (item.specialInstructions) {
			body += `   Notes: ${item.specialInstructions}\n`;
		}
		body += `\n`;
	});

	body += `------\nSubtotal: $${subtotal.toFixed(2)}\n------`;

	return body;
};

/**
 * Submit order via email
 * @param {Object} orderData - Order data
 * @returns {Promise}
 */
const submitOrder = async (orderData) => {
	const orderId = generateOrderId();
	// const businessEmail = "alldaytreats@gmail.com";
	const businessEmail = "jermbo@cosmicstrawberry.com";
	const subject = `Treat Order #${orderId}`;
	const body = formatOrderEmail(orderData);

	// Create mailto link
	const mailtoLink = `mailto:${businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

	// Try to open email client in new context (prevents page navigation)
	try {
		const anchor = document.createElement('a');
		anchor.href = mailtoLink;
		anchor.target = '_blank';
		anchor.rel = 'noopener noreferrer';
		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);
		return Promise.resolve({ success: true, orderId, formattedOrder: `${subject}\n\n${body}` });
	} catch (error) {
		// If mailto fails, still return success with fallback data
		return Promise.resolve({ success: true, orderId, formattedOrder: `${subject}\n\n${body}`, requiresFallback: true });
	}
};

/**
 * Set loading state on submit button
 * @param {boolean} isLoading - Loading state
 * @returns {void}
 */
const setLoadingState = (isLoading) => {
	if (!submitBtn) return;

	if (isLoading) {
		submitBtn.classList.add("checkout__submit-btn--loading");
		submitBtn.disabled = true;
	} else {
		submitBtn.classList.remove("checkout__submit-btn--loading");
		submitBtn.disabled = false;
	}
};

/**
 * Show content section
 * @returns {void}
 */
const showContent = () => {
	if (contentSection) contentSection.hidden = false;
	if (successSection) successSection.hidden = true;
	if (errorSection) errorSection.hidden = true;
};

/**
 * Show success state
 * @param {string} message - Success message
 * @param {string} formattedOrder - Formatted order text for fallback
 * @returns {void}
 */
const showSuccess = (message, formattedOrder = null) => {
	if (contentSection) contentSection.hidden = true;
	if (errorSection) errorSection.hidden = true;
	if (successSection) {
		successSection.hidden = false;
		const messageEl = successSection.querySelector(".checkout__success-message");
		if (messageEl) {
			messageEl.textContent = message;
		}

		// Show fallback section with copy functionality
		if (formattedOrder) {
			const fallbackSection = successSection.querySelector(".checkout__success-fallback");
			const orderTextEl = successSection.querySelector(".checkout__success-order-text");
			const copyBtn = successSection.querySelector(".checkout__success-copy-btn");

			if (fallbackSection && orderTextEl) {
				fallbackSection.hidden = false;
				orderTextEl.textContent = formattedOrder;
			}

			// Setup copy button
			if (copyBtn && orderTextEl) {
				// Remove existing listeners
				const newCopyBtn = copyBtn.cloneNode(true);
				copyBtn.parentNode.replaceChild(newCopyBtn, copyBtn);

				newCopyBtn.addEventListener("click", async () => {
					try {
						await navigator.clipboard.writeText(formattedOrder);
						newCopyBtn.classList.add("checkout__success-copy-btn--copied");
						setTimeout(() => {
							newCopyBtn.classList.remove("checkout__success-copy-btn--copied");
						}, 2000);
					} catch (error) {
						console.error("Failed to copy to clipboard:", error);
						// Fallback: select the text
						const range = document.createRange();
						range.selectNodeContents(orderTextEl);
						const selection = window.getSelection();
						selection.removeAllRanges();
						selection.addRange(range);
					}
				});
			}
		}
	}
};

/**
 * Show error state
 * @param {string} message - Error message
 * @returns {void}
 */
const showError = (message) => {
	if (contentSection) contentSection.hidden = true;
	if (successSection) successSection.hidden = true;
	if (errorSection) {
		errorSection.hidden = false;
		const messageEl = errorSection.querySelector(".checkout__error-message");
		if (messageEl) {
			messageEl.textContent = message;
		}
	}
};

/**
 * Open checkout panel
 * @returns {void}
 */
export const openCheckout = () => {
	if (!checkoutPanel) return;

	// Make sure we have items in cart
	const cartItems = getCartItems();
	if (cartItems.length === 0) {
		console.warn("Cannot open checkout with empty cart");
		return;
	}

	// Reset to content view
	showContent();

	// Render order summary
	renderOrderSummary();

	// Reset submit button state
	if (checkoutForm) {
		updateSubmitButtonState(checkoutForm);
	}

	// Show panel
	checkoutPanel.hidden = false;
	checkoutPanel.classList.add("checkout--open");
	document.body.style.overflow = "hidden";

	// Focus on first form field
	if (checkoutForm) {
		const firstField = checkoutForm.querySelector("#checkout-name");
		if (firstField) {
			setTimeout(() => firstField.focus(), 100);
		}
	}
};

/**
 * Close checkout panel
 * @returns {void}
 */
export const closeCheckout = () => {
	if (!checkoutPanel) return;

	checkoutPanel.classList.remove("checkout--open");
	document.body.style.overflow = "";

	// Hide panel after animation
	setTimeout(() => {
		if (!checkoutPanel.classList.contains("checkout--open")) {
			checkoutPanel.hidden = true;
		}
	}, 300);
};

/**
 * Check if checkout is open
 * @returns {boolean}
 */
const isCheckoutOpen = () => {
	return checkoutPanel?.classList.contains("checkout--open");
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
		const product = products.find((p) => p.id === item.productId);
		const quantity = item.quantity || 1;
		const unitPrice = item.unitPrice !== undefined ? item.unitPrice : item.price;
		const lineTotal = unitPrice * quantity;

		const itemEl = document.createElement("div");
		itemEl.className = "checkout__summary-item";
		itemEl.innerHTML = `
			<div class="checkout__summary-item-details">
				<span class="checkout__summary-item-name">${escapeHtml(item.name)}</span>
				<span class="checkout__summary-item-meta">${item.count}ct × ${quantity}</span>
			</div>
			<span class="checkout__summary-item-price">$${lineTotal.toFixed(2)}</span>
		`;
		summaryItemsContainer.appendChild(itemEl);
	});

	// Update totals
	summarySubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
	summaryTotalEl.textContent = `$${subtotal.toFixed(2)}`;
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
