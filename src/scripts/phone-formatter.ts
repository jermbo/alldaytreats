/**
 * Phone number auto-formatting utility
 * Formats input as user types to (XXX) XXX-XXXX format
 */

export const formatPhoneNumber = (value: string): string => {
	const digits = value.replace(/\D/g, "").substring(0, 10);

	if (digits.length === 0) return "";
	if (digits.length <= 3) return `(${digits}`;
	if (digits.length <= 6)
		return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
	return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const initPhoneFormatter = (phoneInput: HTMLInputElement): void => {
	if (!phoneInput) return;

	phoneInput.addEventListener("input", (e) => {
		const target = e.target as HTMLInputElement;
		const cursorPosition = target.selectionStart || 0;
		const oldLength = target.value.length;
		const formatted = formatPhoneNumber(target.value);
		target.value = formatted;

		const lengthDiff = formatted.length - oldLength;
		const newPosition =
			cursorPosition + (lengthDiff > 0 ? lengthDiff : 0);
		target.setSelectionRange(newPosition, newPosition);
	});

	phoneInput.addEventListener("paste", () => {
		setTimeout(() => {
			phoneInput.value = formatPhoneNumber(phoneInput.value);
		}, 10);
	});
};
