const AppError = require("../../shared/errors/AppError");

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      const error = new AppError(
        "Request validation failed",
        400,
        "VALIDATION_ERROR"
      );

      error.details = errors;

      return next(error);
    }

    req.validated = result.data;

    next();
  };
};

module.exports = validate;