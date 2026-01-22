# 🚀 Quick Start Guide

Get your GuestPostHub marketplace up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
pnpm install
# or
npm install
```

## Step 2: Start Convex Backend

```bash
npx convex dev
```

**What happens:**
- Creates a Convex account (if needed)
- Sets up your database
- Generates TypeScript types
- Starts watching for changes

**Important:** Keep this terminal running!

## Step 3: Seed Database (New Terminal)

```bash
npx convex run seedData:seed
```

**This creates:**
- ✅ 15 niches (Technology, Business, Health, etc.)
- ✅ 50 sample publishers with realistic metrics
- ✅ 4 pricing packages (Basic to Enterprise)
- ✅ 5 customer reviews

## Step 4: Start Dev Server

```bash
pnpm dev
# or
npm run dev
```

## Step 5: Open Browser

Navigate to: `http://localhost:5173`

**You should see:**
- Modern landing page with hero section
- Stats showing 50 publishers
- Featured publishers grid
- Customer testimonials
- Call-to-action sections

## 🎯 Test the Platform

### Browse Publishers
1. Click "Browse Publishers" or navigate to `/publishers`
2. Try the filters:
   - Search for domains
   - Select a niche
   - Adjust DA slider
   - Toggle "DoFollow Only"
3. Add publishers to cart or wishlist

### View Packages
1. Navigate to `/packages`
2. See 4 pricing tiers
3. Compare features

### Shopping Cart
1. Add items to cart from Publishers page
2. Click cart icon or go to `/cart`
3. Update quantities
4. Click "Proceed to Checkout"
5. Order created and redirected to dashboard

### User Dashboard
1. Navigate to `/dashboard`
2. View your orders
3. Check wishlist items
4. See statistics

## 🎨 Customize Your Instance

### Change Site Name
Find and replace "GuestPostHub" in:
- `src/pages/Landing.tsx`
- `src/pages/Publishers.tsx`
- `src/pages/Dashboard.tsx`
- Other page headers

### Update Theme Colors
Edit `src/index.css`:
```css
:root {
  --primary: oklch(0.55 0.18 230); /* Change this */
}
```

### Add More Publishers
Edit `src/convex/seedData.ts` and change the loop:
```typescript
for (let i = 0; i < 100; i++) { // Change from 50 to 100
```

Then reseed:
```bash
npx convex run seedData:seed
```

## 🔑 Authentication Setup

Authentication is already configured! To test:

1. Navigate to `/auth`
2. Enter an email
3. Receive OTP code (check Convex logs)
4. Enter code to sign in

**For production:** Configure email provider in Convex dashboard

## 📊 View Database

```bash
npx convex dashboard
```

This opens the Convex dashboard where you can:
- View all tables
- Run queries
- Monitor function calls
- Check logs

## 🚨 Troubleshooting

### Ports Already in Use
- Frontend (5173): Change in `vite.config.ts`
- Backend: Convex uses cloud deployment, no local port

### Seed Data Fails
If you see "unique() returned multiple results":
```bash
# Database already has data, skip seeding or clear first
```

### TypeScript Errors
```bash
# Regenerate types
npx convex dev --once
```

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📦 Production Deployment

### 1. Deploy Convex Backend
```bash
npx convex deploy
```

Copy the production URL.

### 2. Deploy Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variable:
- `VITE_CONVEX_URL` = your production Convex URL

### 3. Seed Production Database
```bash
npx convex run seedData:seed --prod
```

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] Convex dev running
- [ ] Database seeded
- [ ] Dev server running
- [ ] Can view landing page
- [ ] Can browse publishers
- [ ] Can add to cart
- [ ] Can create orders
- [ ] Dashboard shows data

## 🎉 You're Ready!

Your guest post marketplace is now running. Start customizing:
- Add real publisher data
- Set up payment processing
- Configure email notifications
- Customize branding and colors
- Deploy to production

## 📚 Next Steps

1. Read `README_DOWNLOAD.md` for full documentation
2. Check `DATABASE_SCHEMA.md` for schema details
3. Explore Convex functions in `src/convex/`
4. Customize pages in `src/pages/`

**Need help?** Check the documentation or Convex Discord community.

---

**Happy building! 🚀**
