# 📊 GuestPostHub Database Schema

Complete database schema documentation for the guest post marketplace platform.

## Overview

The platform uses **Convex** as the backend database with the following tables:

## 📋 Tables

### 1. `publishers`
Website listings available for guest posting.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | Id | Auto-generated unique ID |
| `_creationTime` | number | Timestamp (auto) |
| `domain` | string | Website domain (e.g., "example.com") |
| `niche` | string | Category/niche |
| `country` | string | Publisher country |
| `domainAuthority` | number | DA score (0-100) |
| `pageAuthority` | number | PA score (0-100) |
| `trustFlow` | number | Trust Flow metric |
| `citationFlow` | number | Citation Flow metric |
| `monthlyTraffic` | number | Monthly visitors |
| `spamScore` | number | Spam score (0-100) |
| `language` | string | Content language |
| `turnaroundTime` | number | Days to publish |
| `price` | number | Price in USD |
| `description` | string? | Optional description |
| `contentGuidelines` | string? | Content requirements |
| `doFollow` | boolean | DoFollow link? |
| `indexed` | boolean | Google indexed? |
| `adultContent` | boolean | Adult content allowed? |
| `verified` | boolean | Manually verified? |
| `featured` | boolean | Featured listing? |
| `status` | "active" \| "inactive" \| "pending" | Publication status |

**Indexes:**
- `by_niche` - Query by niche
- `by_country` - Query by country
- `by_status` - Query by status
- `by_featured` - Query featured publishers
- `by_verified` - Query verified publishers

---

### 2. `niches`
Categories for organizing publishers.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | Id | Auto-generated |
| `_creationTime` | number | Timestamp |
| `name` | string | Niche name |
| `slug` | string | URL-friendly slug |
| `description` | string? | Optional description |
| `icon` | string? | Emoji or icon |
| `publisherCount` | number | # of publishers in niche |

**Indexes:**
- `by_slug` - Query by slug

---

### 3. `packages`
Pre-built pricing packages.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | Id | Auto-generated |
| `_creationTime` | number | Timestamp |
| `name` | string | Package name |
| `slug` | string | URL slug |
| `description` | string | Package description |
| `tier` | "basic" \| "standard" \| "premium" \| "enterprise" | Tier level |
| `price` | number | Price in USD |
| `credits` | number | Guest post credits |
| `features` | string[] | List of features |
| `active` | boolean | Is active? |

**Indexes:**
- `by_tier` - Query by tier

---

### 4. `cart`
User shopping carts.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | Id | Auto-generated |
| `_creationTime` | number | Timestamp |
| `userId` | Id<"users"> | User reference |
| `publisherId` | Id<"publishers"> | Publisher reference |
| `packageId` | Id<"packages">? | Optional package |
| `quantity` | number | Quantity |

**Indexes:**
- `by_userId` - Query user's cart
- `by_publisherId` - Query by publisher

---

### 5. `orders`
Order records.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | Id | Auto-generated |
| `_creationTime` | number | Timestamp |
| `userId` | Id<"users"> | User reference |
| `orderNumber` | string | Order # (e.g., "ORD-ABC123") |
| `status` | "pending" \| "processing" \| "completed" \| "cancelled" \| "refunded" | Order status |
| `totalAmount` | number | Total price |
| `paymentStatus` | "paid" \| "unpaid" \| "refunded" | Payment status |
| `paymentMethod` | string? | Payment method |
| `items` | OrderItem[] | Array of order items |
| `notes` | string? | Order notes |

**OrderItem Structure:**
```typescript
{
  publisherId: Id<"publishers">,
  publisherDomain: string,
  price: number,
  quantity: number
}
```

**Indexes:**
- `by_userId` - Query user orders
- `by_status` - Query by status
- `by_orderNumber` - Query by order number

---

### 6. `orderItems`
Detailed order item tracking.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | Id | Auto-generated |
| `_creationTime` | number | Timestamp |
| `orderId` | Id<"orders"> | Order reference |
| `publisherId` | Id<"publishers"> | Publisher reference |
| `status` | "pending" \| "in_progress" \| "submitted" \| "published" \| "rejected" | Item status |
| `articleUrl` | string? | Published article URL |
| `content` | string? | Article content |
| `targetUrl` | string? | Link target URL |
| `anchorText` | string? | Anchor text |
| `submittedAt` | number? | Submission timestamp |
| `publishedAt` | number? | Publication timestamp |
| `notes` | string? | Item notes |

**Indexes:**
- `by_orderId` - Query order items
- `by_publisherId` - Query by publisher
- `by_status` - Query by status

---

### 7. `wishlist`
User saved items.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | Id | Auto-generated |
| `_creationTime` | number | Timestamp |
| `userId` | Id<"users"> | User reference |
| `publisherId` | Id<"publishers"> | Publisher reference |

**Indexes:**
- `by_userId` - Query user wishlist
- `by_publisherId` - Query by publisher

---

### 8. `reviews`
Customer testimonials.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | Id | Auto-generated |
| `_creationTime` | number | Timestamp |
| `userId` | Id<"users"> | User reference |
| `userName` | string | Display name |
| `userImage` | string? | Avatar URL |
| `rating` | number | 1-5 stars |
| `comment` | string | Review text |
| `publisherId` | Id<"publishers">? | Optional publisher |
| `orderId` | Id<"orders">? | Optional order |
| `approved` | boolean | Admin approved? |

**Indexes:**
- `by_userId` - Query user reviews
- `by_approved` - Query approved reviews

---

### 9. `domainChecks`
Cached SEO tool results.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | Id | Auto-generated |
| `_creationTime` | number | Timestamp |
| `domain` | string | Domain name |
| `checkType` | "da" \| "age" \| "authority" | Check type |
| `result` | string | JSON result (stringified) |
| `expiresAt` | number | Cache expiration |

**Indexes:**
- `by_domain` - Query by domain

---

### 10. `tickets`
Support tickets.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | Id | Auto-generated |
| `_creationTime` | number | Timestamp |
| `userId` | Id<"users"> | User reference |
| `orderId` | Id<"orders">? | Optional order |
| `subject` | string | Ticket subject |
| `message` | string | Initial message |
| `status` | "open" \| "in_progress" \| "closed" | Ticket status |
| `priority` | "low" \| "medium" \| "high" | Priority level |

**Indexes:**
- `by_userId` - Query user tickets
- `by_status` - Query by status

---

### 11. `ticketMessages`
Ticket conversation messages.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | Id | Auto-generated |
| `_creationTime` | number | Timestamp |
| `ticketId` | Id<"tickets"> | Ticket reference |
| `userId` | Id<"users"> | User reference |
| `message` | string | Message content |
| `isStaff` | boolean | Staff reply? |

**Indexes:**
- `by_ticketId` - Query ticket messages

---

### 12. `users`
User accounts (from Convex Auth).

| Field | Type | Description |
|-------|------|-------------|
| `_id` | Id | Auto-generated |
| `_creationTime` | number | Timestamp |
| `name` | string? | Display name |
| `email` | string? | Email address |
| `image` | string? | Avatar URL |
| `emailVerificationTime` | number? | Verification timestamp |
| `isAnonymous` | boolean? | Anonymous user? |
| `role` | "admin" \| "user" \| "member"? | User role |

**Indexes:**
- `email` - Query by email

---

## 📈 Sample Data

The database comes pre-seeded with:

- **50 Publishers** across 15 niches
- **15 Niches** (Technology, Business, Health, etc.)
- **4 Packages** ($99 - $1,999)
- **5 Reviews** (all 4-5 stars)

### Sample Publisher:
```javascript
{
  domain: "example-site-1.com",
  niche: "Technology",
  country: "United States",
  domainAuthority: 65,
  pageAuthority: 58,
  trustFlow: 42,
  citationFlow: 48,
  monthlyTraffic: 45000,
  spamScore: 2,
  language: "English",
  turnaroundTime: 7,
  price: 180,
  doFollow: true,
  indexed: true,
  verified: true,
  featured: true,
  status: "active"
}
```

### Sample Niche:
```javascript
{
  name: "Technology",
  slug: "technology",
  icon: "💻",
  publisherCount: 12
}
```

### Sample Package:
```javascript
{
  name: "Growth Package",
  slug: "growth",
  tier: "standard",
  price: 299,
  credits: 20,
  features: [
    "20 Guest Post Credits",
    "DA 30-60 Sites",
    "DoFollow Backlinks",
    "Priority Support"
  ],
  active: true
}
```

---

## 🔧 Querying Examples

### Get All Active Publishers
```typescript
const publishers = await ctx.db
  .query("publishers")
  .withIndex("by_status", (q) => q.eq("status", "active"))
  .collect();
```

### Get Publishers by Niche
```typescript
const techPubs = await ctx.db
  .query("publishers")
  .withIndex("by_niche", (q) => q.eq("niche", "Technology"))
  .collect();
```

### Get User Cart
```typescript
const cart = await ctx.db
  .query("cart")
  .withIndex("by_userId", (q) => q.eq("userId", userId))
  .collect();
```

### Get User Orders
```typescript
const orders = await ctx.db
  .query("orders")
  .withIndex("by_userId", (q) => q.eq("userId", userId))
  .collect();
```

---

## 💾 Data Types

### Common Types
- `Id<"table">` - Unique document ID
- `number` - Numeric values, timestamps
- `string` - Text values
- `boolean` - True/false
- `string[]` - Array of strings
- `object` - Nested objects

### Timestamp
All documents have `_creationTime` which is a Unix timestamp in milliseconds.

---

## 🔐 Access Patterns

### Public (No Auth Required)
- List publishers
- Get publisher details
- List niches
- List packages
- Get approved reviews

### Authenticated Users
- Add to cart
- Create orders
- View own orders
- Add to wishlist
- View own wishlist

### Admin Only
- Create/update/delete publishers
- Approve reviews
- Manage orders
- View all tickets

---

## 📊 Schema Location

The complete schema is defined in:
```
src/convex/schema.ts
```

To modify the schema:
1. Edit `schema.ts`
2. Run `npx convex dev` to push changes
3. Schema changes are applied automatically

---

## 🚀 Seeding Data

To populate with test data:
```bash
npx convex run seedData:seed
```

This creates all sample data automatically.

---

**Database schema is production-ready and fully indexed for performance!** 🎉
