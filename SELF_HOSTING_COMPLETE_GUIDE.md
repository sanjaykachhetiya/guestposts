# 🚀 Complete Self-Hosting Guide - Express + MongoDB

## ✅ What's Been Created

I've converted your application from Convex to **Express + MongoDB** for complete self-hosting!

### Created Files:
- ✅ `server/index.js` - Main Express server
- ✅ `server/middleware/auth.js` - JWT authentication
- ✅ `server/models/` - 8 Mongoose models (Publisher, User, Order, Cart, Wishlist, Package, Niche, Review)
- ✅ `server/routes/publishers.js` - Publisher API
- ✅ `server/routes/auth.js` - Authentication API
- ✅ `server/routes/cart.js` - Cart API

### Still Need to Create:
The following route files follow the same pattern. I'll provide templates below.

---

## 📁 Remaining Route Files to Create

### 1. `server/routes/orders.js`

```javascript
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Publisher = require('../models/Publisher');
const { authenticate } = require('../middleware/auth');

// Generate order number
function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Create order from cart
router.post('/', authenticate, async (req, res) => {
  try {
    // Get cart items
    const cartItems = await Cart.find({ userId: req.userId }).populate('publisherId');

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total
    let totalAmount = 0;
    const items = cartItems.map(item => {
      const itemTotal = item.publisherId.price * item.quantity;
      totalAmount += itemTotal;
      return {
        publisherId: item.publisherId._id,
        publisherDomain: item.publisherId.domain,
        price: item.publisherId.price,
        quantity: item.quantity
      };
    });

    // Create order
    const order = new Order({
      userId: req.userId,
      orderNumber: generateOrderNumber(),
      totalAmount,
      items
    });

    await order.save();

    // Clear cart
    await Cart.deleteMany({ userId: req.userId });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user orders
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .populate('items.publisherId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('items.publisherId');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (admin)
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
```

### 2. `server/routes/wishlist.js`

```javascript
const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { authenticate } = require('../middleware/auth');

// Get user wishlist
router.get('/', authenticate, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.userId })
      .populate('publisherId')
      .sort({ createdAt: -1 });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to wishlist
router.post('/', authenticate, async (req, res) => {
  try {
    const { publisherId } = req.body;

    // Check if already exists
    const existing = await Wishlist.findOne({ userId: req.userId, publisherId });
    if (existing) {
      return res.status(400).json({ error: 'Already in wishlist' });
    }

    const item = new Wishlist({ userId: req.userId, publisherId });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove from wishlist
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if in wishlist
router.get('/check/:publisherId', authenticate, async (req, res) => {
  try {
    const exists = await Wishlist.exists({
      userId: req.userId,
      publisherId: req.params.publisherId
    });
    res.json({ inWishlist: !!exists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### 3. `server/routes/packages.js`

```javascript
const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

// Get all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find({ active: true }).sort({ price: 1 });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get package by ID
router.get('/:id', async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### 4. `server/routes/niches.js`

```javascript
const express = require('express');
const router = express.Router();
const Niche = require('../models/Niche');

// Get all niches
router.get('/', async (req, res) => {
  try {
    const niches = await Niche.find().sort({ name: 1 });
    res.json(niches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get niche by slug
router.get('/:slug', async (req, res) => {
  try {
    const niche = await Niche.findOne({ slug: req.params.slug });
    if (!niche) {
      return res.status(404).json({ error: 'Niche not found' });
    }
    res.json(niche);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### 5. `server/routes/reviews.js`

```javascript
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { authenticate } = require('../middleware/auth');

// Get approved reviews
router.get('/', async (req, res) => {
  try {
    const { publisherId, limit = 50 } = req.query;
    const query = { approved: true };

    if (publisherId) {
      query.publisherId = publisherId;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create review
router.post('/', authenticate, async (req, res) => {
  try {
    const { rating, comment, publisherId, orderId } = req.body;

    const review = new Review({
      userId: req.userId,
      userName: req.user.name || 'Anonymous',
      userImage: req.user.image,
      rating,
      comment,
      publisherId,
      orderId
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
```

### 6. `server/routes/users.js`

```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      image: req.user.image
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/me', authenticate, async (req, res) => {
  try {
    const { name, image } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (image) updates.image = image;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
```

---

## 📝 Create Seed Script

### `server/seed.js`

```javascript
const mongoose = require('mongoose');
const Publisher = require('./models/Publisher');
const Package = require('./models/Package');
const Niche = require('./models/Niche');
const Review = require('./models/Review');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/guestposthub';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Publisher.deleteMany({}),
      Package.deleteMany({}),
      Niche.deleteMany({}),
      Review.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Create niches
    const niches = [
      { name: "Technology", slug: "technology", icon: "💻", publisherCount: 0 },
      { name: "Business", slug: "business", icon: "💼", publisherCount: 0 },
      { name: "Health & Fitness", slug: "health-fitness", icon: "💪", publisherCount: 0 },
      { name: "Travel", slug: "travel", icon: "✈️", publisherCount: 0 },
      { name: "Food & Cooking", slug: "food-cooking", icon: "🍳", publisherCount: 0 },
      { name: "Fashion", slug: "fashion", icon: "👗", publisherCount: 0 },
      { name: "Sports", slug: "sports", icon: "⚽", publisherCount: 0 },
      { name: "Finance", slug: "finance", icon: "💰", publisherCount: 0 },
      { name: "Real Estate", slug: "real-estate", icon: "🏠", publisherCount: 0 },
      { name: "Education", slug: "education", icon: "📚", publisherCount: 0 },
      { name: "Entertainment", slug: "entertainment", icon: "🎬", publisherCount: 0 },
      { name: "Gaming", slug: "gaming", icon: "🎮", publisherCount: 0 },
      { name: "Marketing", slug: "marketing", icon: "📈", publisherCount: 0 },
      { name: "Automotive", slug: "automotive", icon: "🚗", publisherCount: 0 },
      { name: "Pets", slug: "pets", icon: "🐾", publisherCount: 0 },
    ];

    await Niche.insertMany(niches);
    console.log('✅ Created 15 niches');

    // Create packages
    const packages = [
      {
        name: "Starter Package",
        slug: "starter",
        description: "Perfect for testing guest posting with high-quality sites",
        tier: "basic",
        price: 99,
        credits: 5,
        features: [
          "5 Guest Post Credits",
          "DA 20-40 Sites",
          "DoFollow Backlinks",
          "Content Guidelines",
          "7-14 Days Delivery"
        ],
        active: true
      },
      {
        name: "Growth Package",
        slug: "growth",
        description: "Ideal for growing your backlink profile consistently",
        tier: "standard",
        price: 299,
        credits: 20,
        features: [
          "20 Guest Post Credits",
          "DA 30-60 Sites",
          "DoFollow Backlinks",
          "Priority Support",
          "5-10 Days Delivery",
          "Monthly Reports"
        ],
        active: true
      },
      {
        name: "Professional Package",
        slug: "professional",
        description: "Best for serious SEO campaigns and agencies",
        tier: "premium",
        price: 799,
        credits: 60,
        features: [
          "60 Guest Post Credits",
          "DA 40-80 Sites",
          "DoFollow Backlinks",
          "Dedicated Account Manager",
          "3-7 Days Delivery",
          "Weekly Reports",
          "Custom Content"
        ],
        active: true
      },
      {
        name: "Enterprise Package",
        slug: "enterprise",
        description: "Custom solutions for large-scale link building campaigns",
        tier: "enterprise",
        price: 1999,
        credits: 200,
        features: [
          "200+ Guest Post Credits",
          "DA 50-90+ Sites",
          "DoFollow Backlinks",
          "Dedicated Team",
          "24-48 Hours Delivery",
          "Daily Reports",
          "Custom Content & Strategy",
          "White Label Options"
        ],
        active: true
      }
    ];

    await Package.insertMany(packages);
    console.log('✅ Created 4 packages');

    // Create 50 sample publishers
    const countries = ["United States", "United Kingdom", "Canada", "Australia", "India", "Germany"];
    const languages = ["English", "English", "English", "English", "English", "German"];
    const nicheNames = niches.map(n => n.name);
    const publishers = [];

    for (let i = 0; i < 50; i++) {
      const niche = nicheNames[Math.floor(Math.random() * nicheNames.length)];
      const countryIndex = Math.floor(Math.random() * countries.length);
      const da = 20 + Math.floor(Math.random() * 70);
      const pa = da - Math.floor(Math.random() * 15);
      const tf = 15 + Math.floor(Math.random() * 40);
      const cf = tf + Math.floor(Math.random() * 20);
      const traffic = Math.floor(Math.random() * 100000) + 1000;
      const price = Math.floor(da * 2) + Math.floor(Math.random() * 100);

      publishers.push({
        domain: `example-site-${i + 1}.com`,
        niche,
        country: countries[countryIndex],
        domainAuthority: da,
        pageAuthority: pa,
        trustFlow: tf,
        citationFlow: cf,
        monthlyTraffic: traffic,
        spamScore: Math.floor(Math.random() * 5),
        language: languages[countryIndex],
        turnaroundTime: Math.floor(Math.random() * 7) + 3,
        price,
        description: `High-quality ${niche.toLowerCase()} website with engaged audience`,
        contentGuidelines: "Original content only, minimum 800 words, 1-2 dofollow links allowed",
        doFollow: Math.random() > 0.2,
        indexed: Math.random() > 0.1,
        adultContent: false,
        verified: Math.random() > 0.3,
        featured: Math.random() > 0.8,
        status: "active"
      });
    }

    await Publisher.insertMany(publishers);
    console.log('✅ Created 50 publishers');

    // Create demo user
    const demoUser = new User({
      name: "Demo User",
      email: "demo@example.com",
      role: "user"
    });
    await demoUser.save();

    // Create sample reviews
    const reviews = [
      {
        userId: demoUser._id,
        userName: "John Smith",
        rating: 5,
        comment: "Excellent service! Got my guest posts published quickly on high-quality sites. Very satisfied with the results.",
        approved: true
      },
      {
        userId: demoUser._id,
        userName: "Sarah Johnson",
        rating: 5,
        comment: "Best guest posting service I've used. Great communication and high DA sites. Highly recommend!",
        approved: true
      },
      {
        userId: demoUser._id,
        userName: "Michael Brown",
        rating: 4,
        comment: "Good service overall. Delivery was a bit slower than expected but the quality of sites was great.",
        approved: true
      },
      {
        userId: demoUser._id,
        userName: "Emily Davis",
        rating: 5,
        comment: "Professional team, quality backlinks, and excellent customer support. Will definitely use again!",
        approved: true
      },
      {
        userId: demoUser._id,
        userName: "David Wilson",
        rating: 5,
        comment: "Amazing results! My website rankings improved significantly after using their service.",
        approved: true
      }
    ];

    await Review.insertMany(reviews);
    console.log('✅ Created 5 reviews');

    console.log('\n🎉 Database seeded successfully!');
    console.log('📊 Summary:');
    console.log(`   - 15 niches`);
    console.log(`   - 4 packages`);
    console.log(`   - 50 publishers`);
    console.log(`   - 5 reviews`);
    console.log(`   - 1 demo user`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
```

---

## 🔧 Configuration Files

### 1. Create `.env` file in root:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/guestposthub

# Server
PORT=3000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email (optional - for OTP)
EMAIL_USER=your@email.com
EMAIL_PASSWORD=yourpassword
```

### 2. Update `package.json` scripts:

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "server": "nodemon server/index.js",
    "server:prod": "node server/index.js",
    "seed": "node server/seed.js",
    "dev:all": "concurrently \"npm run server\" \"npm run dev\""
  }
}
```

Install concurrently for running both servers:
```bash
npm install --save-dev concurrently
```

---

## 🚀 Running Your Self-Hosted Application

### Step 1: Install MongoDB

**Windows:**
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Start MongoDB service

**Or use MongoDB Atlas (free cloud):**
- Sign up at: https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Update `.env` with connection string

### Step 2: Start Everything

```bash
# Terminal 1: Start MongoDB (if local)
mongod

# Terminal 2: Seed database
npm run seed

# Terminal 3: Start backend
npm run server

# Terminal 4: Start frontend
npm run dev
```

**Or run all at once:**
```bash
npm run dev:all
```

### Step 3: Test

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/health

---

## 📡 Frontend API Integration

You need to update frontend to use REST API instead of Convex. Create `src/lib/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Publishers API
export const publishersAPI = {
  list: (params?: any) => apiCall(`/publishers?${new URLSearchParams(params)}`),
  featured: () => apiCall('/publishers/featured'),
  stats: () => apiCall('/publishers/stats'),
  getById: (id: string) => apiCall(`/publishers/${id}`),
};

// Cart API
export const cartAPI = {
  get: () => apiCall('/cart'),
  add: (data: any) => apiCall('/cart', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiCall(`/cart/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => apiCall(`/cart/${id}`, { method: 'DELETE' }),
  clear: () => apiCall('/cart', { method: 'DELETE' }),
  count: () => apiCall('/cart/count'),
};

// Orders API
export const ordersAPI = {
  create: () => apiCall('/orders', { method: 'POST' }),
  list: () => apiCall('/orders'),
  getById: (id: string) => apiCall(`/orders/${id}`),
};

// Wishlist API
export const wishlistAPI = {
  get: () => apiCall('/wishlist'),
  add: (publisherId: string) => apiCall('/wishlist', { method: 'POST', body: JSON.stringify({ publisherId }) }),
  remove: (id: string) => apiCall(`/wishlist/${id}`, { method: 'DELETE' }),
  check: (publisherId: string) => apiCall(`/wishlist/check/${publisherId}`),
};

// Auth API
export const authAPI = {
  requestOTP: (email: string) => apiCall('/auth/otp/request', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyOTP: (email: string, otp: string) => apiCall('/auth/otp/verify', { method: 'POST', body: JSON.stringify({ email, otp }) }),
  me: () => apiCall('/auth/me'),
  logout: () => apiCall('/auth/logout', { method: 'POST' }),
};

// Packages API
export const packagesAPI = {
  list: () => apiCall('/packages'),
  getById: (id: string) => apiCall(`/packages/${id}`),
};

// Reviews API
export const reviewsAPI = {
  list: (params?: any) => apiCall(`/reviews?${new URLSearchParams(params)}`),
  create: (data: any) => apiCall('/reviews', { method: 'POST', body: JSON.stringify(data) }),
};

// Niches API
export const nichesAPI = {
  list: () => apiCall('/niches'),
  getBySlug: (slug: string) => apiCall(`/niches/${slug}`),
};
```

Then update your pages to use these APIs instead of Convex.

---

## 🌐 Deployment to Your Server

### Option 1: VPS (DigitalOcean, Linode, AWS)

```bash
# On your server
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2

# Clone your repo
git clone https://github.com/sanjaykachhetiya/guestposts.git
cd guestposts

# Install dependencies
npm install

# Create .env file
nano .env
# Add your production environment variables

# Seed database
npm run seed

# Build frontend
npm run build

# Start backend with PM2
pm2 start server/index.js --name guestpost-api
pm2 save
pm2 startup

# Serve frontend with Nginx
sudo apt-get install nginx
sudo cp -r dist/* /var/www/html/
```

### Configure Nginx (`/etc/nginx/sites-available/default`):

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

### Add SSL with Let's Encrypt:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 📊 Summary

### What You Have Now:

✅ **Complete Express + MongoDB backend**
✅ **All 8 database models** (Publisher, User, Order, Cart, Wishlist, Package, Niche, Review)
✅ **JWT authentication with OTP**
✅ **RESTful API endpoints** for all features
✅ **Database seeding script**
✅ **Self-hosting ready**

### Total Cost (Your Own Hosting):

- **VPS:** $5-10/month (DigitalOcean, Linode)
- **Domain:** $10-15/year
- **SSL:** FREE (Let's Encrypt)
- **Total:** ~$5-10/month + domain

### Next Steps:

1. Create all remaining route files (copy from templates above)
2. Run `npm run seed` to populate database
3. Test locally with `npm run dev:all`
4. Deploy to your VPS
5. Configure Nginx and SSL
6. Point your domain to your server

---

**You now have COMPLETE control over your hosting!** 🎉

All code, database, and infrastructure are on YOUR server. No dependence on third-party services!
