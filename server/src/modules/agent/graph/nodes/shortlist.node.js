const geminiModel = require("../../../../integrations/gemini/gemini.client");
const {
  restaurantListSchema,
} = require("../../../restaurants/restaurant.schema");

const shortlistNode = async (state) => {
  const candidates = state.candidateRestaurants || [];
  const preferences = state.userPreferences;

  if (!candidates.length) {
    return {
      shortlistedRestaurants: [],
      researchSteps: [
        {
          id: "shortlisting",
          label: "Shortlisting restaurants",
          status: "completed",
          completedAt: new Date().toISOString(),
        },
      ],
    };
  }

  const structuredModel = geminiModel.withStructuredOutput(
    restaurantListSchema
  );

  const prompt = `
You are the restaurant normalization and shortlisting component.

User preferences:
${JSON.stringify(preferences, null, 2)}

Search results:
${JSON.stringify(candidates, null, 2)}

Extract real restaurant entities from the search results.

Rules:
- Only include restaurants that can be reasonably identified from the results.
- Do not invent restaurant information.
- Deduplicate the same restaurant appearing in multiple results.
- Prefer information directly supported by the search result.
- If a field is unknown, use null.
- Keep sourceUrl pointing to the supporting search result.
- cuisine should contain only cuisines supported by the evidence.
- matchReasons should explain why the restaurant potentially matches the user.
- concerns should contain relevant uncertainties or mismatches.
`;

  const result = await structuredModel.invoke(prompt);

  const shortlistedRestaurants = result.restaurants;
  const shortlistEvidence = shortlistedRestaurants.map(
  (restaurant) => ({
    type: "restaurant",
    restaurantName: restaurant.name,
    claim: `Restaurant identified during normalization and shortlisting.`,
    sourceUrl: restaurant.sourceUrl,
    retrievedAt: new Date().toISOString(),
  })
);

  return {
    shortlistedRestaurants,
    evidence: shortlistEvidence,

    researchSteps: [
      {
        id: "shortlisting",
        label: "Shortlisting restaurants",
        status: "completed",
        completedAt: new Date().toISOString(),
        metadata: {
          candidatesReceived: candidates.length,
          restaurantsSelected: shortlistedRestaurants.length,
        },
      },
    ],
  };
};

module.exports = {
  shortlistNode,
};