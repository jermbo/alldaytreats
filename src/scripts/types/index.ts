export interface PriceOption {
	count: number;
	price: number;
	sku: string;
}

export interface Product {
	id: string;
	name: string;
	category: "candy" | "chocolate" | "platter";
	image: string;
	priceFrom: number;
	priceOptions: PriceOption[];
	extraAddOns: number;
	description: string;
}

export interface CartItem {
	id: string;
	productId: string;
	name: string;
	count: number;
	price: number;
	unitPrice: number;
	quantity: number;
	specialInstructions: string;
	toppings?: string[];
	sku: string;
}

export interface ValidationResult {
	isValid: boolean;
	message: string;
}

export interface FormValidationResult {
	isValid: boolean;
	errors: Record<string, string>;
}

export interface CheckoutFormData {
	name: string;
	email: string;
	phone: string;
	zipcode: string;
	address: string;
	notes: string;
}

export interface OrderData extends CheckoutFormData {
	items: CartItem[];
	subtotal: number;
	deliveryFee: number;
	total: number;
}

export interface LegacyToppings {
	included?: string[];
	premium?: string[];
}

export type ToppingsData = string[] | LegacyToppings;

declare global {
	interface Window {
		PRODUCTS: Product[];
	}
}
