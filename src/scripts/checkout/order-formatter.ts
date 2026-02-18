import type { OrderData } from "@/scripts/types/index.ts";
import { formatToppings } from "@/scripts/utils/toppings.ts";
import { formatCurrency } from "@/scripts/utils/format-currency.ts";

/**
 * Format order data as a plain-text email body
 */
export const formatOrderEmail = (orderData: OrderData): string => {
	const {
		name,
		email,
		phone,
		zipcode,
		address,
		notes,
		items,
		subtotal,
		deliveryFee,
		total,
	} = orderData;

	let body = `Name - ${name}\n`;
	body += `Email - ${email}\n`;
	body += `Phone - ${phone}\n`;
	body += `Zip Code - ${zipcode}\n`;
	body += `Address - ${address}\n`;
	if (notes) {
		body += `Special Instructions - ${notes}\n`;
	}

	body += `\n------\nOrder:\n------\n\n`;

	items.forEach((item, index) => {
		const sku = item.sku ? ` [${item.sku}]` : "";
		body += `${index + 1}. ${item.name}${sku} - ${item.count}ct × ${item.quantity}\n`;
		body += `   Price: ${formatCurrency(item.unitPrice * item.quantity)}\n`;

		if (item.toppings) {
			const toppingsText = formatToppings(
				item.toppings,
				item.count,
				item.productId,
				"email",
			);
			if (toppingsText) {
				body += `   Toppings: ${toppingsText}\n`;
			}
		}

		if (item.specialInstructions) {
			body += `   Notes: ${item.specialInstructions}\n`;
		}
		body += `\n`;
	});

	body += `------\n`;
	body += `Subtotal: ${formatCurrency(subtotal)}\n`;
	body += `Delivery: ${formatCurrency(deliveryFee)}\n`;
	body += `------\n`;
	body += `Total: ${formatCurrency(total)}\n`;
	body += `------`;

	return body;
};
