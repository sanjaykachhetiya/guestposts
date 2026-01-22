import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get user's cart
export const getCart = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Enrich with publisher details
    const enrichedItems = await Promise.all(
      cartItems.map(async (item) => {
        const publisher = await ctx.db.get(item.publisherId);
        return {
          ...item,
          publisher,
        };
      })
    );

    return enrichedItems;
  },
});

// Add to cart
export const addToCart = mutation({
  args: {
    publisherId: v.id("publishers"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    // Check if already in cart
    const existing = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("publisherId"), args.publisherId))
      .first();

    if (existing) {
      // Update quantity
      await ctx.db.patch(existing._id, {
        quantity: existing.quantity + args.quantity,
      });
      return existing._id;
    } else {
      // Add new item
      const cartId = await ctx.db.insert("cart", {
        userId,
        publisherId: args.publisherId,
        quantity: args.quantity,
      });
      return cartId;
    }
  },
});

// Update cart item quantity
export const updateQuantity = mutation({
  args: {
    cartId: v.id("cart"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    const cartItem = await ctx.db.get(args.cartId);
    if (!cartItem || cartItem.userId !== userId) {
      throw new Error("Cart item not found");
    }

    if (args.quantity <= 0) {
      await ctx.db.delete(args.cartId);
    } else {
      await ctx.db.patch(args.cartId, { quantity: args.quantity });
    }
  },
});

// Remove from cart
export const removeFromCart = mutation({
  args: { cartId: v.id("cart") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    const cartItem = await ctx.db.get(args.cartId);
    if (!cartItem || cartItem.userId !== userId) {
      throw new Error("Cart item not found");
    }

    await ctx.db.delete(args.cartId);
  },
});

// Clear cart
export const clearCart = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }
  },
});

// Get cart count
export const getCartCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return 0;

    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  },
});
