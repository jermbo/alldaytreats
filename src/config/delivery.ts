import { siteConfig } from "./site.ts";

interface DeliveryOption {
	zipCode: string;
	fee: number;
	area: string;
}

// Memoized delivery zone map (built once on first access)
let deliveryZoneMap: Map<string, number> | null = null;

/**
 * Build a flat map of zipCode -> fee for quick lookups (memoized)
 */
export const getDeliveryZoneMap = (): Map<string, number> => {
	if (deliveryZoneMap) return deliveryZoneMap;

	deliveryZoneMap = new Map<string, number>();

	for (const zone of siteConfig.delivery.zones) {
		for (const area of zone.areas) {
			for (const zipCode of area.zipCodes) {
				const existingFee = deliveryZoneMap.get(zipCode);
				if (existingFee === undefined || zone.fee < existingFee) {
					deliveryZoneMap.set(zipCode, zone.fee);
				}
			}
		}
	}

	return deliveryZoneMap;
};

/**
 * Get all unique delivery options for the dropdown
 * Returns zip codes with their fees and area names, sorted by zip code
 */
export const getDeliveryOptions = (): DeliveryOption[] => {
	const optionsMap = new Map<string, DeliveryOption>();

	for (const zone of siteConfig.delivery.zones) {
		for (const area of zone.areas) {
			for (const zipCode of area.zipCodes) {
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

	return Array.from(optionsMap.values()).sort((a, b) =>
		a.zipCode.localeCompare(b.zipCode),
	);
};

/**
 * Look up delivery fee by zip code
 */
export const getDeliveryFee = (zipCode: string): number | null => {
	const fee = getDeliveryZoneMap().get(zipCode);
	return fee !== undefined ? fee : null;
};

/**
 * Check if a zip code is in the delivery area
 */
export const isDeliveryZipCode = (zipCode: string): boolean => {
	return getDeliveryZoneMap().has(zipCode);
};
