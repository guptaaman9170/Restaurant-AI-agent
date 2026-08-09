const geminiModel = require("../../../../integrations/gemini/gemini.client");
const {
  reviewInsightsSchema,
} = require("../../../reviews/review.schema");
const {
  searchRestaurantReviews,
} = require("../../../../tools/review-search.tool");

const reviewNode = async (state) => {
  const restaurants = state.shortlistedRestaurants || [];

  if (!restaurants.length) {
    return {
      reviews: [],
      reviewInsights: [],
      researchSteps: [
        {
          id: "review_research",
          label: "Analyzing restaurant reviews",
          status: "completed",
          completedAt: new Date().toISOString(),
        },
      ],
    };
  }

  const reviewResults = await Promise.all(
    restaurants.map(async (restaurant) => {
      const result = await searchRestaurantReviews({
        restaurantName: restaurant.name,
        city: restaurant.city,
      });

      return {
        restaurantName: restaurant.name,
        results: result.results,
      };
    })
  );

  const structuredModel = geminiModel.withStructuredOutput(
    reviewInsightsSchema
  );

  const prompt = `
You are the review analysis component of a restaurant recommendation agent.

User preferences:
${JSON.stringify(state.userPreferences, null, 2)}

Restaurants:
${JSON.stringify(restaurants, null, 2)}

Review search results:
${JSON.stringify(reviewResults, null, 2)}

Analyze the available evidence for each restaurant.

Rules:
- Never invent review information.
- Only make claims supported by the provided search results.
- If something cannot be determined, use null or "unknown".
- Pay special attention to atmosphere and whether the restaurant is quiet.
- Analyze service and food quality.
- Determine vegetarian-friendliness only when supported by evidence.
- Every evidence claim must include the URL supporting it.
- Do not treat a restaurant guide's generic description as a customer review unless the source explicitly provides review-like evidence.
`;

  const result = await structuredModel.invoke(prompt);

  const reviewInsights = result.insights;

  const reviews = reviewResults.map((item) => ({
    restaurantName: item.restaurantName,
    sources: item.results.map((result) => ({
      title: result.title,
      url: result.url,
      content: result.content,
      score: result.score,
      publishedDate: result.publishedDate,
    })),
  }));

  return {
    reviews,
    reviewInsights,

    researchSteps: [
      {
        id: "review_research",
        label: "Analyzing restaurant reviews",
        status: "completed",
        completedAt: new Date().toISOString(),
        metadata: {
          restaurantsChecked: restaurants.length,
          insightsGenerated: reviewInsights.length,
        },
      },
    ],

    evidence: reviewInsights.flatMap((insight) =>
      insight.evidence.map((item) => ({
        type: "review",
        restaurantName: insight.restaurantName,
        claim: item.claim,
        sourceUrl: item.sourceUrl,
        retrievedAt: new Date().toISOString(),
      }))
    ),
  };
};

module.exports = {
  reviewNode,
};