const express = require("express");
const cors = require("cors");

const { env } = require("./config/env");
const requestIdMiddleware = require("./api/middleware/requestId.middleware");
const errorHandler = require("./api/middleware/error.middleware");
const researchRoutes = require("./api/routes/research.route");
const app = express();

app.use(
  cors({
    origin: env.clientUrl,
  })
);
app.use(express.json());
app.use(requestIdMiddleware);

app.use("/api/research", researchRoutes);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Restaurant AI Agent API is running",
    requestId: req.requestId,
  });
});

app.use(errorHandler);

module.exports = app;