/**
 * Form validation utilities
 * Provides validation functions for checkout form fields
 */

// Validation error messages
export const ERROR_MESSAGES = {
	REQUIRED: "This field is required",
	EMAIL_INVALID: "Please enter a valid email address",
	PHONE_INVALID: "Please enter a valid 10-digit phone number",
	ZIPCODE_REQUIRED: "Please select a delivery zip code",
	ADDRESS_TOO_SHORT:
		"Please enter a complete delivery address (minimum 10 characters)",
};

/**
 * Validate required field is not empty
 * @param {string} value - Field value
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validateRequired = (value) => {
	const trimmedValue = value?.trim() || "";
	return {
		isValid: trimmedValue.length > 0,
		message: ERROR_MESSAGES.REQUIRED,
	};
};

/**
 * Validate email format (RFC 5322 inspired, practical implementation)
 * @param {string} email - Email address
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validateEmail = (email) => {
	const trimmedEmail = email?.trim() || "";

	// Check if required first
	if (trimmedEmail.length === 0) {
		return {
			isValid: false,
			message: ERROR_MESSAGES.REQUIRED,
		};
	}

	// Practical email regex pattern
	// Allows: alphanumeric, dots, hyphens, underscores, plus signs
	// Requires @ symbol and domain with at least one dot
	const emailPattern = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	const isValid = emailPattern.test(trimmedEmail);

	return {
		isValid,
		message: ERROR_MESSAGES.EMAIL_INVALID,
	};
};

/**
 * Validate US phone number format
 * Validates based on digit count since auto-formatting ensures proper format
 * @param {string} phone - Phone number
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validatePhone = (phone) => {
	const trimmedPhone = phone?.trim() || "";

	// Check if required first
	if (trimmedPhone.length === 0) {
		return {
			isValid: false,
			message: ERROR_MESSAGES.REQUIRED,
		};
	}

	// Remove all non-digit characters to check length
	const digitsOnly = trimmedPhone.replace(/\D/g, "");

	// Must have exactly 10 digits for US phone
	// Auto-formatter ensures proper (XXX) XXX-XXXX format
	const isValid = digitsOnly.length === 10;

	return {
		isValid,
		message: ERROR_MESSAGES.PHONE_INVALID,
	};
};

/**
 * Validate zip code selection
 * @param {string} zipCode - Selected zip code
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validateZipCode = (zipCode) => {
	const trimmedZip = zipCode?.trim() || "";

	return {
		isValid: trimmedZip.length > 0,
		message: ERROR_MESSAGES.ZIPCODE_REQUIRED,
	};
};

/**
 * Validate delivery address (minimum length requirement)
 * @param {string} address - Delivery address
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validateAddress = (address) => {
	const trimmedAddress = address?.trim() || "";

	// Check if required first
	if (trimmedAddress.length === 0) {
		return {
			isValid: false,
			message: ERROR_MESSAGES.REQUIRED,
		};
	}

	// Minimum length for a complete address
	const MIN_ADDRESS_LENGTH = 10;

	const isValid = trimmedAddress.length >= MIN_ADDRESS_LENGTH;

	return {
		isValid,
		message: ERROR_MESSAGES.ADDRESS_TOO_SHORT,
	};
};

/**
 * Validate entire form
 * @param {Object} formData - Form data object with field values
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateForm = (formData) => {
	const errors = {};
	let isValid = true;

	// Validate name
	const nameValidation = validateRequired(formData.name);
	if (!nameValidation.isValid) {
		errors.name = nameValidation.message;
		isValid = false;
	}

	// Validate email
	const emailValidation = validateEmail(formData.email);
	if (!emailValidation.isValid) {
		errors.email = emailValidation.message;
		isValid = false;
	}

	// Validate phone
	const phoneValidation = validatePhone(formData.phone);
	if (!phoneValidation.isValid) {
		errors.phone = phoneValidation.message;
		isValid = false;
	}

	// Validate zip code
	const zipCodeValidation = validateZipCode(formData.zipcode);
	if (!zipCodeValidation.isValid) {
		errors.zipcode = zipCodeValidation.message;
		isValid = false;
	}

	// Validate address
	const addressValidation = validateAddress(formData.address);
	if (!addressValidation.isValid) {
		errors.address = addressValidation.message;
		isValid = false;
	}

	return {
		isValid,
		errors,
	};
};
