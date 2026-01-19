export interface Topping {
	id: string;
	name: string;
	price: number;
	available: boolean;
}

// Configuration constants
export const MAX_TOPPINGS = 2;

export const toppings: Topping[] = [
	{
		id: "jolly-ranchers",
		name: "Jolly Ranchers",
		price: 2,
		available: true,
	},
	{
		id: "nerds",
		name: "Nerds",
		price: 2,
		available: true,
	},
	{
		id: "starburst",
		name: "Starburst",
		price: 2,
		available: true,
	},
	{
		id: "skittles",
		name: "Skittles",
		price: 2,
		available: true,
	},
	{
		id: "airheads",
		name: "Airheads",
		price: 2,
		available: true,
	},
	{
		id: "candy-sauce",
		name: "Candy Sauce",
		price: 1,
		available: true,
	},
	{
		id: "fruit-rollup",
		name: "Fruit Rollup",
		price: 5,
		available: true,
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
 * @returns Total price
 */
export const calculateToppingsPrice = (toppingIds: string[]): number => {
	return toppingIds.reduce((total, id) => {
		const topping = getToppingById(id);
		return total + (topping?.price || 0);
	}, 0);
};
