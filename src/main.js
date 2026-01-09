import "./style.css";

// Category filtering with View Transitions API
const tabs = document.querySelectorAll(".menu__tab");
const menuItems = document.querySelectorAll(".menu__item");

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
