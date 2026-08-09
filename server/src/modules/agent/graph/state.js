const { Annotation } = require("@langchain/langgraph");

const AgentState = Annotation.Root({
  messages: Annotation({
    reducer: (current, update) => current.concat(update),
    default: () => [],
  }),

  userQuery: Annotation({
    reducer: (_, update) => update,
    default: () => "",
  }),

  userPreferences: Annotation({
    reducer: (_, update) => update,
    default: () => ({}),
  }),

  candidateRestaurants: Annotation({
    reducer: (_, update) => update,
    default: () => [],
  }),

  shortlistedRestaurants: Annotation({
    reducer: (_, update) => update,
    default: () => [],
  }),

  menus: Annotation({
    reducer: (_, update) => update,
    default: () => [],
  }),

  reviews: Annotation({
    reducer: (_, update) => update,
    default: () => [],
  }),

  reviewInsights: Annotation({
    reducer: (_, update) => update,
    default: () => [],
  }),

  evidence: Annotation({
    reducer: (current, update) => current.concat(update),
    default: () => [],
  }),

  restaurantScores: Annotation({
    reducer: (_, update) => update,
    default: () => [],
  }),

  recommendations: Annotation({
    reducer: (_, update) => update,
    default: () => [],
  }),

  researchSteps: Annotation({
    reducer: (current, update) => current.concat(update),
    default: () => [],
  }),

  errors: Annotation({
    reducer: (current, update) => current.concat(update),
    default: () => [],
  }),

  finalSummary: Annotation({
    reducer: (_, update) => update,
    default: () => "",
  }),
});

module.exports = AgentState;