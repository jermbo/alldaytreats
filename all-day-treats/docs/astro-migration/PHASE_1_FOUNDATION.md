# Phase 1: Foundation Setup - User Stories

**Phase:** 1 of 8
**Status:** ✅ Complete
**Dependencies:** None
**Last Updated:** 2026-01-18

## Phase Overview

Establish the Astro project structure and content collection infrastructure. This phase provides the foundation for all subsequent work.

**Phase Goal:** Have a working Astro project with proper configuration and content collection setup.

---

## US-001: Initialize Astro Project

**Priority:** P0 (Critical)
**Estimate:** 2 hours
**Status:** ✅ Complete

### Story

**As a** developer
**I want** an Astro project structure with proper configuration
**So that** I have a foundation to build the component-based architecture

### Acceptance Criteria

- [x] Astro project initialized in `all-day-treats/` directory
- [x] `package.json` includes Astro dependencies
- [x] `astro.config.mjs` properly configured
- [x] `tsconfig.json` configured for TypeScript support
- [x] `npm run dev` starts Astro dev server successfully
- [x] Dev server accessible at `http://localhost:4321`
- [x] Directory structure created:
  - [x] `src/components/`
  - [x] `src/content/`
  - [x] `src/layouts/`
  - [x] `src/pages/`
  - [x] `src/scripts/`
  - [x] `src/styles/`
  - [x] `src/assets/images/`
  - [x] `public/`
- [x] `.gitignore` includes Astro build artifacts

### Implementation Notes

```bash
# Commands to run
npm create astro@latest all-day-treats
cd all-day-treats
npm install
npm run dev
```

**Astro Configuration:**
- Use default Astro configuration
- No additional integrations needed initially
- Enable TypeScript support

**Directory Creation:**
```bash
mkdir -p src/components
mkdir -p src/content/products
mkdir -p src/layouts
mkdir -p src/pages
mkdir -p src/scripts
mkdir -p src/styles
mkdir -p src/assets/images
```

### Testing Steps

1. Run `npm run dev`
2. Verify dev server starts without errors
3. Visit `http://localhost:4321`
4. Verify default Astro welcome page displays
5. Verify all directories exist

### Dependencies

- Node.js 18+ installed
- npm or pnpm available

### Blocks

None

---

## US-002: Set Up Content Collection Infrastructure

**Priority:** P0 (Critical)
**Estimate:** 1 hour
**Status:** ✅ Complete
**Depends On:** US-001

### Story

**As a** developer
**I want** a content collection schema for products
**So that** products can be managed as type-safe markdown files

### Acceptance Criteria

- [x] `src/content/config.ts` file created
- [x] Zod schema defined for products collection
- [x] Schema includes all required fields:
  - [x] `id: string`
  - [x] `name: string`
  - [x] `category: enum['candy', 'chocolate', 'platter']`
  - [x] `image: image()`
  - [x] `priceFrom: number (positive)`
  - [x] `priceOptions: array of {count, price}`
  - [x] `extraAddOns: number (default 5)`
  - [x] `order: number (default 999)`
- [x] Content collection registered in exports
- [x] `getCollection('products')` returns empty array (no errors)
- [x] TypeScript types generated correctly

### Implementation Notes

**File: `src/content/config.ts`**

```typescript
import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    id: z.string(),
    name: z.string(),
    category: z.enum(['candy', 'chocolate', 'platter']),
    image: image(),
    priceFrom: z.number().positive(),
    priceOptions: z.array(z.object({
      count: z.number().positive(),
      price: z.number().positive(),
    })),
    extraAddOns: z.number().default(5),
    order: z.number().default(999),
  }),
});

export const collections = { products };
```

**Schema Design Rationale:**
- `id` - Unique identifier for product (used in URLs, cart state)
- `name` - Display name for product
- `category` - Used for filtering (menu tabs)
- `image` - Astro Image helper for optimization
- `priceFrom` - Displayed as "From $X"
- `priceOptions` - Array for quantity/price tiers
- `extraAddOns` - Cost per additional item
- `order` - Display order in menu

### Testing Steps

1. Create `src/content/config.ts` with schema
2. Run `npm run dev`
3. Verify no TypeScript errors
4. Create test file: `src/content/products/test.md`
5. Add minimal frontmatter matching schema
6. Verify content collection builds
7. Delete test file

### Dependencies

- US-001 must be complete (Astro project initialized)
- Zod library (included with Astro)

### Blocks

None

---

## Phase 1 Completion Criteria

Phase 1 is complete when:

- [x] All user stories marked complete (US-001, US-002)
- [x] Astro dev server runs without errors
- [x] Content collection infrastructure ready
- [x] Directory structure established
- [x] TypeScript configuration working
- [x] Ready to begin Phase 2 (Content Migration)

## Phase 1 Testing Checklist

- [ ] `npm run dev` starts successfully
- [ ] `http://localhost:4321` accessible
- [ ] All directories exist
- [ ] `src/content/config.ts` validates correctly
- [ ] TypeScript has no errors
- [ ] Git repository tracking new structure

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-18 | 1.0 | Initial Phase 1 user stories |

---

[← Back to User Stories Index](USER_STORIES_INDEX.md) | [Next: Phase 2 →](PHASE_2_CONTENT.md)
