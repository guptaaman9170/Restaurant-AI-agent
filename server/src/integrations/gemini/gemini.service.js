const geminiModel = require("./gemini.client");
const { withRetry } = require("../../shared/utils/retry");

const testGemini = async (message) => {
  const response = await withRetry(
    () => geminiModel.invoke(message),
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
          errorMessage.includes("quota") ||
          errorMessage.includes("503") ||
          errorMessage.includes("service unavailable") ||
          errorMessage.includes("timeout")
        );
      },
    }
  );

  return response.content;
};

module.exports = {
  testGemini,
};