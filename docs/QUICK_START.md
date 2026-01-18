# All Day Treats - Quick Start Guide

## 🚀 Get Running in 60 Seconds

```bash
cd all-day-treats
npm install
npm run dev
```

Visit: `http://localhost:4321`

## 📁 Project at a Glance

```
all-day-treats/
├── src/
│   ├── components/     # 8 Astro components
│   ├── content/        # 9 product markdown files
│   ├── layouts/        # Base layout
│   ├── pages/          # index.astro
│   ├── scripts/        # 8 JavaScript modules
│   └── styles/         # 11 CSS files
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
id: product-slug
name: Product Name
category: candy
image: /images/product.jpg
priceFrom: 10
priceOptions:
  - count: 6
    price: 10
  - count: 8
    price: 15
order: 10
---

Product description here.
```

3. Restart dev server - product appears!

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

- **README.md** - Complete guide
- **DEPLOYMENT.md** - Deploy instructions
- **TESTING_CHECKLIST.md** - QA guide
- **MIGRATION_SUMMARY.md** - What changed

## 🚀 Deploy to Production

### Netlify (Easiest)
1. Push to GitHub
2. Connect at netlify.com
3. Build: `npm run build`
4. Directory: `all-day-treats/dist`
5. Deploy!

### Other Options
See `DEPLOYMENT.md` for Vercel, Cloudflare Pages, etc.

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

The migration is complete. Test thoroughly and deploy when ready!

---

**Need help?** Check the full documentation files listed above.
