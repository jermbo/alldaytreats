# Phase 5: Interactive Components - User Stories

**Phase:** 5 of 8
**Status:** ✅ Complete
**Dependencies:** Phase 4 Complete
**Last Updated:** 2026-01-18

## Phase Overview

Build interactive overlay components (Cart, Product Modal, Checkout). These components provide the HTML structure that will be hydrated by JavaScript in Phase 6.

**Phase Goal:** All overlay components render with correct structure for JavaScript hydration.

---

## US-011: Build CartPanel Component

**Priority:** P0 (Critical)
**Estimate:** 2 hours
**Status:** ✅ Complete
**Depends On:** US-005

### Story

**As a** developer
**I want** a cart panel component with proper HTML structure
**So that** JavaScript can hydrate it for interactivity

### Acceptance Criteria

- [x] `src/components/CartPanel.astro` file created
- [x] Cart overlay structure rendered
- [x] Cart header with title and close button
- [x] Empty cart state structure
- [x] Cart items container with proper IDs
- [x] Cart item template structure (for JS cloning)
- [x] Cart summary section (subtotal, total)
- [x] Clear cart button
- [x] Checkout button
- [x] All elements have correct IDs and classes for JS targeting
- [x] Proper semantic HTML
- [x] Matches original cart panel structure exactly
- [x] Hidden by default (CSS handles visibility)

### Implementation Notes

```astro
---
// No props needed - JS manages state
---

<div class="cart" id="cart-panel">
  <div class="cart__overlay" id="cart-overlay"></div>

  <div class="cart__panel">
    <div class="cart__header">
      <h2 class="cart__title">Your Cart</h2>
      <button class="cart__close" id="cart-close">&times;</button>
    </div>

    <div class="cart__empty" id="cart-empty">
      <p>Your cart is empty</p>
      <p class="cart__empty-subtitle">Add some treats to get started!</p>
    </div>

    <div class="cart__content" id="cart-content">
      <div class="cart__items" id="cart-items">
        <!-- Cart items rendered by JS -->
      </div>

      <div class="cart__summary">
        <div class="cart__summary-row">
          <span>Subtotal:</span>
          <span class="cart__subtotal" id="cart-subtotal">$0.00</span>
        </div>
        <div class="cart__summary-row cart__summary-row--total">
          <span>Total:</span>
          <span class="cart__total" id="cart-total">$0.00</span>
        </div>
      </div>

      <div class="cart__actions">
        <button class="cart__clear-btn" id="cart-clear">Clear Cart</button>
        <button class="cart__checkout-btn" id="cart-checkout">Proceed to Checkout</button>
      </div>
    </div>
  </div>
</div>

<!-- Cart item template (for JS) -->
<template id="cart-item-template">
  <div class="cart-item" data-product-id="">
    <div class="cart-item__info">
      <h3 class="cart-item__name"></h3>
      <p class="cart-item__details"></p>
    </div>
    <div class="cart-item__controls">
      <button class="cart-item__decrease">-</button>
      <span class="cart-item__quantity">1</span>
      <button class="cart-item__increase">+</button>
    </div>
    <div class="cart-item__price"></div>
    <button class="cart-item__remove">&times;</button>
  </div>
</template>
```

### Element ID Reference

Critical IDs for JavaScript:
- `cart-panel` - Main cart container
- `cart-overlay` - Background overlay
- `cart-close` - Close button
- `cart-empty` - Empty state
- `cart-content` - Populated state
- `cart-items` - Items container
- `cart-subtotal` - Subtotal amount
- `cart-total` - Total amount
- `cart-clear` - Clear cart button
- `cart-checkout` - Checkout button
- `cart-item-template` - Template for JS cloning

### Testing Steps

1. Create `CartPanel.astro` component
2. Add to `index.astro` page
3. Run `npm run dev`
4. Verify cart panel renders (check DevTools)
5. Verify all IDs present
6. Verify template element exists
7. Visual structure matches original
8. Verify hidden by default (CSS)

### Dependencies

- US-005 (Styles migrated, including cart.css)
- Original cart template HTML

### Blocks

None

---

## US-012: Build ProductModal Component

**Priority:** P0 (Critical)
**Estimate:** 2 hours
**Status:** ✅ Complete
**Depends On:** US-005

### Story

**As a** developer
**I want** a product modal component with proper HTML structure
**So that** JavaScript can hydrate it for product details display

### Acceptance Criteria

- [x] `src/components/ProductModal.astro` file created
- [x] Modal overlay structure rendered
- [x] Modal dialog with close button
- [x] Product image container
- [x] Product name heading
- [x] Product description container
- [x] Quantity selector dropdown
- [x] Price display
- [x] Special instructions textarea
- [x] Add to cart button
- [x] All elements have correct IDs and classes for JS targeting
- [x] Proper semantic HTML (`<dialog>` or ARIA attributes)
- [x] Matches original modal structure exactly
- [x] Hidden by default

### Implementation Notes

```astro
---
// No props needed - JS populates dynamically
---

<dialog class="product-modal" id="product-modal">
  <div class="product-modal__overlay" id="modal-overlay"></div>

  <div class="product-modal__content">
    <button class="product-modal__close" id="modal-close">&times;</button>

    <div class="product-modal__body">
      <div class="product-modal__image-container">
        <img
          src=""
          alt=""
          class="product-modal__image"
          id="modal-image"
        />
      </div>

      <div class="product-modal__details">
        <h2 class="product-modal__title" id="modal-title">Product Name</h2>
        <p class="product-modal__description" id="modal-description">Product description</p>

        <div class="product-modal__options">
          <div class="product-modal__field">
            <label for="modal-quantity">Quantity:</label>
            <select id="modal-quantity" class="product-modal__select">
              <!-- Options populated by JS -->
            </select>
          </div>

          <div class="product-modal__price-display">
            <span class="product-modal__price-label">Price:</span>
            <span class="product-modal__price" id="modal-price">$0.00</span>
          </div>

          <div class="product-modal__field">
            <label for="modal-instructions">Special Instructions (optional):</label>
            <textarea
              id="modal-instructions"
              class="product-modal__textarea"
              placeholder="Any special requests?"
              rows="3"
            ></textarea>
          </div>
        </div>

        <button class="product-modal__add-btn" id="modal-add-to-cart">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</dialog>
```

### Element ID Reference

Critical IDs for JavaScript:
- `product-modal` - Main modal container
- `modal-overlay` - Background overlay
- `modal-close` - Close button
- `modal-image` - Product image
- `modal-title` - Product name
- `modal-description` - Product description
- `modal-quantity` - Quantity dropdown
- `modal-price` - Price display
- `modal-instructions` - Special instructions textarea
- `modal-add-to-cart` - Add to cart button

### Testing Steps

1. Create `ProductModal.astro` component
2. Add to `index.astro` page
3. Run `npm run dev`
4. Verify modal renders (check DevTools)
5. Verify all IDs present
6. Visual structure matches original
7. Verify hidden by default

### Dependencies

- US-005 (Styles migrated, including product-modal.css)
- Original product modal template HTML

### Blocks

None

---

## US-013: Build CheckoutPanel Component

**Priority:** P0 (Critical)
**Estimate:** 2.5 hours
**Status:** ✅ Complete
**Depends On:** US-005

### Story

**As a** developer
**I want** a checkout panel component with form structure
**So that** JavaScript can handle form validation and submission

### Acceptance Criteria

- [x] `src/components/CheckoutPanel.astro` file created
- [x] Checkout overlay structure rendered
- [x] Checkout header with title and close button
- [x] Order summary section
- [x] Customer information form fields:
  - [x] Full name (required)
  - [x] Email (required)
  - [x] Phone number (required, formatted)
  - [x] Delivery address (required)
  - [x] Order notes (optional)
- [x] Form validation attributes (required, type, pattern)
- [x] Error message containers
- [x] Order total display
- [x] Submit order button
- [x] Success message container
- [x] All elements have correct IDs and classes for JS targeting
- [x] Proper semantic HTML (`<form>`)
- [x] Matches original checkout structure exactly
- [x] Hidden by default

### Implementation Notes

```astro
---
// No props needed - JS manages state
---

<div class="checkout" id="checkout-panel">
  <div class="checkout__overlay" id="checkout-overlay"></div>

  <div class="checkout__panel">
    <div class="checkout__header">
      <h2 class="checkout__title">Checkout</h2>
      <button class="checkout__close" id="checkout-close">&times;</button>
    </div>

    <div class="checkout__content" id="checkout-content">
      <div class="checkout__summary">
        <h3 class="checkout__summary-title">Order Summary</h3>
        <div class="checkout__items" id="checkout-items">
          <!-- Order items rendered by JS -->
        </div>
        <div class="checkout__total-row">
          <span>Total:</span>
          <span class="checkout__total" id="checkout-total">$0.00</span>
        </div>
      </div>

      <form class="checkout__form" id="checkout-form">
        <h3 class="checkout__form-title">Your Information</h3>

        <div class="checkout__field">
          <label for="checkout-name">Full Name *</label>
          <input
            type="text"
            id="checkout-name"
            name="name"
            class="checkout__input"
            required
          />
          <span class="checkout__error" id="name-error"></span>
        </div>

        <div class="checkout__field">
          <label for="checkout-email">Email *</label>
          <input
            type="email"
            id="checkout-email"
            name="email"
            class="checkout__input"
            required
          />
          <span class="checkout__error" id="email-error"></span>
        </div>

        <div class="checkout__field">
          <label for="checkout-phone">Phone Number *</label>
          <input
            type="tel"
            id="checkout-phone"
            name="phone"
            class="checkout__input"
            placeholder="(555) 555-5555"
            required
          />
          <span class="checkout__error" id="phone-error"></span>
        </div>

        <div class="checkout__field">
          <label for="checkout-date">Pickup Date *</label>
          <input
            type="date"
            id="checkout-date"
            name="date"
            class="checkout__input"
            required
          />
          <span class="checkout__error" id="date-error"></span>
        </div>

        <div class="checkout__field">
          <label for="checkout-address">Pickup Address *</label>
          <textarea
            id="checkout-address"
            name="address"
            class="checkout__textarea"
            rows="3"
            required
          ></textarea>
          <span class="checkout__error" id="address-error"></span>
        </div>

        <button type="submit" class="checkout__submit-btn" id="checkout-submit">
          Place Order
        </button>
      </form>
    </div>

    <div class="checkout__success" id="checkout-success">
      <div class="checkout__success-icon">✓</div>
      <h3 class="checkout__success-title">Order Placed!</h3>
      <p class="checkout__success-message">
        Thank you! We've received your order and will contact you soon to confirm.
      </p>
      <button class="checkout__success-btn" id="checkout-done">Done</button>
    </div>
  </div>
</div>
```

### Element ID Reference

Critical IDs for JavaScript:
- `checkout-panel` - Main checkout container
- `checkout-overlay` - Background overlay
- `checkout-close` - Close button
- `checkout-content` - Form content
- `checkout-items` - Order items summary
- `checkout-total` - Total amount
- `checkout-form` - Form element
- `checkout-name` - Name input
- `checkout-email` - Email input
- `checkout-phone` - Phone input
- `checkout-date` - Date input
- `checkout-address` - Address textarea
- `checkout-submit` - Submit button
- `checkout-success` - Success message container
- `checkout-done` - Done button
- `*-error` - Error message containers

### Testing Steps

1. Create `CheckoutPanel.astro` component
2. Add to `index.astro` page
3. Run `npm run dev`
4. Verify checkout panel renders (check DevTools)
5. Verify all IDs present
6. Verify form fields have validation attributes
7. Visual structure matches original
8. Verify hidden by default

### Dependencies

- US-005 (Styles migrated, including checkout.css)
- Original checkout template HTML

### Blocks

None

---

## Phase 5 Completion Criteria

Phase 5 is complete when:

- [x] All user stories marked complete (US-011 to US-013)
- [x] All interactive components render correctly
- [x] All elements have correct IDs and classes
- [x] HTML structure matches original exactly
- [x] Components hidden by default (CSS)
- [x] Ready for JavaScript hydration in Phase 6
- [x] No console errors

## Phase 5 Testing Checklist

- [x] CartPanel component structure matches original
- [x] ProductModal component structure matches original
- [x] CheckoutPanel component structure matches original
- [x] All critical IDs present in DOM
- [x] All form fields have proper attributes
- [x] Template elements exist where needed
- [x] Components hidden by default
- [x] Visual structure correct (when manually shown)
- [x] No TypeScript errors
- [x] No console errors

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-18 | 1.0 | Initial Phase 5 user stories |

---

[← Back to Phase 4](PHASE_4_STATIC.md) | [Back to Index](USER_STORIES_INDEX.md) | [Next: Phase 6 →](PHASE_6_JAVASCRIPT.md)
