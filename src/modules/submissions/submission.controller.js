const Submission = require("./submission.model");
const Task = require("../tasks/task.model");
const Project = require("../projects/project.model");

// Solver uploads ZIP
exports.createSubmission = async (req, res) => {
  try {
    const { projectId, taskId } = req.body;
    if (!projectId || !taskId || !req.file)
      return res
        .status(400)
        .json({ message: "Project, task, and file are required" });

    const submission = await Submission.create({
      projectId,
      taskId,
      solverId: req.user.userId,
      filePath: `/uploads/${req.file.filename}`,
      status: "PENDING",
    });

    res.status(201).json({ message: "Submission uploaded", submission });
  } catch (err) {
    console.error("Error in createSubmission:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Buyer views submissions for a project/task
exports.getProjectSubmissions = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (String(project.buyerId) !== String(req.user.userId))
      return res.status(403).json({ message: "Access denied" });

    const submissions = await Submission.find({ projectId }).populate(
      "solverId",
      "name email role",
    );

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Buyer accepts a submission
exports.acceptSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await Submission.findById(submissionId);
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    const project = await Project.findById(submission.projectId);
    if (String(project.buyerId) !== String(req.user.userId))
      return res.status(403).json({ message: "Access denied" });

    submission.status = "ACCEPTED";
    await submission.save();

    // Mark task as completed
    const task = await Task.findById(submission.taskId);
    task.status = "COMPLETED";
    await task.save();

    res.json({ message: "Submission accepted", submission, task });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Buyer rejects a submission
exports.rejectSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await Submission.findById(submissionId);
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    const project = await Project.findById(submission.projectId);
    if (String(project.buyerId) !== String(req.user.userId))
      return res.status(403).json({ message: "Access denied" });

    submission.status = "REJECTED";
    await submission.save();

    res.json({ message: "Submission rejected", submission });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
