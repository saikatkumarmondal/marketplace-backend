const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    solverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["IN_PROGRESS", "SUBMITTED", "COMPLETED", "REJECTED"],
      default: "IN_PROGRESS",
    },
    submissionFile: { type: String }, // path to uploaded ZIP
  },
  { timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
