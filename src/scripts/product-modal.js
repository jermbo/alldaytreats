import { addToCart, updateCartItem } from "./cart.js";

let currentProduct = null;
let selectedPriceOption = null;
let editingItemId = null;

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

			if (editingItemId) {
				// Update existing item
				updateCartItem(editingItemId, {
					productId: currentProduct.id,
					name: currentProduct.name,
					count: selectedPriceOption.count,
					unitPrice: selectedPriceOption.price,
					specialInstructions: instructions,
				});
			} else {
				// Add new item
				addToCart({
					productId: currentProduct.id,
					name: currentProduct.name,
					count: selectedPriceOption.count,
					price: selectedPriceOption.price,
					specialInstructions: instructions,
					quantity: 1,
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
 * @param {Object} editData - Optional edit data with itemId, count, price, specialInstructions
 * @returns {void}
 */
export const openProductModal = (dialogElement, product, editData = null) => {
	currentProduct = product;
	selectedPriceOption = null;
	editingItemId = editData?.itemId || null;

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
		titleEl.textContent = product.name.toUpperCase();
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

			// Update add button
			updateAddButton(addBtn, price, editingItemId !== null);
		});
	});

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
 * Reset modal state
 * @returns {void}
 */
const resetModal = () => {
	currentProduct = null;
	selectedPriceOption = null;
	editingItemId = null;
};
