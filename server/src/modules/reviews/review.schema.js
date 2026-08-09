const { z } = require("zod");

const reviewInsightSchema = z.object({
  restaurantName: z.string(),

  overallSentiment: z.enum([
    "positive",
    "mixed",
    "negative",
    "unknown",
  ]),

  atmosphere: z.object({
    quiet: z.boolean().nullable(),
    cozy: z.boolean().nullable(),
    lively: z.boolean().nullable(),
    description: z.string().nullable(),
  }),

  service: z.object({
    sentiment: z.enum([
      "positive",
      "mixed",
      "negative",
      "unknown",
    ]),
    description: z.string().nullable(),
  }),

  foodQuality: z.object({
    sentiment: z.enum([
      "positive",
      "mixed",
      "negative",
      "unknown",
    ]),
    description: z.string().nullable(),
  }),

  dietaryExperience: z.object({
    vegetarianFriendly: z.boolean().nullable(),
    description: z.string().nullable(),
  }),

  evidence: z.array(
    z.object({
      claim: z.string(),
      sourceUrl: z.string(),
    })
  ),
});

const reviewInsightsSchema = z.object({
  insights: z.array(reviewInsightSchema),
});

module.exports = {
  reviewInsightSchema,
  reviewInsightsSchema,
};