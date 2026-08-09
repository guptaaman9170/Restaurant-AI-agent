import { ArrowLeft, RotateCcw } from "lucide-react";

import RecommendationCard from "../components/recommendations/RecommendationCard";

const mockRestaurants = [
  {
    rank: 1,
    name: "Vegetalia",
    image: null,
    location: "Barcelona",
    cuisine: "Vegetarian · Mediterranean",
    priceRange: {
      min: 20,
      max: 30,
      currency: "€",
    },
    description:
      "A relaxed vegetarian spot with Mediterranean dishes and a quieter atmosphere.",
    matchReason:
      "Strong match for vegetarian preferences, budget, cuisine, and a quieter dining experience.",
    score: 92,

    breakdown: {
      budget: {
        score: 100,
        reason: "Price range fits within the stated budget.",
      },
      dietary: {
        score: 100,
        reason: "Strong vegetarian compatibility.",
      },
      cuisine: {
        score: 90,
        reason: "Mediterranean cuisine matches the request.",
      },
      quietness: {
        score: 90,
        reason: "Reviews indicate a relaxed atmosphere.",
      },
      menu: {
        score: 90,
        reason: "Several compatible menu items were found.",
      },
      evidence: {
        score: 90,
        reason: "Strong supporting evidence was found.",
      },
    },

    menuHighlights: [
      {
        name: "Grilled Mediterranean Vegetables",
        price: 18,
        currency: "€",
      },
      {
        name: "Vegetarian Paella",
        price: 22,
        currency: "€",
      },
    ],

    reviewHighlights: [
      "Guests appreciate the relaxed atmosphere.",
      "Vegetarian options are frequently mentioned positively.",
    ],

    concerns: [],

    reviewInsights: {
      positive: [
        "Guests appreciate the relaxed atmosphere.",
        "Vegetarian options are frequently mentioned positively.",
      ],
      concerns: [],
      atmosphere: {
        quiet: true,
        cozy: true,
        lively: false,
        description:
          "Reviews suggest a relaxed and comfortable atmosphere.",
      },
      service: {
        sentiment: "positive",
        description:
          "Service is generally described positively.",
      },
      foodQuality: {
        sentiment: "positive",
        description:
          "Food quality receives positive feedback.",
      },
      dietaryExperience: {
        vegetarianFriendly: true,
        description:
          "Vegetarian options are well represented.",
      },
    },

    evidence: [],
    websiteUrl: null,
    menuUrl: null,
    sourceUrl: null,
  },

  {
    rank: 2,
    name: "Green Table",
    image: null,
    location: "Barcelona",
    cuisine: "Vegetarian · European",
    priceRange: {
      min: 18,
      max: 28,
      currency: "€",
    },
    description:
      "A casual vegetarian restaurant with a broad plant-forward menu.",
    matchReason:
      "Good vegetarian and budget alignment with some uncertainty around atmosphere.",
    score: 86,

    breakdown: {
      budget: {
        score: 100,
        reason: "Price range fits within the stated budget.",
      },
      dietary: {
        score: 100,
        reason: "Vegetarian options are well supported.",
      },
      cuisine: {
        score: 80,
        reason: "Cuisine partially matches the request.",
      },
      quietness: {
        score: 60,
        reason:
          "Limited review evidence was available for quietness.",
      },
      menu: {
        score: 90,
        reason: "Compatible menu items were found.",
      },
      evidence: {
        score: 80,
        reason: "Moderate to strong supporting evidence was found.",
      },
    },

    menuHighlights: [],
    reviewHighlights: [],
    concerns: [],

    reviewInsights: {
      positive: [],
      concerns: [],
      atmosphere: null,
      service: null,
      foodQuality: null,
      dietaryExperience: null,
    },

    evidence: [],
    websiteUrl: null,
    menuUrl: null,
    sourceUrl: null,
  },
];

const normalizeRestaurant = (
  recommendation,
  index,
  menus = [],
  reviewInsights = [],
  evidence = []
) => {
  const restaurant =
    recommendation?.restaurant || {};

  const restaurantName =
    restaurant?.name ||
    recommendation?.restaurantName ||
    `Restaurant ${index + 1}`;

  /*
   * ------------------------------------------------
   * MENU JOIN
   * ------------------------------------------------
   */

  const menu = menus.find(
    (item) =>
      item?.restaurantName
        ?.toLowerCase()
        .trim() === restaurantName.toLowerCase().trim()
  );

  const menuHighlights =
    recommendation?.menuHighlights?.length > 0
      ? recommendation.menuHighlights
      : menu?.items?.map((item) => ({
          name: item.name,
          price: item.price ?? null,
          currency: item.currency ?? null,
          description: item.description ?? null,
          dietaryTags: item.dietaryTags || [],
        })) || [];

  /*
   * ------------------------------------------------
   * REVIEW JOIN
   * ------------------------------------------------
   */

  const reviewInsight = reviewInsights.find(
    (item) =>
      item?.restaurantName
        ?.toLowerCase()
        .trim() === restaurantName.toLowerCase().trim()
  );

  const positive = [];

  const concerns = [
    ...(recommendation?.concerns || []),
    ...(restaurant?.concerns || []),
  ];

  if (reviewInsight) {
    if (reviewInsight.atmosphere?.description) {
      positive.push(
        reviewInsight.atmosphere.description
      );
    }

    if (
      reviewInsight.service?.sentiment === "positive" &&
      reviewInsight.service?.description
    ) {
      positive.push(
        reviewInsight.service.description
      );
    }

    if (
      reviewInsight.foodQuality?.sentiment === "positive" &&
      reviewInsight.foodQuality?.description
    ) {
      positive.push(
        reviewInsight.foodQuality.description
      );
    }

    if (
      reviewInsight.dietaryExperience
        ?.vegetarianFriendly === true
    ) {
      positive.push(
        reviewInsight.dietaryExperience.description ||
          "Reviews indicate good vegetarian-friendliness."
      );
    }

    if (
      reviewInsight.atmosphere?.quiet === false
    ) {
      concerns.push(
        "Reviews indicate the restaurant may not be especially quiet."
      );
    }

    if (
      reviewInsight.service?.sentiment === "negative"
    ) {
      concerns.push(
        reviewInsight.service.description ||
          "Some review evidence indicates concerns about service."
      );
    }

    if (
      reviewInsight.foodQuality?.sentiment === "negative"
    ) {
      concerns.push(
        reviewInsight.foodQuality.description ||
          "Some review evidence indicates concerns about food quality."
      );
    }
  }

  /*
   * ------------------------------------------------
   * EVIDENCE JOIN
   * ------------------------------------------------
   */

  const restaurantEvidence = evidence.filter(
    (item) =>
      !item?.restaurantName ||
      item?.restaurantName
        ?.toLowerCase()
        .trim() === restaurantName.toLowerCase().trim()
  );

  /*
   * ------------------------------------------------
   * FINAL NORMALIZED OBJECT
   * ------------------------------------------------
   */

  return {
    rank: recommendation?.rank ?? index + 1,

    name: restaurantName,

    image:
      restaurant?.image ||
      restaurant?.imageUrl ||
      restaurant?.photoUrl ||
      null,

    address:
      restaurant?.address || null,

    location:
      restaurant?.city ||
      restaurant?.address ||
      "Location unavailable",

    city:
      restaurant?.city || null,

    cuisine:
      Array.isArray(restaurant?.cuisine)
        ? restaurant.cuisine.join(" · ")
        : restaurant?.cuisine || "Restaurant",

    priceRange:
      restaurant?.priceRange || null,

    priceLevel:
      restaurant?.priceLevel ?? null,

    rating:
      restaurant?.rating ?? null,

    websiteUrl:
      restaurant?.websiteUrl ||
      restaurant?.sourceUrl ||
      null,

    menuUrl:
      restaurant?.menuUrl ||
      menu?.menuUrl ||
      null,

    sourceUrl:
      restaurant?.sourceUrl ||
      menu?.sourceUrl ||
      null,

    description:
      restaurant?.description ||
      "A restaurant selected based on your research preferences.",

    matchReason:
      recommendation?.reasons?.length > 0
        ? recommendation.reasons.join(" ")
        : restaurant?.matchReasons?.length > 0
        ? restaurant.matchReasons.join(" ")
        : "This restaurant matches several of your requested preferences.",

    reasons:
      recommendation?.reasons ||
      restaurant?.matchReasons ||
      [],

    score:
      recommendation?.score ?? 0,

    breakdown:
      recommendation?.breakdown || {},

    menuHighlights,

    reviewHighlights:
      recommendation?.reviewHighlights?.length > 0
        ? recommendation.reviewHighlights
        : positive,

    concerns,

    reviewInsights: {
      positive,
      concerns,

      atmosphere:
        reviewInsight?.atmosphere || null,

      service:
        reviewInsight?.service || null,

      foodQuality:
        reviewInsight?.foodQuality || null,

      dietaryExperience:
        reviewInsight?.dietaryExperience || null,
    },

    evidence: restaurantEvidence,
  };
};

const Results = ({
  researchResult,
  onBack,
  onExplore,
}) => {
  const rawRecommendations =
    researchResult?.recommendations || [];

  const hasRealResults =
    Array.isArray(rawRecommendations) &&
    rawRecommendations.length > 0;

  const menus =
    researchResult?.menus || [];

  const reviewInsights =
    researchResult?.reviewInsights || [];

  const evidence =
    researchResult?.evidence || [];

  const restaurants = hasRealResults
    ? rawRecommendations.map(
        (recommendation, index) =>
          normalizeRestaurant(
            recommendation,
            index,
            menus,
            reviewInsights,
            evidence
          )
      )
    : mockRestaurants;

  const summary =
    researchResult?.summary ||
    "Based on your preferences, these restaurants appear to be the strongest matches.";

  const preferences =
    researchResult?.preferences || {};

  return (
    <main className="min-h-screen bg-[#f8f5f1]">

      {/* Header */}
      <section className="border-b border-[#d8cec6]">
        <div className="mx-auto max-w-[1400px] px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:px-12">

          <button
            type="button"
            onClick={onBack}
            className="mb-10 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#766b65] transition-colors hover:text-[#a64d32]"
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.5}
            />

            New research
          </button>

          <div className="max-w-4xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a64d32]">
              Research results
            </p>

            <h1 className="mt-4 font-editorial text-5xl leading-[0.95] tracking-[-0.035em] text-[#1a1a1a] sm:text-6xl lg:text-7xl">
              Places worth
              <br />
              considering.
            </h1>

            <p className="mt-7 max-w-2xl text-sm leading-7 text-[#766b65] sm:text-base">
              {summary}
            </p>
          </div>

          {/* Preferences */}
          {Object.keys(preferences).length > 0 && (
            <div className="mt-9 flex flex-wrap gap-2">
              {preferences.city && (
                <span className="border border-[#d8cec6] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[#766b65]">
                  {preferences.city}
                </span>
              )}

              {preferences.mealType && (
                <span className="border border-[#d8cec6] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[#766b65]">
                  {preferences.mealType}
                </span>
              )}

              {preferences.cuisinePreferences?.map(
                (cuisine) => (
                  <span
                    key={cuisine}
                    className="border border-[#d8cec6] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[#766b65]"
                  >
                    {cuisine}
                  </span>
                )
              )}

              {preferences.dietaryPreferences?.map(
                (diet) => (
                  <span
                    key={diet}
                    className="border border-[#d8cec6] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[#766b65]"
                  >
                    {diet}
                  </span>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Recommendations */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {restaurants.map(
          (restaurant, index) => (
            <RecommendationCard
              key={
                restaurant.name ||
                `restaurant-${index}`
              }
              restaurant={restaurant}
              rank={
                restaurant.rank ||
                index + 1
              }
              onExplore={onExplore}
            />
          )
        )}
      </section>

      {/* Footer */}
      <section className="border-t border-[#d8cec6]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-5 px-5 py-10 sm:flex-row sm:items-center sm:px-8 lg:px-12">

          <div>
            <p className="font-editorial text-2xl text-[#1a1a1a]">
              Want to look somewhere else?
            </p>

            <p className="mt-1 text-xs text-[#766b65]">
              Start a new research request with different preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 border border-[#1a1a1a] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-[#f8f5f1]"
          >
            <RotateCcw
              size={14}
              strokeWidth={1.5}
            />

            New research
          </button>
        </div>
      </section>

    </main>
  );
};

export default Results;