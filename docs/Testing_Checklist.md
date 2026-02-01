# All Day Treats - Testing Checklist

**Date:** 2026-01-18
**Tester:** _________
**Browser:** _________
**Device:** _________

## Pre-Testing Setup
- [ ] Dev server running (`npm run dev`)
- [ ] Browser DevTools open (Console tab)
- [ ] No errors in console on load
- [ ] Original site open for comparison

---

## US-022: Visual Regression Testing

### Desktop (1920x1080)
- [ ] Header displays correctly (logo, contact links, cart button)
- [ ] Hero section displays correctly (logo, tagline, CTA)
- [ ] Menu section displays correctly (title, tabs, products)
- [ ] All 9 products visible in grid
- [ ] Product images load correctly
- [ ] Footer displays correctly (3 columns, contact info, policies)
- [ ] Colors match original
- [ ] Fonts match original
- [ ] Spacing matches original

### Tablet (768x1024)
- [ ] Responsive layout adjusts correctly
- [ ] Product grid shows 2 columns
- [ ] All sections remain functional
- [ ] Touch targets are adequate size

### Mobile (375x667)
- [ ] Responsive layout adjusts correctly
- [ ] Product grid shows 1 column
- [ ] All sections remain functional
- [ ] No horizontal scroll
- [ ] Touch targets are adequate size (44x44px)

---

## US-023: Functional Testing

### Menu Filtering
- [ ] "All Treats" shows all 9 products
- [ ] "Candy Coated" shows only candy products (3)
- [ ] "Chocolate Covered" shows only chocolate products (5)
- [ ] "Platters" shows only platter products (1)
- [ ] Active tab indicator updates
- [ ] Smooth animation on filter

### Product Modal
- [ ] Click product card - modal opens
- [ ] Product details populate correctly:
  - [ ] Name
  - [ ] Image
  - [ ] Description
  - [ ] Price options
- [ ] Quantity selector shows all options
- [ ] Click quantity option - price updates
- [ ] Special instructions field works
- [ ] Character counter updates (max 250)
- [ ] Click "Add to Cart" - item added
- [ ] Modal closes after adding
- [ ] Click close button - modal closes
- [ ] Click outside modal - modal closes

### Cart Functionality
- [ ] Cart badge shows correct count
- [ ] Cart badge animates on add
- [ ] Click cart button - cart panel opens
- [ ] Cart items display correctly:
  - [ ] Product name
  - [ ] Quantity (count)
  - [ ] Price
  - [ ] Special instructions (if any)
- [ ] Empty state shows when cart empty
- [ ] Cart content shows when items present
- [ ] Subtotal calculates correctly
- [ ] Total calculates correctly
- [ ] Adjust quantity:
  - [ ] Increase quantity - total updates
  - [ ] Decrease quantity - total updates
- [ ] Remove item - item deleted, total updates
- [ ] Clear cart - all items removed, empty state shows
- [ ] Close cart - panel closes
- [ ] Refresh page - cart persists (localStorage)

### Checkout Flow
- [ ] Click "Proceed to Checkout" - checkout opens
- [ ] Order summary displays correctly
- [ ] All cart items listed
- [ ] Total matches cart total
- [ ] Form fields present:
  - [ ] Full Name (required)
  - [ ] Email (required)
  - [ ] Phone (required, formatted)
  - [ ] Delivery Address (required)
  - [ ] Order Notes (optional)
- [ ] Form validation works:
  - [ ] Empty required field - shows error
  - [ ] Invalid email - shows error
  - [ ] Invalid phone - shows error
  - [ ] Short address - shows error
- [ ] Phone number formats as you type: (555) 555-5555
- [ ] Submit valid form - success message shows
- [ ] Success message displays confirmation
- [ ] Close checkout - panel closes
- [ ] Cart cleared after successful order

### Hero CTA
- [ ] Click "View Menu" - smooth scrolls to menu

### Edge Cases
- [ ] Add same product twice - creates two cart items
- [ ] Add multiple different products - all show in cart
- [ ] Remove items one by one - cart updates correctly
- [ ] Clear cart and reopen - shows empty state
- [ ] Resize window - responsive behavior works
- [ ] Refresh with items in cart - items persist

---

## US-024: Performance Testing

### Build Test
- [ ] Run `npm run build` - builds successfully
- [ ] No build errors
- [ ] No build warnings (or acceptable warnings noted)

### Lighthouse Scores (run on build/preview)
```bash
npm run build
npm run preview
# Open Chrome DevTools > Lighthouse > Run audit
```

**Desktop:**
- [ ] Performance: _____ (target: ≥95)
- [ ] Accessibility: _____ (target: ≥95)
- [ ] Best Practices: _____ (target: ≥95)
- [ ] SEO: _____ (target: ≥95)

**Mobile:**
- [ ] Performance: _____ (target: ≥90)
- [ ] Accessibility: _____ (target: ≥95)
- [ ] Best Practices: _____ (target: ≥95)
- [ ] SEO: _____ (target: ≥95)

### Core Web Vitals
- [ ] LCP < 2.5s: _____
- [ ] FID < 100ms: _____
- [ ] CLS < 0.1: _____

### Load Time
- [ ] First Contentful Paint < 1.5s: _____
- [ ] Time to Interactive < 3.0s: _____
- [ ] Total page load < 3.0s: _____

---

## US-025: Cross-Browser Testing

### Chrome (Desktop)
- [ ] All features work
- [ ] Visual rendering correct
- [ ] No console errors

### Firefox (Desktop)
- [ ] All features work
- [ ] Visual rendering correct
- [ ] No console errors

### Safari (Desktop)
- [ ] All features work
- [ ] Visual rendering correct
- [ ] No console errors

### Mobile Safari (iOS)
- [ ] All features work
- [ ] Touch interactions work
- [ ] Form inputs work
- [ ] Modal scroll lock works
- [ ] No zoom on input focus

### Chrome Mobile (Android)
- [ ] All features work
- [ ] Touch interactions work
- [ ] Form inputs work
- [ ] Back button behavior correct

---

## Console Errors Check

**Errors Found:**
```
[List any console errors here]
```

**Warnings Found:**
```
[List any console warnings here]
```

---

## Issues Found

| # | Issue | Severity | Status | Notes |
|---|-------|----------|--------|-------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

**Severity Levels:**
- **Critical**: Blocks core functionality
- **High**: Significant issue, workaround exists
- **Medium**: Minor issue, low impact
- **Low**: Cosmetic or edge case

---

## Sign-Off

- [ ] All tests completed
- [ ] All critical/high issues resolved
- [ ] Visual parity confirmed
- [ ] Functional parity confirmed
- [ ] Performance acceptable
- [ ] Cross-browser compatibility confirmed

**Tester Signature:** _________________ **Date:** _________

**Stakeholder Approval:** _________________ **Date:** _________
