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
	return (
		item &&
		typeof item === "object" &&
		typeof item.id === "string" &&
		typeof item.productId === "string" &&
		typeof item.name === "string" &&
		typeof item.price === "number"
	);
};

/**
 * Validate cart data structure
 * @param {any} data - Data to validate
 * @returns {boolean}
 */
const isValidCartData = (data) => {
	return Array.isArray(data) && data.every(isValidCartItem);
};

/**
 * Normalize cart item to ensure required fields
 * @param {Object} item - Cart item
 * @returns {Object} - Normalized cart item
 */
const normalizeCartItem = (item) => {
	return {
		...item,
		quantity: item.quantity || 1,
		unitPrice: item.unitPrice !== undefined ? item.unitPrice : item.price / (item.quantity || 1),
		specialInstructions: item.specialInstructions || "",
	};
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
			return parsed.map(normalizeCartItem);
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
 * Save cart to localStorage
 * @returns {void}
 */
const saveCartToStorage = () => {
	if (!isLocalStorageAvailable()) {
		return;
	}

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
	} catch (error) {
		if (error.name === "QuotaExceededError") {
			console.warn(
				"Cart storage quota exceeded. Cart will work in memory only."
			);
		}
	}
};

/**
 * Add item to cart
 * @param {Object} item - Cart item with productId, name, count, price, specialInstructions
 * @returns {void}
 */
export const addToCart = (item) => {
	const normalizedItem = normalizeCartItem({
		id: `${item.productId}-${Date.now()}-${Math.random()}`,
		productId: item.productId,
		name: item.name,
		count: item.count,
		price: item.price,
		specialInstructions: item.specialInstructions || "",
		quantity: item.quantity || 1,
		unitPrice: item.price,
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

	// Update fields
	if (updates.productId !== undefined) item.productId = updates.productId;
	if (updates.name !== undefined) item.name = updates.name;
	if (updates.count !== undefined) item.count = updates.count;
	if (updates.specialInstructions !== undefined) {
		item.specialInstructions = updates.specialInstructions;
	}
	if (updates.quantity !== undefined) item.quantity = updates.quantity;
	if (updates.unitPrice !== undefined) item.unitPrice = updates.unitPrice;

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
		return total + (item.unitPrice * item.quantity);
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
