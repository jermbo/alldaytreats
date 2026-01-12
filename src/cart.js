let cartItems = [];

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
