const {
  rankRestaurants,
} = require("../../../recommendations/scoring.service");

const recommendationNode = async (state) => {
  const restaurants = state.shortlistedRestaurants || [];

  if (!restaurants.length) {
    return {
      restaurantScores: [],
      recommendations: [],
      researchSteps: [
        {
          id: "ranking",
          label: "Ranking restaurants",
          status: "completed",
          completedAt: new Date().toISOString(),
        },
      ],
    };
  }

  const rankedRestaurants = rankRestaurants({
    restaurants,
    preferences: state.userPreferences,
    menus: state.menus || [],
    reviewInsights: state.reviewInsights || [],
  });

  const recommendations = rankedRestaurants
    .slice(0, 5)
    .map((item, index) => ({
      rank: index + 1,
      restaurant: item.restaurant,
      score: item.score,
      breakdown: item.breakdown,
      reasons: item.reasons,
    }));

  return {
    restaurantScores: rankedRestaurants,

    recommendations,

    researchSteps: [
      {
        id: "ranking",
        label: "Ranking restaurants",
        status: "completed",
        completedAt: new Date().toISOString(),
        metadata: {
          restaurantsRanked: rankedRestaurants.length,
        },
      },
    ],
  };
};

module.exports = {
  recommendationNode,
};