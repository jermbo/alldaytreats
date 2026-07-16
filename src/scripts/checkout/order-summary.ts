import { getCartItems, getCartSubtotal } from "@/scripts/cart.ts";
import { escapeHtml } from "@/scripts/utils/escape-html.ts";
import { formatCurrency } from "@/scripts/utils/format-currency.ts";
import { formatToppings } from "@/scripts/utils/toppings.ts";
import { formatPackageOptions } from "@/scripts/utils/package-options.ts";
import { calculateLineTotal, isPackage } from "@/scripts/utils/product.ts";

let summaryItemsContainer: HTMLElement | null = null;
let summarySubtotalEl: HTMLElement | null = null;
let summaryDeliveryEl: HTMLElement | null = null;
let summaryDeliveryLabelEl: HTMLElement | null = null;
let summaryRushEl: HTMLElement | null = null;
let summaryRushRow: HTMLElement | null = null;
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
	summaryRushEl = modal.querySelector(".checkout-modal__summary-rush");
	summaryRushRow = modal.querySelector("[data-rush-summary-row]");
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
		const packageOpts = formatPackageOptions(item, "text");
		const meta = isPackage(item.productId)
			? `Package x ${item.quantity}`
			: `${item.count}ct x ${item.quantity}`;

		const itemEl = document.createElement("div");
		itemEl.className = "checkout-modal__summary-item";
		itemEl.innerHTML = `
			<div class="checkout-modal__summary-item-details">
				<span class="checkout-modal__summary-item-name">${escapeHtml(item.name)}</span>
				<span class="checkout-modal__summary-item-meta">${meta}</span>
				${packageOpts ? `<span class="checkout-modal__summary-item-toppings">${packageOpts}</span>` : ""}
				${toppingsText ? `<span class="checkout-modal__summary-item-toppings">${toppingsText}</span>` : ""}
			</div>
			<span class="checkout-modal__summary-item-price">${formatCurrency(lineTotal)}</span>
		`;
		summaryItemsContainer.appendChild(itemEl);
	});

	summarySubtotalEl.textContent = formatCurrency(subtotal);
};

/**
 * Update the delivery fee, rush fee, and total displays
 */
export const updateDeliveryDisplay = (
	selectedDeliveryFee: number | null,
	deliveryType: "pickup" | "delivery" = "delivery",
	rushFee: number = 0,
): void => {
	if (!summaryDeliveryEl || !summaryTotalEl) return;

	const subtotal = getCartSubtotal();

	if (summaryDeliveryLabelEl) {
		summaryDeliveryLabelEl.textContent =
			deliveryType === "pickup" ? "Pickup" : "Delivery";
	}

	if (summaryRushEl && summaryRushRow) {
		if (rushFee > 0) {
			summaryRushRow.hidden = false;
			summaryRushEl.textContent = formatCurrency(rushFee);
		} else {
			summaryRushRow.hidden = true;
			summaryRushEl.textContent = formatCurrency(0);
		}
	}

	let fees = rushFee;
	if (deliveryType === "pickup") {
		summaryDeliveryEl.textContent = formatCurrency(0);
	} else if (selectedDeliveryFee !== null) {
		summaryDeliveryEl.textContent = formatCurrency(selectedDeliveryFee);
		fees += selectedDeliveryFee;
	} else {
		summaryDeliveryEl.textContent = "--";
	}

	summaryTotalEl.textContent = formatCurrency(subtotal + fees);
};
