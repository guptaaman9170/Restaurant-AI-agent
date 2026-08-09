const { ChatGoogle } = require("@langchain/google");
const { env } = require("../../config/env");

const geminiModel = new ChatGoogle({
  model: "gemini-3.5-flash",
  apiKey: env.geminiApiKey,
});

module.exports = geminiModel;