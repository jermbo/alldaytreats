import {
	getCartItems,
	getCartSubtotal,
	clearCart,
	getOrderIdFromCart,
	saveOrderIdToCart,
} from "@/scripts/cart.ts";
import {
	validateRequired,
	validateEmail,
	validatePhone,
	validateAddress,
	validateZipCode,
	validateForm,
} from "@/scripts/validation.ts";
import {
	clearAllErrors,
	focusFirstInvalidField,
	showFieldError,
} from "@/scripts/validation-ui.ts";
import { initPhoneFormatter } from "@/scripts/phone-formatter.ts";
import { getDeliveryOptions, getDeliveryFee } from "@/config/delivery.ts";
import { siteConfig } from "@/config/site.ts";
import { generateId } from "@/scripts/utils/generate-id.ts";
import { formatCurrency } from "@/scripts/utils/format-currency.ts";
import {
	createFocusTrap,
	type FocusTrap,
} from "@/scripts/utils/focus-trap.ts";
import { copyToClipboard } from "@/scripts/checkout/clipboard.ts";
import { formatOrderEmail } from "@/scripts/checkout/order-formatter.ts";
import { attachFieldValidation } from "@/scripts/checkout/field-validator.ts";
import {
	initOrderSummary,
	renderOrderSummary,
	updateDeliveryDisplay,
} from "@/scripts/checkout/order-summary.ts";
import type { CheckoutFormData, OrderData } from "@/scripts/types/index.ts";

// DOM references
let checkoutModal: HTMLElement | null = null;
let checkoutForm: HTMLFormElement | null = null;
let submitBtn: HTMLButtonElement | null = null;
let countdownEl: HTMLElement | null = null;
let zipCodeField: HTMLSelectElement | null = null;
let deliveryTypeRadios: NodeListOf<HTMLInputElement> | null = null;
let deliveryFields: NodeListOf<HTMLElement> | null = null;

// Step elements
let stepInfo: HTMLElement | null = null;
let stepInstructions: HTMLElement | null = null;
let stepSuccess: HTMLElement | null = null;

// State
let currentStep = "info";
let formattedOrderText = "";
let orderId = "";
let autoCloseTimer: ReturnType<typeof setTimeout> | null = null;
let countdownInterval: ReturnType<typeof setInterval> | null = null;
let selectedDeliveryFee: number | null = null;
let deliveryType: "pickup" | "delivery" = "pickup";
let focusTrap: FocusTrap | null = null;

/**
 * Initialize checkout UI
 */
export const initCheckoutUI = (modalElement: HTMLElement): void => {
	checkoutModal = modalElement;
	if (!checkoutModal) return;

	// Cache step elements
	stepInfo = checkoutModal.querySelector('[data-step="info"]');
	stepInstructions = checkoutModal.querySelector(
		'[data-step="instructions"]',
	);
	stepSuccess = checkoutModal.querySelector('[data-step="success"]');

	// Cache DOM references
	checkoutForm = checkoutModal.querySelector("#checkout-form");
	submitBtn = checkoutModal.querySelector(
		".checkout-modal__btn--primary",
	);
	countdownEl = checkoutModal.querySelector(
		".checkout-modal__countdown-value",
	);
	zipCodeField = checkoutModal.querySelector("#checkout-zipcode");
	deliveryTypeRadios = checkoutModal.querySelectorAll<HTMLInputElement>(
		'input[name="deliveryType"]',
	);
	deliveryFields = checkoutModal.querySelectorAll<HTMLElement>(
		"[data-delivery-fields]",
	);

	// Focus trap
	const container = checkoutModal.querySelector<HTMLElement>(
		".checkout-modal__container",
	);
	if (container) {
		focusTrap = createFocusTrap(container);
	}

	// Initialize order summary
	initOrderSummary(checkoutModal);

	// Populate zip code dropdown
	if (zipCodeField) populateZipCodeDropdown(zipCodeField);

	// Event delegation for button actions
	checkoutModal.addEventListener("click", handleModalClick);

	// Form setup
	if (checkoutForm) {
		checkoutForm.addEventListener("submit", handleFormSubmit);

		const phoneField =
			checkoutForm.querySelector<HTMLInputElement>(
				"#checkout-phone",
			);
		if (phoneField) initPhoneFormatter(phoneField);

		// Setup delivery type selection
		setupDeliveryTypeSelection();

		setupFieldValidation(checkoutForm);
	}

	// Mobile submit button compatibility
	if (submitBtn) {
		const triggerSubmit = (e?: Event): void => {
			if (submitBtn!.disabled || !checkoutForm) return;
			if (e) e.preventDefault();
			checkoutForm.dispatchEvent(
				new Event("submit", { bubbles: true, cancelable: true }),
			);
		};
		submitBtn.addEventListener("click", () => triggerSubmit());
		submitBtn.addEventListener("touchend", (e) => triggerSubmit(e));
	}
};

// --- Delivery Type Selection ---

const setupDeliveryTypeSelection = (): void => {
	if (!deliveryTypeRadios || !checkoutForm) return;

	// Set initial state
	const checkedRadio = Array.from(deliveryTypeRadios).find(
		(radio) => radio.checked,
	);
	if (checkedRadio) {
		deliveryType = checkedRadio.value as "pickup" | "delivery";
		updateDeliveryFieldsVisibility();
	}

	// Add change listeners
	deliveryTypeRadios.forEach((radio) => {
		radio.addEventListener("change", handleDeliveryTypeChange);
	});
};

const handleDeliveryTypeChange = (): void => {
	if (!deliveryTypeRadios || !checkoutForm) return;

	const checkedRadio = Array.from(deliveryTypeRadios).find(
		(radio) => radio.checked,
	);
	if (!checkedRadio) return;

	deliveryType = checkedRadio.value as "pickup" | "delivery";
	updateDeliveryFieldsVisibility();

	// Clear zipcode and address when switching to pickup
	if (deliveryType === "pickup") {
		if (zipCodeField) zipCodeField.value = "";
		const addressField = checkoutForm.querySelector<HTMLTextAreaElement>(
			"#checkout-address",
		);
		if (addressField) addressField.value = "";
		selectedDeliveryFee = null;
		updateDeliveryDisplay(null, deliveryType);
	} else {
		updateDeliveryDisplay(selectedDeliveryFee, deliveryType);
	}

	// Update validation state
	clearAllErrors(checkoutForm);
	updateSubmitButtonState();
};

const updateDeliveryFieldsVisibility = (): void => {
	if (!deliveryFields) return;

	deliveryFields.forEach((field) => {
		if (deliveryType === "pickup") {
			field.hidden = true;
			// Remove required attribute when hidden
			const input = field.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
				"input, select, textarea",
			);
			if (input) {
				input.removeAttribute("required");
				input.setAttribute("aria-required", "false");
			}
		} else {
			field.hidden = false;
			// Restore required attribute when visible
			const input = field.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
				"input, select, textarea",
			);
			if (input) {
				input.setAttribute("required", "");
				input.setAttribute("aria-required", "true");
			}
		}
	});
};

// --- Zip Code ---

const populateZipCodeDropdown = (select: HTMLSelectElement): void => {
	getDeliveryOptions().forEach((option) => {
		const el = document.createElement("option");
		el.value = option.zipCode;
		el.textContent = `${option.zipCode} - ${option.area} (${formatCurrency(option.fee)} delivery)`;
		select.appendChild(el);
	});
};

const handleZipCodeChange = (): void => {
	if (!zipCodeField) return;
	selectedDeliveryFee = zipCodeField.value
		? getDeliveryFee(zipCodeField.value)
		: null;
	updateDeliveryDisplay(selectedDeliveryFee, deliveryType);
};

// --- Step Navigation ---

const goToStep = (step: string): void => {
	currentStep = step;

	if (stepInfo) stepInfo.hidden = true;
	if (stepInstructions) stepInstructions.hidden = true;
	if (stepSuccess) stepSuccess.hidden = true;

	switch (step) {
		case "info":
			if (stepInfo) stepInfo.hidden = false;
			if (checkoutForm) {
				const firstField =
					checkoutForm.querySelector<HTMLInputElement>(
						"#checkout-name",
					);
				if (firstField)
					setTimeout(() => firstField.focus(), 100);
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

// --- Modal Click Delegation ---

const handleModalClick = (e: Event): void => {
	const action = (e.target as HTMLElement).closest<HTMLElement>(
		"[data-action]",
	)?.dataset.action;
	if (!action) return;

	switch (action) {
		case "cancel":
		case "close":
			closeCheckout();
			break;
		case "back":
			goToStep("info");
			break;
		case "copy":
			copyOrderToClipboard(
				(e.target as HTMLElement).closest<HTMLElement>(
					"[data-action]",
				)!,
			);
			break;
		case "email":
			openEmailClient();
			break;
		case "confirm":
			confirmOrderSent();
			break;
	}
};

// --- Form Validation Setup (DRY via field-validator factory) ---

const updateSubmitButtonState = (): void => {
	if (!checkoutForm || !submitBtn) return;

	const field = (id: string): string =>
		(
			checkoutForm!.querySelector<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>(id)?.value || ""
		).trim();

	const nameValid = validateRequired(field("#checkout-name")).isValid;
	const emailValid = validateEmail(field("#checkout-email")).isValid;
	const phoneValid = validatePhone(field("#checkout-phone")).isValid;

	let allValid = nameValid && emailValid && phoneValid;

	// Only validate zipcode and address for delivery orders
	if (deliveryType === "delivery") {
		const zipcodeValid = validateZipCode(field("#checkout-zipcode")).isValid;
		const addressValid = validateAddress(field("#checkout-address")).isValid;
		allValid = allValid && zipcodeValid && addressValid;
	}

	submitBtn.disabled = !allValid;
};

const setupFieldValidation = (form: HTMLFormElement): void => {
	const onUpdate = (): void => updateSubmitButtonState();

	attachFieldValidation(
		form.querySelector("#checkout-name"),
		validateRequired,
		onUpdate,
	);

	attachFieldValidation(
		form.querySelector("#checkout-email"),
		validateEmail,
		onUpdate,
	);

	attachFieldValidation(
		form.querySelector("#checkout-phone"),
		validatePhone,
		onUpdate,
	);

	// Always attach zipcode/address validation - validateForm handles conditional logic
	attachFieldValidation(
		form.querySelector("#checkout-zipcode"),
		validateZipCode,
		() => {
			handleZipCodeChange();
			onUpdate();
		},
		{ eventType: "change", trimOnBlur: false },
	);

	attachFieldValidation(
		form.querySelector("#checkout-address"),
		validateAddress,
		onUpdate,
	);

	// Character counter for notes field
	const notesField =
		form.querySelector<HTMLTextAreaElement>("#checkout-notes");
	const charCountValue = form.querySelector<HTMLElement>(
		".checkout-modal__char-count-value",
	);

	if (notesField) {
		const updateCharCount = (): void => {
			if (!charCountValue) return;
			const length = notesField.value.length;
			charCountValue.textContent = String(length);
			const container = charCountValue.closest(
				".checkout-modal__char-count",
			);
			if (container) {
				container.classList.toggle(
					"checkout-modal__char-count--warning",
					length > 400,
				);
			}
		};

		notesField.addEventListener("blur", () => {
			notesField.value = notesField.value.trim();
		});
		notesField.addEventListener("input", updateCharCount);
		notesField.addEventListener("paste", () =>
			setTimeout(updateCharCount, 0),
		);
	}

	updateSubmitButtonState();
};

// --- Form Submission ---

const handleFormSubmit = async (e: Event): Promise<void> => {
	e.preventDefault();
	if (!checkoutForm) return;

	// Honeypot check
	const websiteField =
		checkoutForm.querySelector<HTMLInputElement>(
			"#checkout-website",
		);
	if (websiteField?.value) return;

	// Timestamp check
	const timestampField =
		checkoutForm.querySelector<HTMLInputElement>(
			"#checkout-form-ts",
		);
	if (timestampField?.value) {
		const elapsed =
			(Date.now() - parseInt(timestampField.value, 10)) / 1000;
		if (elapsed < 3) return;
	}

	const formData: CheckoutFormData = {
		deliveryType,
		name: getFieldValue("#checkout-name"),
		email: getFieldValue("#checkout-email"),
		phone: getFieldValue("#checkout-phone"),
		zipcode:
			deliveryType === "delivery"
				? checkoutForm.querySelector<HTMLSelectElement>(
						"#checkout-zipcode",
					)?.value || ""
				: "",
		address:
			deliveryType === "delivery"
				? getFieldValue("#checkout-address")
				: "",
		notes: getFieldValue("#checkout-notes"),
	};

	const validation = validateForm(formData);
	clearAllErrors(checkoutForm);

	if (!validation.isValid) {
		Object.entries(validation.errors).forEach(
			([fieldName, errorMessage]) => {
				const field =
					checkoutForm!.querySelector<HTMLElement>(
						`#checkout-${fieldName}`,
					);
				if (field) showFieldError(field, errorMessage);
			},
		);
		focusFirstInvalidField(checkoutForm);
		return;
	}

	setLoadingState(true);

	try {
		orderId = getOrderIdFromCart();
		if (!orderId) {
			orderId = generateId();
			saveOrderIdToCart(orderId);
		}

		const deliveryFee =
			deliveryType === "delivery"
				? getDeliveryFee(formData.zipcode) || 0
				: 0;
		const subtotal = getCartSubtotal();

		const orderData: OrderData = {
			...formData,
			items: getCartItems(),
			subtotal,
			deliveryFee,
			total: subtotal + deliveryFee,
		};

		const subject = `Treat Order #${orderId}`;
		const body = formatOrderEmail(orderData);
		formattedOrderText = `${subject}\n\n${body}`;

		goToStep("instructions");
	} catch (error) {
		console.error("Error during checkout:", error);
	} finally {
		setLoadingState(false);
	}
};

const getFieldValue = (selector: string): string => {
	return (
		checkoutForm?.querySelector<
			HTMLInputElement | HTMLTextAreaElement
		>(selector)?.value || ""
	).trim();
};

// --- Clipboard & Email ---

const copyOrderToClipboard = async (button: HTMLElement): Promise<void> => {
	const success = await copyToClipboard(formattedOrderText);

	if (success && button) {
		const textEl = button.querySelector<HTMLElement>(
			".checkout-modal__btn-text",
		);
		const copiedEl = button.querySelector<HTMLElement>(
			".checkout-modal__btn-copied",
		);

		if (textEl) textEl.hidden = true;
		if (copiedEl) copiedEl.hidden = false;

		setTimeout(() => {
			if (textEl) textEl.hidden = false;
			if (copiedEl) copiedEl.hidden = true;
		}, 2000);
	} else if (!success) {
		alert(
			"Could not copy to clipboard. Please manually copy the order details.",
		);
	}
};

const openEmailClient = (): void => {
	const businessEmail = siteConfig.contact.email;
	const subject = `Treat Order #${orderId}`;
	const zipcode =
		deliveryType === "delivery"
			? checkoutForm?.querySelector<HTMLSelectElement>(
					"#checkout-zipcode",
				)?.value || ""
			: "";
	const deliveryFee =
		deliveryType === "delivery" ? getDeliveryFee(zipcode) || 0 : 0;
	const subtotal = getCartSubtotal();

	const body = formatOrderEmail({
		deliveryType,
		name: getFieldValue("#checkout-name"),
		email: getFieldValue("#checkout-email"),
		phone: getFieldValue("#checkout-phone"),
		zipcode,
		address:
			deliveryType === "delivery"
				? getFieldValue("#checkout-address")
				: "",
		notes: getFieldValue("#checkout-notes"),
		items: getCartItems(),
		subtotal,
		deliveryFee,
		total: subtotal + deliveryFee,
	});

	// Copy as fallback
	copyToClipboard(formattedOrderText).catch(() => {});

	const mailtoLink = `mailto:${businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
	const anchor = document.createElement("a");
	anchor.href = mailtoLink;
	anchor.target = "_blank";
	anchor.rel = "noopener noreferrer";
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
};

// --- Order Confirmation ---

const confirmOrderSent = (): void => {
	clearCart();
	if (checkoutForm) {
		checkoutForm.reset();
		clearAllErrors(checkoutForm);
	}
	orderId = "";
	goToStep("success");
};

// --- Auto-close Countdown ---

const clearTimers = (): void => {
	if (countdownInterval) clearInterval(countdownInterval);
	if (autoCloseTimer) clearTimeout(autoCloseTimer);
};

const startAutoCloseCountdown = (): void => {
	let countdown = 5;
	if (countdownEl) countdownEl.textContent = String(countdown);

	clearTimers();

	countdownInterval = setInterval(() => {
		countdown--;
		if (countdownEl) countdownEl.textContent = String(countdown);
		if (countdown <= 0) clearInterval(countdownInterval!);
	}, 1000);

	autoCloseTimer = setTimeout(() => {
		clearInterval(countdownInterval!);
		closeCheckout();
	}, 5000);
};

// --- Loading State ---

const setLoadingState = (isLoading: boolean): void => {
	if (!submitBtn) return;
	submitBtn.classList.toggle(
		"checkout-modal__btn--loading",
		isLoading,
	);
	submitBtn.disabled = isLoading;
};

// --- Open / Close ---

export const openCheckout = (): void => {
	if (!checkoutModal) return;

	const cartItems = getCartItems();
	if (cartItems.length === 0) {
		if (orderId) {
			orderId = "";
			saveOrderIdToCart("");
		}
		console.warn("Cannot open checkout with empty cart");
		return;
	}

	currentStep = "info";
	formattedOrderText = "";
	orderId = getOrderIdFromCart();

	if (!orderId) {
		orderId = generateId();
		saveOrderIdToCart(orderId);
	}
	selectedDeliveryFee = null;
	deliveryType = "pickup";

	// Reset form and delivery type selection
	if (checkoutForm) {
		const pickupRadio = checkoutForm.querySelector<HTMLInputElement>(
			'input[name="deliveryType"][value="pickup"]',
		);
		if (pickupRadio) pickupRadio.checked = true;
	}
	if (zipCodeField) zipCodeField.value = "";

	updateDeliveryFieldsVisibility();

	clearTimers();
	goToStep("info");
	renderOrderSummary();
	updateDeliveryDisplay(null, deliveryType);

	if (checkoutForm) updateSubmitButtonState();

	const timestampField =
		checkoutForm?.querySelector<HTMLInputElement>(
			"#checkout-form-ts",
		);
	if (timestampField) timestampField.value = Date.now().toString();

	checkoutModal.hidden = false;
	checkoutModal.classList.add("checkout-modal--open");
	document.body.style.overflow = "hidden";
	focusTrap?.activate();
};

export const closeCheckout = (): void => {
	if (!checkoutModal) return;

	clearTimers();
	checkoutModal.classList.remove("checkout-modal--open");
	document.body.style.overflow = "";
	focusTrap?.deactivate();

	setTimeout(() => {
		if (!checkoutModal?.classList.contains("checkout-modal--open")) {
			checkoutModal!.hidden = true;
		}
	}, 300);
};
