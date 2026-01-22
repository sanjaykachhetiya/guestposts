import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

// Get all publishers with pagination and filters
export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    niche: v.optional(v.string()),
    country: v.optional(v.string()),
    minDA: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    doFollow: v.optional(v.boolean()),
    verified: v.optional(v.boolean()),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Apply index-based filters
    let publishers;

    if (args.niche && args.niche !== "all") {
      publishers = await ctx.db
        .query("publishers")
        .withIndex("by_niche", (q) => q.eq("niche", args.niche!))
        .collect();
    } else if (args.country && args.country !== "all") {
      publishers = await ctx.db
        .query("publishers")
        .withIndex("by_country", (q) => q.eq("country", args.country!))
        .collect();
    } else if (args.verified !== undefined) {
      publishers = await ctx.db
        .query("publishers")
        .withIndex("by_verified", (q) => q.eq("verified", args.verified!))
        .collect();
    } else {
      publishers = await ctx.db
        .query("publishers")
        .withIndex("by_status", (q) => q.eq("status", "active"))
        .collect();
    }

    const filtered = publishers.filter((pub) => {
      if (args.minDA && pub.domainAuthority < args.minDA) return false;
      if (args.maxPrice && pub.price > args.maxPrice) return false;
      if (args.doFollow !== undefined && pub.doFollow !== args.doFollow) return false;
      if (args.searchQuery) {
        const search = args.searchQuery.toLowerCase();
        if (!pub.domain.toLowerCase().includes(search) &&
            !pub.niche.toLowerCase().includes(search)) {
          return false;
        }
      }
      return pub.status === "active";
    });

    // Manual pagination
    const startIndex = args.paginationOpts.cursor
      ? parseInt(args.paginationOpts.cursor)
      : 0;
    const endIndex = startIndex + args.paginationOpts.numItems;
    const page = filtered.slice(startIndex, endIndex);
    const isDone = endIndex >= filtered.length;
    const continueCursor = isDone ? null : endIndex.toString();

    return {
      page,
      isDone,
      continueCursor,
    };
  },
});

// Get featured publishers
export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const publishers = await ctx.db
      .query("publishers")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .take(12);
    return publishers;
  },
});

// Get single publisher
export const getById = query({
  args: { id: v.id("publishers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get publisher stats
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const publishers = await ctx.db.query("publishers").collect();
    return {
      total: publishers.length,
      active: publishers.filter(p => p.status === "active").length,
      verified: publishers.filter(p => p.verified).length,
      featured: publishers.filter(p => p.featured).length,
    };
  },
});

// Admin: Create publisher
export const create = mutation({
  args: {
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
    turnaroundTime: v.number(),
    price: v.number(),
    description: v.optional(v.string()),
    contentGuidelines: v.optional(v.string()),
    doFollow: v.boolean(),
    indexed: v.boolean(),
    adultContent: v.boolean(),
    verified: v.boolean(),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    const publisherId = await ctx.db.insert("publishers", {
      ...args,
      status: "active" as const,
    });
    return publisherId;
  },
});

// Admin: Update publisher
export const update = mutation({
  args: {
    id: v.id("publishers"),
    domain: v.optional(v.string()),
    niche: v.optional(v.string()),
    country: v.optional(v.string()),
    domainAuthority: v.optional(v.number()),
    pageAuthority: v.optional(v.number()),
    trustFlow: v.optional(v.number()),
    citationFlow: v.optional(v.number()),
    monthlyTraffic: v.optional(v.number()),
    spamScore: v.optional(v.number()),
    language: v.optional(v.string()),
    turnaroundTime: v.optional(v.number()),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    contentGuidelines: v.optional(v.string()),
    doFollow: v.optional(v.boolean()),
    indexed: v.optional(v.boolean()),
    adultContent: v.optional(v.boolean()),
    verified: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("pending"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Admin: Delete publisher
export const remove = mutation({
  args: { id: v.id("publishers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
