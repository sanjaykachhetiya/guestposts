import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all packages
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("packages")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();
  },
});

// Get package by ID
export const getById = query({
  args: { id: v.id("packages") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create package
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    tier: v.union(v.literal("basic"), v.literal("standard"), v.literal("premium"), v.literal("enterprise")),
    price: v.number(),
    credits: v.number(),
    features: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const packageId = await ctx.db.insert("packages", {
      ...args,
      active: true,
    });
    return packageId;
  },
});

// Update package
export const update = mutation({
  args: {
    id: v.id("packages"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    credits: v.optional(v.number()),
    features: v.optional(v.array(v.string())),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});
