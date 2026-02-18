import type { CartItem, ToppingsData } from "@/scripts/types/index.ts";
import { generateId } from "@/scripts/utils/generate-id.ts";
import { isChocolateCovered } from "@/scripts/utils/product.ts";
import { normalizeToppingIds } from "@/scripts/utils/toppings.ts";

const STORAGE_KEY = "alldaytreats-cart";
let cartItems: CartItem[] = [];

// --- Storage helpers ---

const isLocalStorageAvailable = (): boolean => {
	try {
		const test = "__localStorage_test__";
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	} catch {
		return false;
	}
};

const isValidCartItem = (item: unknown): item is CartItem => {
	if (!item || typeof item !== "object") return false;
	const obj = item as Record<string, unknown>;

	const hasBasicFields =
		typeof obj.id === "string" &&
		typeof obj.productId === "string" &&
		typeof obj.name === "string" &&
		typeof obj.price === "number";

	if (!hasBasicFields) return false;

	if (obj.toppings !== undefined) {
		if (Array.isArray(obj.toppings)) return true;
		if (typeof obj.toppings !== "object" || obj.toppings === null)
			return false;
		const t = obj.toppings as Record<string, unknown>;
		if (t.included !== undefined && !Array.isArray(t.included))
			return false;
		if (t.premium !== undefined && !Array.isArray(t.premium)) return false;
	}

	return true;
};

interface CartData {
	items: CartItem[];
	orderId: string;
}

const isValidCartData = (data: unknown): boolean => {
	if (data && typeof data === "object" && !Array.isArray(data)) {
		const obj = data as Record<string, unknown>;
		if (obj.items && Array.isArray(obj.items)) {
			return (obj.items as unknown[]).every(isValidCartItem);
		}
		return false;
	}
	if (Array.isArray(data)) {
		return data.every(isValidCartItem);
	}
	return false;
};

const normalizeCartItem = (item: CartItem): CartItem => {
	const normalized: CartItem = {
		...item,
		quantity: item.quantity || 1,
		unitPrice:
			item.unitPrice !== undefined
				? item.unitPrice
				: item.price / (item.quantity || 1),
		specialInstructions: item.specialInstructions || "",
	};

	if (item.toppings) {
		normalized.toppings = normalizeToppingIds(
			item.toppings as ToppingsData,
		);
	}

	return normalized;
};

const loadCartFromStorage = (): CartItem[] => {
	if (!isLocalStorageAvailable()) return [];

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return [];

		const parsed = JSON.parse(stored);
		if (!isValidCartData(parsed)) {
			localStorage.removeItem(STORAGE_KEY);
			return [];
		}

		const items: unknown[] = Array.isArray(parsed)
			? parsed
			: (parsed as CartData).items;

		return (items as CartItem[]).map(normalizeCartItem).map((item) => {
			if (isChocolateCovered(item.productId) && item.toppings) {
				return { ...item, toppings: undefined };
			}
			return item;
		});
	} catch {
		localStorage.removeItem(STORAGE_KEY);
		return [];
	}
};

const saveCartToStorage = (orderId: string | null = null): void => {
	if (!isLocalStorageAvailable()) return;

	try {
		if (cartItems.length === 0) {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({ items: [], orderId: "" }),
			);
			return;
		}

		let orderIdToSave = orderId;
		if (orderIdToSave === null) {
			try {
				const stored = localStorage.getItem(STORAGE_KEY);
				if (stored) {
					const parsed = JSON.parse(stored);
					if (
						parsed &&
						typeof parsed === "object" &&
						!Array.isArray(parsed)
					) {
						orderIdToSave =
							(parsed as CartData).orderId || "";
					}
				}
			} catch {
				// Ignore errors reading existing orderId
			}
		}

		const cartData: CartData = {
			items: cartItems,
			orderId: orderIdToSave || "",
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(cartData));
	} catch (error: unknown) {
		if (
			error instanceof DOMException &&
			error.name === "QuotaExceededError"
		) {
			console.warn(
				"Cart storage quota exceeded. Cart will work in memory only.",
			);
		}
	}
};

const dispatchCartUpdate = (): void => {
	document.dispatchEvent(
		new CustomEvent("cartUpdate", {
			detail: { itemCount: cartItems.length },
		}),
	);
};

// --- Public API ---

export const getOrderIdFromCart = (): string => {
	if (!isLocalStorageAvailable()) return "";

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return "";

		const parsed = JSON.parse(stored);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
			return (parsed as CartData).orderId || "";
		}
		return "";
	} catch {
		return "";
	}
};

export const saveOrderIdToCart = (orderId: string): void => {
	saveCartToStorage(orderId || "");
};

export const addToCart = (item: {
	productId: string;
	name: string;
	count: number;
	price: number;
	specialInstructions?: string;
	quantity?: number;
	toppings?: ToppingsData;
	sku?: string;
}): void => {
	const safeToppings = isChocolateCovered(item.productId)
		? undefined
		: item.toppings || undefined;

	const uniqueId = generateId();
	const itemId = item.sku ? `${item.sku}-${uniqueId}` : uniqueId;

	const normalizedItem = normalizeCartItem({
		id: itemId,
		productId: item.productId,
		name: item.name,
		count: item.count,
		price: item.price,
		specialInstructions: item.specialInstructions || "",
		quantity: item.quantity || 1,
		unitPrice: item.price,
		toppings: safeToppings
			? normalizeToppingIds(safeToppings)
			: undefined,
		sku: item.sku || "",
	});

	normalizedItem.price = normalizedItem.unitPrice * normalizedItem.quantity;

	cartItems.push(normalizedItem);
	saveCartToStorage();
	dispatchCartUpdate();
};

export const getCartItemCount = (): number => cartItems.length;

export const getCartItems = (): CartItem[] => [...cartItems];

export const removeFromCart = (itemId: string): boolean => {
	const index = cartItems.findIndex((item) => item.id === itemId);
	if (index === -1) return false;

	cartItems.splice(index, 1);
	saveCartToStorage();
	dispatchCartUpdate();
	return true;
};

export const clearCart = (): void => {
	cartItems = [];
	saveCartToStorage();
	dispatchCartUpdate();
};

export const updateCartItem = (
	itemId: string,
	updates: Partial<CartItem>,
): boolean => {
	const item = cartItems.find((i) => i.id === itemId);
	if (!item) return false;

	const productId = updates.productId ?? item.productId;
	const isChocolate = isChocolateCovered(productId);

	// Sanitize toppings for chocolate products
	if (updates.toppings !== undefined && isChocolate) {
		updates = { ...updates, toppings: undefined };
	}

	if (updates.productId !== undefined) item.productId = updates.productId;
	if (updates.name !== undefined) item.name = updates.name;
	if (updates.count !== undefined) item.count = updates.count;
	if (updates.specialInstructions !== undefined)
		item.specialInstructions = updates.specialInstructions;
	if (updates.quantity !== undefined) item.quantity = updates.quantity;
	if (updates.unitPrice !== undefined) item.unitPrice = updates.unitPrice;
	if (updates.toppings !== undefined) item.toppings = updates.toppings;
	if (updates.sku !== undefined) item.sku = updates.sku;

	if (isChocolate) item.toppings = undefined;

	const normalized = normalizeCartItem(item);
	Object.assign(item, normalized);
	item.price = item.unitPrice * item.quantity;

	saveCartToStorage();
	dispatchCartUpdate();
	return true;
};

export const getCartItemById = (itemId: string): CartItem | null => {
	const item = cartItems.find((i) => i.id === itemId);
	return item ? { ...item } : null;
};

export const getCartSubtotal = (): number => {
	return cartItems.reduce(
		(total, item) => total + item.unitPrice * item.quantity,
		0,
	);
};

// Initialize cart from localStorage on module load
cartItems = loadCartFromStorage();
