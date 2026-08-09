const mapRecommendation = (recommendation) => ({
  rank: recommendation.rank,
  restaurant: recommendation.restaurant,
  score: recommendation.score,
  reasons: recommendation.reasons,
  breakdown: recommendation.breakdown,
});

const mapResearchResponse = (result, requestId) => {
  return {
    requestId,

    status: result.status || "completed",

    summary: result.finalSummary || "",

    preferences: result.userPreferences || {},

    recommendations: (result.recommendations || []).map(
      mapRecommendation
    ),

    researchSteps: result.researchSteps || [],

    evidence: result.evidence || [],
  };
};

module.exports = {
  mapResearchResponse,
};