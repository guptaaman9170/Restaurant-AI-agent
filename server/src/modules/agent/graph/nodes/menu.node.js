const geminiModel = require("../../../../integrations/gemini/gemini.client");
const {
  menuResearchSchema,
} = require("../../../menus/menu.schema");
const {
  searchRestaurantMenu,
} = require("../../../../tools/menu-search.tool");

const menuNode = async (state) => {
  const restaurants = state.shortlistedRestaurants || [];

  if (!restaurants.length) {
    return {
      menus: [],
      researchSteps: [
        {
          id: "menu_research",
          label: "Checking restaurant menus",
          status: "completed",
          completedAt: new Date().toISOString(),
        },
      ],
    };
  }

  // Search menus for each shortlisted restaurant.
  const searchResults = await Promise.all(
    restaurants.map(async (restaurant) => {
      const result = await searchRestaurantMenu({
        restaurantName: restaurant.name,
        city: restaurant.city,
      });

      return {
        restaurantName: restaurant.name,
        results: result.results,
      };
    })
  );

  const structuredModel = geminiModel.withStructuredOutput(
    menuResearchSchema
  );

  const prompt = `
You are the menu research component of a restaurant recommendation agent.

User preferences:
${JSON.stringify(state.userPreferences, null, 2)}

Shortlisted restaurants:
${JSON.stringify(restaurants, null, 2)}

Menu search results:
${JSON.stringify(searchResults, null, 2)}

Extract menu information supported by the search results.

Rules:
- Never invent dishes or prices.
- Only include menu items supported by the provided evidence.
- If price is unavailable, use null.
- Identify vegetarian/vegan/dietary tags only when supported.
- Preserve the source URL that supports the menu information.
- If no reliable menu information exists for a restaurant, return an empty items array.
- Prefer official restaurant/menu sources when available.
`;

  const result = await structuredModel.invoke(prompt);

  const menus = result.menus;

  return {
    menus,

    researchSteps: [
      {
        id: "menu_research",
        label: "Checking restaurant menus",
        status: "completed",
        completedAt: new Date().toISOString(),
        metadata: {
          restaurantsChecked: restaurants.length,
          menusFound: menus.filter(
            (menu) => menu.items.length > 0
          ).length,
        },
      },
    ],
  };
};

module.exports = {
  menuNode,
};