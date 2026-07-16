import type { OrderData } from "@/scripts/types/index.ts";
import { formatToppings } from "@/scripts/utils/toppings.ts";
import { formatPackageOptions } from "@/scripts/utils/package-options.ts";
import { formatCurrency } from "@/scripts/utils/format-currency.ts";
import { isPackage } from "@/scripts/utils/product.ts";
import { RUSH_FEE_SKU } from "@/config/order-fees.ts";

/**
 * Format order data as a plain-text email body
 */
export const formatOrderEmail = (orderData: OrderData): string => {
	const {
		deliveryType,
		name,
		email,
		phone,
		zipcode,
		address,
		notes,
		items,
		subtotal,
		deliveryFee,
		rushFee,
		total,
	} = orderData;

	let body = `Name - ${name}\n`;
	body += `Email - ${email}\n`;
	body += `Phone - ${phone}\n`;

	if (deliveryType === "pickup") {
		body += `Pickup - Yes\n`;
	} else {
		body += `Zip Code - ${zipcode}\n`;
		body += `Address - ${address}\n`;
	}

	if (notes) {
		body += `Special Instructions - ${notes}\n`;
	}

	body += `\n------\nOrder:\n------\n\n`;

	items.forEach((item, index) => {
		const sku = item.sku ? ` [${item.sku}]` : "";
		const countLabel = isPackage(item.productId)
			? `Package × ${item.quantity}`
			: `${item.count}ct × ${item.quantity}`;
		body += `${index + 1}. ${item.name}${sku} - ${countLabel}\n`;
		body += `   Price: ${formatCurrency(item.unitPrice * item.quantity)}\n`;

		const packageOpts = formatPackageOptions(item, "email");
		if (packageOpts) {
			body += `   ${packageOpts}\n`;
		}

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
	if (deliveryType === "pickup") {
		body += `Pickup: ${formatCurrency(0)}\n`;
	} else {
		body += `Delivery: ${formatCurrency(deliveryFee)}\n`;
	}
	if (rushFee > 0) {
		body += `Rush Fee [${RUSH_FEE_SKU}]: ${formatCurrency(rushFee)}\n`;
	}
	body += `------\n`;
	body += `Total: ${formatCurrency(total)}\n`;
	body += `------`;

	return body;
};
