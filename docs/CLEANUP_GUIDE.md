# Cleanup Guide - Archive Old Project Files

## Overview

This guide helps you safely archive the old Vite project files now that the Astro migration is complete.

## Files to Archive

The following files/directories from the original project should be archived:

### Root Directory Files
- `../index.html` - Old HTML file
- `../package.json` - Old package.json (if different)
- `../package-lock.json` - Old lock file

### Source Directory
- `../src/` - Entire old source directory containing:
  - `cart.js`, `cart-ui.js`
  - `checkout-ui.js`
  - `main.js`
  - `phone-formatter.js`
  - `product-modal.js`
  - `products.js`
  - `validation.js`, `validation-ui.js`
  - `style.css`
  - `styles/` directory
  - `images/` directory

### Keep These Files
- ✅ `PRD.md` - Product requirements (reference)
- ✅ `README.md` - Root readme (update to point to new project)
- ✅ `.gitignore` - Git configuration
- ✅ `.git/` - Git history
- ✅ `all-day-treats/` - **NEW Astro project**

## Recommended Approach: Archive (Safe)

### Step 1: Create Archive Directory

```bash
cd /Users/admin/Desktop/Work/Clients/AllDayTreats/alldaytreats
mkdir -p archive/vite-original
```

### Step 2: Move Old Files to Archive

```bash
# Move old HTML
mv index.html archive/vite-original/ 2>/dev/null || echo "Already moved"

# Move old source (if not already in use)
mv src archive/vite-original/ 2>/dev/null || echo "Already moved"

# Move old public (if separate from new)
# mv public archive/vite-original/ 2>/dev/null || echo "Already moved"

# Optional: Move old package files if you want
# cp package.json archive/vite-original/package.json.old
# cp package-lock.json archive/vite-original/package-lock.json.old
```

### Step 3: Update Root README

Create/update root `README.md` to point to new project:

```markdown
# All Day Treats

This repository contains the All Day Treats website.

## Active Project

The current production site is in the `all-day-treats/` directory (Astro-based).

See: [all-day-treats/README.md](all-day-treats/README.md)

## Archive

The original Vite-based project has been archived in `archive/vite-original/`
for reference purposes.

## Quick Start

\`\`\`bash
cd all-day-treats
npm install
npm run dev
\`\`\`

## Documentation

- [Astro Project README](all-day-treats/README.md)
- [Deployment Guide](all-day-treats/DEPLOYMENT.md)
- [Migration Summary](all-day-treats/MIGRATION_SUMMARY.md)
```

### Step 4: Verify New Project Still Works

```bash
cd all-day-treats
npm run build
npm run preview
```

**Verify:**
- [ ] Build succeeds
- [ ] All products load
- [ ] No import errors
- [ ] Site functions correctly

### Step 5: Commit Archive Changes

```bash
git add .
git commit -m "chore: archive old vite project files"
git push
```

## Alternative Approach: Complete Removal

⚠️ **Only do this after thorough testing and stakeholder approval!**

```bash
# DO NOT RUN without confirmation!
# rm -rf index.html
# rm -rf src/
# rm -rf public/ (if old public)
```

## Cleanup Checklist

- [ ] Archive directory created
- [ ] Old files moved to archive
- [ ] New project still builds
- [ ] New project still runs
- [ ] Root README updated
- [ ] Changes committed to git
- [ ] Stakeholder notified

## File Structure After Cleanup

```
alldaytreats/
├── .git/
├── .gitignore
├── README.md (updated, points to all-day-treats/)
├── PRD.md (keep for reference)
├── archive/
│   └── vite-original/
│       ├── index.html
│       └── src/
└── all-day-treats/ (ACTIVE PROJECT)
    ├── README.md
    ├── DEPLOYMENT.md
    ├── MIGRATION_SUMMARY.md
    ├── src/
    ├── public/
    └── package.json
```

## Verification Steps

After cleanup:

1. **Fresh Clone Test**
   ```bash
   cd /tmp
   git clone [your-repo]
   cd alldaytreats/all-day-treats
   npm install
   npm run build
   ```

2. **Check Documentation Links**
   - Verify all links in README work
   - Check migration docs are accessible
   - Test deployment guide links

3. **Test Deployment Pipeline**
   - Ensure CI/CD still points to correct directory
   - Update Netlify/Vercel build settings if needed
   - Confirm base directory: `all-day-treats`

## Rollback Plan

If you need to restore old files:

```bash
# Restore from archive
cp -r archive/vite-original/* .

# Or revert git commit
git revert HEAD
```

## Notes

- The archive is kept for reference and emergency rollback
- Old files can be permanently deleted after 30-60 days of successful production
- Git history preserves all old code even if files deleted
- Consider creating a git tag before cleanup:
  ```bash
  git tag -a v1.0-vite-final -m "Final Vite version before cleanup"
  git push --tags
  ```

## Timeline Recommendation

1. **Week 1:** Move to archive, keep accessible
2. **Week 2-4:** Monitor production for issues
3. **After 30 days:** Consider permanent deletion (optional)

---

**Questions?** Review the migration docs or contact the development team.
