# Code Audit — All Day Treats

**Date:** February 12, 2026
**Auditor:** Senior Engineer Review
**Scope:** Full codebase — Astro 5 static site with vanilla JS cart/checkout system

---

## Overall Grade: C+ (72/100)

| Category        | Score | Weight | Notes                                        |
| --------------- | ----- | ------ | -------------------------------------------- |
| Architecture    | B-    | 20%    | Good foundation, poor separation in scripts  |
| Code Quality    | C     | 25%    | Heavy duplication, SRP violations, no TS     |
| Security        | C+    | 15%    | XSS mitigation exists but is fragile         |
| Accessibility   | C     | 15%    | Partial ARIA, no focus traps, shortcut clash |
| Performance     | B     | 10%    | Mostly fine for static site, some waste      |
| Maintainability | C-    | 15%    | Hard to extend; changes ripple everywhere    |

---

## Executive Summary

The codebase is **functional and deployed** with a solid Astro foundation, Content Collections, and sensible CSS custom properties. However, the interactive JavaScript layer suffers from **significant code duplication**, **single-responsibility violations**, **inconsistent typing**, and **missing accessibility primitives**. The largest file (`checkout-ui.js` at 1,114 lines) is doing the work of 5-6 modules. Three nearly identical topping-formatting functions exist across two files. The `escapeHtml` utility and UUID generator are each duplicated verbatim. These issues compound to make the codebase brittle — a change to topping display logic requires edits in three places, and a missed `escapeHtml` call in any `innerHTML` assignment is an XSS vector.

---

## Detailed Findings

### 1. Code Duplication (Severity: HIGH)

#### 1a. `escapeHtml` — duplicated verbatim

- `cart-ui.js:608-612`
- `checkout-ui.js:1109-1113`

Both files contain identical DOM-based HTML escaping. This should be a shared utility.

#### 1b. UUID / ID Generation — duplicated verbatim

- `cart.js:260-284` (`generateCartItemId` inside `addToCart`)
- `checkout-ui.js:750-776` (`generateOrderId`)

Same three-tier fallback pattern (crypto.randomUUID → crypto.getRandomValues → timestamp+random). Defined inline inside `addToCart` as a nested function, then again as a standalone in checkout.

#### 1c. Toppings Formatting — triplicated

- `cart-ui.js:555-601` — `formatToppingsDisplay()` returns HTML string
- `checkout-ui.js:1010-1053` — `formatToppingsForDisplay()` returns escaped text
- `checkout-ui.js:1062-1102` — `formatToppingsForEmail()` returns plain text with SKUs

All three share **identical** logic for:

- Null/empty guard
- Chocolate category check via `window.PRODUCTS`
- Legacy toppings format normalization (object → array)
- Mapping IDs to names with price calculation

The only difference is the output format (HTML, escaped text, plain text with SKU). This should be one function with a formatter parameter.

#### 1d. Chocolate Category Check — scattered across 4 files

The pattern `product?.category === 'chocolate'` appears in:

- `cart.js` (lines 140, 253, 372, 392)
- `cart-ui.js` (line 562)
- `checkout-ui.js` (lines 1017, 1069)
- `product-modal.js` (lines 86, 143, 299, 467)

This business rule ("chocolate products don't get toppings") has no single source of truth.

---

### 2. Single Responsibility Violations (Severity: HIGH)

#### 2a. `checkout-ui.js` — 1,114 lines, ~10 responsibilities

This file handles:

1. Multi-step wizard navigation
2. Form field validation orchestration (blur + input for 5 fields = ~160 lines of repetitive handlers)
3. Order summary rendering
4. Delivery fee calculation/display
5. Order ID generation and persistence
6. Order email body formatting
7. Clipboard operations (with mobile/HTTP fallback)
8. Email client integration (mailto: link construction)
9. Auto-close countdown timer
10. Loading state management

Each of these is a distinct concern that should be its own module.

#### 2b. `setupFieldValidation` — ~160 lines of copy-paste

Lines 303-467 repeat the same pattern for each field:

```
field.addEventListener("blur", () => { trim → validate → show/clear error → update button });
field.addEventListener("input", () => { validate → clear if valid → update button });
```

This is done identically for `name`, `email`, `phone`, `address`. A single factory function would reduce this to ~20 lines.

#### 2c. `product-modal.js` — mixes UI, state, and cart operations

Manages topping state, renders topping checkboxes, handles quantity selection, calculates prices, AND triggers cart add/update — all in one module.

---

### 3. Global Mutable State (Severity: MEDIUM)

Every script file uses module-level `let` for state:

| File               | Mutable globals                                                                                                                                                                                                                                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cart.js`          | `cartItems`                                                                                                                                                                                                                                                                                                                   |
| `cart-ui.js`       | `cartPanel`, `productModal`, `itemsContainer`, `emptyState`, `cartContent`, `footer`, `subtotalEl`, `totalEl`, `lastItemCount`, `itemsToRefresh`, `updatedItemIds`                                                                                                                                                            |
| `checkout-ui.js`   | `checkoutModal`, `checkoutForm`, `stepInfo`, `stepInstructions`, `stepSuccess`, `summaryItemsContainer`, `summarySubtotalEl`, `summaryDeliveryEl`, `summaryTotalEl`, `submitBtn`, `countdownEl`, `zipCodeField`, `currentStep`, `formattedOrderText`, `orderId`, `autoCloseTimer`, `countdownInterval`, `selectedDeliveryFee` |
| `product-modal.js` | `currentProduct`, `selectedPriceOption`, `editingItemId`, `selectedToppings`                                                                                                                                                                                                                                                  |

That's **30+ mutable module-level variables** across 4 files. Any function can read or mutate this state at any time, making the data flow nearly impossible to trace.

---

### 4. Security Concerns (Severity: MEDIUM-HIGH)

#### 4a. `innerHTML` usage without guaranteed escaping

`cart-ui.js:244-286` and `checkout-ui.js:979-993` build HTML via template literals inserted via `innerHTML`. While `escapeHtml()` is called on user-provided values, this is **opt-in safety** — one missed call on a future edit creates an XSS vulnerability. A safer approach would use DOM creation APIs or a template sanitization pattern.

#### 4b. `window.PRODUCTS` global — price data is client-mutable

Product data (including prices) is serialized to `window.PRODUCTS` in `index.astro:46`. Any user can open DevTools and modify prices before adding to cart. The email-based checkout means there's no server-side price verification. This isn't critical for an email-order flow, but it's worth noting.

#### 4c. Hardcoded business email in two locations

- `checkout-ui.js:652` — `const businessEmail = "alldaytreatomaha@gmail.com"`
- `CheckoutPanel.astro:205` — hardcoded in HTML

Should reference `siteConfig.contact.email` from `src/config/site.ts`.

#### 4d. Honeypot field has visible label

```html
<label for="checkout-website" class="checkout-modal__label">
	Website (leave blank)
</label>
```

The label text "Website (leave blank)" is visible in the DOM. Sophisticated bots can read this hint. The label should be visually hidden with CSS (not `display:none`), and the instructional text removed.

#### 4e. Deprecated `document.execCommand("copy")` as fallback

`checkout-ui.js:607` uses the deprecated execCommand API. While this works today, it's on the deprecation path and should be documented as tech debt.

---

### 5. Accessibility Issues (Severity: HIGH)

#### 5a. No focus trap in cart panel or checkout modal

Both `CartPanel.astro` and `CheckoutPanel.astro` use `role="dialog"` + `aria-modal="true"` but are `<div>` elements, not `<dialog>`. **No focus trap is implemented.** When these modals are open, users can Tab to elements behind the overlay. This is a WCAG 2.1 Level A failure (2.4.3 Focus Order).

The `ProductModal.astro` correctly uses `<dialog>` (which provides native focus trapping via `showModal()`), but the other two modals don't.

#### 5b. `Cmd/Ctrl+D` keyboard shortcut overrides browser bookmark

`cart-ui.js:88` binds `Cmd+D` / `Ctrl+D` to toggle the cart. This **hijacks the browser's native "Bookmark this page" shortcut**, which is a significant usability violation. Custom keyboard shortcuts should avoid conflicting with browser defaults.

#### 5c. Destructive action without confirmation

The "Clear Cart" button (`CartPanel.astro:45`) immediately clears all items with no confirmation dialog. This is a UX anti-pattern for destructive actions.

#### 5d. Emoji used for semantic content without text fallback

- Cart icon "🛒" has `aria-hidden="true"` (good)
- Edit button "✏️" has `aria-label="Edit {name}"` (good)
- Remove button "🗑️" has `aria-label="Remove {name}"` (good)
- Email instruction icons "✉️", "📋", "📧" are decorative but inside buttons — the buttons do have text spans, so these are acceptable
- Success checkmark "✓" is decorative (acceptable)

This area is mostly fine, but should be audited when making changes.

#### 5e. No `aria-live` region for cart state changes

When items are added, removed, or quantities change, there's no `aria-live` announcement. Screen reader users won't know their action succeeded unless they navigate to the cart.

---

### 6. Price Calculation Inconsistency (Severity: MEDIUM)

The cart item data model is confusing:

- `item.price` — sometimes the total (unitPrice × quantity), sometimes the unit price
- `item.unitPrice` — the per-unit price (may or may not include toppings)
- `normalizeCartItem` in `cart.js:89-115` calculates `unitPrice` as `price / quantity`
- `addToCart` in `cart.js:250-311` sets `unitPrice = price`, then later sets `price = unitPrice * quantity`

Multiple places recalculate line totals with subtly different logic:

- `cart-ui.js:238` — `const lineTotal = unitPrice * quantity`
- `cart-ui.js:401` — `const lineTotal = itemData.unitPrice * itemData.quantity`
- `checkout-ui.js:968` — `const lineTotal = unitPrice * quantity`
- `cart.js:423-425` — `total + item.unitPrice * item.quantity`

This should be a single `calculateLineTotal(item)` utility.

---

### 7. TypeScript Inconsistency (Severity: MEDIUM)

| File                 | Language | Notes                                        |
| -------------------- | -------- | -------------------------------------------- |
| `main.ts`            | TS       | Uses `(window as any).PRODUCTS`, `any` casts |
| `config/toppings.ts` | TS       | Well-typed                                   |
| `config/delivery.ts` | TS       | Well-typed                                   |
| `config/site.ts`     | TS       | Uses `as const`                              |
| `content/config.ts`  | TS       | Zod schema                                   |
| `cart.js`            | JS       | JSDoc only, no interfaces                    |
| `cart-ui.js`         | JS       | JSDoc only                                   |
| `checkout-ui.js`     | JS       | JSDoc only                                   |
| `product-modal.js`   | JS       | JSDoc only                                   |
| `validation.js`      | JS       | JSDoc only                                   |
| `validation-ui.js`   | JS       | JSDoc only                                   |
| `phone-formatter.js` | JS       | JSDoc only                                   |

No shared type definitions exist for the cart item shape, product shape, or order data — the most critical data structures in the app.

---

### 8. CSS / Design System Issues (Severity: LOW)

#### 8a. Legacy color variables are misleading

`variables.css` contains 8 "legacy mapping" variables that all resolve to the same blue:

```css
--color-accent-red: #20a6fd; /* Not red */
--color-pastel-pink: #20a6fd; /* Not pink */
--color-gold: #20a6fd; /* Not gold */
--color-burgundy: #20a6fd; /* Not burgundy */
```

These should be removed and any usage replaced with `--color-accent-blue`.

#### 8b. User rules specify Tailwind CSS, project uses vanilla CSS

The cursor rules say "Use Tailwind CSS for all styles" but the project uses handwritten CSS with custom properties. This is a rules/reality mismatch that should be resolved.

#### 8c. Unused module-level variables

`cart-ui.js` declares `itemsToRefresh = new Set()` (line 27) which is never used anywhere.

---

### 9. Content / Copy Issue (Severity: LOW)

`Layout.astro:23` — Default meta description says "Made fresh to order in **the Bronx**" but the site is for **Omaha, NE** (per `site.ts` and the page title). This is likely a leftover from an earlier version.

---

### 10. Performance Notes (Severity: LOW)

#### 10a. `getDeliveryZoneMap()` rebuilds on every call

`delivery.ts:13-29` creates a new `Map` on every invocation. `getDeliveryFee()` calls it each time. For a small dataset this is fine, but it should be memoized.

#### 10b. `window.PRODUCTS.find()` on every item render

Both `cart-ui.js` and `checkout-ui.js` call `window.PRODUCTS.find()` per item during render. For 9 products this is negligible, but a lookup map would be cleaner.

---

## What's Working Well

To be fair, the codebase has several strengths worth acknowledging:

1. **Astro + Content Collections** — Excellent choice for a product catalog. Type-safe content, Markdown-based, zero JS shipped for static parts.
2. **CSS Custom Properties** — Well-organized design tokens with consistent naming (spacing, typography, shadows, etc.).
3. **Event Delegation** — `cart-ui.js` and `checkout-ui.js` use `data-action` + event delegation instead of per-element listeners. This is a good pattern.
4. **Validation Separation** — Pure validation logic (`validation.js`) is cleanly separated from UI feedback (`validation-ui.js`). This is the strongest architectural decision in the JS layer.
5. **XSS Awareness** — `escapeHtml()` is consistently applied. The intent is right even if the pattern is fragile.
6. **Honeypot + Timestamp** — Anti-spam measures on the checkout form show thoughtful consideration.
7. **Incremental DOM Updates** — Cart quantity changes use targeted DOM updates instead of full re-renders.
8. **Accessible Form Markup** — Checkout form has proper `aria-describedby`, `aria-required`, `aria-invalid`, and `role="alert"` on error containers.

---

## Plan of Action

### Phase 1: Shared Utilities (eliminate duplication)

**Estimated effort: Small | Impact: High**

1. Create `src/scripts/utils/escape-html.ts` — single `escapeHtml` function
2. Create `src/scripts/utils/generate-id.ts` — single `generateId` function with configurable length
3. Create `src/scripts/utils/format-currency.ts` — `formatCurrency(amount)` to replace scattered `$${x.toFixed(2)}`
4. Create `src/scripts/utils/toppings-formatter.ts` — unified topping normalization + formatting with output mode (html | text | email)
5. Create `src/scripts/utils/product-helpers.ts` — `isChocolateCovered(productId)`, `findProduct(productId)`, `calculateLineTotal(item)`
6. Migrate all consumers to use shared utilities

### Phase 2: Break Up `checkout-ui.js` (single responsibility)

**Estimated effort: Medium | Impact: High**

Split into focused modules:

1. `src/scripts/checkout/checkout-wizard.ts` — step navigation logic
2. `src/scripts/checkout/checkout-form.ts` — form orchestration + field validation wiring
3. `src/scripts/checkout/order-formatter.ts` — email body + subject formatting
4. `src/scripts/checkout/clipboard.ts` — copy-to-clipboard with fallback
5. `src/scripts/checkout/order-summary.ts` — summary rendering + delivery display
6. Keep `checkout-ui.ts` as the thin orchestrator that imports and wires these together

### Phase 3: Validation Refactor (DRY the field handlers)

**Estimated effort: Small | Impact: Medium**

1. Create a `createFieldValidator(field, validatorFn, form)` factory that attaches both blur and input handlers
2. Replace the 5 repetitive field setup blocks (~160 lines) with 5 one-liner calls (~20 lines)
3. Preserve the existing `validation.js` and `validation-ui.js` — they're already well-separated

### Phase 4: TypeScript Migration for Scripts

**Estimated effort: Medium | Impact: Medium**

1. Create `src/scripts/types/index.ts` with shared interfaces: `CartItem`, `Product`, `OrderData`, `PriceOption`, `ValidationResult`
2. Rename `.js` script files to `.ts` one at a time, starting with `cart.ts` (the data layer)
3. Remove `(window as any)` casts in `main.ts` by declaring proper `Window` interface augmentation
4. Add strict null checks and return types to all exported functions

### Phase 5: Accessibility Fixes

**Estimated effort: Small-Medium | Impact: High**

1. **Add focus trap** to cart panel and checkout modal (lightweight implementation or use `<dialog>` element)
2. **Remove `Cmd+D` shortcut** or change to a non-conflicting key
3. **Add `aria-live="polite"` region** for cart notifications (item added/removed/updated)
4. **Add confirmation** to "Clear Cart" action
5. **Hide honeypot label** properly (visually hidden, remove instructional text)

### Phase 6: Security Hardening

**Estimated effort: Small | Impact: Medium**

1. Replace `innerHTML` rendering with DOM creation APIs (or at minimum, create a safe template builder utility that enforces escaping)
2. Move hardcoded email to `siteConfig.contact.email`
3. Fix the honeypot field label to be screen-reader only with no instructional text

### Phase 7: Cleanup

**Estimated effort: Small | Impact: Low**

1. Remove legacy color CSS variables and update any references to `--color-accent-blue`
2. Remove unused `itemsToRefresh` variable from `cart-ui.js`
3. Fix Layout.astro default description ("the Bronx" → "Omaha, NE")
4. Memoize `getDeliveryZoneMap()` in `delivery.ts`
5. Create a product lookup map to replace repeated `.find()` calls
6. Resolve Tailwind CSS rule vs. vanilla CSS reality (update cursor rules or plan Tailwind migration)

---

## Recommended Execution Order

```
Phase 1 (Utilities)     → Immediate — unblocks everything else
Phase 5 (Accessibility) → Next — highest user-facing impact
Phase 3 (Validation)    → Quick win alongside Phase 2
Phase 2 (Checkout Split)→ Core refactor — pair with Phase 4
Phase 4 (TypeScript)    → Gradual — do alongside Phase 2
Phase 6 (Security)      → Important but less urgent for email-order flow
Phase 7 (Cleanup)       → Final polish
```

**Total estimated effort:** 3-5 focused working sessions

---

## Files Changed Per Phase (Quick Reference)

| Phase | Files Touched                                                                                 |
| ----- | --------------------------------------------------------------------------------------------- |
| 1     | New: 5 utility files. Modified: `cart.js`, `cart-ui.js`, `checkout-ui.js`, `product-modal.js` |
| 2     | New: 5 checkout modules. Modified: `checkout-ui.js` (split), `main.ts`                        |
| 3     | Modified: `checkout-ui.js` (or its replacement from Phase 2)                                  |
| 4     | Renamed: 7 `.js` → `.ts`. New: `types/index.ts`. Modified: `main.ts`                          |
| 5     | Modified: `cart-ui.js`, `CartPanel.astro`, `CheckoutPanel.astro`, `checkout-ui.js`            |
| 6     | Modified: `cart-ui.js`, `checkout-ui.js`, `CheckoutPanel.astro`                               |
| 7     | Modified: `variables.css`, `cart-ui.js`, `Layout.astro`, `delivery.ts`                        |
