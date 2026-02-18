import type { Product, CartItem } from "@/scripts/types/index.ts";

let productMap: Map<string, Product> | null = null;

/**
 * Build (or rebuild) the product lookup map from window.PRODUCTS
 */
export const buildProductMap = (): void => {
	productMap = new Map<string, Product>();
	const products = window.PRODUCTS || [];
	for (const product of products) {
		productMap.set(product.id, product);
	}
};

/**
 * Find a product by ID (lazily builds map on first access)
 */
export const findProduct = (productId: string): Product | undefined => {
	if (!productMap) buildProductMap();
	return productMap!.get(productId);
};

/**
 * Single source of truth: does this product belong to the chocolate category?
 * Chocolate products do not support toppings.
 */
export const isChocolateCovered = (productId: string): boolean => {
	return findProduct(productId)?.category === "chocolate";
};

/**
 * Calculate line total for a cart item (unitPrice × quantity)
 */
export const calculateLineTotal = (item: CartItem): number => {
	const unitPrice = item.unitPrice !== undefined ? item.unitPrice : item.price;
	const quantity = item.quantity || 1;
	return unitPrice * quantity;
};
