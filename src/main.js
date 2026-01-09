import './style.css';

// Category filtering
const tabs = document.querySelectorAll('.menu__tab');
const menuItems = document.querySelectorAll('.menu__item');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const filter = tab.dataset.filter;

    // Update active tab
    tabs.forEach((t) => {
      t.classList.remove('menu__tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('menu__tab--active');
    tab.setAttribute('aria-selected', 'true');

    // Filter menu items
    menuItems.forEach((item) => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.removeAttribute('hidden');
      } else {
        item.setAttribute('hidden', '');
      }
    });
  });
});

// Smooth scroll for "View Menu" button
const viewMenuLink = document.querySelector('.hero__cta');
if (viewMenuLink) {
  viewMenuLink.addEventListener('click', (e) => {
    e.preventDefault();
    const menuSection = document.querySelector('#menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}
