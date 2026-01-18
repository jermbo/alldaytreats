import { addToCart, updateCartItem } from "./cart.js";
import {
	toppings,
	calculateToppingsPrice,
	MAX_INCLUDED_TOPPINGS,
} from "../config/toppings.ts";

let currentProduct = null;
let selectedPriceOption = null;
let editingItemId = null;
let selectedToppings = {
	included: [],
	premium: [],
};

/**
 * Initialize product modal (one-time setup)
 * @param {HTMLElement} dialogElement - The dialog element
 * @returns {void}
 */
export const initProductModal = (dialogElement) => {
	const closeBtn = dialogElement.querySelector(".product-modal__close");
	const addBtn = dialogElement.querySelector(".product-modal__add-btn");
	const instructionsInput = dialogElement.querySelector(
		".product-modal__instructions"
	);
	const charCountValue = dialogElement.querySelector(
		".product-modal__char-count-value"
	);

	// Character counter update function
	const updateCharCount = () => {
		if (charCountValue && instructionsInput) {
			const length = instructionsInput.value.length;
			charCountValue.textContent = length;

			// Add warning class if approaching limit
			const charCountContainer = charCountValue.closest(
				".product-modal__char-count"
			);
			if (charCountContainer) {
				if (length > 200) {
					charCountContainer.classList.add(
						"product-modal__char-count--warning"
					);
				} else {
					charCountContainer.classList.remove(
						"product-modal__char-count--warning"
					);
				}
			}
		}
	};

	// Update character count on input
	if (instructionsInput) {
		instructionsInput.addEventListener("input", updateCharCount);
		instructionsInput.addEventListener("paste", (e) => {
			// Handle paste to ensure maxlength is respected
			setTimeout(updateCharCount, 0);
		});
	}

	// Close button handler
	if (closeBtn) {
		closeBtn.addEventListener("click", () => {
			closeModal(dialogElement);
		});
	}

	// Close on backdrop click
	dialogElement.addEventListener("click", (e) => {
		if (e.target === dialogElement) {
			closeModal(dialogElement);
		}
	});

	// Add to cart handler
	if (addBtn) {
		addBtn.addEventListener("click", () => {
			if (!currentProduct || !selectedPriceOption) return;

			const instructions = instructionsInput
				? instructionsInput.value.trim().slice(0, 250)
				: "";

			// Calculate total price including toppings
			const toppingsPrice = calculateToppingsPrice([
				...selectedToppings.included,
				...selectedToppings.premium,
			]);
			const totalPrice = selectedPriceOption.price + toppingsPrice;

			// Prepare toppings data (only include if selections exist)
			const toppingsData =
				selectedToppings.included.length > 0 ||
				selectedToppings.premium.length > 0
					? {
							included: [...selectedToppings.included],
							premium: [...selectedToppings.premium],
					  }
					: undefined;

			if (editingItemId) {
				// Update existing item
				updateCartItem(editingItemId, {
					productId: currentProduct.id,
					name: currentProduct.name,
					count: selectedPriceOption.count,
					unitPrice: totalPrice,
					specialInstructions: instructions,
					toppings: toppingsData,
				});
			} else {
				// Add new item
				addToCart({
					productId: currentProduct.id,
					name: currentProduct.name,
					count: selectedPriceOption.count,
					price: totalPrice,
					specialInstructions: instructions,
					quantity: 1,
					toppings: toppingsData,
				});
			}

			// Close modal and reset
			closeModal(dialogElement);

			// Visual feedback handled by cart badge animation
		});
	}
};

/**
 * Open modal with product data
 * @param {HTMLElement} dialogElement - The dialog element
 * @param {Object} product - Product data from products.js
 * @param {Object} editData - Optional edit data with itemId, count, price, specialInstructions, toppings
 * @returns {void}
 */
export const openProductModal = (dialogElement, product, editData = null) => {
	currentProduct = product;
	selectedPriceOption = null;
	editingItemId = editData?.itemId || null;
	selectedToppings = {
		included: editData?.toppings?.included || [],
		premium: editData?.toppings?.premium || [],
	};

	// Update modal content
	const titleEl = dialogElement.querySelector(".product-modal__title");
	const imageEl = dialogElement.querySelector(".product-modal__image");
	const descriptionEl = dialogElement.querySelector(
		".product-modal__description"
	);
	const quantityOptionsContainer = dialogElement.querySelector(
		".product-modal__quantity-options"
	);
	const addBtn = dialogElement.querySelector(".product-modal__add-btn");
	const instructionsInput = dialogElement.querySelector(
		".product-modal__instructions"
	);

	// Set title
	if (titleEl) {
		titleEl.textContent = product.name;
	}

	// Set image
	if (imageEl) {
		imageEl.src = product.image;
		imageEl.alt = product.name;
	}

	// Set description
	if (descriptionEl) {
		descriptionEl.textContent = product.description;
	}

	// Generate quantity options
	if (quantityOptionsContainer) {
		quantityOptionsContainer.innerHTML = "";
		product.priceOptions.forEach((option) => {
			const button = document.createElement("button");
			button.type = "button";
			button.className = "product-modal__quantity-option";
			button.textContent = `${option.count}ct $${option.price}`;
			button.dataset.count = option.count;
			button.dataset.price = option.price;
			quantityOptionsContainer.appendChild(button);
		});
	}

	// Generate topping options
	populateToppings(dialogElement);

	// Update included toppings state if editing (to disable options if at limit)
	if (selectedToppings.included.length > 0) {
		updateIncludedToppingsState(dialogElement);
	}

	// Pre-select option if editing
	let preSelectedOption = null;
	if (editData) {
		preSelectedOption = product.priceOptions.find(
			(opt) => opt.count === editData.count && opt.price === editData.price
		);
	}

	// Reset add button
	updateAddButton(addBtn, preSelectedOption?.price || 0, editingItemId !== null);

	// Pre-fill instructions if editing and update character count
	const charCountValue = dialogElement.querySelector(
		".product-modal__char-count-value"
	);
	if (instructionsInput) {
		const instructions = editData?.specialInstructions || "";
		instructionsInput.value = instructions.slice(0, 250);

		// Update character count
		if (charCountValue) {
			charCountValue.textContent = instructionsInput.value.length;
		}

		// Update warning state
		const charCountContainer = charCountValue?.closest(
			".product-modal__char-count"
		);
		if (charCountContainer) {
			if (instructionsInput.value.length > 200) {
				charCountContainer.classList.add(
					"product-modal__char-count--warning"
				);
			} else {
				charCountContainer.classList.remove(
					"product-modal__char-count--warning"
				);
			}
		}
	} else {
		// Reset character count if no instructions input
		if (charCountValue) {
			charCountValue.textContent = "0";
		}
		const charCountContainer = charCountValue?.closest(
			".product-modal__char-count"
		);
		if (charCountContainer) {
			charCountContainer.classList.remove(
				"product-modal__char-count--warning"
			);
		}
	}

	// Attach event listeners to new quantity options
	const newQuantityOptions = dialogElement.querySelectorAll(
		".product-modal__quantity-option"
	);
	newQuantityOptions.forEach((option) => {
		const count = parseInt(option.dataset.count);
		const price = parseFloat(option.dataset.price);

		// Pre-select if editing
		if (preSelectedOption && count === preSelectedOption.count && price === preSelectedOption.price) {
			option.classList.add("product-modal__quantity-option--selected");
			selectedPriceOption = { count, price };
		}

		option.addEventListener("click", () => {
			// Remove selected class from all options
			newQuantityOptions.forEach((opt) => {
				opt.classList.remove("product-modal__quantity-option--selected");
			});

			// Add selected class to clicked option
			option.classList.add("product-modal__quantity-option--selected");

			// Get price option data
			selectedPriceOption = { count, price };

			// Update add button with toppings price
			const toppingsPrice = calculateToppingsPrice([
				...selectedToppings.included,
				...selectedToppings.premium,
			]);
			updateAddButton(addBtn, price + toppingsPrice, editingItemId !== null);
		});
	});

	// Update initial add button price with toppings if editing
	const initialToppingsPrice = calculateToppingsPrice([
		...selectedToppings.included,
		...selectedToppings.premium,
	]);
	updateAddButton(
		addBtn,
		(preSelectedOption?.price || 0) + initialToppingsPrice,
		editingItemId !== null
	);

	// Open modal
	dialogElement.showModal();

	// Focus on first quantity option after modal opens
	if (newQuantityOptions.length > 0) {
		setTimeout(() => {
			newQuantityOptions[0].focus();
		}, 0);
	}
};

/**
 * Update add button text and state
 * @param {HTMLElement} addBtn - Add button element
 * @param {number} price - Selected price
 * @param {boolean} isEditing - Whether in edit mode
 * @returns {void}
 */
const updateAddButton = (addBtn, price, isEditing = false) => {
	if (!addBtn) return;

	const checkmark = addBtn.querySelector(".product-modal__checkmark");
	const textSpan = addBtn.querySelector(".product-modal__add-text");

	const buttonText = isEditing ? "Update Cart" : "Add to Cart";

	if (price > 0) {
		addBtn.disabled = false;
		if (textSpan) {
			textSpan.textContent = `${buttonText} - $${price}`;
		} else {
			const newTextSpan = document.createElement("span");
			newTextSpan.className = "product-modal__add-text";
			newTextSpan.textContent = `${buttonText} - $${price}`;
			if (checkmark) {
				addBtn.insertBefore(newTextSpan, checkmark);
			} else {
				addBtn.appendChild(newTextSpan);
			}
		}
	} else {
		addBtn.disabled = true;
		if (textSpan) {
			textSpan.textContent = `${buttonText} - $0`;
		} else {
			const newTextSpan = document.createElement("span");
			newTextSpan.className = "product-modal__add-text";
			newTextSpan.textContent = `${buttonText} - $0`;
			addBtn.appendChild(newTextSpan);
		}
	}
};

/**
 * Close modal with animation
 * @param {HTMLElement} dialogElement - The dialog element
 * @returns {void}
 */
const closeModal = (dialogElement) => {
	dialogElement.classList.add("closing");
	setTimeout(() => {
		dialogElement.close();
		dialogElement.classList.remove("closing");
		resetModal();
	}, 200);
};

/**
 * Populate topping checkboxes
 * @param {HTMLElement} dialogElement - The dialog element
 * @returns {void}
 */
const populateToppings = (dialogElement) => {
	const includedContainer = dialogElement.querySelector(
		'.toppings-group__options[data-category="included"]'
	);
	const premiumContainer = dialogElement.querySelector(
		'.toppings-group__options[data-category="premium"]'
	);

	if (includedContainer) {
		includedContainer.innerHTML = "";
		const includedToppings = toppings.filter(
			(t) => t.category === "included" && t.available
		);
		includedToppings.forEach((topping) => {
			const option = createToppingOption(topping, "included", dialogElement);
			includedContainer.appendChild(option);
		});
	}

	if (premiumContainer) {
		premiumContainer.innerHTML = "";
		const premiumToppings = toppings.filter(
			(t) => t.category === "premium" && t.available
		);
		premiumToppings.forEach((topping) => {
			const option = createToppingOption(topping, "premium", dialogElement);
			premiumContainer.appendChild(option);
		});
	}

	// Update toppings total display
	updateToppingsTotal(dialogElement);
};

/**
 * Create topping option element
 * @param {Object} topping - Topping data
 * @param {string} category - Category (included or premium)
 * @param {HTMLElement} dialogElement - The dialog element
 * @returns {HTMLElement}
 */
const createToppingOption = (topping, category, dialogElement) => {
	const label = document.createElement("label");
	label.className = "topping-option";

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.className = "topping-option__checkbox";
	checkbox.value = topping.id;
	checkbox.dataset.category = category;

	// Pre-check if editing
	if (selectedToppings[category].includes(topping.id)) {
		checkbox.checked = true;
	}

	const labelText = document.createElement("span");
	labelText.className = "topping-option__label";
	labelText.textContent = topping.name;

	label.appendChild(checkbox);
	label.appendChild(labelText);

	// Add price indicator for premium toppings
	if (category === "premium" && topping.price > 0) {
		const priceSpan = document.createElement("span");
		priceSpan.className = "topping-option__price";
		priceSpan.textContent = `+$${topping.price}`;
		label.appendChild(priceSpan);
	}

	// Handle checkbox change
	checkbox.addEventListener("change", () => {
		handleToppingChange(topping.id, category, checkbox.checked, dialogElement);
	});

	return label;
};

/**
 * Handle topping selection change
 * @param {string} toppingId - Topping ID
 * @param {string} category - Category (included or premium)
 * @param {boolean} isChecked - Whether checkbox is checked
 * @param {HTMLElement} dialogElement - The dialog element
 * @returns {void}
 */
const handleToppingChange = (toppingId, category, isChecked, dialogElement) => {
	if (isChecked) {
		// Check limit for included toppings
		if (
			category === "included" &&
			selectedToppings.included.length >= MAX_INCLUDED_TOPPINGS
		) {
			// Already at max, uncheck the box
			const checkbox = dialogElement.querySelector(
				`input[value="${toppingId}"][data-category="included"]`
			);
			if (checkbox) {
				checkbox.checked = false;
			}
			return;
		}

		if (!selectedToppings[category].includes(toppingId)) {
			selectedToppings[category].push(toppingId);
		}
	} else {
		selectedToppings[category] = selectedToppings[category].filter(
			(id) => id !== toppingId
		);
	}

	// Update UI based on included topping limit
	if (category === "included") {
		updateIncludedToppingsState(dialogElement);
	}

	// Update toppings total display
	updateToppingsTotal(dialogElement);

	// Update add button price
	const addBtn = dialogElement.querySelector(".product-modal__add-btn");
	if (selectedPriceOption) {
		const toppingsPrice = calculateToppingsPrice([
			...selectedToppings.included,
			...selectedToppings.premium,
		]);
		updateAddButton(
			addBtn,
			selectedPriceOption.price + toppingsPrice,
			editingItemId !== null
		);
	}
};

/**
 * Update included toppings state (disable/enable based on limit)
 * @param {HTMLElement} dialogElement - The dialog element
 * @returns {void}
 */
const updateIncludedToppingsState = (dialogElement) => {
	const includedCheckboxes = dialogElement.querySelectorAll(
		'input[type="checkbox"][data-category="included"]'
	);
	const counterCurrent = dialogElement.querySelector(
		".toppings-group__counter-current"
	);
	const atLimit = selectedToppings.included.length >= MAX_INCLUDED_TOPPINGS;

	// Update counter
	if (counterCurrent) {
		counterCurrent.textContent = selectedToppings.included.length;
	}

	includedCheckboxes.forEach((checkbox) => {
		if (!checkbox.checked) {
			// Disable unchecked boxes if at limit
			checkbox.disabled = atLimit;
			const label = checkbox.closest(".topping-option");
			if (label) {
				if (atLimit) {
					label.classList.add("topping-option--disabled");
				} else {
					label.classList.remove("topping-option--disabled");
				}
			}
		}
	});
};

/**
 * Update toppings total display
 * @param {HTMLElement} dialogElement - The dialog element
 * @returns {void}
 */
const updateToppingsTotal = (dialogElement) => {
	const toppingsTotalValue = dialogElement.querySelector(
		".product-modal__toppings-total-value"
	);

	if (toppingsTotalValue) {
		const toppingsPrice = calculateToppingsPrice([
			...selectedToppings.included,
			...selectedToppings.premium,
		]);
		toppingsTotalValue.textContent = `+$${toppingsPrice}`;

		// Add animation class if price changed
		if (toppingsPrice > 0) {
			toppingsTotalValue.classList.add("has-premium");
			setTimeout(() => {
				toppingsTotalValue.classList.remove("has-premium");
			}, 300);
		}
	}
};

/**
 * Reset modal state
 * @returns {void}
 */
const resetModal = () => {
	currentProduct = null;
	selectedPriceOption = null;
	editingItemId = null;
	selectedToppings = {
		included: [],
		premium: [],
	};
};
