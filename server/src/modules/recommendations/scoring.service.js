const clamp = (value, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);

const normalize = (value) =>
  typeof value === "string" ? value.toLowerCase().trim() : "";

const calculateBudgetScore = (restaurant, preferences) => {
  const maxBudget = preferences?.budget?.max;

  if (!maxBudget) {
    return {
      score: 100,
      reason: "No maximum budget was specified.",
    };
  }

  const restaurantMax = restaurant?.priceRange?.max;

  if (restaurantMax == null) {
    return {
      score: 50,
      reason: "Restaurant price range could not be verified.",
    };
  }

  if (restaurantMax <= maxBudget) {
    return {
      score: 100,
      reason: `Price range fits within the €${maxBudget} budget.`,
    };
  }

  const difference = restaurantMax - maxBudget;

  if (difference <= 5) {
    return {
      score: 60,
      reason: "Restaurant is slightly above the stated budget.",
    };
  }

  return {
    score: 20,
    reason: "Restaurant appears to exceed the stated budget.",
  };
};

const calculateDietaryScore = (restaurant, preferences) => {
  const dietaryPreferences =
    preferences?.dietaryPreferences || [];

  if (!dietaryPreferences.length) {
    return {
      score: 100,
      reason: "No dietary restriction was specified.",
    };
  }

  const restaurantText = [
    restaurant.description,
    ...(restaurant.cuisine || []),
    ...(restaurant.matchReasons || []),
  ]
    .join(" ")
    .toLowerCase();

  const matched = dietaryPreferences.filter((preference) =>
    restaurantText.includes(normalize(preference))
  );

  if (matched.length === dietaryPreferences.length) {
    return {
      score: 100,
      reason: `Matches dietary preference: ${matched.join(", ")}.`,
    };
  }

  if (matched.length > 0) {
    return {
      score: 60,
      reason: `Partially matches dietary preferences: ${matched.join(
        ", "
      )}.`,
    };
  }

  return {
    score: 20,
    reason: "Dietary compatibility could not be established.",
  };
};

const calculateCuisineScore = (restaurant, preferences) => {
  const requestedCuisines =
    preferences?.cuisinePreferences || [];

  if (!requestedCuisines.length) {
    return {
      score: 100,
      reason: "No specific cuisine preference was specified.",
    };
  }

  const restaurantCuisines = (restaurant?.cuisine || []).map(
    normalize
  );

  const matched = requestedCuisines.filter((cuisine) =>
    restaurantCuisines.some(
      (restaurantCuisine) =>
        restaurantCuisine.includes(normalize(cuisine)) ||
        normalize(cuisine).includes(restaurantCuisine)
    )
  );

  if (matched.length === requestedCuisines.length) {
    return {
      score: 100,
      reason: `Matches requested cuisine: ${matched.join(", ")}.`,
    };
  }

  if (matched.length > 0) {
    return {
      score: 60,
      reason: `Partially matches requested cuisine: ${matched.join(
        ", "
      )}.`,
    };
  }

  return {
    score: 20,
    reason: "Requested cuisine was not clearly matched.",
  };
};

const calculateQuietnessScore = (
  restaurant,
  reviewInsights = []
) => {
  const insight = reviewInsights.find(
    (item) =>
      normalize(item.restaurantName) ===
      normalize(restaurant.name)
  );

  if (!insight) {
    return {
      score: 50,
      reason: "No review evidence was available for atmosphere.",
    };
  }

  const quiet = insight?.atmosphere?.quiet;

  if (quiet === true) {
    return {
      score: 100,
      reason: "Review evidence indicates a quiet atmosphere.",
    };
  }

  if (quiet === false) {
    return {
      score: 20,
      reason: "Review evidence indicates the restaurant may not be quiet.",
    };
  }

  return {
    score: 50,
    reason: "Quietness could not be determined from the available reviews.",
  };
};

const calculateMenuScore = (restaurant, menus = [], preferences) => {
  const menu = menus.find(
    (item) =>
      normalize(item.restaurantName) ===
      normalize(restaurant.name)
  );

  if (!menu || !menu.items?.length) {
    return {
      score: 30,
      reason: "No reliable menu items were found.",
    };
  }

  const dietaryPreferences =
    preferences?.dietaryPreferences || [];

  if (!dietaryPreferences.length) {
    return {
      score: 100,
      reason: "Menu information was successfully verified.",
    };
  }

  const dietaryItems = menu.items.filter((item) =>
    item.dietaryTags?.some((tag) =>
      dietaryPreferences.some(
        (preference) =>
          normalize(tag).includes(normalize(preference)) ||
          normalize(preference).includes(normalize(tag))
      )
    )
  );

  if (dietaryItems.length >= 3) {
    return {
      score: 100,
      reason: `Menu contains ${dietaryItems.length} compatible items.`,
    };
  }

  if (dietaryItems.length > 0) {
    return {
      score: 70,
      reason: `Menu contains ${dietaryItems.length} compatible item(s).`,
    };
  }

  return {
    score: 20,
    reason: "No compatible dietary items were verified.",
  };
};

const calculateEvidenceScore = (
  restaurant,
  menus = [],
  reviewInsights = []
) => {
  let evidencePoints = 0;

  if (restaurant?.sourceUrl) {
    evidencePoints += 30;
  }

  const menu = menus.find(
    (item) =>
      normalize(item.restaurantName) ===
      normalize(restaurant.name)
  );

  if (menu?.sourceUrl) {
    evidencePoints += 35;
  }

  const reviews = reviewInsights.find(
    (item) =>
      normalize(item.restaurantName) ===
      normalize(restaurant.name)
  );

  if (reviews?.evidence?.length) {
    evidencePoints += 35;
  }

  return {
    score: clamp(evidencePoints),
    reason:
      evidencePoints >= 80
        ? "Strong supporting evidence was found."
        : evidencePoints >= 40
          ? "Moderate supporting evidence was found."
          : "Limited supporting evidence was found.",
  };
};

const calculateRestaurantScore = ({
  restaurant,
  preferences,
  menus = [],
  reviewInsights = [],
}) => {
  const budget = calculateBudgetScore(
    restaurant,
    preferences
  );

  const dietary = calculateDietaryScore(
    restaurant,
    preferences
  );

  const cuisine = calculateCuisineScore(
    restaurant,
    preferences
  );

  const quietness = calculateQuietnessScore(
    restaurant,
    reviewInsights
  );

  const menu = calculateMenuScore(
    restaurant,
    menus,
    preferences
  );

  const evidence = calculateEvidenceScore(
    restaurant,
    menus,
    reviewInsights
  );

  const score = Math.round(
    budget.score * 0.25 +
      dietary.score * 0.25 +
      cuisine.score * 0.20 +
      quietness.score * 0.15 +
      menu.score * 0.10 +
      evidence.score * 0.05
  );

  return {
    restaurant,

    score,

    breakdown: {
      budget,
      dietary,
      cuisine,
      quietness,
      menu,
      evidence,
    },

    reasons: [
      budget.reason,
      dietary.reason,
      cuisine.reason,
      quietness.reason,
      menu.reason,
      evidence.reason,
    ],
  };
};

const rankRestaurants = ({
  restaurants = [],
  preferences,
  menus = [],
  reviewInsights = [],
}) => {
  return restaurants
    .map((restaurant) =>
      calculateRestaurantScore({
        restaurant,
        preferences,
        menus,
        reviewInsights,
      })
    )
    .sort((a, b) => b.score - a.score);
};

module.exports = {
  calculateRestaurantScore,
  rankRestaurants,
};