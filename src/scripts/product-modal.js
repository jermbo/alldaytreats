import { addToCart, updateCartItem } from "./cart.js";
import {
	toppings,
	calculateToppingsPrice,
	calculateToppingPrice,
	MAX_TOPPINGS,
} from "../config/toppings.ts";

let currentProduct = null;
let selectedPriceOption = null;
let editingItemId = null;
let selectedToppings = [];

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

			// Check if product is chocolate covered
			const isChocolateCovered = currentProduct?.category === 'chocolate';

			// Calculate total price including toppings (skip toppings for chocolate covered treats)
			const toppingsPrice = isChocolateCovered ? 0 : calculateToppingsPrice(selectedToppings, selectedPriceOption.count);
			const totalPrice = selectedPriceOption.price + toppingsPrice;

			// Prepare toppings data (only include if selections exist and not chocolate covered)
			const toppingsData = isChocolateCovered 
				? undefined 
				: (selectedToppings.length > 0 ? [...selectedToppings] : undefined);

			if (editingItemId) {
				// Update existing item
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
				// Add new item
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
	
	// Check if product is chocolate covered
	const isChocolateCovered = product?.category === 'chocolate';
	
	// Handle both old format {included: [], premium: []} and new format []
	// Clear toppings for chocolate covered treats
	if (isChocolateCovered) {
		selectedToppings = [];
	} else if (editData?.toppings) {
		selectedToppings = Array.isArray(editData.toppings)
			? [...editData.toppings]
			: [...(editData.toppings.included || []), ...(editData.toppings.premium || [])];
	} else {
		selectedToppings = [];
	}

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

	// Hide toppings section for chocolate covered treats
	const toppingsSection = dialogElement.querySelector('[data-toppings-section]');
	if (toppingsSection) {
		toppingsSection.hidden = isChocolateCovered;
	}

	// Generate topping options (skip for chocolate covered treats)
	if (!isChocolateCovered) {
		populateToppings(dialogElement);

		// Update toppings state if editing (to disable options if at limit)
		if (selectedToppings.length > 0) {
			updateToppingsState(dialogElement);
		}
	}

	// Pre-select option if editing
	// Match by count only, since editData.price might include toppings
	let preSelectedOption = null;
	if (editData) {
		preSelectedOption = product.priceOptions.find(
			(opt) => opt.count === editData.count
		);
	}

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

		// Pre-select if editing (match by count only)
		if (preSelectedOption && count === preSelectedOption.count) {
			option.classList.add("product-modal__quantity-option--selected");
			selectedPriceOption = { count, price, sku: preSelectedOption.sku || "" };
		}

		option.addEventListener("click", () => {
			// Remove selected class from all options
			newQuantityOptions.forEach((opt) => {
				opt.classList.remove("product-modal__quantity-option--selected");
			});

			// Add selected class to clicked option
			option.classList.add("product-modal__quantity-option--selected");

			// Get price option data including SKU
			const fullOption = currentProduct.priceOptions.find(
				(opt) => opt.count === count && opt.price === price
			);
			selectedPriceOption = { count, price, sku: fullOption?.sku || "" };

			// Regenerate toppings with new prices based on count (skip for chocolate covered treats)
			const isChocolateCovered = currentProduct?.category === 'chocolate';
			if (!isChocolateCovered) {
				populateToppings(dialogElement);

				// Update toppings state to re-apply disabled state if at limit
				updateToppingsState(dialogElement);
			}

			// Update add button with toppings price (skip toppings for chocolate covered treats)
			const toppingsPrice = isChocolateCovered ? 0 : calculateToppingsPrice(selectedToppings, count);
			updateAddButton(addBtn, price + toppingsPrice, editingItemId !== null);
		});
	});

	// Update add button (disabled if no quantity selected)
	if (preSelectedOption) {
		// Editing: button enabled with correct price including toppings
		const initialToppingsPrice = isChocolateCovered ? 0 : calculateToppingsPrice(
			selectedToppings,
			preSelectedOption.count
		);
		updateAddButton(
			addBtn,
			preSelectedOption.price + initialToppingsPrice,
			editingItemId !== null
		);
	} else {
		// New product: button disabled until quantity is selected
		updateAddButton(addBtn, 0, false);
	}

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

	// Disable button if no quantity is selected (selectedPriceOption is null)
	const isEnabled = selectedPriceOption !== null && price > 0;
	addBtn.disabled = !isEnabled;

	if (textSpan) {
		textSpan.textContent = `${buttonText} - $${price.toFixed(2)}`;
	} else {
		const newTextSpan = document.createElement("span");
		newTextSpan.className = "product-modal__add-text";
		newTextSpan.textContent = `${buttonText} - $${price.toFixed(2)}`;
		if (checkmark) {
			addBtn.insertBefore(newTextSpan, checkmark);
		} else {
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
	const premiumContainer = dialogElement.querySelector(
		'.toppings-group__options[data-category="premium"]'
	);

	if (premiumContainer) {
		premiumContainer.innerHTML = "";
		const availableToppings = toppings.filter((t) => t.available);
		const currentCount = selectedPriceOption?.count || 6;
		availableToppings.forEach((topping) => {
			const option = createToppingOption(topping, currentCount, dialogElement);
			premiumContainer.appendChild(option);
		});
	}

	// Update toppings total display
	updateToppingsTotal(dialogElement);
};

/**
 * Create topping option element
 * @param {Object} topping - Topping data
 * @param {number} count - Product count for price calculation
 * @param {HTMLElement} dialogElement - The dialog element
 * @returns {HTMLElement}
 */
const createToppingOption = (topping, count, dialogElement) => {
	const label = document.createElement("label");
	label.className = "topping-option";

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.className = "topping-option__checkbox";
	checkbox.value = topping.id;
	checkbox.dataset.category = "premium";

	// Pre-check if editing
	if (selectedToppings.includes(topping.id)) {
		checkbox.checked = true;
	}

	const labelText = document.createElement("span");
	labelText.className = "topping-option__label";
	labelText.textContent = topping.name;

	label.appendChild(checkbox);
	label.appendChild(labelText);

	// Add price indicator with dynamic pricing based on count
	const price = calculateToppingPrice(topping.price, count);
	if (price > 0) {
		const priceSpan = document.createElement("span");
		priceSpan.className = "topping-option__price";
		priceSpan.textContent = `+$${price}`;
		label.appendChild(priceSpan);
	}

	// Handle checkbox change
	checkbox.addEventListener("change", () => {
		handleToppingChange(topping.id, checkbox.checked, dialogElement);
	});

	return label;
};

/**
 * Handle topping selection change
 * @param {string} toppingId - Topping ID
 * @param {boolean} isChecked - Whether checkbox is checked
 * @param {HTMLElement} dialogElement - The dialog element
 * @returns {void}
 */
const handleToppingChange = (toppingId, isChecked, dialogElement) => {
	// Prevent toppings for chocolate covered treats
	const isChocolateCovered = currentProduct?.category === 'chocolate';
	if (isChocolateCovered) {
		return;
	}

	if (isChecked) {
		// Check limit for toppings
		if (selectedToppings.length >= MAX_TOPPINGS) {
			// Already at max, uncheck the box
			const checkbox = dialogElement.querySelector(
				`input[value="${toppingId}"]`
			);
			if (checkbox) {
				checkbox.checked = false;
			}
			return;
		}

		if (!selectedToppings.includes(toppingId)) {
			selectedToppings.push(toppingId);
		}
	} else {
		selectedToppings = selectedToppings.filter((id) => id !== toppingId);
	}

	// Update UI based on topping limit
	updateToppingsState(dialogElement);

	// Update toppings total display
	updateToppingsTotal(dialogElement);

	// Update add button price
	const addBtn = dialogElement.querySelector(".product-modal__add-btn");
	if (selectedPriceOption) {
		const toppingsPrice = calculateToppingsPrice(selectedToppings, selectedPriceOption.count);
		updateAddButton(
			addBtn,
			selectedPriceOption.price + toppingsPrice,
			editingItemId !== null
		);
	}
};

/**
 * Update toppings state (disable/enable based on limit)
 * @param {HTMLElement} dialogElement - The dialog element
 * @returns {void}
 */
const updateToppingsState = (dialogElement) => {
	const checkboxes = dialogElement.querySelectorAll(
		'input[type="checkbox"][data-category="premium"]'
	);
	const counterCurrent = dialogElement.querySelector(
		".toppings-group__counter-current"
	);
	const atLimit = selectedToppings.length >= MAX_TOPPINGS;

	// Update counter
	if (counterCurrent) {
		counterCurrent.textContent = selectedToppings.length;
	}

	checkboxes.forEach((checkbox) => {
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
		const currentCount = selectedPriceOption?.count || 6;
		const toppingsPrice = calculateToppingsPrice(selectedToppings, currentCount);
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
	selectedToppings = [];
};
