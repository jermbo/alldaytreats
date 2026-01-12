import { addToCart } from "./cart.js";

let currentProduct = null;
let selectedPriceOption = null;

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
				? instructionsInput.value.trim()
				: "";

			addToCart({
				productId: currentProduct.id,
				name: currentProduct.name,
				count: selectedPriceOption.count,
				price: selectedPriceOption.price,
				specialInstructions: instructions,
			});

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
 * @returns {void}
 */
export const openProductModal = (dialogElement, product) => {
	currentProduct = product;
	selectedPriceOption = null;

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

	// Reset add button
	updateAddButton(addBtn, 0);

	// Clear instructions
	if (instructionsInput) {
		instructionsInput.value = "";
	}

	// Attach event listeners to new quantity options
	const newQuantityOptions = dialogElement.querySelectorAll(
		".product-modal__quantity-option"
	);
	newQuantityOptions.forEach((option) => {
		option.addEventListener("click", () => {
			// Remove selected class from all options
			newQuantityOptions.forEach((opt) => {
				opt.classList.remove("product-modal__quantity-option--selected");
			});

			// Add selected class to clicked option
			option.classList.add("product-modal__quantity-option--selected");

			// Get price option data
			const count = parseInt(option.dataset.count);
			const price = parseFloat(option.dataset.price);
			selectedPriceOption = { count, price };

			// Update add button
			updateAddButton(addBtn, price);
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
 * @returns {void}
 */
const updateAddButton = (addBtn, price) => {
	if (!addBtn) return;

	const checkmark = addBtn.querySelector(".product-modal__checkmark");
	const textSpan = addBtn.querySelector(".product-modal__add-text");

	if (price > 0) {
		addBtn.disabled = false;
		if (textSpan) {
			textSpan.textContent = `Add to Cart - $${price}`;
		} else {
			const newTextSpan = document.createElement("span");
			newTextSpan.className = "product-modal__add-text";
			newTextSpan.textContent = `Add to Cart - $${price}`;
			if (checkmark) {
				addBtn.insertBefore(newTextSpan, checkmark);
			} else {
				addBtn.appendChild(newTextSpan);
			}
		}
	} else {
		addBtn.disabled = true;
		if (textSpan) {
			textSpan.textContent = "Add to Cart - $0";
		} else {
			const newTextSpan = document.createElement("span");
			newTextSpan.className = "product-modal__add-text";
			newTextSpan.textContent = "Add to Cart - $0";
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
};
