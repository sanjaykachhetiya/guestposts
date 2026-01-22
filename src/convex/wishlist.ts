import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get user's wishlist
export const getWishlist = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const wishlistItems = await ctx.db
      .query("wishlist")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Enrich with publisher details
    const enrichedItems = await Promise.all(
      wishlistItems.map(async (item) => {
        const publisher = await ctx.db.get(item.publisherId);
        return {
          ...item,
          publisher,
        };
      })
    );

    return enrichedItems.filter(item => item.publisher !== null);
  },
});

// Add to wishlist
export const addToWishlist = mutation({
  args: { publisherId: v.id("publishers") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    // Check if already in wishlist
    const existing = await ctx.db
      .query("wishlist")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("publisherId"), args.publisherId))
      .first();

    if (existing) {
      return existing._id;
    }

    const wishlistId = await ctx.db.insert("wishlist", {
      userId,
      publisherId: args.publisherId,
    });

    return wishlistId;
  },
});

// Remove from wishlist
export const removeFromWishlist = mutation({
  args: { publisherId: v.id("publishers") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    const item = await ctx.db
      .query("wishlist")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("publisherId"), args.publisherId))
      .first();

    if (item) {
      await ctx.db.delete(item._id);
    }
  },
});

// Check if in wishlist
export const isInWishlist = query({
  args: { publisherId: v.id("publishers") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const item = await ctx.db
      .query("wishlist")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("publisherId"), args.publisherId))
      .first();

    return item !== null;
  },
});
