const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const withRetry = async (
  operation,
  {
    retries = 2,
    initialDelay = 1000,
    maxDelay = 5000,
    shouldRetry = () => true,
  } = {}
) => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      const isLastAttempt = attempt === retries;

      if (isLastAttempt || !shouldRetry(error)) {
        throw error;
      }

      const delay = Math.min(
        initialDelay * 2 ** attempt,
        maxDelay
      );

      await sleep(delay);
    }
  }

  throw lastError;
};

module.exports = {
  withRetry,
};