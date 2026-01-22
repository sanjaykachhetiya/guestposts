import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Publishers/Websites table
    publishers: defineTable({
      domain: v.string(),
      niche: v.string(),
      country: v.string(),
      domainAuthority: v.number(),
      pageAuthority: v.number(),
      trustFlow: v.number(),
      citationFlow: v.number(),
      monthlyTraffic: v.number(),
      spamScore: v.number(),
      language: v.string(),
      turnaroundTime: v.number(), // in days
      price: v.number(),
      description: v.optional(v.string()),
      contentGuidelines: v.optional(v.string()),
      doFollow: v.boolean(),
      indexed: v.boolean(),
      adultContent: v.boolean(),
      verified: v.boolean(),
      featured: v.boolean(),
      status: v.union(v.literal("active"), v.literal("inactive"), v.literal("pending")),
    })
      .index("by_niche", ["niche"])
      .index("by_country", ["country"])
      .index("by_status", ["status"])
      .index("by_featured", ["featured"])
      .index("by_verified", ["verified"]),

    // Niches/Categories
    niches: defineTable({
      name: v.string(),
      slug: v.string(),
      description: v.optional(v.string()),
      icon: v.optional(v.string()),
      publisherCount: v.number(),
    }).index("by_slug", ["slug"]),

    // Packages/Plans
    packages: defineTable({
      name: v.string(),
      slug: v.string(),
      description: v.string(),
      tier: v.union(v.literal("basic"), v.literal("standard"), v.literal("premium"), v.literal("enterprise")),
      price: v.number(),
      credits: v.number(), // number of guest posts included
      features: v.array(v.string()),
      active: v.boolean(),
    }).index("by_tier", ["tier"]),

    // Shopping Cart
    cart: defineTable({
      userId: v.id("users"),
      publisherId: v.id("publishers"),
      packageId: v.optional(v.id("packages")),
      quantity: v.number(),
    })
      .index("by_userId", ["userId"])
      .index("by_publisherId", ["publisherId"]),

    // Orders
    orders: defineTable({
      userId: v.id("users"),
      orderNumber: v.string(),
      status: v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("completed"),
        v.literal("cancelled"),
        v.literal("refunded")
      ),
      totalAmount: v.number(),
      paymentStatus: v.union(v.literal("paid"), v.literal("unpaid"), v.literal("refunded")),
      paymentMethod: v.optional(v.string()),
      items: v.array(
        v.object({
          publisherId: v.id("publishers"),
          publisherDomain: v.string(),
          price: v.number(),
          quantity: v.number(),
        })
      ),
      notes: v.optional(v.string()),
    })
      .index("by_userId", ["userId"])
      .index("by_status", ["status"])
      .index("by_orderNumber", ["orderNumber"]),

    // Order Items (detailed tracking)
    orderItems: defineTable({
      orderId: v.id("orders"),
      publisherId: v.id("publishers"),
      status: v.union(
        v.literal("pending"),
        v.literal("in_progress"),
        v.literal("submitted"),
        v.literal("published"),
        v.literal("rejected")
      ),
      articleUrl: v.optional(v.string()),
      content: v.optional(v.string()),
      targetUrl: v.optional(v.string()),
      anchorText: v.optional(v.string()),
      submittedAt: v.optional(v.number()),
      publishedAt: v.optional(v.number()),
      notes: v.optional(v.string()),
    })
      .index("by_orderId", ["orderId"])
      .index("by_publisherId", ["publisherId"])
      .index("by_status", ["status"]),

    // Wishlist
    wishlist: defineTable({
      userId: v.id("users"),
      publisherId: v.id("publishers"),
    })
      .index("by_userId", ["userId"])
      .index("by_publisherId", ["publisherId"]),

    // Reviews/Testimonials
    reviews: defineTable({
      userId: v.id("users"),
      userName: v.string(),
      userImage: v.optional(v.string()),
      rating: v.number(), // 1-5
      comment: v.string(),
      publisherId: v.optional(v.id("publishers")),
      orderId: v.optional(v.id("orders")),
      approved: v.boolean(),
    })
      .index("by_userId", ["userId"])
      .index("by_approved", ["approved"]),

    // SEO Tool Results (cached)
    domainChecks: defineTable({
      domain: v.string(),
      checkType: v.union(v.literal("da"), v.literal("age"), v.literal("authority")),
      result: v.string(), // JSON stringified result
      expiresAt: v.number(),
    }).index("by_domain", ["domain"]),

    // Support Tickets
    tickets: defineTable({
      userId: v.id("users"),
      orderId: v.optional(v.id("orders")),
      subject: v.string(),
      message: v.string(),
      status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("closed")),
      priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    })
      .index("by_userId", ["userId"])
      .index("by_status", ["status"]),

    // Ticket Messages
    ticketMessages: defineTable({
      ticketId: v.id("tickets"),
      userId: v.id("users"),
      message: v.string(),
      isStaff: v.boolean(),
    }).index("by_ticketId", ["ticketId"])
  },
  {
    schemaValidation: false,
  },
);

export default schema;
