const {
  searchWeb,
} = require("../integrations/search/search.client");

/*
 * Reverse geocode browser coordinates into a
 * human-readable city and country.
 *
 * Uses OpenStreetMap Nominatim.
 */
const reverseGeocode = async (
  latitude,
  longitude
) => {
  const url =
    `https://nominatim.openstreetmap.org/reverse` +
    `?lat=${encodeURIComponent(latitude)}` +
    `&lon=${encodeURIComponent(longitude)}` +
    `&format=json` +
    `&zoom=10` +
    `&addressdetails=1`;

  try {
    const response = await fetch(
      url,
      {
        headers: {
          /*
           * Nominatim requests should identify
           * the application.
           */
          "User-Agent":
            "DineScout-AI-Restaurant-Agent/1.0",
          Accept:
            "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Reverse geocoding failed: ${response.status}`
      );
    }

    const data =
      await response.json();

    const address =
      data.address || {};

    /*
     * Different countries may use different
     * address fields, so use sensible fallbacks.
     */
    const city =
      address.city ||
      address.town ||
      address.municipality ||
      address.village ||
      address.county ||
      null;

    const country =
      address.country || null;

    const countryCode =
      address.country_code
        ? address.country_code.toUpperCase()
        : null;

    return {
      city,
      country,
      countryCode,
    };
  } catch (error) {
    console.error(
      "Reverse geocoding failed:",
      error.message
    );

    return {
      city: null,
      country: null,
      countryCode: null,
    };
  }
};

const searchRestaurants = async ({
  city,
  latitude = null,
  longitude = null,
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

  const mealText =
    mealType !== "any"
      ? mealType
      : "restaurants";

  /*
   * ------------------------------------------------
   * RESOLVE GPS LOCATION
   * ------------------------------------------------
   */

  const hasCoordinates =
    typeof latitude === "number" &&
    typeof longitude === "number";

  let resolvedCity =
    city || null;

  let resolvedCountry =
    null;

  let countryCode =
    null;

  if (hasCoordinates) {
    const location =
      await reverseGeocode(
        latitude,
        longitude
      );

    /*
     * GPS-derived city takes priority when
     * the user asked for "near me".
     */
    resolvedCity =
      location.city ||
      resolvedCity;

    resolvedCountry =
      location.country;

    countryCode =
      location.countryCode;
  }

  /*
   * ------------------------------------------------
   * BUILD LOCATION CONSTRAINT
   * ------------------------------------------------
   */

  let locationText = "";

  if (
    resolvedCity &&
    resolvedCountry
  ) {
    locationText =
      `in ${resolvedCity}, ${resolvedCountry}`;
  } else if (resolvedCity) {
    locationText =
      `in ${resolvedCity}`;
  } else if (resolvedCountry) {
    locationText =
      `in ${resolvedCountry}`;
  } else {
    locationText =
      "near the user's current location";
  }

  /*
   * ------------------------------------------------
   * BUILD SEARCH QUERY
   * ------------------------------------------------
   */

  const query = [
    `best ${cuisineText} restaurants`,
    locationText,
    mealText,
    dietaryText,
    "restaurant menu reviews",
  ].join(" ");

  console.log(
    "----------------------------------------"
  );

  console.log(
    "RESTAURANT SEARCH"
  );

  console.log(
    "GPS ENABLED:",
    hasCoordinates
  );

  console.log(
    "RESOLVED CITY:",
    resolvedCity
  );

  console.log(
    "RESOLVED COUNTRY:",
    resolvedCountry
  );

  console.log(
    "COUNTRY CODE:",
    countryCode
  );

  console.log(
    "SEARCH QUERY:",
    query
  );

  console.log(
    "----------------------------------------"
  );

  /*
   * ------------------------------------------------
   * WEB SEARCH
   * ------------------------------------------------
   */

  const result =
    await searchWeb({
      query,
      searchDepth:
        "advanced",
      maxResults: 8,
    });

  return result;
};

module.exports = {
  searchRestaurants,
};