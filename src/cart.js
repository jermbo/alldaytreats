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
		typeof item.count === "number" &&
		typeof item.price === "number" &&
		typeof item.specialInstructions === "string" &&
		(typeof item.quantity === "undefined" || typeof item.quantity === "number")
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
			// Migrate old cart items to include quantity and unitPrice
			return parsed.map((item) => {
				if (item.quantity === undefined) {
					item.quantity = 1;
				}
				if (item.unitPrice === undefined) {
					item.unitPrice = item.price;
				}
				return item;
			});
		}

		// Invalid data, clear it
		localStorage.removeItem(STORAGE_KEY);
		return [];
	} catch {
		// Corrupted data or parse error, clear it
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch {
			// Ignore errors when clearing
		}
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
		// Handle quota exceeded or other errors silently
		// Cart continues to work in memory
		if (error.name === "QuotaExceededError") {
			// Storage full, but cart still works in memory
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
	cartItems.push({
		id: `${item.productId}-${Date.now()}-${Math.random()}`,
		productId: item.productId,
		name: item.name,
		count: item.count,
		price: item.price,
		specialInstructions: item.specialInstructions || "",
		quantity: item.quantity || 1,
		unitPrice: item.price, // Store original unit price
	});

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
 * @param {Object} updates - Updates to apply (productId, name, count, price, specialInstructions, quantity, unitPrice)
 * @returns {boolean} - True if item was updated, false if not found
 */
export const updateCartItem = (itemId, updates) => {
	const item = cartItems.find((item) => item.id === itemId);
	if (!item) {
		return false;
	}

	if (updates.productId !== undefined) {
		item.productId = updates.productId;
	}
	if (updates.name !== undefined) {
		item.name = updates.name;
	}
	if (updates.count !== undefined) {
		item.count = updates.count;
	}
	if (updates.price !== undefined) {
		item.price = updates.price;
	}
	if (updates.specialInstructions !== undefined) {
		item.specialInstructions = updates.specialInstructions;
	}
	if (updates.quantity !== undefined) {
		item.quantity = updates.quantity;
		// Update price based on quantity and unit price
		if (item.unitPrice !== undefined) {
			item.price = item.unitPrice * item.quantity;
		}
	}
	if (updates.unitPrice !== undefined) {
		item.unitPrice = updates.unitPrice;
		// Recalculate price if quantity exists
		if (item.quantity !== undefined) {
			item.price = updates.unitPrice * item.quantity;
		}
	}

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
		// If quantity exists, use it; otherwise treat as 1
		const quantity = item.quantity || 1;
		const itemPrice = item.unitPrice !== undefined ? item.unitPrice * quantity : item.price;
		return total + itemPrice;
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
