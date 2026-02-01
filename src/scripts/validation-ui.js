/**
 * Validation UI utilities
 * Handles displaying and clearing validation error messages
 * Styling is handled by CSS :user-valid and :user-invalid pseudo-classes
 */

/**
 * Show error message for a field
 * Note: Border/background styling is handled by :user-invalid CSS
 * @param {HTMLElement} field - Input field element
 * @param {string} message - Error message to display
 * @returns {void}
 */
export const showFieldError = (field, message) => {
	if (!field) return;

	// Set ARIA attribute for accessibility
	field.setAttribute("aria-invalid", "true");

	// Find error container
	const errorId = field.getAttribute("aria-describedby");
	if (!errorId) return;

	const errorContainer = document.getElementById(errorId);
	if (!errorContainer) return;

	// Display error message
	errorContainer.textContent = message;
	errorContainer.classList.add("checkout-modal__error--visible");
};

/**
 * Clear error message for a field
 * Note: Border/background styling is handled by :user-valid CSS
 * @param {HTMLElement} field - Input field element
 * @returns {void}
 */
export const clearFieldError = (field) => {
	if (!field) return;

	// Set ARIA attribute for accessibility
	field.setAttribute("aria-invalid", "false");

	// Find error container
	const errorId = field.getAttribute("aria-describedby");
	if (!errorId) return;

	const errorContainer = document.getElementById(errorId);
	if (!errorContainer) return;

	// Clear error message
	errorContainer.textContent = "";
	errorContainer.classList.remove("checkout-modal__error--visible");
};

/**
 * Clear all error messages in a form
 * @param {HTMLFormElement} form - Form element
 * @returns {void}
 */
export const clearAllErrors = (form) => {
	if (!form) return;

	// Clear all input field ARIA attributes
	const fields = form.querySelectorAll(".checkout-modal__input");
	fields.forEach((field) => {
		field.setAttribute("aria-invalid", "false");
	});

	// Clear all error messages
	const errorContainers = form.querySelectorAll(".checkout-modal__error");
	errorContainers.forEach((container) => {
		container.textContent = "";
		container.classList.remove("checkout-modal__error--visible");
	});
};

/**
 * Focus on the first invalid field
 * @param {HTMLFormElement} form - Form element
 * @returns {void}
 */
export const focusFirstInvalidField = (form) => {
	if (!form) return;

	const firstInvalidField = form.querySelector('[aria-invalid="true"]');
	if (firstInvalidField) {
		firstInvalidField.focus();
		// Scroll into view if needed
		firstInvalidField.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
	}
};
