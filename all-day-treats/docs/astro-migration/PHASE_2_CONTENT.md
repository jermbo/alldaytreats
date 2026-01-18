# Phase 2: Content Migration - User Stories

**Phase:** 2 of 8
**Status:** ⬜ Not Started
**Dependencies:** Phase 1 Complete
**Last Updated:** 2026-01-18

## Phase Overview

Convert all products from hardcoded JavaScript objects to markdown files with frontmatter. This separates content from code and enables non-developers to manage products.

**Phase Goal:** All 9 products migrated to markdown files with images optimized.

---

## US-003: Convert Products to Markdown

**Priority:** P0 (Critical)
**Estimate:** 3 hours
**Status:** ⬜ Not Started
**Depends On:** US-002

### Story

**As a** business owner
**I want** products stored as markdown files
**So that** I can edit product information without touching code

### Acceptance Criteria

- [ ] All 9 products converted to individual markdown files
- [ ] Product files created in `src/content/products/`:
  - [ ] `candy-grapes.md`
  - [ ] `candy-strawberries.md`
  - [ ] `candy-pineapple-rings.md`
  - [ ] `chocolate-strawberries.md`
  - [ ] `cake-pops.md`
  - [ ] `chocolate-oreos.md`
  - [ ] `chocolate-pretzels.md`
  - [ ] `chocolate-rice-krispies.md`
  - [ ] `party-platter.md`
- [ ] All product images copied to `src/assets/images/`
- [ ] Each markdown file has valid frontmatter matching schema
- [ ] Content collection validates all products (no errors)
- [ ] `getCollection('products')` returns all 9 products
- [ ] Products sorted by `order` field
- [ ] Product descriptions migrated to markdown body

### Product Migration Checklist

#### Candy Products

**1. Candy Grapes** (`candy-grapes.md`)
- [ ] Frontmatter complete
- [ ] Image: `candy-grapes-new.jpg` copied
- [ ] Price options: 6/$10, 8/$15, 12/$20
- [ ] Description migrated
- [ ] Order: 1

**2. Candy Strawberries** (`candy-strawberries.md`)
- [ ] Frontmatter complete
- [ ] Image: `candy-strawberries.jpg` copied
- [ ] Price options: 6/$15, 8/$20, 12/$25
- [ ] Description migrated
- [ ] Order: 2

**3. Candy Pineapple Rings** (`candy-pineapple-rings.md`)
- [ ] Frontmatter complete
- [ ] Image: `candy-pineapple-rings.jpg` copied
- [ ] Price options: 6/$15, 8/$20, 12/$25
- [ ] Description migrated
- [ ] Order: 3

#### Chocolate Products

**4. Chocolate Strawberries** (`chocolate-strawberries.md`)
- [ ] Frontmatter complete
- [ ] Image: `chocolate-strawberries-new.jpg` copied
- [ ] Price options: 6/$15, 8/$20, 12/$25
- [ ] Description migrated
- [ ] Order: 4

**5. Cake Pops** (`cake-pops.md`)
- [ ] Frontmatter complete
- [ ] Image: `cake-pops.jpg` copied
- [ ] Price options: 6/$18, 8/$24, 12/$30
- [ ] Description migrated
- [ ] Order: 5

**6. Chocolate Oreos** (`chocolate-oreos.md`)
- [ ] Frontmatter complete
- [ ] Image: `chocolate-oreos.jpg` copied
- [ ] Price options: 6/$15, 8/$20, 12/$25
- [ ] Description migrated
- [ ] Order: 6

**7. Chocolate Pretzels** (`chocolate-pretzels.md`)
- [ ] Frontmatter complete
- [ ] Image: `chocolate-pretzels.jpg` copied
- [ ] Price options: 6/$15, 8/$20, 12/$25
- [ ] Description migrated
- [ ] Order: 7

**8. Chocolate Rice Krispies** (`chocolate-rice-krispies.md`)
- [ ] Frontmatter complete
- [ ] Image: `chocolate-rice-krispies.jpg` copied
- [ ] Price options: 6/$15, 8/$20, 12/$25
- [ ] Description migrated
- [ ] Order: 8

#### Platter Products

**9. Party Platter** (`party-platter.md`)
- [ ] Frontmatter complete
- [ ] Image: `party-platter.jpg` copied
- [ ] Price options: 1/$45, 1/$60, 1/$75
- [ ] Description migrated
- [ ] Order: 9

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

- [ ] All 9 markdown files exist in `src/content/products/`
- [ ] All images exist in `src/assets/images/`
- [ ] No validation errors in dev server console
- [ ] Product data queryable via content collection
- [ ] Each product has complete data
- [ ] Image paths resolve correctly

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-18 | 1.0 | Initial Phase 2 user stories |

---

[← Back to Phase 1](PHASE_1_FOUNDATION.md) | [Back to Index](USER_STORIES_INDEX.md) | [Next: Phase 3 →](PHASE_3_LAYOUT.md)
