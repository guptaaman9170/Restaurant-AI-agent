const { sendSuccess } = require("../../shared/utils/apiResponse");
const researchService = require("../../modules/research/research.service");

const startResearch = async (req, res, next) => {
  try {
    const { message } = req.validated.body;

    const result = await researchService.startResearch({
      message,
      requestId: req.requestId,
    });

    return sendSuccess(
      res,
      result,
      202,
      "Research request received"
    );
  } catch (error) {
    next(error);
  }
};
const getResearch = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    const result =
      await researchService.getResearch(requestId);

    return sendSuccess(
      res,
      result,
      200,
      "Research retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startResearch,
  getResearch,
};