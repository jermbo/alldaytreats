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
		typeof item.specialInstructions === "string"
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
			return parsed;
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
