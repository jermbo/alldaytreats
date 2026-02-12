# Phase 4: Static Components - User Stories

**Phase:** 4 of 8
**Status:** ✅ Complete
**Dependencies:** Phase 3 Complete
**Last Updated:** 2026-01-18

## Phase Overview

Build all static (non-interactive) components. These components render server-side and produce static HTML without client-side JavaScript.

**Phase Goal:** All static components built with visual parity to original site.

---

## US-006: Build Header Component

**Priority:** P0 (Critical)
**Estimate:** 1 hour
**Status:** ✅ Complete
**Depends On:** US-005

### Story

**As a** visitor
**I want** to see the site header with branding and cart button
**So that** I can navigate the site and access my cart

### Acceptance Criteria

- [x] `src/components/Header.astro` file created
- [x] Logo/branding displayed
- [x] Contact links rendered:
  - [x] Phone number (clickable tel: link)
  - [x] Email (clickable mailto: link)
  - [x] Instagram handle (link to Instagram)
- [x] Cart button rendered with badge placeholder
- [x] Props interface defined for cart count
- [x] Proper semantic HTML (`<header>`, `<nav>`)
- [x] Matches original header visually
- [x] Responsive behavior maintained

### Implementation Notes

```astro
---
interface Props {
  cartCount?: number;
}

const { cartCount = 0 } = Astro.props;
---

<header class="header">
  <div class="header__container">
    <div class="header__branding">
      <h1 class="header__title">All Day Treats</h1>
    </div>
    <nav class="header__nav">
      <a href="tel:555-555-5555" class="header__contact">📞 (555) 555-5555</a>
      <a href="mailto:alldaytreat@gmail.com" class="header__contact" target="_blank">✉️ Email</a>
      <a href="https://instagram.com/alldaytreats" class="header__contact" target="_blank">📷 Instagram</a>
      <button class="header__cart-btn" id="cart-button">
        🛒 Cart
        {cartCount > 0 && <span class="cart-badge">{cartCount}</span>}
      </button>
    </nav>
  </div>
</header>
```

### Testing Steps

1. Create `Header.astro` component
2. Add to `index.astro` page
3. Run `npm run dev`
4. Verify header renders
5. Check all links work
6. Test phone link opens dialer
7. Test email link opens mail client
8. Test Instagram link opens in new tab
9. Visual comparison with original
10. Test responsive behavior

### Dependencies

- US-005 (Styles migrated)
- Original header HTML structure

### Blocks

None

---

## US-007: Build Hero Component

**Priority:** P0 (Critical)
**Estimate:** 1 hour
**Status:** ✅ Complete
**Depends On:** US-005

### Story

**As a** visitor
**I want** to see an engaging hero section
**So that** I understand what All Day Treats offers

### Acceptance Criteria

- [x] `src/components/Hero.astro` file created
- [x] Logo image displayed
- [x] Tagline/headline rendered
- [x] "View Menu" CTA button included
- [x] Smooth scroll to menu on button click
- [x] Proper semantic HTML (`<section>`)
- [x] Matches original hero visually
- [x] Responsive behavior maintained
- [x] Background images/styling correct

### Implementation Notes

```astro
---
// No props needed for static content
---

<section class="hero" id="hero">
  <div class="hero__container">
    <img src="/images/logo.jpeg" alt="All Day Treats Logo" class="hero__logo" />
    <h2 class="hero__tagline">Custom Chocolate-Covered Treats</h2>
    <p class="hero__description">Made fresh to order with love</p>
    <a href="#menu" class="hero__cta">View Menu</a>
  </div>
</section>
```

### Testing Steps

1. Create `Hero.astro` component
2. Add logo image to `public/images/`
3. Add to `index.astro` page
4. Run `npm run dev`
5. Verify hero renders correctly
6. Test "View Menu" button scrolls to menu
7. Visual comparison with original
8. Test responsive behavior
9. Check background styles

### Dependencies

- US-005 (Styles migrated)
- Logo image copied to `public/images/`

### Blocks

None

---

## US-008: Build Footer Component

**Priority:** P1 (High)
**Estimate:** 1 hour
**Status:** ✅ Complete
**Depends On:** US-005

### Story

**As a** visitor
**I want** to see contact information and order policies
**So that** I know how to reach the business and understand ordering

### Acceptance Criteria

- [x] `src/components/Footer.astro` file created
- [x] Contact information displayed
- [x] Order policies shown
- [x] Social media links included
- [x] Copyright notice rendered
- [x] Proper semantic HTML (`<footer>`)
- [x] Matches original footer visually
- [x] Responsive behavior maintained

### Implementation Notes

```astro
---
// No props needed for static content
---

<footer class="footer">
  <div class="footer__container">
    <div class="footer__section">
      <h3 class="footer__heading">Contact Us</h3>
      <p><a href="tel:555-555-5555">📞 (555) 555-5555</a></p>
      <p><a href="mailto:alldaytreat@gmail.com">✉️ alldaytreat@gmail.com</a></p>
      <p><a href="https://instagram.com/alldaytreats" target="_blank">📷 @alldaytreats</a></p>
    </div>
    <div class="footer__section">
      <h3 class="footer__heading">Order Information</h3>
      <p>📦 Pickup in the Bronx</p>
      <p>⏰ 3-day advance notice required</p>
      <p>💳 Zelle accepted</p>
    </div>
    <div class="footer__copyright">
      <p>&copy; 2026 All Day Treats. All rights reserved.</p>
    </div>
  </div>
</footer>
```

### Testing Steps

1. Create `Footer.astro` component
2. Add to `index.astro` page
3. Run `npm run dev`
4. Verify footer renders
5. Check all links work
6. Visual comparison with original
7. Test responsive behavior

### Dependencies

- US-005 (Styles migrated)

### Blocks

None

---

## US-009: Build ProductCard Component

**Priority:** P0 (Critical)
**Estimate:** 1.5 hours
**Status:** ✅ Complete
**Depends On:** US-003, US-005

### Story

**As a** developer
**I want** a reusable product card component
**So that** products display consistently from content collection data

### Acceptance Criteria

- [x] `src/components/ProductCard.astro` file created
- [x] Props interface defined for product data
- [x] Product image renders with Astro Image
- [x] Product name displayed
- [x] Product description rendered
- [x] "From $X" price displayed
- [x] Product category available as data attribute
- [x] Clickable to open modal (data attributes for JS)
- [x] Proper semantic HTML (`<article>`)
- [x] Matches original product card visually
- [x] Responsive behavior maintained
- [x] Images lazy load

### Implementation Notes

```astro
---
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';

interface Props {
  product: CollectionEntry<'products'>;
}

const { product } = Astro.props;
const { name, image, priceFrom, category, id } = product.data;
const description = product.body;
---

<article
  class="menu__item"
  data-category={category}
  data-product-id={id}
>
  <div class="product-card">
    <Image
      src={image}
      alt={name}
      class="product-card__image"
      width={400}
      height={400}
    />
    <h3 class="product-card__title">{name}</h3>
    <p class="product-card__description">{description}</p>
    <p class="product-card__price">From ${priceFrom}</p>
    <button
      class="product-card__btn"
      data-product-id={id}
    >
      View Details
    </button>
  </div>
</article>
```

### Testing Steps

1. Create `ProductCard.astro` component
2. Test with single product in `index.astro`
3. Run `npm run dev`
4. Verify product renders
5. Check image loads and optimizes
6. Verify all product data displays
7. Visual comparison with original
8. Test responsive behavior
9. Check lazy loading works

### Dependencies

- US-003 (Products migrated)
- US-005 (Styles migrated)

### Blocks

None

---

## US-010: Build Menu Component

**Priority:** P0 (Critical)
**Estimate:** 2 hours
**Status:** ✅ Complete
**Depends On:** US-009

### Story

**As a** visitor
**I want** to browse products by category
**So that** I can find treats that interest me

### Acceptance Criteria

- [x] `src/components/Menu.astro` file created
- [x] Category filter tabs rendered:
  - [x] All Products
  - [x] Candy
  - [x] Chocolate
  - [x] Platters
- [x] Product grid displays all ProductCard components
- [x] Products load from content collection
- [x] Products sorted by `order` field
- [x] Props interface defined if needed
- [x] Proper semantic HTML (`<section>`)
- [x] Matches original menu section visually
- [x] Responsive grid behavior maintained
- [x] Data attributes for JS filtering

### Implementation Notes

```astro
---
import { getCollection } from 'astro:content';
import ProductCard from './ProductCard.astro';

const products = await getCollection('products');
const sortedProducts = products.sort((a, b) => a.data.order - b.data.order);
---

<section class="menu" id="menu">
  <div class="menu__container">
    <h2 class="menu__title">Our Menu</h2>

    <div class="menu__filters">
      <button class="menu__filter menu__filter--active" data-filter="all">
        All Products
      </button>
      <button class="menu__filter" data-filter="candy">
        Candy
      </button>
      <button class="menu__filter" data-filter="chocolate">
        Chocolate
      </button>
      <button class="menu__filter" data-filter="platter">
        Platters
      </button>
    </div>

    <div class="menu__grid">
      {sortedProducts.map(product => (
        <ProductCard product={product} />
      ))}
    </div>
  </div>
</section>
```

### Testing Steps

1. Create `Menu.astro` component
2. Import and use `ProductCard` component
3. Add to `index.astro` page
4. Run `npm run dev`
5. Verify all 9 products render
6. Check products in correct order
7. Verify filter tabs render
8. Visual comparison with original
9. Test responsive grid behavior
10. Check data attributes present for JS

### Dependencies

- US-009 (ProductCard component)
- US-003 (Products migrated)

### Blocks

None

---

## Phase 4 Completion Criteria

Phase 4 is complete when:

- [x] All user stories marked complete (US-006 to US-010)
- [x] All static components render correctly
- [x] Visual parity with original site confirmed
- [x] All products display in menu
- [x] Responsive behavior maintained
- [x] No console errors
- [x] Ready to begin Phase 5 (Interactive Components)

## Phase 4 Testing Checklist

- [x] Header component renders with all links
- [x] Hero component displays correctly
- [x] Footer component shows all info
- [x] ProductCard displays product data
- [x] Menu shows all 9 products
- [x] Products sorted correctly
- [x] All images load and optimize
- [x] Side-by-side comparison passes
- [x] Mobile responsive layout works
- [x] No TypeScript errors
- [x] No console errors

---

## Version History

| Date       | Version | Changes                      |
| ---------- | ------- | ---------------------------- |
| 2026-01-18 | 1.0     | Initial Phase 4 user stories |

---

[← Back to Phase 3](Phase_3_Layout.md) | [Back to Index](User_Stories_Index.md) | [Next: Phase 5 →](Phase_5_Interactive.md)
