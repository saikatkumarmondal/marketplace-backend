const mongoose = require("mongoose");
const { ROLES } = require("../../utils/constants");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedSolverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["OPEN", "ASSIGNED", "COMPLETED"],
      default: "OPEN",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", projectSchema);
