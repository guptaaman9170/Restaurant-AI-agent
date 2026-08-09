const Research = require("./research.model");

const createResearch = async (data) => {
  return Research.create(data);
};

const findResearchByRequestId = async (requestId) => {
  return Research.findOne({ requestId }).lean();
};

const updateResearchByRequestId = async (
  requestId,
  update
) => {
  return Research.findOneAndUpdate(
    { requestId },
    update,
    {
      new: true,
      runValidators: true,
    }
  ).lean();
};

module.exports = {
  createResearch,
  findResearchByRequestId,
  updateResearchByRequestId,
};