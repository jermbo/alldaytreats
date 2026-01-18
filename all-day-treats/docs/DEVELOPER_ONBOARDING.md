# Developer Onboarding

**Document Type:** Ground Level / Implementation Guide
**Part of:** [Coding with V.I.B.E.S.](../../docs/coding_with_vibes/README.md)
**Status:** Active
**Last Updated:** 2026-01-18

## Purpose

This document provides everything a developer needs to get started working on the All Day Treats Astro site. It covers installation, project structure, development workflow, and contribution guidelines.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed
- **npm** or **pnpm** package manager
- **Git** for version control
- Code editor (VS Code recommended for Astro)
- Basic understanding of HTML, CSS, JavaScript
- Familiarity with markdown syntax

## Quick Start

### 1. Installation

```bash
# Clone the repository (if applicable)
cd all-day-treats

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to view the site.

### 2. Available Scripts

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run Astro CLI commands
npm run astro
```

## Project Structure

### Directory Overview

```
all-day-treats/
├── public/                    # Static assets (served as-is)
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── images/           # Optimized product images
│   ├── components/           # Astro components
│   ├── content/
│   │   ├── config.ts         # Content collection schema (Zod)
│   │   └── products/         # Product markdown files
│   ├── layouts/
│   │   └── Layout.astro      # Base page layout
│   ├── pages/
│   │   └── index.astro       # Homepage (routes to /)
│   ├── scripts/              # Client-side JavaScript
│   └── styles/               # Global CSS
├── docs/                     # Project documentation
│   ├── vision/               # 30,000ft documentation
│   ├── architecture/         # 15,000ft documentation
│   └── DEVELOPER_ONBOARDING.md
├── astro.config.mjs          # Astro configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

### Key Directories Explained

**`src/components/`**
Astro components - each component is self-contained and focused on a single responsibility. Components render at build time and produce static HTML.

**`src/content/products/`**
Product data as markdown files with frontmatter. Managed by Astro Content Collections with type-safe schema validation.

**`src/scripts/`**
Vanilla JavaScript that runs in the browser. Handles all client-side interactivity (cart, modals, validation, etc.).

**`src/styles/`**
Global CSS files organized by feature. Uses CSS custom properties for design tokens. No CSS modules or scoped styles.

**`src/assets/images/`**
Product images that are automatically optimized by Astro (WebP conversion, responsive sizing, lazy loading).

**`public/`**
Static files served as-is without processing (favicon, robots.txt, etc.).

## Development Workflow

### Working on Components

1. **Locate the component** in `src/components/`
2. **Edit the `.astro` file** (HTML-like syntax)
3. **Save and preview** (hot reload updates automatically)
4. **Test functionality** in the browser

**Astro Component Structure:**

```astro
---
// Component script (runs at build time)
import { getCollection } from 'astro:content';

interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!-- Component template -->
<div class="component">
  <h2>{title}</h2>
</div>

<style>
  /* Avoid scoped styles - use global CSS instead */
</style>
```

### Adding a Product

Products are markdown files with structured frontmatter:

**Step 1: Create markdown file**

```bash
# Create file in src/content/products/
touch src/content/products/new-product.md
```

**Step 2: Add product data**

```markdown
---
id: new-product
name: New Product Name
category: candy
image: ../../assets/images/new-product.jpg
priceFrom: 10
priceOptions:
  - count: 6
    price: 10
  - count: 8
    price: 15
  - count: 12
    price: 20
extraAddOns: 5
order: 10
---

Product description goes here. Supports **markdown** formatting.
```

**Step 3: Add product image**

```bash
# Add image to src/assets/images/
cp path/to/image.jpg src/assets/images/new-product.jpg
```

**Step 4: Build and test**

```bash
npm run dev
# Navigate to site and verify product appears
```

### Updating Styles

1. **Locate the relevant CSS file** in `src/styles/`
2. **Edit the styles** (uses BEM-style naming)
3. **Preview changes** (hot reload)
4. **Test responsive behavior**

**CSS Organization:**

- `variables.css` - Design tokens (colors, spacing, fonts)
- `base.css` - Reset and base styles
- Feature-specific files (e.g., `cart.css`, `menu.css`)

**Example: Updating a color**

```css
/* variables.css */
:root {
  --text-color-primary: var(--color-dark);
  --background-color-surface: var(--color-white);
}
```

### Working with JavaScript

All client-side JavaScript lives in `src/scripts/` and is vanilla JS (no frameworks).

**Adding a script to a page:**

```astro
---
// src/pages/index.astro
---

<html>
  <body>
    <!-- content -->

    <script>
      import '../scripts/cart.js';
      import '../scripts/cart-ui.js';
    </script>
  </body>
</html>
```

**JavaScript Module Pattern:**

```javascript
// Export functions and state
export const state = {
  // module state
};

export const doSomething = () => {
  // function logic
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  // initialization
});
```

## Building for Production

### Build Process

```bash
# Build static site
npm run build
```

**Output:**
- Static HTML files in `dist/`
- Optimized images (WebP, multiple sizes)
- Minified CSS and JavaScript
- Ready for deployment

### Preview Production Build

```bash
# Preview production build locally
npm run preview
```

Visit the provided URL to test the production build.

### Deployment

The built site (`dist/` folder) can be deployed to any static hosting:

- **Netlify**: Connect repo and auto-deploy
- **Vercel**: Import project and deploy
- **Cloudflare Pages**: Connect GitHub and deploy
- **GitHub Pages**: Push `dist/` folder to `gh-pages` branch
- **Traditional hosting**: Upload `dist/` contents via FTP

**Requirements:**
- Zero backend
- Zero databases
- Zero monthly costs
- Just static file hosting

## Testing Checklist

Before committing changes, verify:

### Visual Testing
- [ ] Changes look correct on desktop
- [ ] Changes look correct on mobile
- [ ] No layout breaking or style conflicts
- [ ] Responsive behavior works

### Functional Testing
- [ ] Interactive features work (cart, modal, checkout)
- [ ] Forms validate correctly
- [ ] Links and buttons work
- [ ] No console errors

### Performance Testing
- [ ] Images load correctly
- [ ] Page loads quickly
- [ ] No broken links or 404s

## Coding Standards

### TypeScript Interfaces

Always define Props interfaces for components:

```typescript
interface Props {
  title: string;
  isVisible?: boolean;
}

const Component = ({ title, isVisible = false }: Props) => {
  // component logic
};
```

### Function Expressions

Use function expressions over declarations:

```javascript
// Good
const handleClick = () => {
  // logic
};

// Avoid
function handleClick() {
  // logic
}
```

### Explicit Returns

Always specify return types:

```typescript
const getTotal = (): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
```

### No Barrel Files

Import explicitly, no `index.js` re-exports:

```javascript
// Good
import { cart } from './scripts/cart.js';

// Avoid
import { cart } from './scripts';
```

### CSS Custom Properties

Use custom properties for reusable values:

```css
/* Define base values */
:root {
  --color-primary: #ff6b6b;
  --spacing-base: 1rem;
}

/* Use semantic naming */
:root {
  --button-background: var(--color-primary);
  --section-padding: calc(var(--spacing-base) * 2);
}
```

## Common Tasks

### Updating Contact Information

Edit `Header.astro` and `Footer.astro` components:

```astro
<!-- Update phone, email, Instagram handle -->
<a href="tel:555-555-5555">555-555-5555</a>
<a href="mailto:alldaytreats@gmail.com">alldaytreats@gmail.com</a>
```

### Adding a New Page

1. Create `.astro` file in `src/pages/`
2. Use `Layout.astro` for consistent structure
3. Add navigation links in `Header.astro`

```astro
---
// src/pages/about.astro
import Layout from '../layouts/Layout.astro';
---

<Layout title="About Us">
  <main>
    <h1>About All Day Treats</h1>
    <!-- page content -->
  </main>
</Layout>
```

### Modifying Product Schema

Edit `src/content/config.ts` to add fields:

```typescript
const products = defineCollection({
  schema: ({ image }) => z.object({
    // existing fields...
    newField: z.string().optional(),
  }),
});
```

## Troubleshooting

### Development Server Won't Start

```bash
# Clear cache and reinstall
rm -rf node_modules .astro
npm install
npm run dev
```

### Images Not Loading

- Verify image path in markdown: `../../assets/images/filename.jpg`
- Check image exists in `src/assets/images/`
- Rebuild: `npm run build`

### Content Collection Errors

- Check schema matches frontmatter in `config.ts`
- Validate YAML frontmatter syntax
- Run `npm run astro check`

### JavaScript Not Working

- Verify script imports in page
- Check browser console for errors
- Ensure DOM elements exist before accessing

## Getting Help

### Documentation Resources

- [README](../README.md) - Project overview
- [Migration Vision](vision/MIGRATION_VISION.md) - Why Astro
- [Migration Roadmap](architecture/MIGRATION_ROADMAP.md) - Architecture details
- [Coding with VIBES](../../docs/coding_with_vibes/README.md) - Methodology

### External Resources

- [Astro Documentation](https://docs.astro.build) - Official Astro docs
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) - Content guide
- [Zod Documentation](https://zod.dev) - Schema validation

## Contributing

When making changes:

1. **Read the documentation** - Understand the vision and architecture
2. **Follow the standards** - Use Coding with VIBES principles
3. **Test thoroughly** - Use the testing checklist
4. **Keep it simple** - Lines of code = debt
5. **Update docs** - Keep documentation current

### Pull Request Checklist

- [ ] Code follows project standards
- [ ] Visual and functional testing complete
- [ ] No console errors or warnings
- [ ] Documentation updated if needed
- [ ] Commit message follows format (fix:, feat:, etc.)

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-18 | 1.0 | Initial developer onboarding document |

---

*Part of the [Coding with VIBES](../../docs/coding_with_vibes/README.md) methodology*
