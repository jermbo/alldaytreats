# All Day Treats - Deployment Guide

## Pre-Deployment Checklist

### ✅ Verify Build
```bash
cd all-day-treats
npm run build
```

**Expected output:**
- No errors
- `dist/` folder created
- Products loaded: 9
- Build time: ~2 seconds

### ✅ Test Production Build
```bash
npm run preview
```

Visit `http://localhost:4321` and verify:
- [ ] Homepage loads
- [ ] All 9 products visible
- [ ] Images load correctly
- [ ] Menu filtering works
- [ ] Product modal opens
- [ ] Cart functions work
- [ ] Checkout form displays
- [ ] No console errors

### ✅ Performance Check
Run Lighthouse audit in Chrome DevTools:
- [ ] Performance ≥ 95
- [ ] Accessibility ≥ 95
- [ ] Best Practices ≥ 95
- [ ] SEO ≥ 95

---

## Deployment Option 1: Netlify (Recommended)

### Why Netlify?
- ✅ Free tier sufficient
- ✅ Auto-deploy from GitHub
- ✅ Instant SSL certificate
- ✅ CDN included
- ✅ Easy rollback
- ✅ Form submission handling (for contact forms)

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: complete astro migration"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect to GitHub repository
   - Select `alldaytreats` repository

3. **Configure Build Settings**
   ```
   Base directory: all-day-treats
   Build command: npm run build
   Publish directory: all-day-treats/dist
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait ~2 minutes for build
   - Site will be live at `https://random-name.netlify.app`

5. **Configure Custom Domain** (Optional)
   - Go to Site settings > Domain management
   - Add custom domain (e.g., `alldaytreats.com`)
   - Configure DNS as instructed
   - SSL certificate auto-configured

### Environment Variables
None required for this project.

### Post-Deployment
- [ ] Visit live URL
- [ ] Run through testing checklist
- [ ] Test on mobile device
- [ ] Share with stakeholder

---

## Deployment Option 2: Vercel

### Why Vercel?
- ✅ Auto-detects Astro
- ✅ Excellent performance
- ✅ Free tier sufficient
- ✅ Great developer experience

### Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd all-day-treats
   vercel
   ```

3. **Follow Prompts**
   - Link to GitHub (optional)
   - Confirm settings
   - Deploy

4. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Configuration
Vercel auto-detects Astro. No configuration needed.

---

## Deployment Option 3: Cloudflare Pages

### Why Cloudflare Pages?
- ✅ Global CDN
- ✅ Free tier generous
- ✅ Fast performance
- ✅ Good security

### Steps

1. **Connect Repository**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Pages > Create a project
   - Connect to GitHub

2. **Configure Build**
   ```
   Production branch: main
   Build command: npm run build
   Build output directory: dist
   Root directory: all-day-treats
   ```

3. **Deploy**
   - Click "Save and Deploy"
   - Wait for build completion

4. **Custom Domain**
   - Add custom domain in settings
   - Update DNS records
   - SSL automatic

---

## Deployment Option 4: Traditional Hosting

### For cPanel, Shared Hosting, etc.

1. **Build Locally**
   ```bash
   cd all-day-treats
   npm run build
   ```

2. **Upload Files**
   - Connect via FTP/SFTP
   - Upload entire `dist/` folder contents
   - Place in public_html or www directory

3. **Configure Server**
   - Ensure all files served as static
   - Configure 404 handling (if needed)
   - Enable GZIP compression

4. **SSL Certificate**
   - Use Let's Encrypt
   - Or hosting provider's SSL

---

## Post-Deployment Verification

### Critical Path Testing

1. **Homepage**
   - [ ] Loads in < 3 seconds
   - [ ] All products visible (9)
   - [ ] Images load
   - [ ] No console errors

2. **Menu Filtering**
   - [ ] "All Treats" shows 9 products
   - [ ] "Candy Coated" shows 3 products
   - [ ] "Chocolate Covered" shows 5 products
   - [ ] "Platters" shows 1 product

3. **Product Modal**
   - [ ] Opens on product click
   - [ ] Details display correctly
   - [ ] Quantity selector works
   - [ ] Add to cart works

4. **Shopping Cart**
   - [ ] Badge updates
   - [ ] Cart panel opens
   - [ ] Items display
   - [ ] Quantity adjust works
   - [ ] Remove works
   - [ ] Total calculates

5. **Checkout**
   - [ ] Form displays
   - [ ] Validation works
   - [ ] Phone formats
   - [ ] Submit works (check email)

6. **Mobile**
   - [ ] Responsive layout works
   - [ ] Touch interactions work
   - [ ] No horizontal scroll
   - [ ] All features functional

### SEO Verification

- [ ] Title tag correct
- [ ] Meta description present
- [ ] Favicon loads
- [ ] robots.txt accessible
- [ ] Sitemap.xml accessible (if generated)
- [ ] Open Graph tags present
- [ ] Schema markup present (if added)

### Performance Verification

Run Lighthouse on production URL:
```
Target scores:
- Performance: ≥ 95
- Accessibility: ≥ 95
- Best Practices: ≥ 95
- SEO: ≥ 95
```

---

## Rollback Procedure

If critical issues found after deployment:

### Netlify
1. Go to Site > Deploys
2. Find previous working deploy
3. Click "Publish deploy"
4. Instant rollback

### Vercel
```bash
vercel rollback
```

### Cloudflare Pages
1. Go to deployment history
2. Click "Rollback to this deployment"

### Traditional Hosting
1. Keep backup of previous `dist/` folder
2. Re-upload via FTP
3. Clear CDN cache

---

## Monitoring

### What to Monitor

**First 24 Hours:**
- [ ] Check every 2 hours for errors
- [ ] Monitor analytics for traffic
- [ ] Check email for form submissions
- [ ] Review browser console errors

**First Week:**
- [ ] Daily checks
- [ ] Review user feedback
- [ ] Monitor performance metrics
- [ ] Check for broken links

### Tools
- Google Analytics (if configured)
- Browser DevTools Console
- Netlify/Vercel analytics
- User feedback

---

## Troubleshooting

### Issue: 404 Errors
**Solution:** Ensure all files uploaded from `dist/` folder, not just `dist/` itself.

### Issue: Images Not Loading
**Solution:** Check image paths start with `/` and files exist in `dist/images/`

### Issue: JavaScript Not Running
**Solution:** Check console for errors, verify script tags in HTML, check CORS settings

### Issue: Slow Load Times
**Solution:** Enable CDN, configure caching headers, optimize images further

### Issue: Checkout Form Not Working
**Solution:** Check email service configuration, verify mailto links work, check spam folder

---

## Contact Information Update

Before deploying, verify all contact information is correct:

### Files to Check:
- `src/components/Header.astro` - Phone, email, Instagram
- `src/components/Footer.astro` - Contact info, policies
- `src/layouts/Layout.astro` - Meta description

### Information to Verify:
- [ ] Phone number correct
- [ ] Email address correct
- [ ] Instagram handle correct
- [ ] Business location correct
- [ ] Pickup instructions correct
- [ ] Payment methods current

---

## DNS Configuration

### If using custom domain:

1. **Add DNS Records:**
   ```
   Type: A
   Name: @
   Value: [Hosting IP from provider]

   Type: CNAME
   Name: www
   Value: [Domain from hosting]
   ```

2. **Wait for Propagation**
   - Can take 24-48 hours
   - Use [whatsmydns.net](https://whatsmydns.net) to check

3. **Force HTTPS**
   - Enable in hosting dashboard
   - Redirect HTTP → HTTPS

---

## Success Criteria

Deployment is successful when:

- [x] Site accessible at production URL
- [x] All 9 products visible
- [x] All interactive features work
- [x] Mobile site works perfectly
- [x] No console errors
- [x] Lighthouse scores meet targets
- [x] SSL certificate active
- [x] Stakeholder approval received

---

## Post-Launch

### Immediate (Day 1)
- [ ] Announce launch to customers
- [ ] Share on social media
- [ ] Update any directory listings
- [ ] Send thank you to development team

### First Week
- [ ] Monitor for issues
- [ ] Gather user feedback
- [ ] Address any bugs quickly
- [ ] Document any quirks

### Ongoing
- [ ] Regular content updates
- [ ] Seasonal product additions
- [ ] Performance monitoring
- [ ] User feedback incorporation

---

## Support

**Need help with deployment?**
- Check Astro docs: https://docs.astro.build/en/guides/deploy/
- Check hosting provider docs
- Review `README.md` for troubleshooting
- Contact development team

---

🎉 **Ready to deploy!** Follow the steps above for your chosen hosting platform.
