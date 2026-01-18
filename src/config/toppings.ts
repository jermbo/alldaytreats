export interface Topping {
	id: string;
	name: string;
	price: number; // 0 for included toppings
	category: "included" | "premium";
	available: boolean;
}

// Configuration constants
export const MAX_INCLUDED_TOPPINGS = 2;

export const toppings: Topping[] = [
	// Included toppings (no extra charge)
	{
		id: "jolly-ranchers",
		name: "Jolly Ranchers",
		price: 0,
		category: "included",
		available: true,
	},
	{
		id: "nerds",
		name: "Nerds",
		price: 0,
		category: "included",
		available: true,
	},
	{
		id: "starburst",
		name: "Starburst",
		price: 0,
		category: "included",
		available: true,
	},
	{
		id: "skittles",
		name: "Skittles",
		price: 0,
		category: "included",
		available: true,
	},
	{
		id: "airheads",
		name: "Airheads",
		price: 0,
		category: "included",
		available: true,
	},
	// Premium toppings (extra charge)
	{
		id: "candy-sauce",
		name: "Candy Sauce",
		price: 1,
		category: "premium",
		available: true,
	},
	{
		id: "fruit-rollup",
		name: "Fruit Rollup",
		price: 5,
		category: "premium",
		available: true,
	},
];

/**
 * Get all available toppings by category
 * @returns Object with included and premium topping arrays
 */
export const getToppingsByCategory = () => {
	const included = toppings.filter(
		(t) => t.category === "included" && t.available
	);
	const premium = toppings.filter(
		(t) => t.category === "premium" && t.available
	);
	return { included, premium };
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
 * @returns Total price
 */
export const calculateToppingsPrice = (toppingIds: string[]): number => {
	return toppingIds.reduce((total, id) => {
		const topping = getToppingById(id);
		return total + (topping?.price || 0);
	}, 0);
};
