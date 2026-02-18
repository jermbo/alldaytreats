import { addToCart, updateCartItem } from "@/scripts/cart.ts";
import {
	toppings as allToppings,
	calculateToppingsPrice,
	calculateToppingPrice,
	MAX_TOPPINGS,
} from "@/config/toppings.ts";
import { isChocolateCovered } from "@/scripts/utils/product.ts";
import { normalizeToppingIds } from "@/scripts/utils/toppings.ts";
import type { Product, ToppingsData } from "@/scripts/types/index.ts";

let currentProduct: Product | null = null;
let selectedPriceOption: {
	count: number;
	price: number;
	sku: string;
} | null = null;
let editingItemId: string | null = null;
let selectedToppings: string[] = [];

interface EditData {
	itemId: string;
	count: number;
	price: number;
	specialInstructions?: string;
	toppings?: ToppingsData;
}

/**
 * Initialize product modal (one-time setup)
 */
export const initProductModal = (dialogElement: HTMLDialogElement): void => {
	const closeBtn = dialogElement.querySelector(".product-modal__close");
	const addBtn = dialogElement.querySelector<HTMLButtonElement>(
		".product-modal__add-btn",
	);
	const instructionsInput =
		dialogElement.querySelector<HTMLTextAreaElement>(
			".product-modal__instructions",
		);
	const charCountValue = dialogElement.querySelector(
		".product-modal__char-count-value",
	);

	const updateCharCount = (): void => {
		if (!charCountValue || !instructionsInput) return;
		const length = instructionsInput.value.length;
		charCountValue.textContent = String(length);

		const container = charCountValue.closest(
			".product-modal__char-count",
		);
		if (container) {
			container.classList.toggle(
				"product-modal__char-count--warning",
				length > 200,
			);
		}
	};

	if (instructionsInput) {
		instructionsInput.addEventListener("input", updateCharCount);
		instructionsInput.addEventListener("paste", () =>
			setTimeout(updateCharCount, 0),
		);
	}

	if (closeBtn) {
		closeBtn.addEventListener("click", () =>
			closeModal(dialogElement),
		);
	}

	dialogElement.addEventListener("click", (e) => {
		if (e.target === dialogElement) closeModal(dialogElement);
	});

	if (addBtn) {
		addBtn.addEventListener("click", () => {
			if (!currentProduct || !selectedPriceOption) return;

			const instructions = instructionsInput
				? instructionsInput.value.trim().slice(0, 250)
				: "";

			const isChocolate = isChocolateCovered(currentProduct.id);
			const toppingsPrice = isChocolate
				? 0
				: calculateToppingsPrice(
						selectedToppings,
						selectedPriceOption.count,
					);
			const totalPrice = selectedPriceOption.price + toppingsPrice;

			const toppingsData =
				isChocolate || selectedToppings.length === 0
					? undefined
					: [...selectedToppings];

			if (editingItemId) {
				updateCartItem(editingItemId, {
					productId: currentProduct.id,
					name: currentProduct.name,
					count: selectedPriceOption.count,
					unitPrice: totalPrice,
					specialInstructions: instructions,
					toppings: toppingsData,
					sku: selectedPriceOption.sku,
				});
			} else {
				addToCart({
					productId: currentProduct.id,
					name: currentProduct.name,
					count: selectedPriceOption.count,
					price: totalPrice,
					specialInstructions: instructions,
					quantity: 1,
					toppings: toppingsData,
					sku: selectedPriceOption.sku,
				});
			}

			closeModal(dialogElement);
		});
	}
};

/**
 * Open modal with product data
 */
export const openProductModal = (
	dialogElement: HTMLDialogElement,
	product: Product,
	editData: EditData | null = null,
): void => {
	currentProduct = product;
	selectedPriceOption = null;
	editingItemId = editData?.itemId || null;

	const isChocolate = isChocolateCovered(product.id);

	if (isChocolate) {
		selectedToppings = [];
	} else if (editData?.toppings) {
		selectedToppings = normalizeToppingIds(editData.toppings);
	} else {
		selectedToppings = [];
	}

	// Update modal content
	const titleEl = dialogElement.querySelector(".product-modal__title");
	const imageEl = dialogElement.querySelector<HTMLImageElement>(
		".product-modal__image",
	);
	const descriptionEl = dialogElement.querySelector(
		".product-modal__description",
	);
	const quantityOptionsContainer = dialogElement.querySelector(
		".product-modal__quantity-options",
	);
	const addBtn = dialogElement.querySelector<HTMLButtonElement>(
		".product-modal__add-btn",
	);
	const instructionsInput =
		dialogElement.querySelector<HTMLTextAreaElement>(
			".product-modal__instructions",
		);

	if (titleEl) titleEl.textContent = product.name;
	if (imageEl) {
		imageEl.src = product.image;
		imageEl.alt = product.name;
	}
	if (descriptionEl) descriptionEl.textContent = product.description;

	// Generate quantity options
	if (quantityOptionsContainer) {
		quantityOptionsContainer.innerHTML = "";
		product.priceOptions.forEach((option) => {
			const button = document.createElement("button");
			button.type = "button";
			button.className = "product-modal__quantity-option";
			button.textContent = `${option.count}ct $${option.price}`;
			button.dataset.count = String(option.count);
			button.dataset.price = String(option.price);
			quantityOptionsContainer.appendChild(button);
		});
	}

	// Toggle toppings section visibility
	const toppingsSection = dialogElement.querySelector<HTMLElement>(
		"[data-toppings-section]",
	);
	if (toppingsSection) toppingsSection.hidden = isChocolate;

	if (!isChocolate) {
		populateToppings(dialogElement);
		if (selectedToppings.length > 0)
			updateToppingsState(dialogElement);
	}

	// Pre-select option if editing
	let preSelectedOption: (typeof product.priceOptions)[0] | undefined;
	if (editData) {
		preSelectedOption = product.priceOptions.find(
			(opt) => opt.count === editData.count,
		);
	}

	// Pre-fill instructions and update character count
	const charCountValue = dialogElement.querySelector(
		".product-modal__char-count-value",
	);
	if (instructionsInput) {
		const instructions = editData?.specialInstructions || "";
		instructionsInput.value = instructions.slice(0, 250);
		if (charCountValue) {
			charCountValue.textContent = String(
				instructionsInput.value.length,
			);
		}
		const charCountContainer = charCountValue?.closest(
			".product-modal__char-count",
		);
		if (charCountContainer) {
			charCountContainer.classList.toggle(
				"product-modal__char-count--warning",
				instructionsInput.value.length > 200,
			);
		}
	} else if (charCountValue) {
		charCountValue.textContent = "0";
		const container = charCountValue.closest(
			".product-modal__char-count",
		);
		if (container) {
			container.classList.remove(
				"product-modal__char-count--warning",
			);
		}
	}

	// Attach quantity option click handlers
	const quantityOptions = dialogElement.querySelectorAll<HTMLElement>(
		".product-modal__quantity-option",
	);
	quantityOptions.forEach((option) => {
		const count = parseInt(option.dataset.count || "0");
		const price = parseFloat(option.dataset.price || "0");

		if (preSelectedOption && count === preSelectedOption.count) {
			option.classList.add(
				"product-modal__quantity-option--selected",
			);
			selectedPriceOption = {
				count,
				price,
				sku: preSelectedOption.sku || "",
			};
		}

		option.addEventListener("click", () => {
			quantityOptions.forEach((opt) =>
				opt.classList.remove(
					"product-modal__quantity-option--selected",
				),
			);
			option.classList.add(
				"product-modal__quantity-option--selected",
			);

			const fullOption = currentProduct!.priceOptions.find(
				(opt) => opt.count === count && opt.price === price,
			);
			selectedPriceOption = {
				count,
				price,
				sku: fullOption?.sku || "",
			};

			if (!isChocolateCovered(currentProduct!.id)) {
				populateToppings(dialogElement);
				updateToppingsState(dialogElement);
			}

			const toppingsPrice = isChocolateCovered(currentProduct!.id)
				? 0
				: calculateToppingsPrice(selectedToppings, count);
			updateAddButton(
				addBtn,
				price + toppingsPrice,
				editingItemId !== null,
			);
		});
	});

	// Update add button state
	if (preSelectedOption) {
		const initialToppingsPrice = isChocolate
			? 0
			: calculateToppingsPrice(
					selectedToppings,
					preSelectedOption.count,
				);
		updateAddButton(
			addBtn,
			preSelectedOption.price + initialToppingsPrice,
			editingItemId !== null,
		);
	} else {
		updateAddButton(addBtn, 0, false);
	}

	dialogElement.showModal();

	if (quantityOptions.length > 0) {
		setTimeout(() => quantityOptions[0].focus(), 0);
	}
};

const updateAddButton = (
	addBtn: HTMLButtonElement | null,
	price: number,
	isEditing: boolean,
): void => {
	if (!addBtn) return;

	const textSpan = addBtn.querySelector(".product-modal__add-text");
	const checkmark = addBtn.querySelector(".product-modal__checkmark");
	const label = isEditing ? "Update Cart" : "Add to Cart";
	const isEnabled = selectedPriceOption !== null && price > 0;

	addBtn.disabled = !isEnabled;

	if (textSpan) {
		textSpan.textContent = `${label} - $${price.toFixed(2)}`;
	} else {
		const span = document.createElement("span");
		span.className = "product-modal__add-text";
		span.textContent = `${label} - $${price.toFixed(2)}`;
		checkmark
			? addBtn.insertBefore(span, checkmark)
			: addBtn.appendChild(span);
	}
};

const closeModal = (dialogElement: HTMLDialogElement): void => {
	dialogElement.classList.add("closing");
	setTimeout(() => {
		dialogElement.close();
		dialogElement.classList.remove("closing");
		resetModal();
	}, 200);
};

const populateToppings = (dialogElement: HTMLElement): void => {
	const premiumContainer = dialogElement.querySelector(
		'.toppings-group__options[data-category="premium"]',
	);
	if (!premiumContainer) return;

	premiumContainer.innerHTML = "";
	const available = allToppings.filter((t) => t.available);
	const currentCount = selectedPriceOption?.count || 6;

	available.forEach((topping) => {
		premiumContainer.appendChild(
			createToppingOption(topping, currentCount, dialogElement),
		);
	});

	updateToppingsTotal(dialogElement);
};

const createToppingOption = (
	topping: { id: string; name: string; price: number },
	count: number,
	dialogElement: HTMLElement,
): HTMLElement => {
	const label = document.createElement("label");
	label.className = "topping-option";

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.className = "topping-option__checkbox";
	checkbox.value = topping.id;
	checkbox.dataset.category = "premium";
	checkbox.checked = selectedToppings.includes(topping.id);

	const labelText = document.createElement("span");
	labelText.className = "topping-option__label";
	labelText.textContent = topping.name;

	label.appendChild(checkbox);
	label.appendChild(labelText);

	const price = calculateToppingPrice(topping.price, count);
	if (price > 0) {
		const priceSpan = document.createElement("span");
		priceSpan.className = "topping-option__price";
		priceSpan.textContent = `+$${price}`;
		label.appendChild(priceSpan);
	}

	checkbox.addEventListener("change", () => {
		handleToppingChange(topping.id, checkbox.checked, dialogElement);
	});

	return label;
};

const handleToppingChange = (
	toppingId: string,
	isChecked: boolean,
	dialogElement: HTMLElement,
): void => {
	if (isChocolateCovered(currentProduct?.id || "")) return;

	if (isChecked) {
		if (selectedToppings.length >= MAX_TOPPINGS) {
			const checkbox =
				dialogElement.querySelector<HTMLInputElement>(
					`input[value="${toppingId}"]`,
				);
			if (checkbox) checkbox.checked = false;
			return;
		}
		if (!selectedToppings.includes(toppingId)) {
			selectedToppings.push(toppingId);
		}
	} else {
		selectedToppings = selectedToppings.filter(
			(id) => id !== toppingId,
		);
	}

	updateToppingsState(dialogElement);
	updateToppingsTotal(dialogElement);

	const addBtn = dialogElement.querySelector<HTMLButtonElement>(
		".product-modal__add-btn",
	);
	if (selectedPriceOption) {
		const toppingsPrice = calculateToppingsPrice(
			selectedToppings,
			selectedPriceOption.count,
		);
		updateAddButton(
			addBtn,
			selectedPriceOption.price + toppingsPrice,
			editingItemId !== null,
		);
	}
};

const updateToppingsState = (dialogElement: HTMLElement): void => {
	const checkboxes = dialogElement.querySelectorAll<HTMLInputElement>(
		'input[type="checkbox"][data-category="premium"]',
	);
	const counterCurrent = dialogElement.querySelector(
		".toppings-group__counter-current",
	);
	const atLimit = selectedToppings.length >= MAX_TOPPINGS;

	if (counterCurrent) {
		counterCurrent.textContent = String(selectedToppings.length);
	}

	checkboxes.forEach((checkbox) => {
		if (checkbox.checked) return;
		checkbox.disabled = atLimit;
		const label = checkbox.closest(".topping-option");
		if (label) {
			label.classList.toggle("topping-option--disabled", atLimit);
		}
	});
};

const updateToppingsTotal = (dialogElement: HTMLElement): void => {
	const toppingsTotalValue = dialogElement.querySelector(
		".product-modal__toppings-total-value",
	);
	if (!toppingsTotalValue) return;

	const currentCount = selectedPriceOption?.count || 6;
	const toppingsPrice = calculateToppingsPrice(
		selectedToppings,
		currentCount,
	);
	toppingsTotalValue.textContent = `+$${toppingsPrice}`;

	if (toppingsPrice > 0) {
		toppingsTotalValue.classList.add("has-premium");
		setTimeout(
			() => toppingsTotalValue.classList.remove("has-premium"),
			300,
		);
	}
};

const resetModal = (): void => {
	currentProduct = null;
	selectedPriceOption = null;
	editingItemId = null;
	selectedToppings = [];
};
