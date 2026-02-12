# All Day Treats - Quick Start Guide

## 🚀 Get Running in 60 Seconds

```bash
npm install
npm run dev
```

Visit: `http://localhost:4321`

## 📁 Project at a Glance

```
alldaytreats/
├── src/
│   ├── components/     # 10 Astro components
│   ├── config/         # Site and toppings config
│   ├── content/        # 9 product markdown files
│   ├── layouts/        # Base layout
│   ├── pages/          # index.astro
│   ├── scripts/        # 8 JavaScript modules
│   └── styles/         # 13 CSS files
├── public/images/      # Product images
└── dist/               # Build output
```

## 🎯 Key Commands

```bash
npm run dev      # Start dev server (port 4321)
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📝 Adding a Product

1. Add image to `public/images/product.jpg`
2. Create `src/content/products/product-name.md`:

```markdown
---
name: Product Name
category: candy
image: /images/product.jpg
priceFrom: 10
priceOptions:
  - count: 6
    price: 10
    sku: XX06
  - count: 8
    price: 15
    sku: XX08
order: 10
---

Product description here.
```

3. Restart dev server - product appears!

See [Sku_Reference.md](Sku_Reference.md) for SKU naming conventions.

## 🎨 Modifying Styles

Edit files in `src/styles/`:
- `variables.css` - Colors, spacing, fonts
- `header.css`, `menu.css`, etc. - Component styles

Changes hot-reload in dev mode.

## 🐛 Quick Troubleshooting

**Products not showing?**
```bash
rm -rf .astro
npm run dev
```

**Build fails?**
```bash
rm -rf node_modules
npm install
npm run build
```

**Images not loading?**
- Check images are in `public/images/`
- Check paths start with `/images/`

## 📚 Full Documentation

- [README.md](../README.md) - Complete guide
- [Project_Status.md](Project_Status.md) - Current status
- [Deployment.md](Deployment.md) - Deploy instructions
- [Testing_Checklist.md](Testing_Checklist.md) - QA guide

## 🚀 Deploy to Production

### Netlify (Easiest)
1. Push to GitHub
2. Connect at netlify.com
3. Build: `npm run build`
4. Directory: `dist`
5. Deploy!

### Other Options
See `Deployment.md` for Vercel, Cloudflare Pages, etc.

## ✅ Verification

Site is working if you can:
- [x] See 9 products on homepage
- [x] Filter by category
- [x] Click product → modal opens
- [x] Add to cart → badge updates
- [x] Open cart → items show
- [x] Checkout → form displays
- [x] No console errors

## 📞 Contact Info to Update

Before deploying, update these files:
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/layouts/Layout.astro`

Update phone, email, Instagram, location.

## 🎉 You're Ready!

The migration is complete and testing has been validated. Ready for production deployment!

---

**Need help?** Check the full documentation files listed above.
