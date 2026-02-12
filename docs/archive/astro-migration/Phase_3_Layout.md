# Phase 3: Layout & Style Migration - User Stories

**Phase:** 3 of 8
**Status:** ✅ Complete
**Dependencies:** Phase 2 Complete
**Last Updated:** 2026-01-18

## Phase Overview

Establish base layout component and migrate all CSS files. This ensures visual parity and provides the foundation for component rendering.

**Phase Goal:** Layout and styles fully migrated with zero visual regressions.

---

## US-004: Create Base Layout Component

**Priority:** P0 (Critical)
**Estimate:** 1.5 hours
**Status:** ✅ Complete
**Depends On:** US-001

### Story

**As a** developer
**I want** a reusable layout component
**So that** all pages share consistent HTML structure and meta tags

### Acceptance Criteria

- [x] `src/layouts/Layout.astro` file created
- [x] Proper HTML5 document structure
- [x] Meta tags configured:
  - [x] Viewport meta tag
  - [x] Character encoding (UTF-8)
  - [x] Page title (dynamic via props)
  - [x] Description meta tag
  - [ ] Open Graph tags (optional)
- [x] Global CSS files imported
- [x] TypeScript Props interface defined
- [x] Slot for page content works
- [x] Layout renders without errors

### Implementation Notes

**File: `src/layouts/Layout.astro`**

```astro
---
interface Props {
  title: string;
  description?: string;
}

const {
  title,
  description = "Custom chocolate-covered treats, candy grapes, strawberries, and dessert platters. Made fresh to order in the Bronx."
} = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content={description} />
  <title>{title}</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
<body>
  <slot />
</body>
</html>
```

**Key Features:**
- Props interface for type safety
- Dynamic title and description
- Viewport configuration for responsive design
- Slot for page content injection

### Testing Steps

1. Create `Layout.astro` file
2. Create test page using Layout
3. Run `npm run dev`
4. Verify HTML structure in browser DevTools
5. Check meta tags are correct
6. Verify slot content renders

### Dependencies

- US-001 (Project initialized)

### Blocks

None

---

## US-005: Migrate Global Styles

**Priority:** P0 (Critical)
**Estimate:** 2 hours
**Status:** ✅ Complete
**Depends On:** US-004

### Story

**As a** developer
**I want** all existing CSS preserved in the new structure
**So that** visual appearance remains identical

### Acceptance Criteria

- [x] All CSS files copied to `src/styles/`
- [x] CSS files migrated:
  - [x] `variables.css`
  - [x] `base.css`
  - [x] `animations.css`
  - [x] `header.css`
  - [x] `hero.css`
  - [x] `menu.css`
  - [x] `product-modal.css`
  - [x] `cart.css`
  - [x] `checkout.css`
  - [x] `footer.css`
  - [x] `form-validation.css`
- [x] CSS files imported in correct order in Layout
- [x] No 404 errors for CSS files
- [x] CSS custom properties work correctly
- [x] All styles render correctly
- [x] No visual regressions from original
- [x] Responsive behavior maintained

### CSS Import Order

Import styles in `Layout.astro` in this order:

```astro
---
import '../styles/variables.css';
import '../styles/base.css';
import '../styles/animations.css';
import '../styles/header.css';
import '../styles/hero.css';
import '../styles/menu.css';
import '../styles/product-modal.css';
import '../styles/cart.css';
import '../styles/checkout.css';
import '../styles/footer.css';
import '../styles/form-validation.css';
---
```

**Order Rationale:**
1. Variables first (CSS custom properties)
2. Base styles (reset, typography)
3. Animations (keyframes)
4. Feature styles (alphabetical)

### Migration Steps

1. **Copy CSS Files**
   ```bash
   cp -r ../src/styles/* src/styles/
   ```

2. **Review Path Dependencies**
   - Check for any relative imports within CSS
   - Update if needed for new structure

3. **Import in Layout**
   - Add import statements to `Layout.astro`
   - Maintain correct order

4. **Test Each Import**
   - Add one import at a time
   - Verify no errors
   - Check visual output

### Testing Steps

1. Copy all CSS files to `src/styles/`
2. Import CSS in Layout component
3. Run `npm run dev`
4. Check browser console for 404 errors
5. Verify CSS custom properties work:
   - Check DevTools computed styles
   - Verify color variables apply
   - Check spacing variables work
6. Compare with original site side-by-side
7. Test responsive behavior (mobile, tablet, desktop)
8. Verify animations work

### Visual Regression Checklist

- [x] Typography matches (fonts, sizes, weights)
- [x] Colors match (backgrounds, text, borders)
- [x] Spacing matches (margins, padding)
- [x] Layout matches (flexbox, grid)
- [x] Responsive breakpoints work
- [x] Hover states work
- [x] Animations work
- [x] Z-index layering correct

### Dependencies

- US-004 (Layout component created)
- Access to original `src/styles/` directory

### Blocks

None

---

## Phase 3 Completion Criteria

Phase 3 is complete when:

- [x] All user stories marked complete (US-004, US-005)
- [x] Layout component renders correctly
- [x] All CSS files migrated and importing
- [x] Zero visual regressions confirmed
- [x] No console errors or 404s
- [x] Responsive behavior maintained
- [x] Ready to begin Phase 4 (Static Components)

## Phase 3 Testing Checklist

- [x] Layout component has proper HTML structure
- [x] Meta tags configured correctly
- [x] All 11 CSS files in `src/styles/`
- [x] CSS imports in correct order
- [x] No 404 errors for CSS files
- [x] CSS custom properties working
- [x] Visual comparison with original passes
- [x] Responsive behavior identical
- [x] Browser DevTools shows no errors

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-18 | 1.0 | Initial Phase 3 user stories |

---

[← Back to Phase 2](Phase_2_Content.md) | [Back to Index](User_Stories_Index.md) | [Next: Phase 4 →](Phase_4_Static.md)
