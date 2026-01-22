# How to Download Your Guest Post Marketplace Code

## 📥 Download Options

### Option 1: Git Clone (Recommended)
If you have Git installed:

```bash
# Clone this repository
git clone <your-repository-url> guest-post-marketplace
cd guest-post-marketplace
```

### Option 2: Download as ZIP
1. Look for the "Download" or "Code" button on your repository
2. Select "Download ZIP"
3. Extract the ZIP file to your desired location
4. Open terminal/command prompt in that folder

## 🚀 Quick Start Guide

### Step 1: Install Dependencies
```bash
npm install
# or if you use pnpm
pnpm install
```

### Step 2: Set Up Convex Backend
```bash
# This will create your Convex account and project
npx convex dev --once

# Follow the prompts to:
# - Create a Convex account (if you don't have one)
# - Create a new project
# - This automatically sets up your .env.local file
```

### Step 3: Seed the Database
```bash
# Add sample data (50 publishers, packages, niches, reviews)
npx convex run seedData:seed
```

### Step 4: Start Development
```bash
# Terminal 1: Start Convex backend
npx convex dev

# Terminal 2: Start React frontend
npm run dev
```

### Step 5: Open in Browser
Visit: http://localhost:5173

## 📂 What You'll Get

✅ Complete guest post marketplace platform
✅ 50+ sample publishers with real metrics
✅ Shopping cart & checkout system
✅ User dashboard with orders & wishlist
✅ 4 pricing packages
✅ Modern, responsive design
✅ Full authentication system
✅ Real-time database with Convex

## 🎯 Key Features

- **Publisher Directory**: Browse and filter publishers by niche, DA, price
- **Shopping Cart**: Add publishers to cart and manage quantities
- **Order Management**: Track orders and view history
- **Wishlist**: Save publishers for later
- **Packages**: Pre-built pricing tiers
- **Authentication**: Secure email OTP login
- **Real-time Updates**: Powered by Convex

## 🔧 Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Convex (serverless, real-time)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Auth**: Convex Auth with email OTP
- **Router**: React Router v7

## 📚 Documentation

- Full project guide: See `PROJECT_GUIDE.md`
- Database schema: See `src/convex/schema.ts`
- API functions: See `src/convex/*.ts` files

## 🎨 Customization

### Change Theme Colors
Edit `src/index.css` to customize colors:
```css
:root {
  --primary: oklch(0.55 0.18 230);  /* Blue */
  --accent: oklch(0.65 0.15 200);   /* Teal */
}
```

### Add More Publishers
```bash
npx convex run publishers:create '{
  "domain": "your-site.com",
  "niche": "Technology",
  "domainAuthority": 45,
  "price": 150,
  ...
}'
```

## 🚢 Deployment

### Deploy Backend
```bash
npx convex deploy
```

### Deploy Frontend
```bash
npm run build
# Upload dist/ folder to Vercel, Netlify, or any static host
```

## 🆘 Troubleshooting

### "Command not found: npx"
Install Node.js from https://nodejs.org (v18 or later)

### "Convex deployment failed"
Run `npx convex dev` and follow auth prompts

### "Module not found" errors
Run `npm install` again

### Port 5173 already in use
Change port in `vite.config.ts` or kill the process using that port

## 📞 Need Help?

- Convex Docs: https://docs.convex.dev
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev

## 🎉 You're Ready!

Your complete guest post marketplace is ready to customize and deploy!

Start building: `npm run dev`
