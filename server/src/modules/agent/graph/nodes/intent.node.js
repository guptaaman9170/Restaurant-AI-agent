const { z } = require("zod");

const geminiModel = require("../../../../integrations/gemini/gemini.client");

const userPreferencesSchema = z.object({
  city: z.string(),

  mealType: z.enum([
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "any",
  ]),

  dietaryPreferences: z.array(
    z.string()
  ),

  cuisinePreferences: z.array(
    z.string()
  ),

  budget: z.object({
    min: z.number().nullable(),
    max: z.number().nullable(),
    currency: z.string(),
  }),

  locationPreference:
    z.string().nullable(),

  reviewPreferences:
    z.array(z.string()),

  otherPreferences:
    z.array(z.string()),

  /*
   * Browser-provided location.
   *
   * Gemini does NOT generate this.
   * It is injected by the application
   * after intent extraction.
   */
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
      accuracy: z.number().nullable(),
    })
    .nullable(),
});

const structuredGemini =
  geminiModel.withStructuredOutput(
    userPreferencesSchema
  );

const intentPrompt = `
You are the intent extraction component of a restaurant recommendation agent.

Convert the user's natural-language restaurant request into structured
restaurant-search preferences.

Rules:

- Extract only information explicitly stated or strongly implied.
- Never invent preferences.
- Identify the destination city.
- Identify the meal type.
- Extract dietary requirements.
- Extract cuisine preferences.
- Extract budget and currency.
- Extract location preferences.
- Extract review-related preferences such as quiet atmosphere,
  friendly service, outdoor seating, etc.
- Put other useful requirements into otherPreferences.
- If a preference is not specified, use an empty array or null.
- If meal type is not specified, use "any".
- If budget is not specified, use null for min and max.
- Use "EUR" only when the currency cannot reasonably be inferred
  and the destination is in the Eurozone.

IMPORTANT:

- Do NOT generate latitude or longitude.
- Do NOT guess the user's physical location.
- If the user says "near me", capture that as a location preference.
- The application will provide browser GPS coordinates separately.

User request:
`;

const intentNode = async (state) => {
  const userQuery =
    state.userQuery;

  if (
    !userQuery ||
    !userQuery.trim()
  ) {
    throw new Error(
      "User query is required for intent analysis"
    );
  }

  /*
   * Let Gemini extract only semantic
   * preferences.
   */
  const extractedPreferences =
    await structuredGemini.invoke(
      `${intentPrompt}\n${userQuery}`
    );

  /*
   * Browser GPS comes from the application,
   * never from the LLM.
   */
  const browserLocation =
    state.location || null;

  const userPreferences = {
    ...extractedPreferences,

    location:
      browserLocation
        ? {
            latitude:
              browserLocation.latitude,

            longitude:
              browserLocation.longitude,

            accuracy:
              browserLocation.accuracy ??
              null,
          }
        : null,
  };

  return {
    userPreferences,

    researchSteps: [
      {
        id: "intent_analysis",

        label:
          "Understanding your preferences",

        status: "completed",

        completedAt:
          new Date().toISOString(),
      },
    ],
  };
};

module.exports = {
  intentNode,
  userPreferencesSchema,
};