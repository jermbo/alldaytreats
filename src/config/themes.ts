export interface Theme {
	id: string;
	name: string;
	sku: string;
}

export const THEME_PRICE = 20;
export const THEME_SKU = "THME";

export const themes: Theme[] = [
	{ id: "toy-story", name: "Toy Story", sku: "THTS" },
	{ id: "school", name: "School", sku: "THSC" },
	{ id: "birthday", name: "Birthday (any age)", sku: "THBD" },
	{ id: "winnie-the-pooh", name: "Winnie the Pooh", sku: "THWP" },
	{ id: "mickey-mouse", name: "Mickey Mouse", sku: "THMM" },
	{ id: "minions", name: "Minions", sku: "THMN" },
	{ id: "cookies-and-cream", name: "Cookies and Cream", sku: "THCC" },
	{ id: "strawberry-shortcake", name: "Strawberry Shortcake", sku: "THSS" },
	{ id: "cow", name: "Cow", sku: "THCW" },
	{ id: "holiday", name: "Holiday", sku: "THHL" },
	{ id: "baby-shower", name: "Baby Shower", sku: "THBS" },
	{ id: "sports-team", name: "Sports Team / Organization", sku: "THSP" },
	{ id: "custom", name: "Custom / Other (describe in notes)", sku: "THCU" },
];

export const getThemeById = (id: string): Theme | undefined =>
	themes.find((t) => t.id === id);
