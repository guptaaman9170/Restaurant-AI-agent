const {
  searchRestaurants,
} = require("../../../../tools/restaurant-search.tool");

const discoveryNode = async (state) => {
  const preferences = state.userPreferences;

  if (!preferences?.city) {
    throw new Error("City is required for restaurant discovery");
  }

  const result = await searchRestaurants({
    city: preferences.city,
    cuisinePreferences: preferences.cuisinePreferences,
    dietaryPreferences: preferences.dietaryPreferences,
    mealType: preferences.mealType,
  });

  const candidateRestaurants = result.results.map((item) => ({
    name: item.title,
    sourceUrl: item.url,
    description: item.content,
    searchScore: item.score,
  }));

  return {
    candidateRestaurants,

    researchSteps: [
      {
        id: "restaurant_discovery",
        label: "Finding restaurants",
        status: "completed",
        completedAt: new Date().toISOString(),
        metadata: {
          resultCount: candidateRestaurants.length,
        },
      },
    ],

    evidence: candidateRestaurants.map((restaurant) => ({
  type: "search",
  claim: `Restaurant candidate discovered from web research for ${preferences.city}`,
  sourceName: restaurant.name,
  sourceUrl: restaurant.sourceUrl,
  retrievedAt: new Date().toISOString(),
})),
  };
};

module.exports = {
  discoveryNode,
};