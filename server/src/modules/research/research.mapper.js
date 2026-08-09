const mapRecommendation = (recommendation) => ({
  rank: recommendation?.rank ?? 0,

  restaurant: recommendation?.restaurant || {},

  score: recommendation?.score ?? 0,

  reasons: recommendation?.reasons || [],

  breakdown: recommendation?.breakdown || [],

  menuHighlights:
    recommendation?.menuHighlights || [],

  reviewHighlights:
    recommendation?.reviewHighlights || [],

  concerns:
    recommendation?.concerns || [],

  restaurantUrl:
    recommendation?.restaurantUrl ||
    recommendation?.restaurant?.restaurantUrl ||
    null,

  menuUrl:
    recommendation?.menuUrl ||
    recommendation?.restaurant?.menuUrl ||
    null,
});

const mapResearchResponse = (result, requestId) => {
  return {
    requestId,

    status: result?.status || "completed",

    summary: result?.finalSummary || "",

    preferences: result?.userPreferences || {},

    candidateRestaurants:
      result?.candidateRestaurants || [],

    shortlistedRestaurants:
      result?.shortlistedRestaurants || [],

    menus:
      result?.menus || [],

    reviews:
      result?.reviews || [],

    reviewInsights:
      result?.reviewInsights || [],

    restaurantScores:
      result?.restaurantScores || [],

    recommendations:
      (result?.recommendations || []).map(
        mapRecommendation
      ),

    researchSteps:
      result?.researchSteps || [],

    evidence:
      result?.evidence || [],
  };
};

module.exports = {
  mapResearchResponse,
};