/**
 * Form validation utilities
 * Pure validation functions — no DOM access
 */

import type {
	ValidationResult,
	FormValidationResult,
	CheckoutFormData,
} from "@/scripts/types/index.ts";

export const ERROR_MESSAGES = {
	REQUIRED: "This field is required",
	EMAIL_INVALID: "Please enter a valid email address",
	PHONE_INVALID: "Please enter a valid 10-digit phone number",
	ZIPCODE_REQUIRED: "Please select a delivery zip code",
	ADDRESS_TOO_SHORT:
		"Please enter a complete delivery address (minimum 10 characters)",
} as const;

export const validateRequired = (value: string): ValidationResult => {
	const trimmed = value?.trim() || "";
	return {
		isValid: trimmed.length > 0,
		message: ERROR_MESSAGES.REQUIRED,
	};
};

export const validateEmail = (email: string): ValidationResult => {
	const trimmed = email?.trim() || "";
	if (trimmed.length === 0) {
		return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
	}

	const emailPattern = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return {
		isValid: emailPattern.test(trimmed),
		message: ERROR_MESSAGES.EMAIL_INVALID,
	};
};

export const validatePhone = (phone: string): ValidationResult => {
	const trimmed = phone?.trim() || "";
	if (trimmed.length === 0) {
		return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
	}

	const digitsOnly = trimmed.replace(/\D/g, "");
	return {
		isValid: digitsOnly.length === 10,
		message: ERROR_MESSAGES.PHONE_INVALID,
	};
};

export const validateZipCode = (zipCode: string): ValidationResult => {
	const trimmed = zipCode?.trim() || "";
	return {
		isValid: trimmed.length > 0,
		message: ERROR_MESSAGES.ZIPCODE_REQUIRED,
	};
};

export const validateAddress = (address: string): ValidationResult => {
	const trimmed = address?.trim() || "";
	if (trimmed.length === 0) {
		return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
	}

	const MIN_ADDRESS_LENGTH = 10;
	return {
		isValid: trimmed.length >= MIN_ADDRESS_LENGTH,
		message: ERROR_MESSAGES.ADDRESS_TOO_SHORT,
	};
};

export const validateForm = (
	formData: CheckoutFormData,
): FormValidationResult => {
	const errors: Record<string, string> = {};
	let isValid = true;

	const checks: Array<{
		key: keyof CheckoutFormData;
		validate: (v: string) => ValidationResult;
	}> = [
		{ key: "name", validate: validateRequired },
		{ key: "email", validate: validateEmail },
		{ key: "phone", validate: validatePhone },
		{ key: "zipcode", validate: validateZipCode },
		{ key: "address", validate: validateAddress },
	];

	for (const { key, validate } of checks) {
		const result = validate(formData[key]);
		if (!result.isValid) {
			errors[key] = result.message;
			isValid = false;
		}
	}

	return { isValid, errors };
};
