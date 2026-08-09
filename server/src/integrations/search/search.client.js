const { env } = require("../../config/env");
const AppError = require("../../shared/errors/AppError");
const { withRetry } = require("../../shared/utils/retry");

const TAVILY_API_URL = "https://api.tavily.com/search";

const searchWeb = async ({
  query,
  searchDepth = "advanced",
  maxResults = 8,
  includeAnswer = false,
}) => {
  if (!query || !query.trim()) {
    throw new AppError(
      "Search query is required",
      400,
      "SEARCH_QUERY_REQUIRED"
    );
  }

  try {
    const response = await withRetry(
      () =>
        fetch(TAVILY_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            api_key: env.searchApiKey,
            query,
            search_depth: searchDepth,
            max_results: maxResults,
            include_answer: includeAnswer,
          }),
        }),
      {
        retries: 2,
        initialDelay: 1000,
        maxDelay: 4000,

        shouldRetry: (error) => {
          const errorMessage =
            error?.message?.toLowerCase() || "";

          return (
            errorMessage.includes("429") ||
            errorMessage.includes("rate limit") ||
            errorMessage.includes("503") ||
            errorMessage.includes("service unavailable") ||
            errorMessage.includes("timeout")
          );
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Tavily request failed: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();

    return {
      query,
      answer: data.answer || null,

      results: (data.results || []).map((result) => ({
        title: result.title,
        url: result.url,
        content: result.content,
        score: result.score,
        publishedDate: result.published_date || null,
      })),
    };
  } catch (error) {
    throw new AppError(
      "Restaurant web search failed",
      502,
      "SEARCH_PROVIDER_ERROR"
    );
  }
};

module.exports = {
  searchWeb,
};