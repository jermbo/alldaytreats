import {
	getCartItems,
	removeFromCart,
	clearCart,
	getCartSubtotal,
	updateCartItem,
} from "@/scripts/cart.ts";
import { openProductModal } from "@/scripts/product-modal.ts";
import { openCheckout } from "@/scripts/checkout-ui.ts";
import { escapeHtml } from "@/scripts/utils/escape-html.ts";
import { formatCurrency } from "@/scripts/utils/format-currency.ts";
import { formatToppings } from "@/scripts/utils/toppings.ts";
import { findProduct } from "@/scripts/utils/product.ts";
import {
	createFocusTrap,
	type FocusTrap,
} from "@/scripts/utils/focus-trap.ts";
import type { CartItem } from "@/scripts/types/index.ts";

let cartPanel: HTMLElement | null = null;
let productModal: HTMLDialogElement | null = null;

// Cached DOM references
let itemsContainer: HTMLElement | null = null;
let emptyState: HTMLElement | null = null;
let cartContent: HTMLElement | null = null;
let footer: HTMLElement | null = null;
let subtotalEl: HTMLElement | null = null;
let totalEl: HTMLElement | null = null;
let liveRegion: HTMLElement | null = null;

// Focus trap for accessibility
let focusTrap: FocusTrap | null = null;

// Track item count to detect add/remove vs quantity changes
let lastItemCount = 0;

/**
 * Announce a message to screen readers via the live region
 */
const announce = (message: string): void => {
	if (!liveRegion) return;
	liveRegion.textContent = message;
	setTimeout(() => {
		if (liveRegion) liveRegion.textContent = "";
	}, 1000);
};

/**
 * Initialize cart UI
 */
export const initCartUI = (
	panelElement: HTMLElement,
	modalElement: HTMLDialogElement,
): void => {
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
	liveRegion = cartPanel.querySelector(".cart__live-region");

	// Set up focus trap
	const panel = cartPanel.querySelector<HTMLElement>(".cart__panel");
	if (panel) {
		focusTrap = createFocusTrap(panel);
	}

	const closeBtn = cartPanel.querySelector(".cart__close");
	const backdrop = cartPanel.querySelector(".cart__backdrop");
	const clearBtn = cartPanel.querySelector(".cart__clear-btn");
	const checkoutBtn = cartPanel.querySelector(".cart__checkout-btn");

	if (closeBtn) closeBtn.addEventListener("click", closeCart);
	if (backdrop) backdrop.addEventListener("click", closeCart);

	if (clearBtn) {
		clearBtn.addEventListener("click", handleClearCart);
	}

	if (checkoutBtn) {
		checkoutBtn.addEventListener("click", () => {
			closeCart();
			setTimeout(() => openCheckout(), 100);
		});
	}

	if (itemsContainer) {
		itemsContainer.addEventListener("click", handleItemAction);
	}

	// ESC key to close (removed conflicting Cmd+D browser shortcut override)
	document.addEventListener("keydown", (e: KeyboardEvent) => {
		if (e.key === "Escape" && isCartOpen()) {
			e.preventDefault();
			closeCart();
		}
	});

	renderCart();
	lastItemCount = getCartItems().length;
};

/**
 * Open cart panel
 */
export const openCart = (): void => {
	if (!cartPanel) return;

	cartPanel.hidden = false;
	cartPanel.classList.add("cart--open");
	document.body.style.overflow = "hidden";
	renderCart();

	focusTrap?.activate();

	const closeBtn = cartPanel.querySelector<HTMLElement>(".cart__close");
	if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
};

/**
 * Close cart panel
 */
export const closeCart = (): void => {
	if (!cartPanel) return;

	cartPanel.classList.remove("cart--open");
	document.body.style.overflow = "";
	focusTrap?.deactivate();

	setTimeout(() => {
		if (!cartPanel?.classList.contains("cart--open")) {
			cartPanel!.hidden = true;
		}
	}, 300);
};

const isCartOpen = (): boolean => {
	return cartPanel?.classList.contains("cart--open") ?? false;
};

const toggleCartState = (isEmpty: boolean): void => {
	if (emptyState) emptyState.hidden = !isEmpty;
	if (cartContent) cartContent.hidden = isEmpty;
	if (footer) footer.hidden = isEmpty;
};

const renderCart = (): void => {
	if (!cartPanel || !itemsContainer) return;

	const items = getCartItems();
	lastItemCount = items.length;

	if (items.length === 0) {
		toggleCartState(true);
		itemsContainer.innerHTML = "";
	} else {
		toggleCartState(false);
		renderCartItems();
		updateCartTotals();
	}
};

const renderCartItems = (): void => {
	if (!itemsContainer) return;

	itemsContainer.innerHTML = "";
	const items = getCartItems();
	items.forEach((item) => {
		itemsContainer!.appendChild(createCartItemElement(item));
	});
};

const createCartItemElement = (item: CartItem): HTMLElement => {
	const itemEl = document.createElement("article");
	itemEl.className = "cart__item";
	itemEl.setAttribute("data-item-id", item.id);

	const product = findProduct(item.productId);
	const productImage = product?.image || "";
	const quantity = item.quantity || 1;

	const priceOption = product?.priceOptions.find(
		(opt) =>
			opt.count === item.count &&
			(opt.price === item.unitPrice || opt.price === item.price),
	);
	const unitCount = priceOption?.count || item.count;
	const unitPrice = item.unitPrice !== undefined ? item.unitPrice : item.price;
	const lineTotal = unitPrice * quantity;

	const toppingsHtml = formatToppings(
		item.toppings,
		item.count,
		item.productId,
		"html",
	);

	itemEl.innerHTML = `
		<div class="cart__item-main">
			<img class="cart__item-image" src="${escapeHtml(productImage)}" alt="${escapeHtml(item.name)}" loading="lazy" />
			<div class="cart__item-content">
				<div class="cart__item-header">
					<h3 class="cart__item-name">${escapeHtml(item.name)}</h3>
					<button type="button" class="cart__item-edit" aria-label="Edit ${escapeHtml(item.name)}" title="Edit item" data-action="edit">
						✏️
					</button>
				</div>
				<p class="cart__item-option">${unitCount}ct ${formatCurrency(unitPrice)}</p>
				${toppingsHtml}
				${item.specialInstructions ? `<p class="cart__item-instructions">${escapeHtml(item.specialInstructions)}</p>` : ""}
			</div>
		</div>
		<div class="cart__item-actions">
			<div class="cart__item-quantity">
				<button type="button" class="cart__quantity-btn cart__quantity-btn--minus" aria-label="Decrease quantity" data-action="decrease">−</button>
				<span class="cart__quantity-value">${quantity}</span>
				<button type="button" class="cart__quantity-btn cart__quantity-btn--plus" aria-label="Increase quantity" data-action="increase">+</button>
			</div>
			<div class="cart__item-price">${formatCurrency(lineTotal)}</div>
			<button type="button" class="cart__item-remove" aria-label="Remove ${escapeHtml(item.name)}" data-action="remove">🗑️</button>
		</div>
	`;

	return itemEl;
};

const handleItemAction = (e: Event): void => {
	const button = (e.target as HTMLElement).closest<HTMLElement>(
		"button[data-action]",
	);
	if (!button) return;

	const itemElement = button.closest<HTMLElement>("[data-item-id]");
	if (!itemElement) return;

	const itemId = itemElement.getAttribute("data-item-id")!;
	const action = button.getAttribute("data-action");
	const item = getCartItems().find((i) => i.id === itemId);
	if (!item) return;

	switch (action) {
		case "edit":
			e.stopPropagation();
			handleEditItem(item);
			break;
		case "remove":
			handleRemoveItem(itemId, item.name);
			break;
		case "increase":
		case "decrease": {
			const quantityEl =
				itemElement.querySelector(".cart__quantity-value");
			if (!quantityEl) return;

			const currentQty =
				parseInt(quantityEl.textContent || "1") || 1;
			const newQty =
				action === "increase" ? currentQty + 1 : currentQty - 1;
			const activeElement = document.activeElement as HTMLElement;
			updateCartItemQuantity(itemId, newQty, activeElement);
			break;
		}
	}
};

const updateCartItemQuantity = (
	itemId: string,
	quantity: number,
	activeElement: HTMLElement,
): void => {
	const item = getCartItems().find((i) => i.id === itemId);
	if (!item) return;

	if (quantity <= 0) {
		handleRemoveItem(itemId, item.name);
		return;
	}

	const unitPrice =
		item.unitPrice !== undefined
			? item.unitPrice
			: item.price / (item.quantity || 1);

	updateCartItem(itemId, { quantity, unitPrice });
	updateCartItemElement(itemId, { quantity, unitPrice });
	updateCartTotals();
	announce(`${item.name} quantity updated to ${quantity}`);

	requestAnimationFrame(() => {
		if (activeElement && document.contains(activeElement)) {
			activeElement.focus();
		}
	});
};

const updateCartItemElement = (
	itemId: string,
	itemData: { quantity: number; unitPrice: number },
): void => {
	if (!itemsContainer) return;

	const itemElement = itemsContainer.querySelector(
		`[data-item-id="${itemId}"]`,
	);
	if (!itemElement) return;

	const quantityEl = itemElement.querySelector(".cart__quantity-value");
	const priceEl = itemElement.querySelector(".cart__item-price");

	if (quantityEl) quantityEl.textContent = String(itemData.quantity);
	if (priceEl) {
		priceEl.textContent = formatCurrency(
			itemData.unitPrice * itemData.quantity,
		);
	}
};

const refreshCartItemElement = (itemId: string): void => {
	if (!itemsContainer) return;

	const item = getCartItems().find((i) => i.id === itemId);
	if (!item) return;

	const itemElement = itemsContainer.querySelector(
		`[data-item-id="${itemId}"]`,
	);
	if (!itemElement) return;

	const product = findProduct(item.productId);
	const priceOption = product?.priceOptions.find(
		(opt) =>
			opt.count === item.count &&
			(opt.price === item.unitPrice || opt.price === item.price),
	);
	const unitCount = priceOption?.count || item.count;
	const unitPrice = item.unitPrice !== undefined ? item.unitPrice : item.price;
	const quantity = item.quantity || 1;
	const lineTotal = unitPrice * quantity;

	// Update option display
	const optionEl = itemElement.querySelector(".cart__item-option");
	if (optionEl) {
		optionEl.textContent = `${unitCount}ct ${formatCurrency(unitPrice)}`;
	}

	// Update toppings
	const toppingsEl = itemElement.querySelector(".cart__item-toppings");
	const contentEl = itemElement.querySelector(".cart__item-content");
	const toppingsHtml = formatToppings(
		item.toppings,
		item.count,
		item.productId,
		"html",
	);

	if (toppingsHtml) {
		if (toppingsEl) {
			toppingsEl.outerHTML = toppingsHtml;
		} else if (contentEl && optionEl) {
			optionEl.insertAdjacentHTML("afterend", toppingsHtml);
		}
	} else if (toppingsEl) {
		toppingsEl.remove();
	}

	// Update special instructions
	const instructionsEl = itemElement.querySelector(
		".cart__item-instructions",
	);

	if (item.specialInstructions) {
		if (instructionsEl) {
			instructionsEl.textContent = item.specialInstructions;
		} else if (contentEl) {
			const el = document.createElement("p");
			el.className = "cart__item-instructions";
			el.textContent = item.specialInstructions;
			contentEl.appendChild(el);
		}
	} else if (instructionsEl) {
		instructionsEl.remove();
	}

	// Update quantity and price
	const quantityEl = itemElement.querySelector(".cart__quantity-value");
	const priceEl = itemElement.querySelector(".cart__item-price");

	if (quantityEl) quantityEl.textContent = String(quantity);
	if (priceEl) priceEl.textContent = formatCurrency(lineTotal);
};

const updateCartTotals = (): void => {
	if (!subtotalEl || !totalEl) return;

	const subtotal = getCartSubtotal();
	subtotalEl.textContent = formatCurrency(subtotal);
	totalEl.textContent = formatCurrency(subtotal);
};

const handleEditItem = (item: CartItem): void => {
	if (!productModal) return;

	const product = findProduct(item.productId);
	if (!product) return;

	openProductModal(productModal, product, {
		itemId: item.id,
		count: item.count,
		price: item.unitPrice || item.price,
		specialInstructions: item.specialInstructions,
		toppings: item.toppings,
	});
};

const handleRemoveItem = (itemId: string, itemName?: string): void => {
	removeFromCart(itemId);
	renderCart();
	if (itemName) announce(`${itemName} removed from cart`);
};

const handleClearCart = (): void => {
	if (!confirm("Are you sure you want to clear your cart?")) return;
	clearCart();
	renderCart();
	announce("Cart cleared");
};

// Listen for cart updates — re-render on add/remove, refresh on edits
document.addEventListener("cartUpdate", () => {
	if (!isCartOpen()) return;

	const currentItemCount = getCartItems().length;

	if (currentItemCount !== lastItemCount) {
		renderCart();
		lastItemCount = currentItemCount;
	} else {
		getCartItems().forEach((item) => refreshCartItemElement(item.id));
		updateCartTotals();
	}
});
