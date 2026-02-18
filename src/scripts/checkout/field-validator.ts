import type { ValidationResult } from "@/scripts/types/index.ts";
import { showFieldError, clearFieldError } from "@/scripts/validation-ui.ts";

type ValidatorFn = (value: string) => ValidationResult;

interface FieldValidatorOptions {
	/** Trim whitespace on blur (default: true) */
	trimOnBlur?: boolean;
	/** Use "change" instead of "blur" for the validation trigger (e.g., select elements) */
	eventType?: "blur" | "change";
}

/**
 * Attach blur/change + input validation handlers to a form field
 * Eliminates repetitive per-field validation boilerplate
 */
export const attachFieldValidation = (
	field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null,
	validate: ValidatorFn,
	onUpdate: () => void,
	options: FieldValidatorOptions = {},
): void => {
	if (!field) return;

	const { trimOnBlur = true, eventType = "blur" } = options;

	// Primary validation on blur/change
	field.addEventListener(eventType, () => {
		if (trimOnBlur && eventType === "blur" && "value" in field) {
			field.value = field.value.trim();
		}
		const validation = validate(field.value);
		if (!validation.isValid) {
			showFieldError(field as HTMLElement, validation.message);
		} else {
			clearFieldError(field as HTMLElement);
		}
		onUpdate();
	});

	// For select elements (change event), skip the input listener
	if (eventType === "change") return;

	// Clear error eagerly on input when field becomes valid
	field.addEventListener("input", () => {
		const value = field.value.trim();
		const validation = validate(value);
		if (
			validation.isValid &&
			field.getAttribute("aria-invalid") === "true"
		) {
			clearFieldError(field as HTMLElement);
		}
		onUpdate();
	});
};
