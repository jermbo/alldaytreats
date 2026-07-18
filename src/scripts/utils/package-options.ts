import { getThemeById, THEME_PRICE } from "@/config/themes.ts";
import {
	getFlavorById,
	calculateExtraFlavorFee,
} from "@/config/flavors.ts";
import { escapeHtml } from "@/scripts/utils/escape-html.ts";
import type { CartItem } from "@/scripts/types/index.ts";

type FormatMode = "html" | "text" | "email";

/**
 * Format theme + flavors for cart, checkout summary, and email
 */
export const formatPackageOptions = (
	item: CartItem,
	format: FormatMode = "text",
): string => {
	const parts: string[] = [];

	if (item.theme) {
		const theme = getThemeById(item.theme);
		const themeName = theme?.name || item.theme;
		if (format === "email") {
			parts.push(
				`Theme: ${themeName}${theme ? ` [${theme.sku}]` : ""} (+$${THEME_PRICE})`,
			);
		} else {
			parts.push(`Theme: ${themeName} (+$${THEME_PRICE})`);
		}
	}

	if (item.flavors?.length) {
		const flavorDetails = item.flavors
			.map((id) => {
				const flavor = getFlavorById(id);
				if (!flavor) return null;
				return format === "email"
					? `${flavor.name} [${flavor.sku}]`
					: flavor.name;
			})
			.filter(Boolean) as string[];

		if (flavorDetails.length) {
			const fee = calculateExtraFlavorFee(item.flavors);
			const feeText = fee > 0 ? ` (+$${fee} extra flavors)` : "";
			parts.push(`Flavors: ${flavorDetails.join(", ")}${feeText}`);
		}
	}

	if (parts.length === 0) return "";

	if (format === "html") {
		return parts
			.map(
				(p) =>
					`<p class="cart__item-package-option">${escapeHtml(p)}</p>`,
			)
			.join("");
	}

	if (format === "email") {
		return parts.join("\n   ");
	}

	return parts.map((p) => escapeHtml(p)).join(" · ");
};
