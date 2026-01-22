# 📥 How to Download Your Code

## Method 1: Download as ZIP (Easiest)

### If you have Git access:

```bash
# In your terminal, run:
cd /home/daytona/codebase
zip -r guestposthub-code.zip . -x "node_modules/*" ".git/*" "dist/*" ".convex/_generated/*"
```

This creates a ZIP file excluding heavy folders.

### Download the ZIP:
Look for `guestposthub-code.zip` in your file browser and download it.

## Method 2: Clone Repository

If this code is in a Git repository:

```bash
git clone <your-repo-url>
cd guestposthub
```

## Method 3: Copy Individual Files

If you need to copy files manually, here are the essential directories:

### Core Files (Must Have)
```
📁 Root Files
├── package.json
├── pnpm-lock.yaml (or package-lock.json)
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── index.html
└── README_DOWNLOAD.md

📁 src/
├── main.tsx
├── index.css
├── 📁 components/
│   └── 📁 ui/ (all shadcn components)
├── 📁 pages/
│   ├── Landing.tsx
│   ├── Publishers.tsx
│   ├── Packages.tsx
│   ├── Cart.tsx
│   ├── Dashboard.tsx
│   ├── Auth.tsx
│   └── NotFound.tsx
├── 📁 convex/
│   ├── schema.ts
│   ├── publishers.ts
│   ├── packages.ts
│   ├── cart.ts
│   ├── orders.ts
│   ├── wishlist.ts
│   ├── niches.ts
│   ├── reviews.ts
│   ├── seedData.ts
│   └── auth.ts
└── 📁 lib/
    └── utils.ts

📁 convex/
├── schema.ts (symlink to src/convex/schema.ts)
└── tsconfig.json
```

### Optional Files (Can Skip)
```
❌ node_modules/ (will reinstall)
❌ .git/ (version control)
❌ dist/ (build output)
❌ .convex/_generated/ (regenerated)
❌ .env.local (create new)
```

## Method 4: Create Tarball

```bash
cd /home/daytona
tar -czf guestposthub.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='dist' \
  --exclude='.convex/_generated' \
  codebase/
```

## After Download

### 1. Extract Files
Unzip or extract to your local machine.

### 2. Install Dependencies
```bash
cd guestposthub
pnpm install
```

### 3. Set Up Convex
```bash
npx convex dev
```

### 4. Follow Quick Start
See `QUICK_START.md` for setup instructions.

## What You're Getting

### Complete Platform
✅ Full source code
✅ Database schema
✅ 50+ sample publishers
✅ 4 pricing packages
✅ Shopping cart system
✅ Order management
✅ User dashboard
✅ Modern UI components
✅ Authentication system
✅ Responsive design
✅ Dark mode support

### Documentation
📄 README_DOWNLOAD.md - Full documentation
📄 QUICK_START.md - 5-minute setup guide
📄 DATABASE_SCHEMA.md - Database structure
📄 HOW_TO_DOWNLOAD.md - This file

### Tech Stack
- React 18 + TypeScript
- Vite (build tool)
- Convex (backend/database)
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- React Router v7

## File Sizes

Approximate sizes:
- **Without node_modules**: ~2-5 MB
- **With node_modules**: ~200-300 MB
- **After build (dist/)**: ~500 KB - 1 MB

💡 **Tip**: Always exclude `node_modules/` from downloads. You can reinstall with `pnpm install`.

## Verification Checklist

After download, verify you have:

- [ ] `package.json` file
- [ ] `src/` directory with all pages
- [ ] `src/convex/` directory with backend files
- [ ] `src/components/ui/` with shadcn components
- [ ] `index.html` in root
- [ ] Config files (vite, tailwind, tsconfig)
- [ ] Documentation files (.md)

## Need Help?

If you're missing files or have issues:

1. Check the file structure above
2. Ensure no `.gitignore` excluded essential files
3. Re-download with correct exclusions
4. Verify all paths are correct

## Moving to Production

Once downloaded:

1. ✅ Change branding (site name, colors)
2. ✅ Add real publisher data
3. ✅ Configure environment variables
4. ✅ Set up payment processing
5. ✅ Deploy to Vercel/Netlify
6. ✅ Deploy Convex backend
7. ✅ Test all features

## Sharing/Transferring

To share with team members:

```bash
# Create clean archive
tar -czf guestposthub-clean.tar.gz \
  --exclude='node_modules' \
  --exclude='.env.local' \
  --exclude='dist' \
  codebase/
```

Share the `.tar.gz` file - it's much smaller!

---

**Questions?** Check README_DOWNLOAD.md or QUICK_START.md

**Ready to go?** Run `pnpm install` then `npx convex dev`!
