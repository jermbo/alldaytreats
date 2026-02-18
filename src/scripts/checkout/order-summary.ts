import { getCartItems, getCartSubtotal } from "@/scripts/cart.ts";
import { escapeHtml } from "@/scripts/utils/escape-html.ts";
import { formatCurrency } from "@/scripts/utils/format-currency.ts";
import { formatToppings } from "@/scripts/utils/toppings.ts";
import { calculateLineTotal } from "@/scripts/utils/product.ts";

let summaryItemsContainer: HTMLElement | null = null;
let summarySubtotalEl: HTMLElement | null = null;
let summaryDeliveryEl: HTMLElement | null = null;
let summaryDeliveryLabelEl: HTMLElement | null = null;
let summaryTotalEl: HTMLElement | null = null;

/**
 * Cache DOM references for the order summary section
 */
export const initOrderSummary = (modal: HTMLElement): void => {
	summaryItemsContainer = modal.querySelector(
		".checkout-modal__summary-items",
	);
	summarySubtotalEl = modal.querySelector(
		".checkout-modal__summary-subtotal",
	);
	summaryDeliveryEl = modal.querySelector(
		".checkout-modal__summary-delivery",
	);
	summaryDeliveryLabelEl = modal.querySelector(
		".checkout-modal__summary-label",
	);
	summaryTotalEl = modal.querySelector(".checkout-modal__summary-total");
};

/**
 * Render the order summary item list and subtotal
 */
export const renderOrderSummary = (): void => {
	if (!summaryItemsContainer || !summarySubtotalEl || !summaryTotalEl) return;

	const items = getCartItems();
	const subtotal = getCartSubtotal();

	summaryItemsContainer.innerHTML = "";

	items.forEach((item) => {
		const lineTotal = calculateLineTotal(item);
		const toppingsText = formatToppings(
			item.toppings,
			item.count,
			item.productId,
			"text",
		);

		const itemEl = document.createElement("div");
		itemEl.className = "checkout-modal__summary-item";
		itemEl.innerHTML = `
			<div class="checkout-modal__summary-item-details">
				<span class="checkout-modal__summary-item-name">${escapeHtml(item.name)}</span>
				<span class="checkout-modal__summary-item-meta">${item.count}ct x ${item.quantity}</span>
				${toppingsText ? `<span class="checkout-modal__summary-item-toppings">${toppingsText}</span>` : ""}
			</div>
			<span class="checkout-modal__summary-item-price">${formatCurrency(lineTotal)}</span>
		`;
		summaryItemsContainer.appendChild(itemEl);
	});

	summarySubtotalEl.textContent = formatCurrency(subtotal);
};

/**
 * Update the delivery fee and total displays
 */
export const updateDeliveryDisplay = (
	selectedDeliveryFee: number | null,
	deliveryType: "pickup" | "delivery" = "delivery",
): void => {
	if (!summaryDeliveryEl || !summaryTotalEl) return;

	const subtotal = getCartSubtotal();

	// Update label text
	if (summaryDeliveryLabelEl) {
		summaryDeliveryLabelEl.textContent =
			deliveryType === "pickup" ? "Pickup" : "Delivery";
	}

	// Update fee display
	if (deliveryType === "pickup") {
		summaryDeliveryEl.textContent = formatCurrency(0);
		summaryTotalEl.textContent = formatCurrency(subtotal);
	} else if (selectedDeliveryFee !== null) {
		summaryDeliveryEl.textContent = formatCurrency(selectedDeliveryFee);
		summaryTotalEl.textContent = formatCurrency(
			subtotal + selectedDeliveryFee,
		);
	} else {
		summaryDeliveryEl.textContent = "--";
		summaryTotalEl.textContent = formatCurrency(subtotal);
	}
};
