# Frontend Style Guidelines

## Overview

This document outlines the CSS architecture and styling principles for the AllDayTreats project. These guidelines ensure maintainable, modern, and performant stylesheets using the latest CSS features.

---

## Core Principles

### 1. Modern CSS Nesting

Use **native CSS nesting** (not SASS) for specific use cases only.

#### ✅ **CORRECT - What to Nest:**

```css
.button {
  background: blue;
  transition: all 0.3s;

  /* Pseudo-classes */
  &:hover {
    background: darkblue;
  }

  &:focus {
    outline: 2px solid blue;
  }

  &:active {
    transform: scale(0.98);
  }

  /* Pseudo-elements */
  &::before {
    content: "→";
  }

  &::after {
    content: "";
  }

  /* Attribute selectors */
  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &[aria-hidden="true"] {
    display: none;
  }

  /* Container queries */
  @container (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }

  /* Media queries */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}
```

#### ❌ **INCORRECT - What NOT to Nest:**

```css
.cart {
  opacity: 0;

  /* ❌ WRONG - SASS-style BEM modifiers */
  &--open {
    opacity: 1;
  }

  /* ❌ WRONG - Child classes */
  .cart__backdrop {
    opacity: 1;
  }

  /* ❌ WRONG - Descendant selectors */
  .cart__panel {
    transform: translateX(0);
  }
}
```

#### ✅ **CORRECT Alternative:**

```css
.cart {
  opacity: 0;
  transition: opacity 0.3s;
}

/* Modifier as separate rule */
.cart--open {
  opacity: 1;
}

/* Child relationship as separate rule */
.cart--open .cart__backdrop {
  opacity: 1;
}

.cart--open .cart__panel {
  transform: translateX(0);
}
```

---

### 2. Maximum Nesting Depth: 3 Levels

Never nest deeper than 3 levels. This keeps selectors maintainable and prevents specificity issues.

#### ✅ **CORRECT:**

```css
.card {
  padding: 16px;

  &:hover {
    transform: translateY(-4px);

    &::after {
      opacity: 1;
    }
  }
}
/* Level 1: .card
   Level 2: .card:hover
   Level 3: .card:hover::after */
```

#### ❌ **INCORRECT:**

```css
.section {
  .container {
    .card {
      .content {
        /* Too deep! 4+ levels */
      }
    }
  }
}
```

---

### 3. No Magic Values - Use Custom Properties

Every value should come from the design system defined in `variables.css`.

#### ❌ **INCORRECT - Magic Values:**

```css
.button {
  padding: 12px 24px;           /* ❌ Magic spacing */
  border-radius: 8px;            /* ❌ Magic radius */
  font-size: 16px;               /* ❌ Magic size */
  opacity: 0.8;                  /* ❌ Magic opacity */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* ❌ Magic shadow */
}
```

#### ✅ **CORRECT - Use Variables:**

```css
.button {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  opacity: var(--opacity-primary);
  box-shadow: var(--shadow-base);
}
```

---

### 4. Intrinsic Design with Container Queries

Components should adapt to their **container**, not the viewport. Use `@container` queries instead of `@media` queries wherever possible.

#### ❌ **OLD WAY - Media Queries:**

```css
.card {
  padding: 24px;
}

@media (max-width: 768px) {
  .card {
    padding: 16px;
  }
}
```

#### ✅ **NEW WAY - Container Queries:**

```css
.sidebar {
  container-type: inline-size;
  container-name: sidebar;
}

.card {
  padding: var(--spacing-lg);

  @container sidebar (max-width: 400px) {
    padding: var(--spacing-base);
  }
}
```

**Benefits:**
- Component works in any context (sidebar, modal, full-width)
- More reusable and flexible
- Better component isolation

---

## Custom Properties System

All design tokens are defined in `src/styles/variables.css` and organized into logical sections.

### Organization Structure

```css
:root {
  /* ============================================
     COLORS
     ============================================ */

  /* Base Colors */
  --color-bg-dark: #1a1a1a;
  --color-text-light: #ffffff;

  /* Accent Colors */
  --color-accent-blue: #87ceeb;
  --color-accent-purple: #9b59b6;

  /* ============================================
     SPACING
     ============================================ */

  /* Micro Spacing */
  --spacing-3xs: 0.125rem; /* 2px */
  --spacing-2xs: 0.25rem;  /* 4px */
  --spacing-xs: 0.375rem;  /* 6px */

  /* Standard Spacing */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-base: 1rem;    /* 16px */
  --spacing-lg: 2rem;      /* 32px */
  --spacing-xl: 3rem;      /* 48px */

  /* ... other categories ... */
}
```

### Available Custom Properties

#### **Colors**
- Base: `--color-bg-dark`, `--color-text-light`, `--color-text-dark`
- Accents: `--color-accent-blue`, `--color-accent-purple`, `--color-accent-pink`, `--color-accent-green`
- Overlays: `--color-overlay-light`, `--color-overlay-dark`
- Validation: `--color-success`, `--color-error`

#### **Spacing**
- Micro: `--spacing-3xs` (2px) → `--spacing-xs` (6px)
- Standard: `--spacing-sm` (8px) → `--spacing-xl` (48px)

#### **Typography**
- Sizes: `--font-size-xs` (12px) → `--font-size-5xl` (48px)
- Family: `--font-family-base`
- Line height: `--line-height-base`

#### **Border Radius**
- `--radius-sm` (4px) - buttons, badges
- `--radius-base` (6px) - inputs, cards
- `--radius-lg` (8px) - modals, panels
- `--radius-full` (50%) - circles

#### **Opacity**
- `--opacity-disabled` (0.4)
- `--opacity-muted` (0.5)
- `--opacity-medium` (0.6)
- `--opacity-secondary` (0.7)
- `--opacity-primary` (0.8)
- `--opacity-hover` (0.9)

#### **Sizing**
- Icons: `--size-icon-sm` → `--size-icon-2xl`
- Buttons: `--size-button-sm`, `--size-button-base`
- Logos: `--size-logo-sm`, `--size-logo-base`, `--size-logo-lg`
- Images: `--size-image-sm` → `--size-image-2xl`

#### **Z-Index**
- `--z-sticky` (100) - sticky header
- `--z-overlay` (200) - modals, panels

#### **Transitions**
- Durations: `--transition-fast` (0.2s), `--transition-base` (0.3s), `--transition-slow` (0.6s)
- Easings: `--easing-spring`, `--easing-smooth`, `--easing-exit`

#### **Shadows**
- Elevation: `--shadow-sm`, `--shadow-base`, `--shadow-lg`
- Glows: `--shadow-glow-blue`, `--shadow-glow-purple`
- Component-specific: `--shadow-header`, `--shadow-menu-hover`, `--shadow-panel`, etc.

---

## File Organization

### Structure

```
src/styles/
├── variables.css       # All design tokens
├── base.css           # Reset and base styles
├── animations.css     # Keyframes and animation definitions
├── header.css         # Header component styles
├── hero.css           # Hero component styles
├── menu.css           # Menu component styles
├── product-modal.css  # Product modal styles
├── cart.css           # Cart panel styles
├── checkout.css       # Checkout panel styles
├── footer.css         # Footer component styles
└── form-validation.css # Form validation styles
```

### Import Order (in Layout.astro)

```astro
---
import '../styles/variables.css';      // 1. Design tokens first
import '../styles/base.css';           // 2. Base/reset styles
import '../styles/animations.css';     // 3. Animations
import '../styles/header.css';         // 4. Component styles
import '../styles/hero.css';
import '../styles/menu.css';
import '../styles/product-modal.css';
import '../styles/cart.css';
import '../styles/checkout.css';
import '../styles/footer.css';
import '../styles/form-validation.css';
---
```

---

## Container Query Setup

### Step 1: Define Container

Add `container-type` and `container-name` to the parent element:

```css
.sidebar {
  container-type: inline-size;
  container-name: sidebar;
}
```

### Step 2: Use Container Queries

Nest `@container` queries within child elements:

```css
.card {
  padding: var(--spacing-lg);
  font-size: var(--font-size-base);

  @container sidebar (max-width: 400px) {
    padding: var(--spacing-base);
    font-size: var(--font-size-sm);
  }
}
```

### Container Types

- `inline-size` - Queries based on container width (most common)
- `size` - Queries based on both width and height
- `normal` - Element is not a container

---

## Naming Conventions

### BEM Methodology

Use BEM (Block Element Modifier) for class names:

```css
/* Block */
.menu { }

/* Elements */
.menu__title { }
.menu__item { }
.menu__button { }

/* Modifiers */
.menu__item--active { }
.menu__button--disabled { }
```

**Rules:**
- Use double underscores `__` for elements
- Use double hyphens `--` for modifiers
- Use kebab-case for multi-word names
- Keep names semantic and descriptive

---

## Common Patterns

### Interactive States

```css
.button {
  background: var(--color-accent-blue);
  color: var(--color-bg-dark);
  transition: transform var(--transition-fast),
              box-shadow var(--transition-fast);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-button);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent-blue);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: var(--opacity-disabled);
    cursor: not-allowed;
  }
}
```

### Responsive Containers

```css
.panel {
  container-type: inline-size;
  container-name: panel;
  padding: var(--spacing-lg);

  @container panel (max-width: 600px) {
    padding: var(--spacing-base);
  }
}

.panel__title {
  font-size: var(--font-size-2xl);

  @container panel (max-width: 600px) {
    font-size: var(--font-size-xl);
  }
}
```

### Hidden States

```css
.element {
  display: block;

  &[hidden] {
    display: none !important;
  }

  &[aria-hidden="true"] {
    display: none;
  }
}
```

---

## Animation Guidelines

### Keep Animations Near Usage

Define keyframes close to where they're used (not in a separate animations file unless shared):

```css
.modal {
  animation: modal-fade-in var(--transition-base) var(--easing-smooth);
}

/* Keyframe defined near usage */
@keyframes modal-fade-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### Use CSS Variables in Animations

```css
.menu__item {
  animation: entrance var(--transition-slow) var(--easing-spring);
}

@keyframes entrance {
  from {
    opacity: 0;
    transform: scale(0.5) rotate(calc(var(--entrance-rotate, 12deg)));
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
```

---

## Performance Considerations

### Prefer `transform` and `opacity`

These properties are GPU-accelerated:

```css
/* ✅ Good - GPU accelerated */
.card {
  transform: translateY(0);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-4px);
  }
}

/* ❌ Avoid - triggers layout */
.card {
  top: 0;
  transition: top 0.3s;

  &:hover {
    top: -4px;
  }
}
```

### Use `contain` Property

Help the browser optimize rendering:

```css
.card {
  contain: layout;  /* Isolates layout calculations */
}
```

---

## Accessibility

### Focus States

Always provide visible focus indicators:

```css
.button {
  &:focus {
    outline: none;  /* Remove default only if replacing */
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent-blue);
    outline-offset: 2px;
  }
}
```

### Reduced Motion

Respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    transition: none;
  }
}
```

---

## Adding New Custom Properties

When adding new values to the design system:

### 1. **Identify the Pattern**

Look for repeated values:
```css
/* ❌ Magic values scattered throughout */
padding: 6px;
gap: 6px;
margin-bottom: 6px;
```

### 2. **Create Semantic Token**

Add to `variables.css` in appropriate section:
```css
/* In SPACING section */
--spacing-xs: 0.375rem; /* 6px - between 2xs and sm */
```

### 3. **Use Consistently**

Replace all instances:
```css
/* ✅ Using design token */
padding: var(--spacing-xs);
gap: var(--spacing-xs);
margin-bottom: var(--spacing-xs);
```

### 4. **Document Usage**

Add comments explaining when to use:
```css
/* Micro Spacing (for tight layouts) */
--spacing-3xs: 0.125rem; /* 2px - minimal gaps */
--spacing-2xs: 0.25rem;  /* 4px - small gaps */
--spacing-xs: 0.375rem;  /* 6px - between 2xs and sm */
```

---

## Migration Checklist

When refactoring existing CSS:

- [ ] Replace all magic values with custom properties
- [ ] Convert SASS-style nesting to native CSS nesting
- [ ] Use container queries instead of media queries where appropriate
- [ ] Nest only pseudo-selectors, pseudo-elements, and queries
- [ ] Ensure max 3 levels of nesting
- [ ] Remove duplicate container declarations
- [ ] Add comments for complex logic
- [ ] Test in modern browsers (Chrome, Firefox, Safari, Edge latest)
- [ ] Verify no linter errors
- [ ] Test responsive behavior at various container sizes

---

## Browser Support

These guidelines target modern evergreen browsers:
- Chrome 105+ (Container Queries, Native Nesting)
- Firefox 110+ (Container Queries, Native Nesting)
- Safari 16+ (Container Queries, Native Nesting)
- Edge 105+ (Container Queries, Native Nesting)

No fallbacks needed for legacy browsers.

---

## Resources

- [MDN: CSS Nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)
- [MDN: Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries)
- [BEM Methodology](https://getbem.com/)
- [Modern CSS Solutions](https://moderncss.dev/)

---

## Questions?

For questions or clarifications about these guidelines, refer to:
- Review recent CSS refactoring commits
- Check `variables.css` for available design tokens
- Look at existing components for patterns
