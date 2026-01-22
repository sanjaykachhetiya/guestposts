# 🚀 GuestPostHub - Guest Post Marketplace Platform

A modern, full-featured guest post marketplace platform similar to guestpostlinks.net, built with React, Vite, Convex, and Tailwind CSS.

![Modern Theme](https://img.shields.io/badge/Theme-Modern%20Blue%2FTeal-blue)
![Tech Stack](https://img.shields.io/badge/Stack-React%2BVite%2BConvex-green)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

## ✨ Features

### Core Features
- **Publisher Marketplace** - Browse 50+ publishers with detailed metrics (DA, PA, Traffic, etc.)
- **Advanced Filtering** - Filter by niche, country, domain authority, price, and more
- **Shopping Cart** - Add publishers to cart and checkout
- **Order Management** - Track orders and their status in real-time
- **Wishlist** - Save publishers for later
- **Package Plans** - 4 pricing tiers (Basic, Standard, Premium, Enterprise)
- **User Dashboard** - Manage orders, wishlist, and account
- **Reviews & Testimonials** - Display customer feedback
- **Real-time Updates** - Powered by Convex reactive queries

### Modern UI/UX
- Clean, modern design with blue/teal color scheme
- Smooth animations with Framer Motion
- Fully responsive (mobile, tablet, desktop)
- Dark mode support
- Professional landing page with hero, features, and testimonials
- Intuitive navigation and user flows

### Technical Features
- **Type-safe** - Full TypeScript support
- **Real-time Database** - Convex for reactive data
- **Authentication** - Built-in Convex Auth with OTP
- **SEO Friendly** - Proper meta tags and semantic HTML
- **Performance Optimized** - Code splitting and lazy loading
- **Accessible** - WCAG compliant components

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v7
- **Backend/Database**: Convex (real-time, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Auth**: Convex Auth (OTP-based)
- **Package Manager**: pnpm

## 📁 Project Structure

```
├── src/
│   ├── components/ui/       # shadcn/ui components
│   ├── pages/              # Page components
│   │   ├── Landing.tsx     # Landing page
│   │   ├── Publishers.tsx  # Browse publishers
│   │   ├── Packages.tsx    # Pricing packages
│   │   ├── Cart.tsx        # Shopping cart
│   │   └── Dashboard.tsx   # User dashboard
│   ├── convex/             # Backend (Convex functions)
│   │   ├── schema.ts       # Database schema
│   │   ├── publishers.ts   # Publisher queries/mutations
│   │   ├── packages.ts     # Package management
│   │   ├── cart.ts         # Cart operations
│   │   ├── orders.ts       # Order management
│   │   ├── wishlist.ts     # Wishlist operations
│   │   ├── niches.ts       # Category management
│   │   ├── reviews.ts      # Review system
│   │   └── seedData.ts     # Database seeding
│   ├── lib/                # Utilities
│   └── index.css           # Global styles + theme
├── convex/                 # Convex config
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up Convex**
   ```bash
   npx convex dev
   ```
   This will:
   - Create a new Convex project (or link existing)
   - Set up your database
   - Start the dev server

3. **Seed the database** (in a new terminal)
   ```bash
   npx convex run seedData:seed
   ```
   This populates the database with:
   - 15 niches
   - 50 sample publishers
   - 4 pricing packages
   - 5 sample reviews

4. **Start the dev server**
   ```bash
   pnpm dev
   ```

5. **Open browser**
   Navigate to `http://localhost:5173`

## 🎨 Customization

### Change Theme Colors
Edit `src/index.css` and modify the color variables:

```css
:root {
  --primary: oklch(0.55 0.18 230);  /* Main brand color */
  --secondary: oklch(0.96 0.01 240); /* Secondary color */
  --accent: oklch(0.65 0.15 200);    /* Accent color */
  /* ... more colors */
}
```

### Add New Niches
Edit `src/convex/seedData.ts` and add to the niches array:

```typescript
{ name: "Your Niche", slug: "your-niche", icon: "🎯" }
```

### Modify Packages
Edit the packages array in `src/convex/seedData.ts`

## 📊 Database Schema

See `DATABASE_SCHEMA.md` for complete database documentation.

**Main Tables:**
- `publishers` - Website listings
- `packages` - Pricing plans
- `orders` - User orders
- `cart` - Shopping cart items
- `wishlist` - Saved publishers
- `niches` - Categories
- `reviews` - Customer reviews
- `users` - User accounts (auto-created by Convex Auth)

## 🔑 Authentication

The platform uses Convex Auth with OTP (One-Time Password) authentication:

1. User enters email
2. Receives OTP code
3. Enters code to sign in
4. Session managed automatically

**Configure auth**: `src/convex/auth.ts`

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable:
   - `VITE_CONVEX_URL` - Your Convex deployment URL
4. Deploy!

### Deploy Convex

```bash
npx convex deploy
```

This creates a production deployment of your backend.

## 🎯 Key Features Breakdown

### 1. Publishers Marketplace
- **Location**: `/publishers`
- **Features**:
  - Search by domain name
  - Filter by niche, country, DA, price
  - DoFollow filter
  - Add to cart/wishlist
  - View detailed metrics

### 2. Shopping Cart
- **Location**: `/cart`
- **Features**:
  - View cart items
  - Update quantities
  - Remove items
  - See total price
  - Checkout (creates order)

### 3. User Dashboard
- **Location**: `/dashboard`
- **Features**:
  - Order history
  - Order status tracking
  - Wishlist management
  - Statistics overview

### 4. Package Plans
- **Location**: `/packages`
- **Features**:
  - 4 pricing tiers
  - Feature comparison
  - Credit-based system
  - Direct purchase links

## 🔧 Development Tips

### Running Backend Functions
```bash
# Run a mutation
npx convex run publishers:create '{"domain": "example.com", ...}'

# Run a query
npx convex run publishers:getStats
```

### Clearing Database
```bash
# Delete all data from a table
npx convex run --prod false '(ctx) => ctx.db.query("tableName").collect().then(docs => Promise.all(docs.map(d => ctx.db.delete(d._id))))'
```

### View Database Dashboard
```bash
npx convex dashboard
```

## 📝 Environment Variables

Create `.env.local`:

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

## 🤝 Contributing

This is a template/starter project. Feel free to:
- Customize for your needs
- Add new features
- Modify the design
- Extend the database schema

## 📄 License

MIT License - Free to use for commercial and personal projects

## 🆘 Support & Resources

- **Convex Docs**: https://docs.convex.dev
- **React Router**: https://reactrouter.com
- **Tailwind CSS**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com

## 🎉 What's Next?

Consider adding:
- Payment integration (Stripe, PayPal)
- Admin dashboard for managing publishers
- Email notifications
- Advanced analytics
- Blog/SEO tools
- Bulk ordering
- API for programmatic access
- White-label customization

---

**Built with ❤️ using modern web technologies**

For questions or issues, check the documentation files included in this project.
