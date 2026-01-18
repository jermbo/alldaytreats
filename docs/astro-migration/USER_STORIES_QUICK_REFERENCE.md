# User Stories Quick Reference

**Quick lookup for all Astro migration user stories**
**Last Updated:** 2026-01-18

## All User Stories (28 Total)

### Phase 1: Foundation Setup (2 stories)

| ID | Title | Priority | Estimate | Status |
|----|-------|----------|----------|--------|
| US-001 | Initialize Astro Project | P0 | 2h | ⬜ |
| US-002 | Set Up Content Collection Infrastructure | P0 | 1h | ⬜ |

### Phase 2: Content Migration (1 story)

| ID | Title | Priority | Estimate | Status |
|----|-------|----------|----------|--------|
| US-003 | Convert Products to Markdown | P0 | 3h | ⬜ |

### Phase 3: Layout & Styles (2 stories)

| ID | Title | Priority | Estimate | Status |
|----|-------|----------|----------|--------|
| US-004 | Create Base Layout Component | P0 | 1.5h | ⬜ |
| US-005 | Migrate Global Styles | P0 | 2h | ⬜ |

### Phase 4: Static Components (5 stories)

| ID | Title | Priority | Estimate | Status |
|----|-------|----------|----------|--------|
| US-006 | Build Header Component | P0 | 1h | ⬜ |
| US-007 | Build Hero Component | P0 | 1h | ⬜ |
| US-008 | Build Footer Component | P1 | 1h | ⬜ |
| US-009 | Build ProductCard Component | P0 | 1.5h | ⬜ |
| US-010 | Build Menu Component | P0 | 2h | ⬜ |

### Phase 5: Interactive Components (3 stories)

| ID | Title | Priority | Estimate | Status |
|----|-------|----------|----------|--------|
| US-011 | Build CartPanel Component | P0 | 2h | ⬜ |
| US-012 | Build ProductModal Component | P0 | 2h | ⬜ |
| US-013 | Build CheckoutPanel Component | P0 | 2.5h | ⬜ |

### Phase 6: JavaScript Migration (8 stories)

| ID | Title | Priority | Estimate | Status |
|----|-------|----------|----------|--------|
| US-014 | Migrate Cart Logic | P0 | 1.5h | ⬜ |
| US-015 | Migrate Cart UI Logic | P0 | 2h | ⬜ |
| US-016 | Migrate Product Modal Logic | P0 | 2h | ⬜ |
| US-017 | Migrate Menu Filtering Logic | P1 | 1h | ⬜ |
| US-018 | Migrate Checkout UI Logic | P0 | 2h | ⬜ |
| US-019 | Migrate Form Validation Logic | P0 | 2h | ⬜ |
| US-020 | Migrate Phone Formatter Logic | P1 | 1h | ⬜ |
| US-021 | Update Product Data Access | P0 | 1.5h | ⬜ |

### Phase 7: Testing & Validation (4 stories)

| ID | Title | Priority | Estimate | Status |
|----|-------|----------|----------|--------|
| US-022 | Visual Regression Testing | P0 | 3h | ⬜ |
| US-023 | Functional Testing | P0 | 4h | ⬜ |
| US-024 | Performance Testing | P1 | 2h | ⬜ |
| US-025 | Cross-Browser & Device Testing | P1 | 3h | ⬜ |

### Phase 8: Documentation & Cleanup (3 stories)

| ID | Title | Priority | Estimate | Status |
|----|-------|----------|----------|--------|
| US-026 | Update Project Documentation | P0 | 2h | ⬜ |
| US-027 | Clean Up Old Project Files | P1 | 1h | ⬜ |
| US-028 | Prepare for Deployment | P0 | 2h | ⬜ |

## Total Estimates

| Phase | Stories | Estimated Hours |
|-------|---------|-----------------|
| Phase 1 | 2 | 3h |
| Phase 2 | 1 | 3h |
| Phase 3 | 2 | 3.5h |
| Phase 4 | 5 | 6.5h |
| Phase 5 | 3 | 6.5h |
| Phase 6 | 8 | 13h |
| Phase 7 | 4 | 12h |
| Phase 8 | 3 | 5h |
| **Total** | **28** | **52.5h** |

## Critical Path (Must Complete in Order)

1. **US-001** → Initialize Astro Project
2. **US-002** → Content Collection Infrastructure
3. **US-003** → Convert Products to Markdown
4. **US-004** → Create Base Layout
5. **US-005** → Migrate Global Styles
6. **US-006-013** → Build All Components (some parallel)
7. **US-014-021** → Migrate JavaScript (some parallel)
8. **US-022-025** → Testing & Validation
9. **US-026-028** → Documentation & Deployment

## By Priority

### P0 - Critical (Must Have)
US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016, US-018, US-019, US-021, US-022, US-023, US-026, US-028

**Total P0: 22 stories**

### P1 - High (Should Have)
US-008, US-017, US-020, US-024, US-025, US-027

**Total P1: 6 stories**

## By Role

### Developer Stories (18)
US-001, US-002, US-004, US-005, US-009, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018, US-019, US-020, US-021, US-026, US-027

### User/Visitor Stories (7)
US-006, US-007, US-008, US-010, US-022, US-023, US-025

### Business Owner Stories (1)
US-003

### Stakeholder Stories (2)
US-024, US-028

## Parallel Work Opportunities

These stories can be worked on simultaneously:

**After Phase 3:**
- US-006, US-007, US-008 (Header, Hero, Footer - independent)

**After Phase 4:**
- US-011, US-012, US-013 (Overlay components - independent)

**After Phase 5:**
- US-014, US-015 (Cart logic + UI)
- US-016, US-017 (Modal + Menu filtering)
- US-018, US-019, US-020 (Checkout components)

**During Phase 7:**
- US-022, US-024 (Visual + Performance - can run parallel)

## Quick Links

- [Full User Stories Index](USER_STORIES_INDEX.md)
- [Phase 1: Foundation](PHASE_1_FOUNDATION.md)
- [Phase 2: Content](PHASE_2_CONTENT.md)
- [Phase 3: Layout](PHASE_3_LAYOUT.md)
- [Phase 4: Static Components](PHASE_4_STATIC.md)
- [Phase 5: Interactive Components](PHASE_5_INTERACTIVE.md)
- [Phase 6: JavaScript](PHASE_6_JAVASCRIPT.md)
- [Phase 7: Testing](PHASE_7_TESTING.md)
- [Phase 8: Cleanup](PHASE_8_CLEANUP.md)

---

*Part of the [Coding with VIBES](../../docs/coding_with_vibes/README.md) methodology*
