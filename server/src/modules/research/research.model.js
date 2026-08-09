const mongoose = require("mongoose");

const researchStepSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      required: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    _id: false,
  }
);

const evidenceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },

    restaurantName: {
      type: String,
      default: null,
    },

    claim: {
      type: String,
      required: true,
    },

    sourceName: {
      type: String,
      default: null,
    },

    sourceUrl: {
      type: String,
      required: true,
    },

    retrievedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const researchSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userQuery: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending",
      index: true,
    },

    preferences: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    summary: {
      type: String,
      default: "",
    },

    recommendations: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },

    researchSteps: {
      type: [researchStepSchema],
      default: [],
    },

    evidence: {
      type: [evidenceSchema],
      default: [],
    },

    error: {
      code: {
        type: String,
        default: null,
      },

      message: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Research", researchSchema);