const { searchWeb } = require("../integrations/search/search.client");

const searchRestaurantReviews = async ({
  restaurantName,
  city,
}) => {
  const query = [
    `"${restaurantName}"`,
    city,
    "restaurant reviews",
    "atmosphere",
    "quiet",
    "service",
    "food quality",
  ].join(" ");

  return searchWeb({
    query,
    searchDepth: "advanced",
    maxResults: 6,
  });
};

module.exports = {
  searchRestaurantReviews,
};