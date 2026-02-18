import { getCartItemCount } from "@/scripts/cart.ts";
import {
	initProductModal,
	openProductModal,
} from "@/scripts/product-modal.ts";
import { initCartUI, openCart } from "@/scripts/cart-ui.ts";
import { initCheckoutUI } from "@/scripts/checkout-ui.ts";
import { buildProductMap } from "@/scripts/utils/product.ts";
import type { Product } from "@/scripts/types/index.ts";

const initializeApp = (): void => {
	// Build product lookup map for fast access
	buildProductMap();

	const products: Product[] = window.PRODUCTS || [];

	// Initialize product modal
	const productModal =
		document.querySelector<HTMLDialogElement>(".product-modal");
	if (productModal) {
		initProductModal(productModal);
	}

	// Initialize cart UI
	const cartPanel = document.querySelector<HTMLElement>(".cart");
	if (cartPanel && productModal) {
		initCartUI(cartPanel, productModal);
	}

	// Initialize checkout UI
	const checkoutModal =
		document.querySelector<HTMLElement>(".checkout-modal");
	if (checkoutModal) {
		initCheckoutUI(checkoutModal);
	}

	// Cart badge
	const cartBadge = document.getElementById("cart-badge");
	const updateCartBadge = (): void => {
		const count = getCartItemCount();
		if (!cartBadge) return;

		if (count > 0) {
			cartBadge.textContent = count.toString();
			cartBadge.removeAttribute("aria-hidden");
			cartBadge.classList.add("header__cart-badge--animate");
			setTimeout(() => {
				cartBadge.classList.remove("header__cart-badge--animate");
			}, 400);
		} else {
			cartBadge.textContent = "";
			cartBadge.setAttribute("aria-hidden", "true");
		}
	};

	document.addEventListener("cartUpdate", updateCartBadge);
	updateCartBadge();

	// Product name → product data lookup
	const findProductByName = (name: string): Product | undefined => {
		const normalized = name.toLowerCase().trim();
		return products.find((product) => {
			const productName = product.name.toLowerCase();
			return (
				productName === normalized ||
				productName.includes(normalized) ||
				normalized.includes(productName)
			);
		});
	};

	// Menu item click handlers
	document
		.querySelectorAll(".menu__item-button")
		.forEach((button) => {
			button.addEventListener("click", () => {
				const titleEl =
					button.querySelector(".menu__item-title");
				if (!titleEl) return;

				const productName =
					titleEl.textContent?.trim() || "";
				const product = findProductByName(productName);
				if (product && productModal) {
					openProductModal(productModal, product);
				}
			});
		});

	// Cart button
	const cartBtn = document.getElementById("cart-btn");
	if (cartBtn) {
		cartBtn.addEventListener("click", () => openCart());
	}

	// Category filtering with View Transitions API
	const tabs =
		document.querySelectorAll<HTMLElement>(".menu__tab");
	const menuItems =
		document.querySelectorAll<HTMLElement>(".menu__item");

	// Assign stable view-transition-name to each menu item
	menuItems.forEach((item) => {
		const titleEl = item.querySelector(".menu__item-title");
		if (titleEl) {
			const titleText =
				titleEl.textContent?.trim().toLowerCase() || "";
			const itemId = titleText
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "");
			item.style.viewTransitionName = `item-${itemId}`;
		}
	});

	const updateFilter = (filter: string): void => {
		menuItems.forEach((item) => {
			const category = item.dataset.category;
			if (filter === "all" || category === filter) {
				item.removeAttribute("hidden");
			} else {
				item.setAttribute("hidden", "");
			}
		});
	};

	tabs.forEach((tab) => {
		tab.addEventListener("click", () => {
			const filter = tab.dataset.filter || "all";

			const applyFilter = (): void => {
				tabs.forEach((t) => {
					t.classList.remove("menu__tab--active");
					t.setAttribute("aria-selected", "false");
				});
				tab.classList.add("menu__tab--active");
				tab.setAttribute("aria-selected", "true");
				updateFilter(filter);
			};

			if (
				!(document as unknown as { startViewTransition?: unknown })
					.startViewTransition
			) {
				applyFilter();
				return;
			}

			(
				document as unknown as {
					startViewTransition: (cb: () => void) => void;
				}
			).startViewTransition(applyFilter);
		});
	});

	// Smooth scroll for hero CTA
	const viewMenuLink = document.querySelector(".hero__cta");
	if (viewMenuLink) {
		viewMenuLink.addEventListener("click", (e) => {
			e.preventDefault();
			document
				.querySelector("#menu")
				?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
		});
	}
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeApp);
} else {
	initializeApp();
}
