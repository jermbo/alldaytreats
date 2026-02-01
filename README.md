# All Day Treats - Astro Site

Custom chocolate-covered treats, candy grapes, strawberries, and dessert platters made fresh to order in Omaha, NE.

## 🚀 Tech Stack

- **[Astro](https://astro.build)** - Static Site Generator
- **Vanilla JavaScript** - No framework overhead, pure ES6 modules
- **CSS** - Modern CSS with custom properties
- **Content Collections** - Markdown-based product management
- **TypeScript** - Type safety for main scripts

## 🛠️ Getting Started

### Prerequisites

- Node.js 22+ installed
- npm or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:4321` to see your site.

### Build

```bash
npm run build
```

Outputs static files to `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📝 Adding Products

Products are managed as markdown files in `src/content/products/`.

### Create a New Product

1. **Add product image** to `public/images/`

2. **Create markdown file** in `src/content/products/`:

```markdown
---
name: Product Name
category: candy
image: /images/product-image.jpg
priceFrom: 10
priceOptions:
  - count: 6
    price: 10
    sku: XX06
  - count: 8
    price: 15
    sku: XX08
  - count: 12
    price: 20
    sku: XX12
extraAddOns: 5
order: 10
---

Product description goes here.
```

3. **Product will automatically appear** in the menu on next build/dev reload

### Product Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Display name |
| `category` | enum | Yes | `candy`, `chocolate`, or `platter` |
| `image` | string | Yes | Path to image (e.g., `/images/product.jpg`) |
| `priceFrom` | number | Yes | Starting price for display |
| `priceOptions` | array | Yes | Array of `{count, price, sku}` options |
| `extraAddOns` | number | No | Cost per extra item (default: 5) |
| `order` | number | No | Display order (default: 999) |

**SKU Format:** Use 2-letter product code + count (e.g., `CG06` for Candy Grapes 6-pack). See [Sku_Reference.md](docs/Sku_Reference.md) for all codes.

## 🎨 Styling

### CSS Architecture

- **CSS Custom Properties** - All colors, spacing, and fonts defined in `variables.css`
- **Component-Scoped** - Each feature has its own CSS file
- **No Preprocessor** - Pure modern CSS with nesting support
- **Responsive** - Mobile-first approach with container queries

### Modifying Styles

1. **Global Variables**: Edit `src/styles/variables.css`
2. **Component Styles**: Edit relevant CSS file in `src/styles/`
3. **Layout Changes**: Edit component files in `src/components/`

### Color Scheme

```css
--color-bg-dark: #1a1a1a
--color-text-light: #ffffff
--color-accent-blue: #87ceeb
--color-accent-purple: #9b59b6
--color-accent-pink: #ff69b4
```

## 🛒 Features

- **Product Catalog** - Content collection-based product management
- **Category Filtering** - Filter by candy, chocolate, or platters
- **Product Modal** - View details, select quantity, add toppings
- **Toppings System** - Configurable toppings with dynamic pricing
- **Shopping Cart** - Add/remove items, adjust quantities, persist in localStorage
- **Checkout Form** - Customer information with validation
- **Phone Formatting** - Automatic (555) 555-5555 formatting
- **Form Validation** - Real-time validation with error messages
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Smooth Animations** - View Transitions API with fallbacks

## 🧪 Testing

Use the included `Testing_Checklist.md` for comprehensive testing.

### Quick Smoke Test

```bash
npm run dev
```

1. Homepage loads with products
2. Click product → modal opens
3. Add to cart → cart badge updates
4. Open cart → item displays
5. Proceed to checkout → form appears
6. No console errors

### Performance Testing

```bash
npm run build
npm run preview
```

Open Chrome DevTools > Lighthouse > Run audit

**Target Scores:**

- Performance: ≥95
- Accessibility: ≥95
- Best Practices: ≥95
- SEO: ≥95

## 🚀 Deployment

### Recommended: Netlify

1. Connect GitHub repository
2. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Deploy automatically on push to `main`

### Alternative: Vercel

```bash
npm install -g vercel
vercel
```

### Alternative: Cloudflare Pages

1. Connect repository
2. Build command: `npm run build`
3. Build output: `dist`

### Manual Deployment

```bash
npm run build
# Upload contents of dist/ folder to your web host
```

## 📞 Contact Information

Update contact information in:

- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/layouts/Layout.astro` (meta description)

## 🐛 Troubleshooting

### Products not showing

- Verify markdown files in `src/content/products/`
- Check content schema in `src/content/config.ts`
- Ensure images exist in `public/images/`
- Clear `.astro` cache: `rm -rf .astro`

### Build fails

- Check Node.js version (22+ required)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for syntax errors in markdown frontmatter

### Images not loading

- Verify images are in `public/images/`
- Check image paths in markdown files (should start with `/images/`)
- Check browser console for 404 errors

### Cart not persisting

- Check browser localStorage is enabled
- Check browser console for errors
- Verify `cart.js` is loading correctly

## 📚 Documentation

- **Project Status:** [docs/Project_Status.md](docs/Project_Status.md)
- **Testing Checklist:** [docs/Testing_Checklist.md](docs/Testing_Checklist.md)
- **Deployment Guide:** [docs/Deployment.md](docs/Deployment.md)
- **SKU Reference:** [docs/Sku_Reference.md](docs/Sku_Reference.md)
- **PRD:** [PRD.md](PRD.md)

## 🎯 Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run astro        # Run Astro CLI commands
```

## 📄 License

© 2026 All Day Treats. All rights reserved.

## 🙏 Credits

Built with [Astro](https://astro.build) - The web framework for content-driven websites.

---

**Need help?** Check the documentation in `/docs/` or contact the development team.
