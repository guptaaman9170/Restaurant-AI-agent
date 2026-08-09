const { z } = require("zod");

const geminiModel = require("../../../../integrations/gemini/gemini.client");

const finalRecommendationSchema = z.object({
  summary: z.string(),

  recommendations: z.array(
    z.object({
      rank: z.number(),
      restaurantName: z.string(),
      score: z.number(),

      whyRecommended: z.array(z.string()),

      menuHighlights: z.array(
        z.object({
          name: z.string(),
          price: z.number().nullable(),
          currency: z.string().nullable(),
        })
      ),

      reviewHighlights: z.array(z.string()),

      concerns: z.array(z.string()),

      restaurantUrl: z.string().nullable(),
      menuUrl: z.string().nullable(),
    })
  ),
});

const finalNode = async (state) => {
  const rankedRestaurants = state.restaurantScores || [];

  if (!rankedRestaurants.length) {
    return {
      recommendations: [],

      finalSummary: "",

      researchSteps: [
        {
          id: "final_recommendation",
          label: "Preparing recommendations",
          status: "completed",
          completedAt: new Date().toISOString(),
        },
      ],
    };
  }

  const structuredModel = geminiModel.withStructuredOutput(
    finalRecommendationSchema
  );

  const prompt = `
You are the final recommendation component of a restaurant
recommendation agent.

Your job is to explain the already-calculated restaurant rankings
to the user.

IMPORTANT:

- Do NOT change the ranking.
- Do NOT change the score.
- Do NOT invent restaurant information.
- Do NOT invent menu items or prices.
- Do NOT invent review claims.
- Only use the provided data.
- Be transparent when information is unavailable.
- Keep recommendations concise but useful.
- Explain why each restaurant matches the user's preferences.
- Mention concerns or uncertainties when relevant.
- Preserve restaurant and menu URLs exactly as provided.

USER PREFERENCES:
${JSON.stringify(state.userPreferences, null, 2)}

RANKED RESTAURANTS:
${JSON.stringify(rankedRestaurants, null, 2)}

MENU DATA:
${JSON.stringify(state.menus || [], null, 2)}

REVIEW INSIGHTS:
${JSON.stringify(state.reviewInsights || [], null, 2)}

Return a concise summary and recommendations for the top restaurants.
`;

  const result = await structuredModel.invoke(prompt);

  /*
   * Merge the AI explanation back into the original
   * ranking data so we don't lose restaurant details
   * or score breakdowns.
   */

  const recommendations = result.recommendations
    .map((finalRecommendation) => {
      const originalRecommendation =
        rankedRestaurants.find(
          (item) =>
            item?.restaurant?.name ===
            finalRecommendation.restaurantName
        );

      if (!originalRecommendation) {
        return {
          rank: finalRecommendation.rank,
          restaurant: {
            name: finalRecommendation.restaurantName,
          },
          score: finalRecommendation.score,
          breakdown: [],
          reasons: finalRecommendation.whyRecommended || [],
          menuHighlights:
            finalRecommendation.menuHighlights || [],
          reviewHighlights:
            finalRecommendation.reviewHighlights || [],
          concerns:
            finalRecommendation.concerns || [],
          restaurantUrl:
            finalRecommendation.restaurantUrl || null,
          menuUrl:
            finalRecommendation.menuUrl || null,
        };
      }

      return {
        rank: originalRecommendation.rank,

        restaurant: {
          ...originalRecommendation.restaurant,

          restaurantUrl:
            finalRecommendation.restaurantUrl ||
            originalRecommendation.restaurant?.restaurantUrl ||
            null,

          menuUrl:
            finalRecommendation.menuUrl ||
            originalRecommendation.restaurant?.menuUrl ||
            null,
        },

        score: originalRecommendation.score,

        breakdown:
          originalRecommendation.breakdown || [],

        reasons:
          finalRecommendation.whyRecommended || [],

        menuHighlights:
          finalRecommendation.menuHighlights || [],

        reviewHighlights:
          finalRecommendation.reviewHighlights || [],

        concerns:
          finalRecommendation.concerns || [],
      };
    })
    .sort((a, b) => a.rank - b.rank);

  return {
    recommendations,

    finalSummary: result.summary,

    researchSteps: [
      {
        id: "final_recommendation",
        label: "Preparing recommendations",
        status: "completed",
        completedAt: new Date().toISOString(),
      },
    ],
  };
};

module.exports = {
  finalNode,
};