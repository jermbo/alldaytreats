# Phase 6: JavaScript Migration - User Stories

**Phase:** 6 of 8
**Status:** ⬜ Not Started
**Dependencies:** Phase 5 Complete
**Last Updated:** 2026-01-18

## Phase Overview

Migrate all client-side JavaScript to wire up interactivity. JavaScript logic stays identical - only import paths and product data access changes.

**Phase Goal:** All interactive features working identically to original site.

---

## US-014: Migrate Cart Logic

**Priority:** P0 (Critical)
**Estimate:** 1.5 hours
**Status:** ⬜ Not Started
**Depends On:** US-011

### Story

**As a** visitor
**I want** to add products to my cart and manage quantities
**So that** I can build my order

### Acceptance Criteria

- [ ] `src/scripts/cart.js` file created
- [ ] Cart state management logic migrated
- [ ] Functions work identically:
  - [ ] `addToCart(product, quantity, instructions)`
  - [ ] `removeFromCart(productId)`
  - [ ] `updateQuantity(productId, quantity)`
  - [ ] `clearCart()`
  - [ ] `getCart()`
  - [ ] `getCartTotal()`
  - [ ] `getCartCount()`
- [ ] LocalStorage integration works
- [ ] Cart state persists across page loads
- [ ] No logic changes from original
- [ ] Export functions for use by UI

### Implementation Checklist

- [ ] Copy `cart.js` from original `src/` to `src/scripts/`
- [ ] Update any import paths
- [ ] Verify state structure unchanged
- [ ] Test add to cart
- [ ] Test remove from cart
- [ ] Test update quantity
- [ ] Test clear cart
- [ ] Test localStorage persistence
- [ ] Test cart count calculation
- [ ] Test cart total calculation

### Testing Steps

1. Copy `cart.js` to `src/scripts/`
2. Import in `index.astro`
3. Test in browser console:
   ```javascript
   // Add product
   addToCart({id: 'test', name: 'Test', price: 10}, 2, 'Test notes');

   // Check cart
   console.log(getCart());
   console.log(getCartCount());
   console.log(getCartTotal());

   // Remove product
   removeFromCart('test');

   // Clear cart
   clearCart();
   ```
4. Refresh page and verify persistence
5. Check localStorage in DevTools

### Dependencies

- US-011 (CartPanel component)
- Original `cart.js` file

### Blocks

None

---

## US-015: Migrate Cart UI Logic

**Priority:** P0 (Critical)
**Estimate:** 2 hours
**Status:** ⬜ Not Started
**Depends On:** US-014

### Story

**As a** visitor
**I want** visual feedback when interacting with the cart
**So that** I know my actions succeeded

### Acceptance Criteria

- [ ] `src/scripts/cart-ui.js` file created
- [ ] Cart UI logic migrated
- [ ] Functions work identically:
  - [ ] `openCart()`
  - [ ] `closeCart()`
  - [ ] `toggleCart()`
  - [ ] `renderCart()`
  - [ ] `updateCartBadge()`
- [ ] Cart panel shows/hides correctly
- [ ] Cart items render correctly
- [ ] Cart badge updates on add/remove
- [ ] Empty cart state shows when empty
- [ ] Event listeners attached correctly
- [ ] No logic changes from original

### Implementation Checklist

- [ ] Copy `cart-ui.js` from original `src/` to `src/scripts/`
- [ ] Update import paths (import from `./cart.js`)
- [ ] Update DOM selectors (match Phase 5 IDs)
- [ ] Import in `index.astro`
- [ ] Test cart panel open/close
- [ ] Test cart rendering
- [ ] Test badge updates
- [ ] Test empty state
- [ ] Test cart interactions

### Testing Steps

1. Copy `cart-ui.js` to `src/scripts/`
2. Update imports and selectors
3. Import in `index.astro`
4. Click cart button - verify opens
5. Add product - verify renders
6. Change quantity - verify updates
7. Remove item - verify removes
8. Clear cart - verify empty state
9. Verify badge updates correctly
10. Verify overlay click closes cart

### Dependencies

- US-014 (Cart logic migrated)
- US-011 (CartPanel component)

### Blocks

None

---

## US-016: Migrate Product Modal Logic

**Priority:** P0 (Critical)
**Estimate:** 2 hours
**Status:** ⬜ Not Started
**Depends On:** US-012, US-021

### Story

**As a** visitor
**I want** to view product details and add items to cart
**So that** I can make informed purchasing decisions

### Acceptance Criteria

- [ ] `src/scripts/product-modal.js` file created
- [ ] Product modal logic migrated
- [ ] Functions work identically:
  - [ ] `openModal(productId)`
  - [ ] `closeModal()`
  - [ ] `renderProductDetails(product)`
  - [ ] `handleAddToCart()`
- [ ] Modal opens when product clicked
- [ ] Product details populate correctly
- [ ] Quantity selector populates with options
- [ ] Price updates based on quantity
- [ ] Special instructions captured
- [ ] Add to cart adds to cart state
- [ ] Modal closes after adding
- [ ] No logic changes from original

### Implementation Checklist

- [ ] Copy `product-modal.js` from original `src/` to `src/scripts/`
- [ ] Update import paths
- [ ] Update DOM selectors (match Phase 5 IDs)
- [ ] Update product data access (use from Phase 2 content)
- [ ] Import in `index.astro`
- [ ] Test modal open
- [ ] Test product details population
- [ ] Test quantity selector
- [ ] Test price calculation
- [ ] Test add to cart
- [ ] Test modal close

### Testing Steps

1. Copy `product-modal.js` to `src/scripts/`
2. Update imports and selectors
3. Import in `index.astro`
4. Click product card - verify modal opens
5. Verify product details show correctly
6. Select quantity - verify price updates
7. Add special instructions
8. Click "Add to Cart" - verify adds
9. Verify modal closes
10. Verify cart badge updates

### Dependencies

- US-012 (ProductModal component)
- US-014 (Cart logic)
- US-021 (Product data access)

### Blocks

None

---

## US-017: Migrate Menu Filtering Logic

**Priority:** P1 (High)
**Estimate:** 1 hour
**Status:** ⬜ Not Started
**Depends On:** US-010

### Story

**As a** visitor
**I want** to filter products by category
**So that** I can quickly find the type of treats I want

### Acceptance Criteria

- [ ] Menu filtering logic added to `src/scripts/menu.js`
- [ ] Category filter tabs clickable
- [ ] Clicking tab filters products
- [ ] "All" shows all products
- [ ] "Candy" shows only candy products
- [ ] "Chocolate" shows only chocolate products
- [ ] "Platter" shows only platter products
- [ ] Active tab has visual indicator
- [ ] Smooth animations on filter
- [ ] Product grid adjusts responsively
- [ ] No logic changes from original

### Implementation Checklist

- [ ] Create `src/scripts/menu.js` or add to existing JS
- [ ] Add event listeners to filter buttons
- [ ] Implement filter logic using data attributes
- [ ] Update active class on tabs
- [ ] Test all filter options
- [ ] Verify animations work
- [ ] Test responsive behavior

### Testing Steps

1. Create/update menu filtering script
2. Import in `index.astro`
3. Click "All" - verify shows all 9 products
4. Click "Candy" - verify shows only candy
5. Click "Chocolate" - verify shows only chocolate
6. Click "Platter" - verify shows only platter
7. Verify active tab indicator
8. Test on mobile size
9. Verify animations smooth

### Dependencies

- US-010 (Menu component with filter tabs)

### Blocks

None

---

## US-018: Migrate Checkout UI Logic

**Priority:** P0 (Critical)
**Estimate:** 2 hours
**Status:** ⬜ Not Started
**Depends On:** US-013, US-014

### Story

**As a** visitor
**I want** a smooth checkout experience
**So that** I can place my order easily

### Acceptance Criteria

- [ ] `src/scripts/checkout-ui.js` file created
- [ ] Checkout UI logic migrated
- [ ] Functions work identically:
  - [ ] `openCheckout()`
  - [ ] `closeCheckout()`
  - [ ] `renderOrderSummary()`
  - [ ] `handleSubmit()`
  - [ ] `showSuccess()`
- [ ] Checkout panel opens from cart
- [ ] Order summary populates correctly
- [ ] Form submission handled correctly
- [ ] Success message shows after submission
- [ ] Panel closes properly
- [ ] No logic changes from original

### Implementation Checklist

- [ ] Copy `checkout-ui.js` from original `src/` to `src/scripts/`
- [ ] Update import paths
- [ ] Update DOM selectors (match Phase 5 IDs)
- [ ] Import cart functions from `./cart.js`
- [ ] Import in `index.astro`
- [ ] Test checkout open
- [ ] Test order summary
- [ ] Test form submission
- [ ] Test success state
- [ ] Test checkout close

### Testing Steps

1. Copy `checkout-ui.js` to `src/scripts/`
2. Update imports and selectors
3. Import in `index.astro`
4. Add items to cart
5. Click "Proceed to Checkout"
6. Verify order summary shows
7. Verify cart items listed
8. Verify total correct
9. Fill form and submit
10. Verify success message
11. Verify cart clears (if applicable)

### Dependencies

- US-013 (CheckoutPanel component)
- US-014 (Cart logic)
- US-019 (Form validation)

### Blocks

None

---

## US-019: Migrate Form Validation Logic

**Priority:** P0 (Critical)
**Estimate:** 2 hours
**Status:** ⬜ Not Started
**Depends On:** US-013

### Story

**As a** visitor
**I want** clear validation feedback on the checkout form
**So that** I know if I've made any errors

### Acceptance Criteria

- [ ] `src/scripts/validation.js` file created
- [ ] Validation logic migrated
- [ ] Functions work identically:
  - [ ] `validateName()`
  - [ ] `validateEmail()`
  - [ ] `validatePhone()`
  - [ ] `validateDate()`
  - [ ] `validateAddress()`
  - [ ] `validateForm()`
- [ ] All validation rules enforced
- [ ] Error messages display correctly
- [ ] Valid inputs show success state
- [ ] Form submits only when valid
- [ ] No logic changes from original

### Implementation Checklist

- [ ] Copy `validation.js` from original `src/` to `src/scripts/`
- [ ] Update any import paths
- [ ] Import in `index.astro` or `checkout-ui.js`
- [ ] Test each validation function
- [ ] Test form validation on submit
- [ ] Test error message display
- [ ] Test success states

### Validation Rules Reference

- **Name:** Required, min 2 characters
- **Email:** Required, valid email format
- **Phone:** Required, valid phone format (formatted by phone-formatter)
- **Date:** Required, future date, at least 3 days advance
- **Address:** Required, min 10 characters

### Testing Steps

1. Copy `validation.js` to `src/scripts/`
2. Import validation functions
3. Test empty fields - verify errors
4. Test invalid email - verify error
5. Test invalid phone - verify error
6. Test past date - verify error
7. Test short address - verify error
8. Test all valid - verify success
9. Test form submission prevents if invalid

### Dependencies

- US-013 (CheckoutPanel component)
- Original validation logic

### Blocks

None

---

## US-020: Migrate Phone Formatter Logic

**Priority:** P1 (High)
**Estimate:** 1 hour
**Status:** ⬜ Not Started
**Depends On:** US-013

### Story

**As a** visitor
**I want** my phone number automatically formatted
**So that** I can enter it naturally without worrying about format

### Acceptance Criteria

- [ ] `src/scripts/phone-formatter.js` file created
- [ ] Phone formatting logic migrated
- [ ] Functions work identically:
  - [ ] `formatPhoneNumber(input)`
  - [ ] `unformatPhoneNumber(formatted)`
- [ ] Phone input formats as user types
- [ ] Format: (XXX) XXX-XXXX
- [ ] Handles paste correctly
- [ ] Handles backspace correctly
- [ ] No logic changes from original

### Implementation Checklist

- [ ] Copy `phone-formatter.js` from original `src/` to `src/scripts/`
- [ ] Update any import paths
- [ ] Import in `index.astro` or `checkout-ui.js`
- [ ] Attach to phone input field
- [ ] Test typing numbers
- [ ] Test pasting numbers
- [ ] Test backspace
- [ ] Test complete number

### Testing Steps

1. Copy `phone-formatter.js` to `src/scripts/`
2. Attach to phone input in checkout
3. Type "5551234567"
4. Verify formats to "(555) 123-4567"
5. Paste "1234567890"
6. Verify formats correctly
7. Test backspace through number
8. Test various input patterns

### Dependencies

- US-013 (CheckoutPanel component with phone field)

### Blocks

None

---

## US-021: Update Product Data Access

**Priority:** P0 (Critical)
**Estimate:** 1.5 hours
**Status:** ⬜ Not Started
**Depends On:** US-003

### Story

**As a** developer
**I want** JavaScript to access product data from content collection
**So that** interactive features can use the migrated product data

### Acceptance Criteria

- [ ] Product data accessible to client-side JS
- [ ] Data structure matches what JS expects
- [ ] Product lookup by ID works
- [ ] All product fields available
- [ ] Price options array accessible
- [ ] Modal can populate from product data
- [ ] Cart can store product info
- [ ] No breaking changes to data structure

### Implementation Notes

**Option A: Serialize to Window Global**

```astro
---
// In index.astro
import { getCollection } from 'astro:content';
const products = await getCollection('products');

const productsData = products.map(p => ({
  id: p.data.id,
  name: p.data.name,
  category: p.data.category,
  image: p.data.image.src,
  priceFrom: p.data.priceFrom,
  priceOptions: p.data.priceOptions,
  extraAddOns: p.data.extraAddOns,
  description: p.body,
}));
---

<script define:vars={{ productsData }}>
  window.PRODUCTS = productsData;
</script>
```

**Option B: Data Attributes on Elements**

Use `data-product-data` attributes on ProductCard elements, parse when needed.

**Recommended: Option A** - Simpler, matches original structure.

### Implementation Checklist

- [ ] Serialize product data to window global
- [ ] Update product modal to use `window.PRODUCTS`
- [ ] Test product lookup by ID
- [ ] Verify all fields accessible
- [ ] Test modal population
- [ ] Test cart with product data
- [ ] Verify no data structure breaking changes

### Testing Steps

1. Serialize products to window global
2. Check `window.PRODUCTS` in console
3. Verify array has 9 products
4. Test product lookup:
   ```javascript
   const product = window.PRODUCTS.find(p => p.id === 'candy-grapes');
   console.log(product);
   ```
5. Open product modal - verify populates
6. Add to cart - verify product info correct

### Dependencies

- US-003 (Products migrated to content collection)
- US-016 (Product modal needs product data)

### Blocks

None

---

## Phase 6 Completion Criteria

Phase 6 is complete when:

- [x] All user stories marked complete (US-014 to US-021)
- [x] All JavaScript files migrated
- [x] All interactive features working
- [x] Menu filtering works
- [x] Product modals open and function
- [x] Cart adds/removes items
- [x] Checkout form validates and submits
- [x] Phone formatting works
- [x] 100% functional parity with original
- [x] No console errors
- [x] Ready to begin Phase 7 (Testing)

## Phase 6 Testing Checklist

### Cart Functionality
- [ ] Add to cart works
- [ ] Remove from cart works
- [ ] Update quantity works
- [ ] Clear cart works
- [ ] Cart badge updates
- [ ] Cart persists across reloads

### Product Modal
- [ ] Modal opens on product click
- [ ] Product details populate
- [ ] Quantity selector works
- [ ] Price updates correctly
- [ ] Special instructions captured
- [ ] Add to cart from modal works
- [ ] Modal closes

### Menu Filtering
- [ ] "All" shows all products
- [ ] "Candy" filters correctly
- [ ] "Chocolate" filters correctly
- [ ] "Platter" filters correctly
- [ ] Active tab indicator works
- [ ] Animations smooth

### Checkout
- [ ] Checkout opens from cart
- [ ] Order summary correct
- [ ] Form fields validate
- [ ] Phone number formats
- [ ] Form submission works
- [ ] Success message shows
- [ ] Cart clears after order

### General
- [ ] No console errors
- [ ] No broken functionality
- [ ] All features match original
- [ ] Performance acceptable

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-18 | 1.0 | Initial Phase 6 user stories |

---

[← Back to Phase 5](PHASE_5_INTERACTIVE.md) | [Back to Index](USER_STORIES_INDEX.md) | [Next: Phase 7 →](PHASE_7_TESTING.md)
