const { searchWeb } = require("../integrations/search/search.client");

const searchRestaurants = async ({
  city,
  cuisinePreferences = [],
  dietaryPreferences = [],
  mealType = "any",
}) => {
  const cuisineText =
    cuisinePreferences.length > 0
      ? cuisinePreferences.join(", ")
      : "local";

  const dietaryText =
    dietaryPreferences.length > 0
      ? dietaryPreferences.join(", ")
      : "any dietary preference";

  const mealText = mealType !== "any" ? mealType : "restaurants";

  const query = [
    `best ${cuisineText} restaurants in ${city}`,
    `${mealText}`,
    `${dietaryText}`,
    "restaurant menu reviews",
  ].join(" ");

  const result = await searchWeb({
    query,
    searchDepth: "advanced",
    maxResults: 8,
  });

  return result;
};

module.exports = {
  searchRestaurants,
};