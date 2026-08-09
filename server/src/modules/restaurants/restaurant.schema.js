const { z } = require("zod");

const restaurantSchema = z.object({
  name: z.string(),

  address: z.string().nullable(),

  city: z.string(),

  cuisine: z.array(z.string()),

  priceLevel: z.number().int().min(1).max(4).nullable(),

  priceRange: z.object({
    min: z.number().nullable(),
    max: z.number().nullable(),
    currency: z.string().nullable(),
  }),

  rating: z.number().min(0).max(5).nullable(),

  websiteUrl: z.string().nullable(),

  menuUrl: z.string().nullable(),

  sourceUrl: z.string(),

  description: z.string(),

  matchReasons: z.array(z.string()),

  concerns: z.array(z.string()),
});

const restaurantListSchema = z.object({
  restaurants: z.array(restaurantSchema),
});

module.exports = {
  restaurantSchema,
  restaurantListSchema,
};