const logger = require("../../config/logger");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  logger.error("API request failed", {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    code: err.code || "INTERNAL_ERROR",
    message: err.message,
  });

  const response = {
    success: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message:
        statusCode === 500
          ? "Internal server error"
          : err.message,
    },
    requestId: req.requestId,
  };

  if (err.details && statusCode !== 500) {
    response.error.details = err.details;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;