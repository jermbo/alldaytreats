const STORAGE_KEY = "alldaytreats-cart";
let cartItems = [];

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
const isLocalStorageAvailable = () => {
	try {
		const test = "__localStorage_test__";
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	} catch {
		return false;
	}
};

/**
 * Validate cart item structure
 * @param {any} item - Item to validate
 * @returns {boolean}
 */
const isValidCartItem = (item) => {
	const basicValidation =
		item &&
		typeof item === "object" &&
		typeof item.id === "string" &&
		typeof item.productId === "string" &&
		typeof item.name === "string" &&
		typeof item.price === "number";

	if (!basicValidation) return false;

	// Validate toppings structure if present (support both old and new formats)
	if (item.toppings !== undefined) {
		// New format: array
		if (Array.isArray(item.toppings)) {
			return true;
		}
		// Old format: object with included/premium arrays
		if (typeof item.toppings !== "object" || item.toppings === null) {
			return false;
		}
		// Validate toppings.included and toppings.premium are arrays if present
		if (
			item.toppings.included !== undefined &&
			!Array.isArray(item.toppings.included)
		) {
			return false;
		}
		if (
			item.toppings.premium !== undefined &&
			!Array.isArray(item.toppings.premium)
		) {
			return false;
		}
	}

	return true;
};

/**
 * Validate cart data structure
 * Supports both old format (array) and new format (object with items and orderId)
 * @param {any} data - Data to validate
 * @returns {boolean}
 */
const isValidCartData = (data) => {
	// New format: object with items array and optional orderId
	if (data && typeof data === "object" && !Array.isArray(data)) {
		if (data.items && Array.isArray(data.items)) {
			return data.items.every(isValidCartItem);
		}
		return false;
	}
	// Old format: array of items (backward compatibility)
	if (Array.isArray(data)) {
		return data.every(isValidCartItem);
	}
	return false;
};

/**
 * Normalize cart item to ensure required fields
 * @param {Object} item - Cart item
 * @returns {Object} - Normalized cart item
 */
const normalizeCartItem = (item) => {
	const normalized = {
		...item,
		quantity: item.quantity || 1,
		unitPrice:
			item.unitPrice !== undefined
				? item.unitPrice
				: item.price / (item.quantity || 1),
		specialInstructions: item.specialInstructions || "",
	};

	// Normalize toppings structure if present
	if (item.toppings) {
		// Convert old format {included: [], premium: []} to new format []
		if (Array.isArray(item.toppings)) {
			normalized.toppings = [...item.toppings];
		} else {
			// Merge old format into single array
			normalized.toppings = [
				...(item.toppings.included || []),
				...(item.toppings.premium || []),
			];
		}
	}

	return normalized;
};

/**
 * Load cart from localStorage
 * @returns {Array}
 */
const loadCartFromStorage = () => {
	if (!isLocalStorageAvailable()) {
		return [];
	}

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) {
			return [];
		}

		const parsed = JSON.parse(stored);
		if (isValidCartData(parsed)) {
			// Handle new format (object with items) or old format (array)
			const items = Array.isArray(parsed) ? parsed : parsed.items;
			const normalized = items.map(normalizeCartItem);
			// Safety check: remove toppings for chocolate covered products when loading
			return normalized.map((item) => {
				const product = window.PRODUCTS?.find((p) => p.id === item.productId);
				if (product?.category === "chocolate" && item.toppings) {
					item.toppings = undefined;
				}
				return item;
			});
		}

		// Invalid data, clear it
		localStorage.removeItem(STORAGE_KEY);
		return [];
	} catch {
		// Corrupted data or parse error, clear it
		localStorage.removeItem(STORAGE_KEY);
		return [];
	}
};

/**
 * Get order ID from cart storage
 * @returns {string} Order ID or empty string
 */
export const getOrderIdFromCart = () => {
	if (!isLocalStorageAvailable()) {
		return "";
	}

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) {
			return "";
		}

		const parsed = JSON.parse(stored);
		// New format: object with orderId
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
			return parsed.orderId || "";
		}
		// Old format: array (no orderId)
		return "";
	} catch {
		return "";
	}
};

/**
 * Save cart to localStorage
 * @param {string|null} orderId - Optional order ID to store with cart. null = preserve existing, empty string = clear
 * @returns {void}
 */
const saveCartToStorage = (orderId = null) => {
	if (!isLocalStorageAvailable()) {
		return;
	}

	try {
		// If cart is empty, always clear orderId
		if (cartItems.length === 0) {
			const cartData = {
				items: [],
				orderId: "",
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(cartData));
			return;
		}

		// Get existing orderId if not provided
		let orderIdToSave = orderId;
		if (orderIdToSave === null) {
			try {
				const stored = localStorage.getItem(STORAGE_KEY);
				if (stored) {
					const parsed = JSON.parse(stored);
					if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
						orderIdToSave = parsed.orderId || "";
					}
				}
			} catch {
				// Ignore errors when reading existing orderId
			}
		}

		// Save as object with items and orderId
		const cartData = {
			items: cartItems,
			orderId: orderIdToSave || "",
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(cartData));
	} catch (error) {
		if (error.name === "QuotaExceededError") {
			console.warn(
				"Cart storage quota exceeded. Cart will work in memory only.",
			);
		}
	}
};

/**
 * Save order ID to cart storage
 * @param {string} orderId - Order ID to save
 * @returns {void}
 */
export const saveOrderIdToCart = (orderId) => {
	saveCartToStorage(orderId || "");
};

/**
 * Add item to cart
 * @param {Object} item - Cart item with productId, name, count, price, specialInstructions, toppings
 * @returns {void}
 */
export const addToCart = (item) => {
	// Safety check: remove toppings for chocolate covered products
	const product = window.PRODUCTS?.find((p) => p.id === item.productId);
	const isChocolateCovered = product?.category === "chocolate";
	const safeToppings = isChocolateCovered
		? undefined
		: item.toppings || undefined;

	// Generate unique ID using crypto.randomUUID() if available (first 8 chars)
	// Fallback to timestamp + random for older browsers
	const generateCartItemId = () => {
		// Try crypto.randomUUID first (modern browsers with HTTPS)
		if (
			typeof crypto !== "undefined" &&
			typeof crypto.randomUUID === "function"
		) {
			return crypto.randomUUID().substring(0, 8);
		}

		// Fallback: use crypto.getRandomValues (broader support)
		if (
			typeof crypto !== "undefined" &&
			typeof crypto.getRandomValues === "function"
		) {
			const array = new Uint8Array(4);
			crypto.getRandomValues(array);
			return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
		}

		// Final fallback: timestamp + random
		return (
			Date.now().toString(36).substring(-4) +
			Math.random().toString(36).substring(2, 6)
		);
	};

	// Generate ID with SKU prefix: [sku]-[id]
	const uniqueId = generateCartItemId();
	const itemId = item.sku 
		? `${item.sku}-${uniqueId}`
		: uniqueId;

	const normalizedItem = normalizeCartItem({
		id: itemId,
		productId: item.productId,
		name: item.name,
		count: item.count,
		price: item.price,
		specialInstructions: item.specialInstructions || "",
		quantity: item.quantity || 1,
		unitPrice: item.price,
		toppings: safeToppings,
		sku: item.sku || "",
	});

	// Calculate total price
	normalizedItem.price = normalizedItem.unitPrice * normalizedItem.quantity;

	cartItems.push(normalizedItem);
	saveCartToStorage();
	dispatchCartUpdate();
};

/**
 * Get total number of items in cart
 * @returns {number}
 */
export const getCartItemCount = () => {
	return cartItems.length;
};

/**
 * Get all cart items
 * @returns {Array}
 */
export const getCartItems = () => {
	return [...cartItems];
};

/**
 * Remove item from cart by ID
 * @param {string} itemId - Cart item ID
 * @returns {boolean} - True if item was removed, false if not found
 */
export const removeFromCart = (itemId) => {
	const index = cartItems.findIndex((item) => item.id === itemId);
	if (index === -1) {
		return false;
	}

	cartItems.splice(index, 1);
	saveCartToStorage();
	dispatchCartUpdate();
	return true;
};

/**
 * Clear all items from cart
 * @returns {void}
 */
export const clearCart = () => {
	cartItems = [];
	saveCartToStorage();
	dispatchCartUpdate();
};

/**
 * Update cart item by ID
 * @param {string} itemId - Cart item ID
 * @param {Object} updates - Updates to apply
 * @returns {boolean} - True if item was updated, false if not found
 */
export const updateCartItem = (itemId, updates) => {
	const item = cartItems.find((item) => item.id === itemId);
	if (!item) {
		return false;
	}

	// Safety check: remove toppings for chocolate covered products
	const productId =
		updates.productId !== undefined ? updates.productId : item.productId;
	const product = window.PRODUCTS?.find((p) => p.id === productId);
	const isChocolateCovered = product?.category === "chocolate";

	// If updating toppings and product is chocolate covered, remove toppings
	if (updates.toppings !== undefined && isChocolateCovered) {
		updates.toppings = undefined;
	}

	// Update fields
	if (updates.productId !== undefined) item.productId = updates.productId;
	if (updates.name !== undefined) item.name = updates.name;
	if (updates.count !== undefined) item.count = updates.count;
	if (updates.specialInstructions !== undefined) {
		item.specialInstructions = updates.specialInstructions;
	}
	if (updates.quantity !== undefined) item.quantity = updates.quantity;
	if (updates.unitPrice !== undefined) item.unitPrice = updates.unitPrice;
	if (updates.toppings !== undefined) item.toppings = updates.toppings;
	if (updates.sku !== undefined) item.sku = updates.sku;

	// Safety check: ensure toppings are removed if product is chocolate covered
	if (isChocolateCovered) {
		item.toppings = undefined;
	}

	// Ensure normalized structure
	const normalized = normalizeCartItem(item);
	Object.assign(item, normalized);

	// Always recalculate price from unitPrice * quantity
	item.price = item.unitPrice * item.quantity;

	saveCartToStorage();
	dispatchCartUpdate();
	return true;
};

/**
 * Get cart item by ID
 * @param {string} itemId - Cart item ID
 * @returns {Object|null} - Cart item or null if not found
 */
export const getCartItemById = (itemId) => {
	const item = cartItems.find((item) => item.id === itemId);
	return item ? { ...item } : null;
};

/**
 * Calculate cart subtotal
 * @returns {number}
 */
export const getCartSubtotal = () => {
	return cartItems.reduce((total, item) => {
		return total + item.unitPrice * item.quantity;
	}, 0);
};

/**
 * Dispatch cart update event
 * @returns {void}
 */
const dispatchCartUpdate = () => {
	const event = new CustomEvent("cartUpdate", {
		detail: { itemCount: cartItems.length },
	});
	document.dispatchEvent(event);
};

// Initialize cart from localStorage on module load
cartItems = loadCartFromStorage();
