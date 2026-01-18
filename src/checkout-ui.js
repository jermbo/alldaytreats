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

	// Trim notes field on blur (even though it's optional)
	if (notesField) {
		notesField.addEventListener("blur", () => {
			trimFieldValue(notesField);
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
		// TODO: Implement actual order submission (US-006)
		// For now, simulate API call
		await submitOrder({
			...formData,
			items: getCartItems(),
			subtotal: getCartSubtotal(),
		});

		// Show success state
		showSuccess("Your order has been submitted successfully! We'll contact you shortly to confirm your order and arrange payment.");
		
		// Clear cart
		clearCart();
		
		// Reset form
		checkoutForm.reset();
		clearAllErrors(checkoutForm);
	} catch (error) {
		// Show error state
		showError(error.message || "An error occurred while submitting your order. Please try again.");
	} finally {
		setLoadingState(false);
	}
};

/**
 * Simulate order submission (placeholder for US-006)
 * @param {Object} orderData - Order data
 * @returns {Promise}
 */
const submitOrder = async (orderData) => {
	// Simulate API call
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			// For now, always succeed
			console.log("Order submitted:", orderData);
			resolve({ success: true });
		}, 1500);
	});
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
 * @returns {void}
 */
const showSuccess = (message) => {
	if (contentSection) contentSection.hidden = true;
	if (errorSection) errorSection.hidden = true;
	if (successSection) {
		successSection.hidden = false;
		const messageEl = successSection.querySelector(".checkout__success-message");
		if (messageEl) {
			messageEl.textContent = message;
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
