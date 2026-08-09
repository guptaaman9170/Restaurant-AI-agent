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
}) => {
  // 1. Create initial running record
  await createResearch({
    requestId,
    userQuery: message,
    status: "running",
  });

  try {
    // 2. Run agent
    const result = await agentGraph.invoke({
      userQuery: message,
    });

    // 3. Map internal graph state → public response
    const response = mapResearchResponse(
      result,
      requestId
    );

    // 4. Persist successful research
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
    // 5. Persist failure
    await updateResearchByRequestId(
      requestId,
      {
        status: "failed",
        error: {
          code: error.code || "RESEARCH_FAILED",
          message:
            error.message || "Research failed",
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