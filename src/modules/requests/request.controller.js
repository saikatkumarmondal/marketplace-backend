const Request = require("./request.model");
const Project = require("../projects/project.model");
const User = require("../users/user.model");

// Solver sends request to work on a project
exports.createRequest = async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId)
      return res.status(400).json({ message: "ProjectId required" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.status !== "OPEN")
      return res.status(400).json({ message: "Project not open for requests" });

    // Check if solver already requested
    const existing = await Request.findOne({
      projectId,
      solverId: req.user.userId, // ensure we are taking userId from token
    });
    if (existing) return res.status(400).json({ message: "Already requested" });

    const request = await Request.create({
      projectId,
      solverId: req.user.userId,
      status: "PENDING",
    });

    res.status(201).json({ message: "Request submitted", request });
  } catch (err) {
    console.error("Error in createRequest:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Buyer views requests for a project
exports.getProjectRequests = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Only owner can view
    if (String(project.buyerId) !== String(req.user.userId))
      return res.status(403).json({ message: "Access denied" });

    const requests = await Request.find({ projectId }).populate(
      "solverId",
      "name email role",
    );

    res.json(requests);
  } catch (err) {
    console.error("Error in getProjectRequests:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Buyer selects a solver
exports.assignSolver = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { solverId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (String(project.buyerId) !== String(req.user.userId))
      return res.status(403).json({ message: "Access denied" });

    if (project.assignedSolverId)
      return res.status(400).json({ message: "Solver already assigned" });

    // Assign solver
    project.assignedSolverId = solverId;
    project.status = "ASSIGNED";
    await project.save();

    // Reject all other requests
    await Request.updateMany({ projectId }, { $set: { status: "REJECTED" } });

    // Accept selected solver request
    await Request.findOneAndUpdate(
      { projectId, solverId },
      { status: "ACCEPTED" },
    );

    res.json({ message: "Solver assigned successfully", project });
  } catch (err) {
    console.error("Error in assignSolver:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
