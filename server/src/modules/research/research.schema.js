const { z } = require("zod");

const researchRequestSchema = z.object({
  body: z.object({
    message: z
      .string()
      .trim()
      .min(1, "Message is required")
      .max(2000, "Message must be less than 2000 characters"),
  }),
});

module.exports = {
  researchRequestSchema,
};