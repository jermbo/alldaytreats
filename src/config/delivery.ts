import { siteConfig } from "./site.ts";

interface DeliveryOption {
	zipCode: string;
	fee: number;
	area: string;
}

/**
 * Build a flat map of zipCode -> fee for quick lookups
 * @returns Map of zip codes to their delivery fees
 */
export const getDeliveryZoneMap = (): Map<string, number> => {
	const map = new Map<string, number>();

	for (const zone of siteConfig.delivery.zones) {
		for (const area of zone.areas) {
			for (const zipCode of area.zipCodes) {
				// If zip code appears in multiple zones, use the lower fee
				const existingFee = map.get(zipCode);
				if (existingFee === undefined || zone.fee < existingFee) {
					map.set(zipCode, zone.fee);
				}
			}
		}
	}

	return map;
};

/**
 * Get all unique delivery options for the dropdown
 * Returns zip codes with their fees and area names, sorted by zip code
 * @returns Array of delivery options
 */
export const getDeliveryOptions = (): DeliveryOption[] => {
	const optionsMap = new Map<string, DeliveryOption>();

	for (const zone of siteConfig.delivery.zones) {
		for (const area of zone.areas) {
			for (const zipCode of area.zipCodes) {
				// If zip code already exists, keep the one with lower fee
				const existing = optionsMap.get(zipCode);
				if (!existing || zone.fee < existing.fee) {
					optionsMap.set(zipCode, {
						zipCode,
						fee: zone.fee,
						area: area.name,
					});
				}
			}
		}
	}

	// Convert to array and sort by zip code
	return Array.from(optionsMap.values()).sort((a, b) =>
		a.zipCode.localeCompare(b.zipCode)
	);
};

/**
 * Look up delivery fee by zip code
 * @param zipCode - The zip code to look up
 * @returns The delivery fee, or null if zip code is not in delivery area
 */
export const getDeliveryFee = (zipCode: string): number | null => {
	const map = getDeliveryZoneMap();
	const fee = map.get(zipCode);
	return fee !== undefined ? fee : null;
};

/**
 * Check if a zip code is in the delivery area
 * @param zipCode - The zip code to check
 * @returns True if the zip code is deliverable
 */
export const isDeliveryZipCode = (zipCode: string): boolean => {
	return getDeliveryZoneMap().has(zipCode);
};
