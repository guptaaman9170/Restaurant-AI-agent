const { z } = require("zod");

const researchRequestSchema = z.object({
  body: z.object({
    message: z
      .string()
      .trim()
      .min(1, "Message is required")
      .max(
        2000,
        "Message must be less than 2000 characters"
      ),

    location: z
      .object({
        latitude: z
          .number()
          .min(-90)
          .max(90),

        longitude: z
          .number()
          .min(-180)
          .max(180),

        accuracy: z
          .number()
          .nonnegative()
          .optional(),
      })
      .nullable()
      .optional(),
  }),
});

module.exports = {
  researchRequestSchema,
};