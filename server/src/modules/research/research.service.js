const agentGraph = require("../agent/graph/graph");

const {
  mapResearchResponse,
} = require("./research.mapper");

const {
  createResearch,
  updateResearchByRequestId,
  findResearchByRequestId,
} = require("./research.repository");

const AppError = require("../../shared/errors/AppError");

const startResearch = async ({
  message,
  location = null,
  requestId,
  onProgress,
}) => {
  // 1. Create initial running record
  await createResearch({
    requestId,
    userQuery: message,
    status: "running",
    location: location || null,
  });

  try {
    /*
     * ------------------------------------------------
     * 2. Run agent with LangGraph streaming
     * ------------------------------------------------
     */

    let finalState = null;

    const stream = await agentGraph.stream(
      {
        userQuery: message,

        /*
         * Optional browser location.
         *
         * If the user denied permission or didn't
         * enable location, this remains null.
         */
        location: location || null,
      },
      {
        streamMode: "values",
      }
    );

    for await (const state of stream) {
      finalState = state;

      /*
       * Send live progress to frontend.
       */
      if (
        typeof onProgress ===
        "function"
      ) {
        onProgress({
          requestId,
          status: "running",

          researchSteps:
            state.researchSteps ||
            [],

          userPreferences:
            state.userPreferences ||
            {},

          candidateRestaurants:
            state.candidateRestaurants ||
            [],

          shortlistedRestaurants:
            state.shortlistedRestaurants ||
            [],

          /*
           * Expose location status without
           * exposing unnecessary information.
           */
          locationEnabled:
            Boolean(location),
        });
      }
    }

    /*
     * Safety check.
     */
    if (!finalState) {
      throw new Error(
        "Research graph did not return a final state."
      );
    }

    // 3. Map internal graph state → public response
    const response =
      mapResearchResponse(
        finalState,
        requestId
      );

    /*
     * 4. Send final completed progress event
     */
    if (
      typeof onProgress ===
      "function"
    ) {
      onProgress({
        requestId,
        status: "completed",

        researchSteps:
          response.researchSteps ||
          [],

        userPreferences:
          response.preferences ||
          {},

        locationEnabled:
          Boolean(location),
      });
    }

    // 5. Persist successful research
    await updateResearchByRequestId(
      requestId,
      {
        status: "completed",

        preferences:
          response.preferences,

        summary:
          response.summary,

        recommendations:
          response.recommendations,

        researchSteps:
          response.researchSteps,

        evidence:
          response.evidence,

        error: {
          code: null,
          message: null,
        },
      }
    );

    return response;
  } catch (error) {
    /*
     * Send failure progress event.
     */
    if (
      typeof onProgress ===
      "function"
    ) {
      onProgress({
        requestId,
        status: "failed",

        error: {
          code:
            error.code ||
            "RESEARCH_FAILED",

          message:
            error.message ||
            "Research failed",
        },
      });
    }

    // 6. Persist failure
    await updateResearchByRequestId(
      requestId,
      {
        status: "failed",

        error: {
          code:
            error.code ||
            "RESEARCH_FAILED",

          message:
            error.message ||
            "Research failed",
        },
      }
    );

    throw error;
  }
};

const getResearch = async (requestId) => {
  const research =
    await findResearchByRequestId(requestId);

  if (!research) {
    throw new AppError(
      "Research request not found",
      404,
      "RESEARCH_NOT_FOUND"
    );
  }

  return research;
};

module.exports = {
  startResearch,
  getResearch,
};