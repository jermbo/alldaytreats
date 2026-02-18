/**
 * Validation UI utilities
 * Handles displaying and clearing validation error messages
 * Styling is handled by CSS :user-valid and :user-invalid pseudo-classes
 */

export const showFieldError = (field: HTMLElement, message: string): void => {
	if (!field) return;

	field.setAttribute("aria-invalid", "true");

	const errorId = field.getAttribute("aria-describedby");
	if (!errorId) return;

	const errorContainer = document.getElementById(errorId);
	if (!errorContainer) return;

	errorContainer.textContent = message;
	errorContainer.classList.add("checkout-modal__error--visible");
};

export const clearFieldError = (field: HTMLElement): void => {
	if (!field) return;

	field.setAttribute("aria-invalid", "false");

	const errorId = field.getAttribute("aria-describedby");
	if (!errorId) return;

	const errorContainer = document.getElementById(errorId);
	if (!errorContainer) return;

	errorContainer.textContent = "";
	errorContainer.classList.remove("checkout-modal__error--visible");
};

export const clearAllErrors = (form: HTMLFormElement): void => {
	if (!form) return;

	form.querySelectorAll<HTMLElement>(".checkout-modal__input").forEach(
		(field) => {
			field.setAttribute("aria-invalid", "false");
		},
	);

	form.querySelectorAll<HTMLElement>(".checkout-modal__error").forEach(
		(container) => {
			container.textContent = "";
			container.classList.remove("checkout-modal__error--visible");
		},
	);
};

export const focusFirstInvalidField = (form: HTMLFormElement): void => {
	if (!form) return;

	const firstInvalid = form.querySelector<HTMLElement>(
		'[aria-invalid="true"]',
	);
	if (!firstInvalid) return;

	firstInvalid.focus();
	firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
};
