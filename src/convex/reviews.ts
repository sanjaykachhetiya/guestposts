import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get approved reviews
export const getApproved = query({
  args: {
    publisherId: v.optional(v.id("publishers")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let reviewsQuery = ctx.db
      .query("reviews")
      .withIndex("by_approved", (q) => q.eq("approved", true));

    const reviews = await reviewsQuery.collect();

    let filtered = reviews;
    if (args.publisherId) {
      filtered = reviews.filter((r) => r.publisherId === args.publisherId);
    }

    const limit = args.limit || 50;
    return filtered.slice(0, limit).sort((a, b) => b._creationTime - a._creationTime);
  },
});

// Create review
export const create = mutation({
  args: {
    rating: v.number(),
    comment: v.string(),
    publisherId: v.optional(v.id("publishers")),
    orderId: v.optional(v.id("orders")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const reviewId = await ctx.db.insert("reviews", {
      userId,
      userName: user.name || "Anonymous",
      userImage: user.image,
      rating: args.rating,
      comment: args.comment,
      publisherId: args.publisherId,
      orderId: args.orderId,
      approved: false, // Reviews need admin approval
    });

    return reviewId;
  },
});

// Approve review (admin)
export const approve = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { approved: true });
  },
});

// Delete review (admin)
export const remove = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get all reviews (admin)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("reviews").take(100);
  },
});
