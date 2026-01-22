import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Create niches
    const niches = [
      { name: "Technology", slug: "technology", icon: "💻" },
      { name: "Business", slug: "business", icon: "💼" },
      { name: "Health & Fitness", slug: "health-fitness", icon: "💪" },
      { name: "Travel", slug: "travel", icon: "✈️" },
      { name: "Food & Cooking", slug: "food-cooking", icon: "🍳" },
      { name: "Fashion", slug: "fashion", icon: "👗" },
      { name: "Sports", slug: "sports", icon: "⚽" },
      { name: "Finance", slug: "finance", icon: "💰" },
      { name: "Real Estate", slug: "real-estate", icon: "🏠" },
      { name: "Education", slug: "education", icon: "📚" },
      { name: "Entertainment", slug: "entertainment", icon: "🎬" },
      { name: "Gaming", slug: "gaming", icon: "🎮" },
      { name: "Marketing", slug: "marketing", icon: "📈" },
      { name: "Automotive", slug: "automotive", icon: "🚗" },
      { name: "Pets", slug: "pets", icon: "🐾" },
    ];

    for (const niche of niches) {
      await ctx.db.insert("niches", {
        ...niche,
        publisherCount: 0,
      });
    }

    // Create packages
    const packages = [
      {
        name: "Starter Package",
        slug: "starter",
        description: "Perfect for testing guest posting with high-quality sites",
        tier: "basic" as const,
        price: 99,
        credits: 5,
        features: [
          "5 Guest Post Credits",
          "DA 20-40 Sites",
          "DoFollow Backlinks",
          "Content Guidelines",
          "7-14 Days Delivery",
        ],
      },
      {
        name: "Growth Package",
        slug: "growth",
        description: "Ideal for growing your backlink profile consistently",
        tier: "standard" as const,
        price: 299,
        credits: 20,
        features: [
          "20 Guest Post Credits",
          "DA 30-60 Sites",
          "DoFollow Backlinks",
          "Priority Support",
          "5-10 Days Delivery",
          "Monthly Reports",
        ],
      },
      {
        name: "Professional Package",
        slug: "professional",
        description: "Best for serious SEO campaigns and agencies",
        tier: "premium" as const,
        price: 799,
        credits: 60,
        features: [
          "60 Guest Post Credits",
          "DA 40-80 Sites",
          "DoFollow Backlinks",
          "Dedicated Account Manager",
          "3-7 Days Delivery",
          "Weekly Reports",
          "Custom Content",
        ],
      },
      {
        name: "Enterprise Package",
        slug: "enterprise",
        description: "Custom solutions for large-scale link building campaigns",
        tier: "enterprise" as const,
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
          "White Label Options",
        ],
      },
    ];

    for (const pkg of packages) {
      await ctx.db.insert("packages", {
        ...pkg,
        active: true,
      });
    }

    // Create sample publishers
    const countries = ["United States", "United Kingdom", "Canada", "Australia", "India", "Germany"];
    const languages = ["English", "English", "English", "English", "English", "German"];
    const publishers = [];

    for (let i = 0; i < 50; i++) {
      const nicheIndex = Math.floor(Math.random() * niches.length);
      const countryIndex = Math.floor(Math.random() * countries.length);
      const da = 20 + Math.floor(Math.random() * 70);
      const pa = da - Math.floor(Math.random() * 15);
      const tf = 15 + Math.floor(Math.random() * 40);
      const cf = tf + Math.floor(Math.random() * 20);
      const traffic = Math.floor(Math.random() * 100000) + 1000;
      const price = Math.floor(da * 2) + Math.floor(Math.random() * 100);

      publishers.push({
        domain: `example-site-${i + 1}.com`,
        niche: niches[nicheIndex].name,
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
        description: `High-quality ${niches[nicheIndex].name.toLowerCase()} website with engaged audience`,
        contentGuidelines: "Original content only, minimum 800 words, 1-2 dofollow links allowed",
        doFollow: Math.random() > 0.2,
        indexed: Math.random() > 0.1,
        adultContent: false,
        verified: Math.random() > 0.3,
        featured: Math.random() > 0.8,
        status: "active" as const,
      });
    }

    for (const publisher of publishers) {
      await ctx.db.insert("publishers", publisher);
    }

    // Create some sample reviews
    const reviews = [
      {
        userName: "John Smith",
        rating: 5,
        comment: "Excellent service! Got my guest posts published quickly on high-quality sites. Very satisfied with the results.",
        approved: true,
      },
      {
        userName: "Sarah Johnson",
        rating: 5,
        comment: "Best guest posting service I've used. Great communication and high DA sites. Highly recommend!",
        approved: true,
      },
      {
        userName: "Michael Brown",
        rating: 4,
        comment: "Good service overall. Delivery was a bit slower than expected but the quality of sites was great.",
        approved: true,
      },
      {
        userName: "Emily Davis",
        rating: 5,
        comment: "Professional team, quality backlinks, and excellent customer support. Will definitely use again!",
        approved: true,
      },
      {
        userName: "David Wilson",
        rating: 5,
        comment: "Amazing results! My website rankings improved significantly after using their service.",
        approved: true,
      },
    ];

    // Create a dummy user ID for reviews (in real app, this would be actual users)
    const dummyUserId = await ctx.db.insert("users", {
      name: "Demo User",
      email: "demo@example.com",
    });

    for (const review of reviews) {
      await ctx.db.insert("reviews", {
        userId: dummyUserId,
        userName: review.userName,
        rating: review.rating,
        comment: review.comment,
        approved: review.approved,
      });
    }

    // Update niche counts
    for (const niche of niches) {
      const count = publishers.filter(p => p.niche === niche.name).length;
      const nicheDoc = await ctx.db
        .query("niches")
        .withIndex("by_slug", (q) => q.eq("slug", niche.slug))
        .unique();
      if (nicheDoc) {
        await ctx.db.patch(nicheDoc._id, { publisherCount: count });
      }
    }

    return { success: true, message: "Database seeded successfully!" };
  },
});
