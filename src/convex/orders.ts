import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Create order from cart
export const createOrder = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    // Get cart items
    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Build order items
    let totalAmount = 0;
    const items = [];

    for (const cartItem of cartItems) {
      const publisher = await ctx.db.get(cartItem.publisherId);
      if (!publisher) continue;

      const itemTotal = publisher.price * cartItem.quantity;
      totalAmount += itemTotal;

      items.push({
        publisherId: cartItem.publisherId,
        publisherDomain: publisher.domain,
        price: publisher.price,
        quantity: cartItem.quantity,
      });
    }

    // Create order
    const orderId = await ctx.db.insert("orders", {
      userId,
      orderNumber: generateOrderNumber(),
      status: "pending" as const,
      totalAmount,
      paymentStatus: "unpaid" as const,
      items,
    });

    // Create order items for tracking
    for (const item of items) {
      for (let i = 0; i < item.quantity; i++) {
        await ctx.db.insert("orderItems", {
          orderId,
          publisherId: item.publisherId,
          status: "pending" as const,
        });
      }
    }

    // Clear cart
    for (const cartItem of cartItems) {
      await ctx.db.delete(cartItem._id);
    }

    return orderId;
  },
});

// Get user orders
export const getUserOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return orders.sort((a, b) => b._creationTime - a._creationTime);
  },
});

// Get order by ID
export const getById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const order = await ctx.db.get(args.id);

    if (!order || (order.userId !== userId)) {
      return null;
    }

    // Get order items
    const orderItems = await ctx.db
      .query("orderItems")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.id))
      .collect();

    // Enrich with publisher details
    const enrichedItems = await Promise.all(
      orderItems.map(async (item) => {
        const publisher = await ctx.db.get(item.publisherId);
        return {
          ...item,
          publisher,
        };
      })
    );

    return {
      ...order,
      orderItems: enrichedItems,
    };
  },
});

// Update order status
export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
    });
  },
});

// Update payment status
export const updatePaymentStatus = mutation({
  args: {
    orderId: v.id("orders"),
    paymentStatus: v.union(v.literal("paid"), v.literal("unpaid"), v.literal("refunded")),
    paymentMethod: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: any = {
      paymentStatus: args.paymentStatus,
    };

    if (args.paymentMethod) {
      updates.paymentMethod = args.paymentMethod;
    }

    if (args.paymentStatus === "paid") {
      updates.status = "processing";
    }

    await ctx.db.patch(args.orderId, updates);
  },
});

// Get all orders (admin)
export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").take(100);
    return orders.sort((a, b) => b._creationTime - a._creationTime);
  },
});
