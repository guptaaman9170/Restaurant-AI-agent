require("dotenv").config();

const parseClientUrl = (url) => {
  if (!url) return ["http://localhost:5173", "http://localhost:3000", "http://localhost"];
  if (url.includes(",")) {
    return url.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return url;
};

const env = {
  port: process.env.PORT || 5000,

  mongodbUri: process.env.MONGODB_URI,

  geminiApiKey: process.env.GEMINI_API_KEY,

  searchApiKey: process.env.SEARCH_API_KEY,
  clientUrl: parseClientUrl(process.env.CLIENT_URL),

  nodeEnv: process.env.NODE_ENV || "development",
};

const validateEnvironment = () => {
  const requiredVariables = [
    ["MONGODB_URI", env.mongodbUri],
    ["GEMINI_API_KEY", env.geminiApiKey],
    ["SEARCH_API_KEY", env.searchApiKey],
  ];

  const missingVariables = requiredVariables
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`
    );
  }
};

module.exports = {
  env,
  validateEnvironment,
};