const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");
const projectController = require("./project.controller");

// Buyer creates a project
router.post("/", auth, role("BUYER"), projectController.createProject);

// Buyer sees own projects
router.get("/buyer", auth, role("BUYER"), projectController.getBuyerProjects);

// Admin sees all projects
router.get("/admin", auth, role("ADMIN"), projectController.getAllProjects);

// Solver sees open projects
router.get("/open", auth, role("SOLVER"), projectController.getOpenProjects);
router.get(
  "/my-assigned",
  auth,
  role("SOLVER"),
  projectController.getMyAssignedProject,
);

module.exports = router;
