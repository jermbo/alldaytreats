export interface Topping {
	id: string;
	name: string;
	price: number; // Base price (for 6ct)
	available: boolean;
	sku: string; // Unique identifier for order verification
}

// Configuration constants
export const MAX_TOPPINGS = 2;

/**
 * Calculate topping price based on product count
 * @param basePrice - Base topping price
 * @param count - Product count (6, 8, or 12)
 * @returns Calculated price
 */
export const calculateToppingPrice = (
	basePrice: number,
	count: number,
): number => {
	switch (count) {
		case 6:
			return basePrice;
		case 8:
			return basePrice + 1;
		case 12:
			return basePrice + 2;
		default:
			return basePrice;
	}
};

export const toppings: Topping[] = [
	{
		id: "jolly-ranchers",
		name: "Jolly Ranchers",
		price: 2,
		available: true,
		sku: "JYRS",
	},
	{
		id: "nerds",
		name: "Nerds",
		price: 2,
		available: true,
		sku: "NERD",
	},
	{
		id: "starburst",
		name: "Starburst",
		price: 2,
		available: true,
		sku: "STRB",
	},
	{
		id: "skittles",
		name: "Skittles",
		price: 2,
		available: true,
		sku: "SKTL",
	},
	{
		id: "airheads",
		name: "Airheads",
		price: 2,
		available: true,
		sku: "AHDS",
	},
	{
		id: "candy-sauce",
		name: "Candy Sauce",
		price: 1,
		available: true,
		sku: "CDSA",
	},
	{
		id: "fruit-rollup",
		name: "Fruit Rollup",
		price: 5,
		available: true,
		sku: "FRUP",
	},
];

/**
 * Get all available toppings
 * @returns Array of available toppings
 */
export const getAvailableToppings = () => {
	return toppings.filter((t) => t.available);
};

/**
 * Get topping by ID
 * @param id - Topping ID
 * @returns Topping or undefined
 */
export const getToppingById = (id: string): Topping | undefined => {
	return toppings.find((t) => t.id === id);
};

/**
 * Calculate total price for selected toppings
 * @param toppingIds - Array of topping IDs
 * @param count - Product count (optional, defaults to 6 for base price)
 * @returns Total price
 */
export const calculateToppingsPrice = (
	toppingIds: string[],
	count: number = 6,
): number => {
	return toppingIds.reduce((total, id) => {
		const topping = getToppingById(id);
		if (!topping) return total;
		const price = calculateToppingPrice(topping.price, count);
		return total + price;
	}, 0);
};
