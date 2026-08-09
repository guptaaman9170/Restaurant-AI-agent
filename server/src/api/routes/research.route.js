const express = require("express");

const validate = require("../middleware/validate.middleware");
const { researchRequestSchema } = require("../../modules/research/research.schema");
const {
  startResearch,
  getResearch,
} = require("../controllers/research.controller");

const router = express.Router();

router.post(
  "/",
  validate(researchRequestSchema),
  startResearch
);

router.get("/:requestId", getResearch);

module.exports = router;