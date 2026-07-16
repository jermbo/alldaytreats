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
 * Party / platter packages (named bundles)
 */
export const isPackage = (productId: string): boolean => {
	return findProduct(productId)?.category === "platter";
};

/**
 * A la carte chocolate products do not support toppings.
 * Packages always support add-ons even when packageKind is chocolate.
 */
export const isChocolateCovered = (productId: string): boolean => {
	const product = findProduct(productId);
	if (!product) return false;
	return product.category === "chocolate";
};

/**
 * Whether toppings/add-ons can be selected for this product
 */
export const supportsToppings = (productId: string): boolean => {
	const product = findProduct(productId);
	if (!product) return false;
	if (product.category === "platter") return true;
	if (product.category === "candy") return true;
	return false;
};

/**
 * Candy-fruit packages require at least one flavor
 */
export const requiresFlavor = (productId: string): boolean => {
	return Boolean(findProduct(productId)?.requiresFlavor);
};

/**
 * Calculate line total for a cart item (unitPrice × quantity)
 */
export const calculateLineTotal = (item: CartItem): number => {
	const unitPrice = item.unitPrice !== undefined ? item.unitPrice : item.price;
	const quantity = item.quantity || 1;
	return unitPrice * quantity;
};
