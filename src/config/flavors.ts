export interface Flavor {
	id: string;
	name: string;
	sku: string;
}

/** First flavor included; each additional distinct flavor costs this much */
export const EXTRA_FLAVOR_FEE = 1;
export const EXTRA_FLAVOR_SKU = "XFLV";

export const flavors: Flavor[] = [
	{ id: "strawberry", name: "Strawberry", sku: "FLST" },
	{ id: "watermelon", name: "Watermelon", sku: "FLWM" },
	{ id: "green-apple", name: "Green Apple", sku: "FLGA" },
	{ id: "grape", name: "Grape", sku: "FLGR" },
	{ id: "cherry", name: "Cherry", sku: "FLCH" },
	{ id: "blue-raspberry", name: "Blue Raspberry", sku: "FLBR" },
	{ id: "cotton-candy", name: "Cotton Candy", sku: "FLCC" },
	{ id: "fruit-punch", name: "Fruit Punch", sku: "FLFP" },
];

export const getFlavorById = (id: string): Flavor | undefined =>
	flavors.find((f) => f.id === id);

/**
 * Extra flavor fee: first flavor free, +$1 per additional distinct flavor
 */
export const calculateExtraFlavorFee = (flavorIds: string[]): number => {
	const unique = [...new Set(flavorIds)];
	return Math.max(0, unique.length - 1) * EXTRA_FLAVOR_FEE;
};
