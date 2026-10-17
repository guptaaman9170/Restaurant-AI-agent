const express = require("express");
const cors = require("cors");

const { env } = require("./config/env");
const requestIdMiddleware = require("./api/middleware/requestId.middleware");
const errorHandler = require("./api/middleware/error.middleware");
const researchRoutes = require("./api/routes/research.route");
const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-side proxies)
    if (!origin) return callback(null, true);

    const allowed = Array.isArray(env.clientUrl)
      ? env.clientUrl
      : [env.clientUrl];

    if (
      allowed.includes("*") ||
      allowed.includes(origin) ||
      allowed.some((item) => origin === item || origin.startsWith(item))
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));
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