const { searchWeb } = require("../integrations/search/search.client");

const searchRestaurantMenu = async ({
  restaurantName,
  city,
}) => {
  const query = `"${restaurantName}" ${city} restaurant menu prices vegetarian`;

  return searchWeb({
    query,
    searchDepth: "advanced",
    maxResults: 5,
  });
};

module.exports = {
  searchRestaurantMenu,
};