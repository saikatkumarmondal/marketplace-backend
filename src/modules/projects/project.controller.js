const Project = require("./project.model");

// Buyer creates project
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title & Description required" });
    }

    const project = await Project.create({
      title,
      description,
      buyerId: req.user.userId,
    });

    res.status(201).json({
      message: "Project created",
      project,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all projects for Admin
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("buyerId", "name email role")
      .populate("assignedSolverId", "name email role");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get projects for Buyer
exports.getBuyerProjects = async (req, res) => {
  try {
    const projects = await Project.find({ buyerId: req.user.userId }).populate(
      "assignedSolverId",
      "name email role",
    );
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get open projects for Solver
exports.getOpenProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "OPEN" }).populate(
      "buyerId",
      "name email",
    );
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
