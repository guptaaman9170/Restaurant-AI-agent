const { z } = require("zod");

const menuItemSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  price: z.number().nullable(),
  currency: z.string().nullable(),
  dietaryTags: z.array(z.string()),
});

const restaurantMenuSchema = z.object({
  restaurantName: z.string(),
  menuUrl: z.string().nullable(),
  sourceUrl: z.string(),
  items: z.array(menuItemSchema),
});

const menuResearchSchema = z.object({
  menus: z.array(restaurantMenuSchema),
});

module.exports = {
  menuItemSchema,
  restaurantMenuSchema,
  menuResearchSchema,
};