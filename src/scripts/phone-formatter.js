/**
 * Phone number auto-formatting utility
 * Formats input as user types to (XXX) XXX-XXXX format
 */

/**
 * Format phone number to (XXX) XXX-XXXX
 * @param {string} value - Raw input value
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (value) => {
	// Remove all non-digit characters
	const digits = value.replace(/\D/g, "");

	// Limit to 10 digits
	const limited = digits.substring(0, 10);

	// Format based on number of digits
	if (limited.length === 0) {
		return "";
	} else if (limited.length <= 3) {
		return `(${limited}`;
	} else if (limited.length <= 6) {
		return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
	} else {
		return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
	}
};

/**
 * Initialize phone formatter on an input field
 * @param {HTMLInputElement} phoneInput - Phone input element
 * @returns {void}
 */
export const initPhoneFormatter = (phoneInput) => {
	if (!phoneInput) return;

	phoneInput.addEventListener("input", (e) => {
		const cursorPosition = e.target.selectionStart;
		const oldValue = e.target.value;
		const oldLength = oldValue.length;

		// Format the value
		const formattedValue = formatPhoneNumber(oldValue);
		e.target.value = formattedValue;

		// Adjust cursor position to account for formatting characters
		const newLength = formattedValue.length;
		const lengthDiff = newLength - oldLength;

		// If we added characters (formatting), move cursor forward
		if (lengthDiff > 0) {
			e.target.setSelectionRange(
				cursorPosition + lengthDiff,
				cursorPosition + lengthDiff
			);
		} else {
			// Otherwise keep cursor in same position
			e.target.setSelectionRange(cursorPosition, cursorPosition);
		}
	});

	// Also format on paste
	phoneInput.addEventListener("paste", (e) => {
		// Give the paste a moment to complete
		setTimeout(() => {
			const formattedValue = formatPhoneNumber(e.target.value);
			e.target.value = formattedValue;
		}, 10);
	});
};
