const {
  searchRestaurants,
} = require("../../../../tools/restaurant-search.tool");

const discoveryNode = async (state) => {
  const preferences =
    state.userPreferences || {};

  /*
   * GPS location comes from the browser
   * and is passed through LangGraph state.
   */
  const location =
    state.location ||
    preferences.location ||
    null;

  /*
   * Existing city-based searches still work.
   * GPS can now be used when city is unavailable.
   */
  if (
    !preferences.city &&
    !location
  ) {
    throw new Error(
      "City or current location is required for restaurant discovery"
    );
  }

  const result =
    await searchRestaurants({
      city:
        preferences.city ||
        null,

      latitude:
        location?.latitude ??
        null,

      longitude:
        location?.longitude ??
        null,

      cuisinePreferences:
        preferences.cuisinePreferences ||
        [],

      dietaryPreferences:
        preferences.dietaryPreferences ||
        [],

      mealType:
        preferences.mealType ||
        "any",
    });

  const candidateRestaurants =
    (result.results || []).map(
      (item) => ({
        name: item.title,
        sourceUrl: item.url,
        description: item.content,
        searchScore: item.score,
      })
    );

  const locationDescription =
    location
      ? "near the user's current location"
      : `for ${preferences.city}`;

  return {
    candidateRestaurants,

    researchSteps: [
      {
        id: "restaurant_discovery",

        label:
          location
            ? "Finding restaurants near you"
            : "Finding restaurants",

        status: "completed",

        completedAt:
          new Date().toISOString(),

        metadata: {
          resultCount:
            candidateRestaurants.length,

          locationEnabled:
            Boolean(location),
        },
      },
    ],

    evidence:
      candidateRestaurants.map(
        (restaurant) => ({
          type: "search",

          claim:
            `Restaurant candidate discovered from web research ${locationDescription}.`,

          sourceName:
            restaurant.name,

          sourceUrl:
            restaurant.sourceUrl,

          retrievedAt:
            new Date().toISOString(),
        })
      ),
  };
};

module.exports = {
  discoveryNode,
};