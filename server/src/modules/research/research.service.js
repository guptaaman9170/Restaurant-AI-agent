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
  requestId,
  onProgress,
}) => {
  // 1. Create initial running record
  await createResearch({
    requestId,
    userQuery: message,
    status: "running",
  });

  try {
    /*
     * ------------------------------------------------
     * 2. Run agent with LangGraph streaming
     * ------------------------------------------------
     *
     * "values" gives us the complete graph state
     * after every node execution.
     *
     * This allows the API layer to forward research
     * progress to the frontend in real time.
     */

    let finalState = null;

    const stream = await agentGraph.stream(
      {
        userQuery: message,
      },
      {
        streamMode: "values",
      }
    );

    for await (const state of stream) {
      finalState = state;

      /*
       * Send progress to the caller if a callback
       * was provided.
       *
       * Existing callers that don't provide
       * onProgress will continue to work normally.
       */
      if (typeof onProgress === "function") {
        onProgress({
          requestId,
          status: "running",
          researchSteps:
            state.researchSteps || [],
          userPreferences:
            state.userPreferences || {},
          candidateRestaurants:
            state.candidateRestaurants || [],
          shortlistedRestaurants:
            state.shortlistedRestaurants || [],
        });
      }
    }

    /*
     * Safety check in case the graph produces
     * no final state.
     */
    if (!finalState) {
      throw new Error(
        "Research graph did not return a final state."
      );
    }

    // 3. Map internal graph state → public response
    const response = mapResearchResponse(
      finalState,
      requestId
    );

    /*
     * 4. Send final completed progress event
     */
    if (typeof onProgress === "function") {
      onProgress({
        requestId,
        status: "completed",
        researchSteps:
          response.researchSteps || [],
        userPreferences:
          response.preferences || {},
      });
    }

    // 5. Persist successful research
    await updateResearchByRequestId(
      requestId,
      {
        status: "completed",
        preferences: response.preferences,
        summary: response.summary,
        recommendations: response.recommendations,
        researchSteps: response.researchSteps,
        evidence: response.evidence,
        error: {
          code: null,
          message: null,
        },
      }
    );

    return response;
  } catch (error) {
    /*
     * Send failure progress event before rethrowing.
     */
    if (typeof onProgress === "function") {
      onProgress({
        requestId,
        status: "failed",
        error: {
          code:
            error.code || "RESEARCH_FAILED",
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
            error.code || "RESEARCH_FAILED",
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