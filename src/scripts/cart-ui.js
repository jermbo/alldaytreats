import {
	getCartItems,
	removeFromCart,
	clearCart,
	getCartSubtotal,
	updateCartItem,
} from "./cart.js";
import { openProductModal } from "./product-modal.js";
import { openCheckout } from "./checkout-ui.js";
import { getToppingById, calculateToppingPrice } from "../config/toppings.ts";

let cartPanel = null;
let productModal = null;

// Cached DOM references
let itemsContainer = null;
let emptyState = null;
let cartContent = null;
let footer = null;
let subtotalEl = null;
let totalEl = null;

// Track item count to detect add/remove vs quantity changes
let lastItemCount = 0;

// Track which items need refreshing (for edits that don't change quantity)
let itemsToRefresh = new Set();

/**
 * Initialize cart UI
 * @param {HTMLElement} panelElement - Cart panel element
 * @param {HTMLElement} modalElement - Product modal element for editing
 * @returns {void}
 */
export const initCartUI = (panelElement, modalElement) => {
	cartPanel = panelElement;
	productModal = modalElement;

	if (!cartPanel) return;

	// Cache DOM references
	itemsContainer = cartPanel.querySelector(".cart__items");
	emptyState = cartPanel.querySelector(".cart__empty");
	cartContent = cartPanel.querySelector(".cart__content");
	footer = cartPanel.querySelector(".cart__footer");
	subtotalEl = cartPanel.querySelector(".cart__subtotal-value");
	totalEl = cartPanel.querySelector(".cart__total-value");

	const closeBtn = cartPanel.querySelector(".cart__close");
	const backdrop = cartPanel.querySelector(".cart__backdrop");
	const clearBtn = cartPanel.querySelector(".cart__clear-btn");
	const checkoutBtn = cartPanel.querySelector(".cart__checkout-btn");

	// Close button handler
	if (closeBtn) {
		closeBtn.addEventListener("click", closeCart);
	}

	// Backdrop click handler
	if (backdrop) {
		backdrop.addEventListener("click", closeCart);
	}

	// Clear cart handler
	if (clearBtn) {
		clearBtn.addEventListener("click", handleClearCart);
	}

	// Checkout button handler
	if (checkoutBtn) {
		checkoutBtn.addEventListener("click", () => {
			closeCart();
			// Small delay to allow cart close animation
			setTimeout(() => {
				openCheckout();
			}, 100);
		});
	}

	// Event delegation for cart item actions
	if (itemsContainer) {
		itemsContainer.addEventListener("click", handleItemAction);
	}

	// Close on ESC key
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && isCartOpen()) {
			closeCart();
		}
	});

	// Initial render
	renderCart();
	lastItemCount = getCartItems().length;
};

/**
 * Open cart panel
 * @returns {void}
 */
export const openCart = () => {
	if (!cartPanel) return;

	cartPanel.hidden = false;
	cartPanel.classList.add("cart--open");
	document.body.style.overflow = "hidden";
	renderCart();

	// Focus on close button for accessibility
	const closeBtn = cartPanel.querySelector(".cart__close");
	if (closeBtn) {
		setTimeout(() => closeBtn.focus(), 100);
	}
};

/**
 * Close cart panel
 * @returns {void}
 */
export const closeCart = () => {
	if (!cartPanel) return;

	cartPanel.classList.remove("cart--open");
	document.body.style.overflow = "";

	// Hide cart after animation
	setTimeout(() => {
		if (!cartPanel.classList.contains("cart--open")) {
			cartPanel.hidden = true;
		}
	}, 300);
};

/**
 * Check if cart is open
 * @returns {boolean}
 */
const isCartOpen = () => {
	return cartPanel?.classList.contains("cart--open");
};

/**
 * Toggle cart state between empty and has items
 * @param {boolean} isEmpty - Whether cart is empty
 * @returns {void}
 */
const toggleCartState = (isEmpty) => {
	if (isEmpty) {
		if (emptyState) emptyState.hidden = false;
		if (cartContent) cartContent.hidden = true;
		if (footer) footer.hidden = true;
	} else {
		if (emptyState) emptyState.hidden = true;
		if (cartContent) cartContent.hidden = false;
		if (footer) footer.hidden = false;
	}
};

/**
 * Render entire cart
 * @returns {void}
 */
const renderCart = () => {
	if (!cartPanel || !itemsContainer) return;

	const items = getCartItems();
	lastItemCount = items.length;

	if (items.length === 0) {
		toggleCartState(true);
		if (itemsContainer) {
			itemsContainer.innerHTML = "";
		}
	} else {
		toggleCartState(false);
		renderCartItems();
		updateCartTotals();
	}
};

/**
 * Render cart items
 * @returns {void}
 */
const renderCartItems = () => {
	if (!itemsContainer) return;

	// Clear existing items
	itemsContainer.innerHTML = "";

	// Render each item
	const items = getCartItems();
	items.forEach((item) => {
		const itemElement = createCartItemElement(item);
		itemsContainer.appendChild(itemElement);
	});
};

/**
 * Create single cart item element
 * @param {Object} item - Cart item
 * @returns {HTMLElement}
 */
const createCartItemElement = (item) => {
	const itemEl = document.createElement("article");
	itemEl.className = "cart__item";
	itemEl.setAttribute("data-item-id", item.id);

	// Find product to get image
	const product = window.PRODUCTS.find((p) => p.id === item.productId);
	const productImage = product?.image || "";

	// Get quantity (default to 1 if not set)
	const quantity = item.quantity || 1;

	// Find matching price option to get the count
	const priceOption = product?.priceOptions.find(
		(opt) =>
			opt.count === item.count &&
			(opt.price === item.unitPrice || opt.price === item.price)
	);
	const unitCount = priceOption?.count || item.count;

	// Calculate line total based on quantity and unit price
	const unitPrice = item.unitPrice !== undefined ? item.unitPrice : item.price;
	const lineTotal = unitPrice * quantity;

	// Format toppings for display
	const toppingsHtml = formatToppingsDisplay(item.toppings, item.count);

	itemEl.innerHTML = `
		<div class="cart__item-main">
			<img class="cart__item-image" src="${escapeHtml(
				productImage
			)}" alt="${escapeHtml(item.name)}" loading="lazy" />
			<div class="cart__item-content">
				<div class="cart__item-header">
					<h3 class="cart__item-name">${escapeHtml(item.name)}</h3>
					<button type="button" class="cart__item-edit" aria-label="Edit ${escapeHtml(
						item.name
					)}" title="Edit item" data-action="edit">
						✏️
					</button>
				</div>
				<p class="cart__item-option">${unitCount}ct $${unitPrice.toFixed(2)}</p>
				${toppingsHtml}
				${
					item.specialInstructions
						? `<p class="cart__item-instructions">${escapeHtml(
								item.specialInstructions
						  )}</p>`
						: ""
				}
			</div>
		</div>
		<div class="cart__item-actions">
			<div class="cart__item-quantity">
				<button type="button" class="cart__quantity-btn cart__quantity-btn--minus" aria-label="Decrease quantity" data-action="decrease">
					−
				</button>
				<span class="cart__quantity-value">${quantity}</span>
				<button type="button" class="cart__quantity-btn cart__quantity-btn--plus" aria-label="Increase quantity" data-action="increase">
					+
				</button>
			</div>
			<div class="cart__item-price">$${lineTotal.toFixed(2)}</div>
			<button type="button" class="cart__item-remove" aria-label="Remove ${escapeHtml(
				item.name
			)}" data-action="remove">
				🗑️
			</button>
		</div>
	`;

	return itemEl;
};

/**
 * Handle cart item actions via event delegation
 * @param {Event} e - Click event
 * @returns {void}
 */
const handleItemAction = (e) => {
	const button = e.target.closest("button[data-action]");
	if (!button) return;

	const itemElement = button.closest("[data-item-id]");
	if (!itemElement) return;

	const itemId = itemElement.getAttribute("data-item-id");
	const action = button.getAttribute("data-action");

	const item = getCartItems().find((i) => i.id === itemId);
	if (!item) return;

	switch (action) {
		case "edit":
			e.stopPropagation();
			handleEditItem(item);
			break;
		case "remove":
			handleRemoveItem(itemId);
			break;
		case "increase":
		case "decrease": {
			const quantityEl = itemElement.querySelector(".cart__quantity-value");
			if (!quantityEl) return;

			const currentQty = parseInt(quantityEl.textContent) || 1;
			const newQty = action === "increase" ? currentQty + 1 : currentQty - 1;

			// Store active element for focus restoration
			const activeElement = document.activeElement;

			updateCartItemQuantity(itemId, newQty, activeElement);
			break;
		}
	}
};

/**
 * Update cart item quantity with incremental DOM updates
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @param {HTMLElement} activeElement - Element to restore focus to
 * @returns {void}
 */
const updateCartItemQuantity = (itemId, quantity, activeElement) => {
	const item = getCartItems().find((i) => i.id === itemId);
	if (!item) return;

	if (quantity <= 0) {
		handleRemoveItem(itemId);
		return;
	}

	// Get unit price (use stored unitPrice or calculate from current price/quantity)
	const unitPrice =
		item.unitPrice !== undefined
			? item.unitPrice
			: item.price / (item.quantity || 1);

	updateCartItem(itemId, {
		quantity: quantity,
		unitPrice: unitPrice,
	});

	// Update DOM incrementally
	updateCartItemElement(itemId, {
		quantity: quantity,
		unitPrice: unitPrice,
	});

	// Update totals
	updateCartTotals();

	// Restore focus after DOM updates complete
	// Use requestAnimationFrame to ensure DOM is updated
	requestAnimationFrame(() => {
		if (activeElement && document.contains(activeElement)) {
			activeElement.focus();
		}
	});
};

/**
 * Update cart item element incrementally
 * @param {string} itemId - Cart item ID
 * @param {Object} itemData - Updated item data
 * @returns {void}
 */
const updateCartItemElement = (itemId, itemData) => {
	if (!itemsContainer) return;

	const itemElement = itemsContainer.querySelector(
		`[data-item-id="${itemId}"]`
	);
	if (!itemElement) return;

	const quantityEl = itemElement.querySelector(".cart__quantity-value");
	const priceEl = itemElement.querySelector(".cart__item-price");

	if (quantityEl) {
		quantityEl.textContent = itemData.quantity;
	}

	if (priceEl) {
		const lineTotal = itemData.unitPrice * itemData.quantity;
		priceEl.textContent = `$${lineTotal.toFixed(2)}`;
	}
};

/**
 * Refresh cart item element when item is edited (special instructions, count, etc.)
 * @param {string} itemId - Cart item ID
 * @returns {void}
 */
const refreshCartItemElement = (itemId) => {
	if (!itemsContainer) return;

	const item = getCartItems().find((i) => i.id === itemId);
	if (!item) return;

	const itemElement = itemsContainer.querySelector(
		`[data-item-id="${itemId}"]`
	);
	if (!itemElement) return;

	// Find product to get image and price option
	const product = window.PRODUCTS.find((p) => p.id === item.productId);
	const priceOption = product?.priceOptions.find(
		(opt) =>
			opt.count === item.count &&
			(opt.price === item.unitPrice || opt.price === item.price)
	);
	const unitCount = priceOption?.count || item.count;
	const unitPrice = item.unitPrice !== undefined ? item.unitPrice : item.price;
	const quantity = item.quantity || 1;
	const lineTotal = unitPrice * quantity;

	// Update quantity option display
	const optionEl = itemElement.querySelector(".cart__item-option");
	if (optionEl) {
		optionEl.textContent = `${unitCount}ct $${unitPrice.toFixed(2)}`;
	}

	// Update toppings display
	const toppingsEl = itemElement.querySelector(".cart__item-toppings");
	const contentEl = itemElement.querySelector(".cart__item-content");
	const toppingsHtml = formatToppingsDisplay(item.toppings, item.count);

	if (toppingsHtml) {
		if (toppingsEl) {
			toppingsEl.outerHTML = toppingsHtml;
		} else if (contentEl && optionEl) {
			// Insert toppings after option element
			optionEl.insertAdjacentHTML("afterend", toppingsHtml);
		}
	} else if (toppingsEl) {
		// Remove toppings element if no toppings
		toppingsEl.remove();
	}

	// Update special instructions
	const instructionsEl = itemElement.querySelector(".cart__item-instructions");

	if (item.specialInstructions) {
		if (instructionsEl) {
			instructionsEl.textContent = item.specialInstructions;
		} else if (contentEl) {
			// Create instructions element if it doesn't exist
			const newInstructionsEl = document.createElement("p");
			newInstructionsEl.className = "cart__item-instructions";
			newInstructionsEl.textContent = item.specialInstructions;
			contentEl.appendChild(newInstructionsEl);
		}
	} else if (instructionsEl) {
		// Remove instructions element if instructions are cleared
		instructionsEl.remove();
	}

	// Update quantity and price
	const quantityEl = itemElement.querySelector(".cart__quantity-value");
	const priceEl = itemElement.querySelector(".cart__item-price");

	if (quantityEl) {
		quantityEl.textContent = quantity;
	}

	if (priceEl) {
		priceEl.textContent = `$${lineTotal.toFixed(2)}`;
	}
};

/**
 * Update cart totals
 * @returns {void}
 */
const updateCartTotals = () => {
	if (!subtotalEl || !totalEl) return;

	const subtotal = getCartSubtotal();
	const estimatedTotal = subtotal; // No taxes/fees yet

	subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
	totalEl.textContent = `$${estimatedTotal.toFixed(2)}`;
};

/**
 * Handle edit item
 * @param {Object} item - Cart item to edit
 * @returns {void}
 */
const handleEditItem = (item) => {
	if (!productModal) return;

	// Find product data
	const product = window.PRODUCTS.find((p) => p.id === item.productId);
	if (!product) return;

	// Find matching price option
	const priceOption = product.priceOptions.find(
		(opt) => opt.count === item.count && opt.price === item.unitPrice
	);

	// Open product modal with item data for editing (cart stays open)
	openProductModal(productModal, product, {
		itemId: item.id,
		count: item.count,
		price: item.unitPrice || item.price,
		specialInstructions: item.specialInstructions,
		toppings: item.toppings,
	});
};

/**
 * Handle remove item
 * @param {string} itemId - Cart item ID
 * @returns {void}
 */
const handleRemoveItem = (itemId) => {
	removeFromCart(itemId);
	renderCart();
};

/**
 * Handle clear cart
 * @returns {void}
 */
const handleClearCart = () => {
	clearCart();
	renderCart();
};

/**
 * Format toppings for display in cart
 * @param {Array|Object} toppings - Toppings array or legacy object with included and premium arrays
 * @param {number} count - Product count for price calculation
 * @returns {string} HTML string for toppings display
 */
const formatToppingsDisplay = (toppings, count) => {
	if (!toppings) {
		return "";
	}

	// Handle both new format (array) and old format (object)
	let allToppingIds = [];
	if (Array.isArray(toppings)) {
		allToppingIds = toppings;
	} else if (toppings.included || toppings.premium) {
		// Legacy format support
		allToppingIds = [
			...(toppings.included || []),
			...(toppings.premium || []),
		];
	}

	if (allToppingIds.length === 0) {
		return "";
	}

	const toppingNames = allToppingIds
		.map((id) => {
			const topping = getToppingById(id);
			if (!topping) return null;

			// Calculate dynamic price based on count
			const price = calculateToppingPrice(topping.price, count);
			if (price > 0) {
				return `${topping.name} (+$${price})`;
			}
			return topping.name;
		})
		.filter(Boolean);

	if (toppingNames.length === 0) {
		return "";
	}

	return `<p class="cart__item-toppings">+ ${escapeHtml(toppingNames.join(", "))}</p>`;
};

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string}
 */
const escapeHtml = (text) => {
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
};

// Track updated items to refresh their display
let updatedItemIds = new Set();

// Listen for cart updates to re-render
// Only re-render if item count changed (add/remove), not on quantity updates
document.addEventListener("cartUpdate", () => {
	if (!isCartOpen()) return;

	const currentItemCount = getCartItems().length;

	// Only re-render if items were added or removed
	// Quantity updates are handled incrementally
	if (currentItemCount !== lastItemCount) {
		renderCart();
		lastItemCount = currentItemCount;
		updatedItemIds.clear();
	} else {
		// Refresh all items to ensure they reflect any edits (e.g., special instructions, count, price)
		// This is safe because we're only updating content, not destroying/recreating elements
		const currentItems = getCartItems();
		currentItems.forEach((item) => {
			refreshCartItemElement(item.id);
		});
		// Update totals in case prices changed
		updateCartTotals();
		updatedItemIds.clear();
	}
});
