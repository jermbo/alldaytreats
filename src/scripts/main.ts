import { getCartItemCount } from "./cart.js";
import { initProductModal, openProductModal } from "./product-modal.js";
import { initCartUI, openCart } from "./cart-ui.js";
import { initCheckoutUI } from "./checkout-ui.js";

// Initialize components once DOM is ready
const initializeApp = () => {
  // Get product data from window global
  const products = (window as any).PRODUCTS || [];

  // Initialize product modal
  const productModal = document.querySelector(".product-modal") as HTMLElement;
  if (productModal) {
    initProductModal(productModal);
  }

  // Initialize cart UI
  const cartPanel = document.querySelector(".cart") as HTMLElement;
  if (cartPanel && productModal) {
    initCartUI(cartPanel, productModal);
  }

  // Initialize checkout UI
  const checkoutPanel = document.querySelector(".checkout") as HTMLElement;
  if (checkoutPanel) {
    initCheckoutUI(checkoutPanel);
  }

  // Initialize cart badge
  const cartBadge = document.getElementById("cart-badge");
  const updateCartBadge = () => {
    const count = getCartItemCount();
    if (cartBadge) {
      if (count > 0) {
        cartBadge.textContent = count.toString();
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
  const findProductByName = (name: string) => {
    const normalizedName = name.toLowerCase().trim();
    return products.find((product: any) => {
      const productName = product.name.toLowerCase();
      // Match exact or handle variations
      return (
        productName === normalizedName ||
        productName.includes(normalizedName) ||
        normalizedName.includes(productName)
      );
    });
  };

  // Add click handlers to menu item buttons
  const menuItemButtons = document.querySelectorAll(".menu__item-button");
  menuItemButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const titleElement = button.querySelector(".menu__item-title");
      if (titleElement) {
        const productName = titleElement.textContent?.trim() || "";
        const product = findProductByName(productName);
        if (product && productModal) {
          openProductModal(productModal, product);
        }
      }
    });
  });

  // Wire up cart button
  const cartBtn = document.getElementById("cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      openCart();
    });
  }

  // Category filtering with View Transitions API
  const tabs = document.querySelectorAll(".menu__tab");
  const menuItems = document.querySelectorAll(".menu__item");

  // Assign unique, stable view-transition-name to each menu item based on title
  menuItems.forEach((item) => {
    const titleElement = item.querySelector(".menu__item-title");
    if (titleElement) {
      const titleText = titleElement.textContent?.trim().toLowerCase() || "";
      const itemId = titleText.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      (item as HTMLElement).style.viewTransitionName = `item-${itemId}`;
    }
  });

  const updateFilter = (filter: string) => {
    menuItems.forEach((item) => {
      const itemElement = item as HTMLElement;
      const category = itemElement.dataset.category;
      if (filter === "all" || category === filter) {
        itemElement.removeAttribute("hidden");
      } else {
        itemElement.setAttribute("hidden", "");
      }
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = (tab as HTMLElement).dataset.filter || "all";

      // Check if View Transitions API is supported
      if (!(document as any).startViewTransition) {
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
      (document as any).startViewTransition(() => {
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
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
