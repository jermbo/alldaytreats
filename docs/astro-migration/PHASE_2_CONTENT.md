# Phase 2: Content Migration - User Stories

**Phase:** 2 of 8
**Status:** ✅ Complete
**Dependencies:** Phase 1 Complete
**Last Updated:** 2026-01-18

## Phase Overview

Convert all products from hardcoded JavaScript objects to markdown files with frontmatter. This separates content from code and enables non-developers to manage products.

**Phase Goal:** All 9 products migrated to markdown files with images optimized.

---

## US-003: Convert Products to Markdown

**Priority:** P0 (Critical)
**Estimate:** 3 hours
**Status:** ✅ Complete
**Depends On:** US-002

### Story

**As a** business owner
**I want** products stored as markdown files
**So that** I can edit product information without touching code

### Acceptance Criteria

- [x] All 9 products converted to individual markdown files
- [x] Product files created in `src/content/products/`:
  - [x] `candy-grapes.md`
  - [x] `candy-strawberries.md`
  - [x] `candy-pineapple.md` (matches product ID from products.js)
  - [x] `chocolate-strawberries.md`
  - [x] `cake-pops.md`
  - [x] `chocolate-oreos.md`
  - [x] `chocolate-pretzels.md`
  - [x] `chocolate-rice-krispies.md`
  - [x] `party-platter.md`
- [x] All product images copied to `src/assets/images/`
- [x] Each markdown file has valid frontmatter matching schema
- [x] Content collection validates all products (no errors)
- [x] `getCollection('products')` returns all 9 products
- [x] Products sorted by `order` field
- [x] Product descriptions migrated to markdown body

### Product Migration Checklist

#### Candy Products

**1. Candy Grapes** (`candy-grapes.md`)
- [x] Frontmatter complete
- [x] Image: `candy-grapes-new.jpg` copied
- [x] Price options: 6/$10, 8/$15, 12/$20
- [x] Description migrated
- [x] Order: 1

**2. Candy Strawberries** (`candy-strawberries.md`)
- [x] Frontmatter complete
- [x] Image: `candy-strawberries.jpg` copied
- [x] Price options: 6/$10, 8/$15, 12/$20
- [x] Description migrated
- [x] Order: 2

**3. Candy Pineapple** (`candy-pineapple.md`)
- [x] Frontmatter complete
- [x] Image: `candy-pineapple-rings.jpg` copied
- [x] Price options: 6/$12, 8/$17, 12/$27
- [x] Description migrated
- [x] Order: 3

#### Chocolate Products

**4. Chocolate Strawberries** (`chocolate-strawberries.md`)
- [x] Frontmatter complete
- [x] Image: `chocolate-strawberries-new.jpg` copied
- [x] Price options: 6/$10, 8/$15, 12/$20
- [x] Description migrated
- [x] Order: 4

**5. Cake Pops** (`cake-pops.md`)
- [x] Frontmatter complete
- [x] Image: `cake-pops.jpg` copied
- [x] Price options: 6/$10, 8/$17, 12/$27
- [x] Description migrated
- [x] Order: 5

**6. Chocolate Oreos** (`chocolate-oreos.md`)
- [x] Frontmatter complete
- [x] Image: `chocolate-oreos.jpg` copied
- [x] Price options: 6/$10, 8/$15, 12/$20
- [x] Description migrated
- [x] Order: 6

**7. Chocolate Pretzels** (`chocolate-pretzels.md`)
- [x] Frontmatter complete
- [x] Image: `chocolate-pretzels.jpg` copied
- [x] Price options: 6/$10, 8/$15, 12/$20
- [x] Description migrated
- [x] Order: 7

**8. Chocolate Rice Krispies** (`chocolate-rice-krispies.md`)
- [x] Frontmatter complete
- [x] Image: `chocolate-rice-krispies.jpg` copied
- [x] Price options: 6/$15, 8/$15, 12/$20
- [x] Description migrated
- [x] Order: 8

#### Platter Products

**9. Party Platter** (`party-platter.md`)
- [x] Frontmatter complete
- [x] Image: `party-platter.jpg` copied
- [x] Price options: 1/$45, 2/$55, 3/$60
- [x] Description migrated
- [x] Order: 9

### Implementation Template

**Markdown File Template:**

```markdown
---
id: product-id
name: Product Name
category: candy
image: ../../assets/images/product-image.jpg
priceFrom: 10
priceOptions:
  - count: 6
    price: 10
  - count: 8
    price: 15
  - count: 12
    price: 20
extraAddOns: 5
order: 1
---

Product description goes here. Supports **markdown** formatting.
```

### Data Migration Reference

**Source:** `/Users/admin/Desktop/Work/Clients/AllDayTreats/alldaytreats/src/products.js`

Extract product data from current `products.js`:
1. Product ID
2. Product name
3. Category
4. Image filename
5. Price options
6. Description

### Testing Steps

1. Create all 9 markdown files
2. Copy all images to `src/assets/images/`
3. Run `npm run dev`
4. Check for validation errors in console
5. Test in browser console:
   ```javascript
   // In Astro component
   const products = await getCollection('products');
   console.log(products.length); // Should be 9
   ```
6. Verify each product has:
   - Valid frontmatter
   - Correct image path
   - Valid price options array
   - Description content

### Dependencies

- US-002 must be complete (Content collection schema)
- Access to original `src/products.js` file
- Access to original `src/images/` directory

### Blocks

None

---

## Phase 2 Completion Criteria

Phase 2 is complete when:

- [x] All 9 products migrated to markdown
- [x] All product images copied and accessible
- [x] Content collection validates without errors
- [x] `getCollection('products')` returns 9 products
- [x] No TypeScript or build errors
- [x] Ready to begin Phase 3 (Layout & Styles)

## Phase 2 Testing Checklist

- [x] All 9 markdown files exist in `src/content/products/`
- [x] All images exist in `src/assets/images/`
- [x] No validation errors in dev server console
- [x] Product data queryable via content collection
- [x] Each product has complete data
- [x] Image paths resolve correctly

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-18 | 1.0 | Initial Phase 2 user stories |

---

[← Back to Phase 1](PHASE_1_FOUNDATION.md) | [Back to Index](USER_STORIES_INDEX.md) | [Next: Phase 3 →](PHASE_3_LAYOUT.md)
