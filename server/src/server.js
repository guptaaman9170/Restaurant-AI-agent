const app = require("./app");
const connectDatabase = require("./config/database");
const { env, validateEnvironment } = require("./config/env");
const logger = require("./config/logger");
const cors = require("cors");

const startServer = async () => {
  try {
    validateEnvironment();

    await connectDatabase();

    app.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    });
  } catch (error) {
    logger.error("Server startup failed", {
      message: error.message,
    });

    process.exit(1);
  }
};

startServer();