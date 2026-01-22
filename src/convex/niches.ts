import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all niches
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("niches").collect();
  },
});

// Get niche by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const niche = await ctx.db
      .query("niches")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    return niche;
  },
});

// Create niche
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const nicheId = await ctx.db.insert("niches", {
      ...args,
      publisherCount: 0,
    });
    return nicheId;
  },
});

// Update niche
export const update = mutation({
  args: {
    id: v.id("niches"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    publisherCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Update publisher count for a niche
export const updatePublisherCount = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const niche = await ctx.db
      .query("niches")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!niche) return;

    const publishers = await ctx.db
      .query("publishers")
      .withIndex("by_niche", (q) => q.eq("niche", niche.name))
      .collect();

    await ctx.db.patch(niche._id, {
      publisherCount: publishers.length,
    });
  },
});
