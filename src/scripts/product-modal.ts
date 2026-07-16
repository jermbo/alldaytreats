import { addToCart, updateCartItem } from "@/scripts/cart.ts";
import {
	toppings as allToppings,
	calculateToppingsPrice,
	calculateToppingPrice,
	MAX_TOPPINGS,
} from "@/config/toppings.ts";
import { themes, THEME_PRICE } from "@/config/themes.ts";
import {
	flavors as allFlavors,
	calculateExtraFlavorFee,
} from "@/config/flavors.ts";
import {
	isPackage,
	supportsToppings,
	requiresFlavor,
} from "@/scripts/utils/product.ts";
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
let selectedTheme: string | null = null;
let selectedFlavors: string[] = [];

interface EditData {
	itemId: string;
	count: number;
	price: number;
	specialInstructions?: string;
	toppings?: ToppingsData;
	theme?: string;
	flavors?: string[];
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
			if (!canAddToCart()) return;

			const instructions = instructionsInput
				? instructionsInput.value.trim().slice(0, 250)
				: "";

			const showToppings = supportsToppings(currentProduct.id);
			const flatToppings = isPackage(currentProduct.id);
			const toppingsPrice = showToppings
				? calculateToppingsPrice(
						selectedToppings,
						selectedPriceOption.count,
						flatToppings,
					)
				: 0;
			const themePrice = selectedTheme ? THEME_PRICE : 0;
			const flavorFee = calculateExtraFlavorFee(selectedFlavors);
			const totalPrice =
				selectedPriceOption.price +
				toppingsPrice +
				themePrice +
				flavorFee;

			const toppingsData =
				!showToppings || selectedToppings.length === 0
					? undefined
					: [...selectedToppings];

			const cartPayload = {
				productId: currentProduct.id,
				name: currentProduct.name,
				count: selectedPriceOption.count,
				specialInstructions: instructions,
				toppings: toppingsData,
				sku: selectedPriceOption.sku,
				theme: selectedTheme || undefined,
				flavors:
					selectedFlavors.length > 0
						? [...selectedFlavors]
						: undefined,
			};

			if (editingItemId) {
				updateCartItem(editingItemId, {
					...cartPayload,
					unitPrice: totalPrice,
				});
			} else {
				addToCart({
					...cartPayload,
					price: totalPrice,
					quantity: 1,
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
	selectedTheme = editData?.theme || null;
	selectedFlavors = editData?.flavors ? [...editData.flavors] : [];

	const productIsPackage = isPackage(product.id);
	const showToppings = supportsToppings(product.id);
	const needsFlavor = requiresFlavor(product.id);

	if (showToppings && editData?.toppings) {
		selectedToppings = normalizeToppingIds(editData.toppings);
	} else {
		selectedToppings = [];
	}

	const titleEl = dialogElement.querySelector(".product-modal__title");
	const imageEl = dialogElement.querySelector<HTMLImageElement>(
		".product-modal__image",
	);
	const descriptionEl = dialogElement.querySelector(
		".product-modal__description",
	);
	const includesEl = dialogElement.querySelector<HTMLElement>(
		"[data-includes]",
	);
	const quantitySection = dialogElement.querySelector<HTMLElement>(
		"[data-quantity-section]",
	);
	const packagePriceSection = dialogElement.querySelector<HTMLElement>(
		"[data-package-price-section]",
	);
	const packagePriceEl = dialogElement.querySelector<HTMLElement>(
		"[data-package-price]",
	);
	const themeSection = dialogElement.querySelector<HTMLElement>(
		"[data-theme-section]",
	);
	const flavorSection = dialogElement.querySelector<HTMLElement>(
		"[data-flavor-section]",
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

	if (includesEl) {
		if (product.includes) {
			includesEl.hidden = false;
			includesEl.textContent = `Includes: ${product.includes}`;
		} else {
			includesEl.hidden = true;
			includesEl.textContent = "";
		}
	}

	// Quantity vs fixed package price
	if (productIsPackage) {
		if (quantitySection) quantitySection.hidden = true;
		if (packagePriceSection) packagePriceSection.hidden = false;
		const option = product.priceOptions[0];
		if (option) {
			selectedPriceOption = {
				count: option.count,
				price: option.price,
				sku: option.sku,
			};
			if (packagePriceEl) {
				packagePriceEl.textContent = `$${option.price.toFixed(2)}`;
			}
		}
	} else {
		if (quantitySection) quantitySection.hidden = false;
		if (packagePriceSection) packagePriceSection.hidden = true;
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
	}

	// Themes (packages only)
	if (themeSection) {
		themeSection.hidden = !productIsPackage;
		if (productIsPackage) populateThemes(dialogElement);
	}

	// Flavors (candy-fruit packages)
	if (flavorSection) {
		flavorSection.hidden = !needsFlavor;
		if (needsFlavor) populateFlavors(dialogElement);
	}

	// Toppings
	const toppingsSection = dialogElement.querySelector<HTMLElement>(
		"[data-toppings-section]",
	);
	if (toppingsSection) toppingsSection.hidden = !showToppings;

	if (showToppings) {
		populateToppings(dialogElement);
		if (selectedToppings.length > 0)
			updateToppingsState(dialogElement);
	}

	// Pre-select option if editing a la carte
	let preSelectedOption: (typeof product.priceOptions)[0] | undefined;
	if (editData && !productIsPackage) {
		preSelectedOption = product.priceOptions.find(
			(opt) => opt.count === editData.count,
		);
	}

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

	if (!productIsPackage) {
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

				if (supportsToppings(currentProduct!.id)) {
					populateToppings(dialogElement);
					updateToppingsState(dialogElement);
				}

				refreshAddButton(dialogElement);
			});
		});

		if (quantityOptions.length > 0) {
			setTimeout(() => quantityOptions[0].focus(), 0);
		}
	}

	refreshAddButton(dialogElement);
	dialogElement.showModal();

	if (productIsPackage) {
		const firstFocusable = dialogElement.querySelector<HTMLElement>(
			"[data-theme-options] input, [data-flavor-options] input, .product-modal__add-btn",
		);
		if (firstFocusable) setTimeout(() => firstFocusable.focus(), 0);
	}
};

const canAddToCart = (): boolean => {
	if (!currentProduct || !selectedPriceOption) return false;
	if (requiresFlavor(currentProduct.id) && selectedFlavors.length === 0) {
		return false;
	}
	return true;
};

const getCurrentTotal = (): number => {
	if (!currentProduct || !selectedPriceOption) return 0;

	const showToppings = supportsToppings(currentProduct.id);
	const flatToppings = isPackage(currentProduct.id);
	const toppingsPrice = showToppings
		? calculateToppingsPrice(
				selectedToppings,
				selectedPriceOption.count,
				flatToppings,
			)
		: 0;
	const themePrice = selectedTheme ? THEME_PRICE : 0;
	const flavorFee = calculateExtraFlavorFee(selectedFlavors);

	return (
		selectedPriceOption.price + toppingsPrice + themePrice + flavorFee
	);
};

const refreshAddButton = (dialogElement: HTMLElement): void => {
	const addBtn = dialogElement.querySelector<HTMLButtonElement>(
		".product-modal__add-btn",
	);
	updateAddButton(
		addBtn,
		getCurrentTotal(),
		editingItemId !== null,
		canAddToCart(),
	);
	updateFlavorFeeDisplay(dialogElement);
};

const updateAddButton = (
	addBtn: HTMLButtonElement | null,
	price: number,
	isEditing: boolean,
	enabled: boolean,
): void => {
	if (!addBtn) return;

	const textSpan = addBtn.querySelector(".product-modal__add-text");
	const checkmark = addBtn.querySelector(".product-modal__checkmark");
	const label = isEditing ? "Update Cart" : "Add to Cart";

	addBtn.disabled = !enabled || price <= 0;

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

const populateThemes = (dialogElement: HTMLElement): void => {
	const container = dialogElement.querySelector("[data-theme-options]");
	if (!container) return;

	container.innerHTML = "";

	const noneLabel = document.createElement("label");
	noneLabel.className = "theme-option";
	noneLabel.innerHTML = `
		<input type="radio" name="package-theme" value="" class="theme-option__radio" ${!selectedTheme ? "checked" : ""} />
		<span class="theme-option__label">No theme</span>
	`;
	container.appendChild(noneLabel);

	themes.forEach((theme) => {
		const label = document.createElement("label");
		label.className = "theme-option";
		const checked = selectedTheme === theme.id ? "checked" : "";
		label.innerHTML = `
			<input type="radio" name="package-theme" value="${theme.id}" class="theme-option__radio" ${checked} />
			<span class="theme-option__label">${theme.name}</span>
			<span class="theme-option__price">+$${THEME_PRICE}</span>
		`;
		container.appendChild(label);
	});

	container.querySelectorAll<HTMLInputElement>(".theme-option__radio").forEach((radio) => {
		radio.addEventListener("change", () => {
			selectedTheme = radio.value || null;
			refreshAddButton(dialogElement);
		});
	});
};

const populateFlavors = (dialogElement: HTMLElement): void => {
	const container = dialogElement.querySelector("[data-flavor-options]");
	if (!container) return;

	container.innerHTML = "";

	allFlavors.forEach((flavor) => {
		const label = document.createElement("label");
		label.className = "flavor-option";
		const checked = selectedFlavors.includes(flavor.id);
		label.innerHTML = `
			<input type="checkbox" value="${flavor.id}" class="flavor-option__checkbox" ${checked ? "checked" : ""} />
			<span class="flavor-option__label">${flavor.name}</span>
		`;
		const checkbox = label.querySelector("input")!;
		checkbox.addEventListener("change", () => {
			if (checkbox.checked) {
				if (!selectedFlavors.includes(flavor.id)) {
					selectedFlavors.push(flavor.id);
				}
			} else {
				selectedFlavors = selectedFlavors.filter(
					(id) => id !== flavor.id,
				);
			}
			refreshAddButton(dialogElement);
		});
		container.appendChild(label);
	});

	updateFlavorFeeDisplay(dialogElement);
};

const updateFlavorFeeDisplay = (dialogElement: HTMLElement): void => {
	const feeEl = dialogElement.querySelector<HTMLElement>(
		"[data-flavor-fee]",
	);
	if (!feeEl) return;

	const fee = calculateExtraFlavorFee(selectedFlavors);
	if (selectedFlavors.length === 0) {
		feeEl.hidden = false;
		feeEl.textContent = "Select at least one flavor";
		feeEl.classList.add("product-modal__flavor-fee--error");
	} else if (fee > 0) {
		feeEl.hidden = false;
		feeEl.textContent = `Extra flavors: +$${fee}`;
		feeEl.classList.remove("product-modal__flavor-fee--error");
	} else {
		feeEl.hidden = true;
		feeEl.textContent = "";
		feeEl.classList.remove("product-modal__flavor-fee--error");
	}
};

const populateToppings = (dialogElement: HTMLElement): void => {
	const premiumContainer = dialogElement.querySelector(
		'.toppings-group__options[data-category="premium"]',
	);
	if (!premiumContainer || !currentProduct) return;

	premiumContainer.innerHTML = "";
	const available = allToppings.filter((t) => t.available);
	const currentCount = selectedPriceOption?.count || 6;
	const flat = isPackage(currentProduct.id);

	available.forEach((topping) => {
		premiumContainer.appendChild(
			createToppingOption(
				topping,
				currentCount,
				flat,
				dialogElement,
			),
		);
	});

	updateToppingsTotal(dialogElement);
};

const createToppingOption = (
	topping: { id: string; name: string; price: number },
	count: number,
	flat: boolean,
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

	const price = calculateToppingPrice(topping.price, count, flat);
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
	if (!currentProduct || !supportsToppings(currentProduct.id)) return;

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
	refreshAddButton(dialogElement);
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
	if (!toppingsTotalValue || !currentProduct) return;

	const currentCount = selectedPriceOption?.count || 6;
	const flat = isPackage(currentProduct.id);
	const toppingsPrice = calculateToppingsPrice(
		selectedToppings,
		currentCount,
		flat,
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
	selectedTheme = null;
	selectedFlavors = [];
};
