const Task = require("./task.model");
const Project = require("../projects/project.model");
const fs = require("fs");
const path = require("path");

// Solver creates a task for assigned project
exports.createTask = async (req, res) => {
  try {
    const { projectId, title, description, deadline } = req.body;

    if (!projectId || !title || !description || !deadline)
      return res.status(400).json({ message: "All fields required" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (String(project.assignedSolverId) !== req.user.userId)
      return res.status(403).json({ message: "Not assigned to this project" });

    const task = await Task.create({
      projectId,
      solverId: req.user.userId,
      title,
      description,
      deadline,
    });

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Solver submits ZIP file for a task
exports.submitTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!req.file)
      return res.status(400).json({ message: "ZIP file required" });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (String(task.solverId) !== req.user.userId)
      return res.status(403).json({ message: "Not your task" });

    task.submissionFile = req.file.path;
    task.status = "SUBMITTED";
    await task.save();

    res.json({ message: "Task submitted", task });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Buyer reviews submission → Accept / Reject
exports.reviewTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { action } = req.body; // ACCEPT or REJECT

    const task = await Task.findById(taskId).populate("projectId");
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = task.projectId;

    if (String(project.buyerId) !== req.user.userId)
      return res.status(403).json({ message: "Not project owner" });

    if (!["ACCEPT", "REJECT"].includes(action))
      return res.status(400).json({ message: "Invalid action" });

    if (action === "ACCEPT") task.status = "COMPLETED";
    else task.status = "REJECTED";

    await task.save();

    res.json({ message: `Task ${task.status}`, task });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Buyer sees all tasks of a project
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ projectId }).populate(
      "solverId",
      "name email",
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
