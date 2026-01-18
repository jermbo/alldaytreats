import { products } from "./products.js";
import { getCartItemCount } from "./cart.js";
import { initProductModal, openProductModal } from "./product-modal.js";
import { initCartUI, openCart } from "./cart-ui.js";
import { initCheckoutUI } from "./checkout-ui.js";

// Initialize product modal from template
const productModalTemplate = document.getElementById("product-modal-template");
let productModal = null;

if (productModalTemplate) {
	// Clone the template and append to body
	const templateContent = productModalTemplate.content.cloneNode(true);
	productModal = templateContent.querySelector(".product-modal");
	document.body.appendChild(productModal);

	if (productModal) {
		initProductModal(productModal);
	}
}

// Initialize cart badge
const cartBadge = document.getElementById("cart-badge");
const updateCartBadge = () => {
	const count = getCartItemCount();
	if (cartBadge) {
		if (count > 0) {
			cartBadge.textContent = count;
			cartBadge.removeAttribute("aria-hidden");
			cartBadge.classList.add("header__cart-badge--animate");
			setTimeout(() => {
				cartBadge.classList.remove("header__cart-badge--animate");
			}, 400);
		} else {
			cartBadge.setAttribute("aria-hidden", "true");
		}
	}
};

// Listen for cart updates
document.addEventListener("cartUpdate", updateCartBadge);

// Initialize cart badge on load
updateCartBadge();

// Helper function to find product by name (case-insensitive, flexible matching)
const findProductByName = (name) => {
	const normalizedName = name.toLowerCase().trim();
	return products.find((product) => {
		const productName = product.name.toLowerCase();
		// Match exact or handle variations like "Cake Pops / Cakesicles"
		return (
			productName === normalizedName ||
			productName.includes(normalizedName) ||
			normalizedName.includes(productName)
		);
	});
};

// Add click handlers to menu items
const menuItems = document.querySelectorAll(".menu__item");
menuItems.forEach((item) => {
	item.style.cursor = "pointer";
	item.addEventListener("click", () => {
		const titleElement = item.querySelector(".menu__item-title");
		if (titleElement) {
			const productName = titleElement.textContent.trim();
			const product = findProductByName(productName);
			if (product && productModal) {
				openProductModal(productModal, product);
			}
		}
	});
});

// Export productModal for use in other modules if needed
export { productModal };

// Initialize cart UI
const cartTemplate = document.getElementById("cart-template");
let cartPanel = null;

if (cartTemplate) {
	const templateContent = cartTemplate.content.cloneNode(true);
	cartPanel = templateContent.querySelector(".cart");
	document.body.appendChild(cartPanel);

	if (cartPanel && productModal) {
		initCartUI(cartPanel, productModal);
	}
}

// Wire up cart button
const cartBtn = document.getElementById("cart-btn");
if (cartBtn) {
	cartBtn.addEventListener("click", () => {
		openCart();
	});
}

// Initialize checkout UI
const checkoutTemplate = document.getElementById("checkout-template");
let checkoutPanel = null;

if (checkoutTemplate) {
	const templateContent = checkoutTemplate.content.cloneNode(true);
	checkoutPanel = templateContent.querySelector(".checkout");
	document.body.appendChild(checkoutPanel);

	if (checkoutPanel) {
		initCheckoutUI(checkoutPanel);
	}
}

// Category filtering with View Transitions API
const tabs = document.querySelectorAll(".menu__tab");

// Assign unique, stable view-transition-name to each menu item based on title
menuItems.forEach((item) => {
	const titleElement = item.querySelector(".menu__item-title");
	if (titleElement) {
		const titleText = titleElement.textContent.trim().toLowerCase();
		const itemId = titleText.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
		item.style.viewTransitionName = `item-${itemId}`;
	}
});

const updateFilter = (filter) => {
	menuItems.forEach((item) => {
		if (filter === "all" || item.dataset.category === filter) {
			item.removeAttribute("hidden");
		} else {
			item.setAttribute("hidden", "");
		}
	});
};

tabs.forEach((tab) => {
	tab.addEventListener("click", () => {
		const filter = tab.dataset.filter;

		// Check if View Transitions API is supported
		if (!document.startViewTransition) {
			// Fallback for browsers without View Transitions support
			tabs.forEach((t) => {
				t.classList.remove("menu__tab--active");
				t.setAttribute("aria-selected", "false");
			});
			tab.classList.add("menu__tab--active");
			tab.setAttribute("aria-selected", "true");
			updateFilter(filter);
			return;
		}

		// Use View Transitions API for smooth animations
		document.startViewTransition(() => {
			// Update active tab
			tabs.forEach((t) => {
				t.classList.remove("menu__tab--active");
				t.setAttribute("aria-selected", "false");
			});
			tab.classList.add("menu__tab--active");
			tab.setAttribute("aria-selected", "true");

			// Filter menu items
			updateFilter(filter);
		});
	});
});

// Smooth scroll for "View Menu" button
const viewMenuLink = document.querySelector(".hero__cta");
if (viewMenuLink) {
	viewMenuLink.addEventListener("click", (e) => {
		e.preventDefault();
		const menuSection = document.querySelector("#menu");
		if (menuSection) {
			menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	});
}
