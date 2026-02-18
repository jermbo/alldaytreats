import {
	getToppingById,
	calculateToppingPrice,
} from "@/config/toppings.ts";
import { isChocolateCovered } from "@/scripts/utils/product.ts";
import { escapeHtml } from "@/scripts/utils/escape-html.ts";
import type { ToppingsData } from "@/scripts/types/index.ts";

type ToppingsFormat = "html" | "text" | "email";

/**
 * Normalize toppings from legacy object format or current array format
 */
export const normalizeToppingIds = (
	toppings: ToppingsData | undefined,
): string[] => {
	if (!toppings) return [];
	if (Array.isArray(toppings)) return toppings;
	return [...(toppings.included || []), ...(toppings.premium || [])];
};

/**
 * Format toppings for display in various contexts
 * - "html": returns <p> element string for cart display
 * - "text": returns escaped plain text with + prefix for checkout summary
 * - "email": returns plain text with SKUs for order emails
 */
export const formatToppings = (
	toppings: ToppingsData | undefined,
	count: number,
	productId: string,
	format: ToppingsFormat = "text",
): string => {
	if (!toppings) return "";
	if (isChocolateCovered(productId)) return "";

	const allToppingIds = normalizeToppingIds(toppings);
	if (allToppingIds.length === 0) return "";

	const toppingDetails = allToppingIds
		.map((id) => {
			const topping = getToppingById(id);
			if (!topping) return null;
			const price = calculateToppingPrice(topping.price, count);

			if (format === "email") {
				return price > 0
					? `${topping.name} [${topping.sku}] (+$${price})`
					: `${topping.name} [${topping.sku}]`;
			}
			return price > 0 ? `${topping.name} (+$${price})` : topping.name;
		})
		.filter(Boolean) as string[];

	if (toppingDetails.length === 0) return "";

	const joined = toppingDetails.join(", ");

	if (format === "html") {
		return `<p class="cart__item-toppings">+ ${escapeHtml(joined)}</p>`;
	}
	if (format === "email") {
		return joined;
	}
	return `+ ${escapeHtml(joined)}`;
};
