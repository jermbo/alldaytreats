import {
	getCartItems,
	removeFromCart,
	clearCart,
	getCartSubtotal,
	updateCartItem,
} from "./cart.js";
import { products } from "./products.js";
import { openProductModal } from "./product-modal.js";

let cartPanel = null;
let productModal = null;

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

	// Checkout button handler (placeholder for future implementation)
	if (checkoutBtn) {
		checkoutBtn.addEventListener("click", () => {
			// TODO: Navigate to checkout (US-004)
			console.log("Checkout clicked");
		});
	}

	// Close on ESC key
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && isCartOpen()) {
			closeCart();
		}
	});

	// Initial render
	renderCart();
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
 * Render entire cart
 * @returns {void}
 */
const renderCart = () => {
	if (!cartPanel) return;

	const items = getCartItems();
	const itemsContainer = cartPanel.querySelector(".cart__items");
	const emptyState = cartPanel.querySelector(".cart__empty");
	const cartContent = cartPanel.querySelector(".cart__content");
	const footer = cartPanel.querySelector(".cart__footer");

	// Ensure we have all required elements
	if (!itemsContainer || !emptyState || !cartContent || !footer) {
		return;
	}

	if (items.length === 0) {
		renderEmptyState(itemsContainer, emptyState, cartContent, footer);
	} else {
		renderCartItems(itemsContainer, emptyState, cartContent, footer);
		renderCartTotals();
	}
};

/**
 * Render cart items
 * @param {HTMLElement} itemsContainer - Container for cart items
 * @param {HTMLElement} emptyState - Empty state element
 * @param {HTMLElement} cartContent - Cart content wrapper
 * @param {HTMLElement} footer - Cart footer
 * @returns {void}
 */
const renderCartItems = (itemsContainer, emptyState, cartContent, footer) => {
	if (!itemsContainer) return;

	// Hide empty state, show content and footer FIRST
	if (emptyState) {
		emptyState.hidden = true;
		emptyState.setAttribute("hidden", "");
		emptyState.style.display = "none";
	}
	if (cartContent) {
		cartContent.hidden = false;
		cartContent.removeAttribute("hidden");
		cartContent.style.display = "";
	}
	if (footer) {
		footer.hidden = false;
		footer.removeAttribute("hidden");
		footer.style.display = "";
	}

	// Clear existing items
	itemsContainer.innerHTML = "";

	// Render each item
	const items = getCartItems();
	items.forEach((item) => {
		const itemElement = renderCartItem(item);
		itemsContainer.appendChild(itemElement);
	});
};

/**
 * Render single cart item
 * @param {Object} item - Cart item
 * @returns {HTMLElement}
 */
const renderCartItem = (item) => {
	const itemEl = document.createElement("article");
	itemEl.className = "cart__item";
	itemEl.setAttribute("data-item-id", item.id);

	// Find product to get image
	const product = products.find((p) => p.id === item.productId);
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
					)}" title="Edit item">
						✏️
					</button>
				</div>
				<p class="cart__item-option">${unitCount}ct $${unitPrice.toFixed(2)}</p>
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
				<button type="button" class="cart__quantity-btn cart__quantity-btn--minus" aria-label="Decrease quantity">
					−
				</button>
				<span class="cart__quantity-value">${quantity}</span>
				<button type="button" class="cart__quantity-btn cart__quantity-btn--plus" aria-label="Increase quantity">
					+
				</button>
			</div>
			<div class="cart__item-price">$${lineTotal.toFixed(2)}</div>
			<button type="button" class="cart__item-remove" aria-label="Remove ${escapeHtml(
				item.name
			)}">
				🗑️
			</button>
		</div>
	`;

	// Attach event listeners
	const editBtn = itemEl.querySelector(".cart__item-edit");
	const removeBtn = itemEl.querySelector(".cart__item-remove");
	const minusBtn = itemEl.querySelector(".cart__quantity-btn--minus");
	const plusBtn = itemEl.querySelector(".cart__quantity-btn--plus");
	const quantityValue = itemEl.querySelector(".cart__quantity-value");

	if (editBtn) {
		editBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			handleEditItem(item);
		});
	}

	if (removeBtn) {
		removeBtn.addEventListener("click", () => handleRemoveItem(item.id));
	}

	if (minusBtn && quantityValue) {
		minusBtn.addEventListener("click", () => {
			const currentQty = parseInt(quantityValue.textContent) || 1;
			const newQty = currentQty - 1;
			quantityValue.textContent = newQty;
			updateCartItemQuantity(item.id, newQty);
		});
	}

	if (plusBtn && quantityValue) {
		plusBtn.addEventListener("click", () => {
			const currentQty = parseInt(quantityValue.textContent) || 1;
			const newQty = currentQty + 1;
			quantityValue.textContent = newQty;
			updateCartItemQuantity(item.id, newQty);
		});
	}

	return itemEl;
};

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {void}
 */
const updateCartItemQuantity = (itemId, quantity) => {
	const item = getCartItems().find((i) => i.id === itemId);
	if (!item) return;

	if (quantity <= 0) {
		// Remove item if quantity is 0 or less
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

	renderCart();
};

/**
 * Render empty state
 * @param {HTMLElement} itemsContainer - Container for cart items
 * @param {HTMLElement} emptyState - Empty state element
 * @param {HTMLElement} cartContent - Cart content wrapper
 * @param {HTMLElement} footer - Cart footer
 * @returns {void}
 */
const renderEmptyState = (itemsContainer, emptyState, cartContent, footer) => {
	// Clear items container first
	if (itemsContainer) {
		itemsContainer.innerHTML = "";
	}

	// Show empty state, hide content and footer
	if (emptyState) {
		emptyState.hidden = false;
		emptyState.removeAttribute("hidden");
		emptyState.style.display = "";
	}
	if (cartContent) {
		cartContent.hidden = true;
		cartContent.setAttribute("hidden", "");
		cartContent.style.display = "none";
	}
	if (footer) {
		footer.hidden = true;
		footer.setAttribute("hidden", "");
		footer.style.display = "none";
	}
};

/**
 * Render cart totals
 * @returns {void}
 */
const renderCartTotals = () => {
	if (!cartPanel) return;

	const subtotalEl = cartPanel.querySelector(".cart__subtotal-value");
	const totalEl = cartPanel.querySelector(".cart__total-value");

	const subtotal = getCartSubtotal();
	const estimatedTotal = subtotal; // No taxes/fees yet

	if (subtotalEl) {
		subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
	}

	if (totalEl) {
		totalEl.textContent = `$${estimatedTotal.toFixed(2)}`;
	}
};

/**
 * Handle edit item
 * @param {Object} item - Cart item to edit
 * @returns {void}
 */
const handleEditItem = (item) => {
	if (!productModal) return;

	// Find product data
	const product = products.find((p) => p.id === item.productId);
	if (!product) return;

	// Find matching price option
	const priceOption = product.priceOptions.find(
		(opt) => opt.count === item.count && opt.price === item.price
	);

	// Close cart first
	closeCart();

	// Open product modal with item data for editing
	// We'll need to modify openProductModal to accept edit data
	setTimeout(() => {
		openProductModal(productModal, product, {
			itemId: item.id,
			count: item.count,
			price: item.price,
			specialInstructions: item.specialInstructions,
		});
	}, 300);
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
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string}
 */
const escapeHtml = (text) => {
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
};

// Listen for cart updates to re-render
document.addEventListener("cartUpdate", () => {
	if (isCartOpen()) {
		renderCart();
	}
});
