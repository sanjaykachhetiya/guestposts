# GuestPostHub - Guest Post Marketplace Platform

A modern, full-featured guest post and link building marketplace platform built with React, Vite, TypeScript, Convex, and Tailwind CSS.

## 🚀 Features

### Core Features
- **Publisher Directory**: Browse 50+ verified publishers with advanced filtering
- **Smart Search & Filters**: Filter by niche, country, DA, price, and more
- **Shopping Cart**: Add publishers to cart and checkout seamlessly
- **Order Management**: Track orders and view order history
- **Wishlist**: Save publishers for later
- **Packages System**: Pre-built packages for different budgets
- **Authentication**: Secure email OTP authentication
- **Real-time Updates**: Powered by Convex for instant data synchronization

### User Features
- Modern, responsive design with animations
- Advanced filtering (niche, country, DA, price, doFollow)
- Shopping cart with quantity management
- User dashboard with orders and wishlist
- Package pricing tiers (Basic, Standard, Premium, Enterprise)
- Featured publishers showcase
- Customer reviews and testimonials

### Technical Features
- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Convex (serverless, real-time database)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Authentication**: Convex Auth with email OTP
- **Routing**: React Router v7
- **Type Safety**: Full TypeScript coverage

## 📊 Database Schema

The platform includes comprehensive database tables:

- **publishers**: Website listings with metrics (DA, PA, traffic, price, etc.)
- **niches**: Categories for organizing publishers
- **packages**: Pre-built pricing packages
- **cart**: User shopping carts
- **orders**: Order tracking and management
- **orderItems**: Detailed order item tracking
- **wishlist**: Saved publishers for users
- **reviews**: Customer testimonials
- **tickets**: Support ticket system
- **users**: User accounts and authentication

## 🎨 Design

The platform features a modern blue/teal color scheme with:
- Clean, minimalist interface
- Card-based layouts for content
- Smooth animations and transitions
- Fully responsive design (mobile & desktop)
- Professional typography and spacing

## 📦 How to Download the Code

### Method 1: Git Clone (Recommended)

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project
cd codebase

# Install dependencies
npm install
# or
bun install
```

### Method 2: Download ZIP

1. Download the entire project as a ZIP file
2. Extract to your desired location
3. Open terminal in the extracted folder
4. Run `npm install` or `bun install`

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
bun install
```

### 2. Set Up Convex

```bash
# Login to Convex (creates account if needed)
npx convex dev --once

# This will:
# - Create a new Convex project
# - Generate your CONVEX_URL
# - Update .env.local automatically
```

### 3. Seed the Database

```bash
# Populate database with test data
npx convex run seedData:seed
```

This creates:
- 15 niches/categories
- 50 sample publishers with realistic metrics
- 4 pricing packages
- 5 customer reviews

### 4. Start Development Server

```bash
# Start Convex backend
npx convex dev

# In another terminal, start frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📂 Project Structure

```
codebase/
├── src/
│   ├── components/ui/        # shadcn/ui components
│   ├── convex/              # Backend functions & schema
│   │   ├── schema.ts        # Database schema
│   │   ├── publishers.ts    # Publisher queries/mutations
│   │   ├── cart.ts          # Cart management
│   │   ├── orders.ts        # Order management
│   │   ├── wishlist.ts      # Wishlist functions
│   │   ├── packages.ts      # Package management
│   │   ├── niches.ts        # Category management
│   │   ├── reviews.ts       # Review system
│   │   └── seedData.ts      # Database seeding
│   ├── pages/               # Route pages
│   │   ├── Landing.tsx      # Homepage
│   │   ├── Publishers.tsx   # Publisher directory
│   │   ├── Packages.tsx     # Pricing packages
│   │   ├── Cart.tsx         # Shopping cart
│   │   ├── Dashboard.tsx    # User dashboard
│   │   └── Auth.tsx         # Authentication
│   ├── index.css           # Global styles & theme
│   └── main.tsx            # App entry & routing
├── convex.json             # Convex configuration
├── package.json            # Dependencies
└── vite.config.ts          # Vite configuration
```

## 🎯 Available Routes

- `/` - Landing page with hero, features, testimonials
- `/publishers` - Browse and filter publishers
- `/packages` - View pricing packages
- `/cart` - Shopping cart and checkout
- `/dashboard` - User orders and wishlist
- `/auth` - Sign in / Sign up

## 🔧 Key Technologies

### Frontend
- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety throughout
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality component library
- **Framer Motion**: Smooth animations
- **React Router**: Client-side routing
- **Lucide Icons**: Beautiful icon library

### Backend
- **Convex**: Serverless backend platform
- **Real-time Queries**: Automatic data synchronization
- **Convex Auth**: Built-in authentication
- **Type-safe APIs**: End-to-end TypeScript

## 💡 Usage Examples

### Adding a Publisher to Cart

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const addToCart = useMutation(api.cart.addToCart);

await addToCart({
  publisherId: publisherId,
  quantity: 1
});
```

### Filtering Publishers

```typescript
const publishers = useQuery(api.publishers.list, {
  paginationOpts: { numItems: 50, cursor: null },
  niche: "Technology",
  minDA: 40,
  maxPrice: 500,
  doFollow: true,
});
```

### Creating an Order

```typescript
const createOrder = useMutation(api.orders.createOrder);
const orderId = await createOrder({});
```

## 🎨 Customization

### Changing Theme Colors

Edit `src/index.css`:

```css
:root {
  --primary: oklch(0.55 0.18 230);  /* Blue primary color */
  --accent: oklch(0.65 0.15 200);   /* Teal accent */
  /* ... other colors */
}
```

### Adding New Niches

Run in Convex dashboard or create a mutation:

```typescript
await ctx.db.insert("niches", {
  name: "Your Niche",
  slug: "your-niche",
  publisherCount: 0,
});
```

### Adding Publishers

Use the admin functions in `publishers.ts` or run:

```bash
npx convex run publishers:create '{
  "domain": "example.com",
  "niche": "Technology",
  "country": "United States",
  "domainAuthority": 45,
  "price": 150,
  ...
}'
```

## 📱 Responsive Design

The platform is fully responsive:
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🔐 Authentication

The platform uses Convex Auth with email OTP:
- Passwordless authentication
- Secure email verification
- Automatic session management
- Protected routes for cart and dashboard

## 🚀 Deployment

### Deploy to Convex

```bash
npx convex deploy
```

### Deploy Frontend

Deploy to Vercel, Netlify, or any static hosting:

```bash
npm run build
# Upload dist/ folder to your hosting
```

Update environment variables on your hosting platform with your production `VITE_CONVEX_URL`.

## 📊 Sample Data

The seed script includes:
- **50 Publishers** across 15 niches
- **DA range**: 20-90
- **Price range**: $50-$500
- **Countries**: US, UK, Canada, Australia, India, Germany
- **4 Packages**: $99 to $1,999

## 🤝 Contributing

This is a complete, production-ready platform. You can:
- Add more features (payment integration, analytics, etc.)
- Customize the design and branding
- Add admin panel for managing content
- Integrate with payment processors (Stripe, PayPal)
- Add SEO tools (DA checker, backlink analyzer)

## 📄 License

This project is provided as-is for your use. Modify and deploy as needed.

## 🆘 Support

For questions or issues:
1. Check the Convex documentation: https://docs.convex.dev
2. Review the code comments in key files
3. Inspect the database schema in `src/convex/schema.ts`

## 🎉 Credits

Built with:
- React + Vite + TypeScript
- Convex (Backend as a Service)
- Tailwind CSS + shadcn/ui
- Framer Motion
- Lucide Icons

---

**Ready to build your guest post marketplace!** 🚀

Start the dev server and visit http://localhost:5173 to see your platform in action.
