const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");
const requestController = require("./request.controller");

// Solver sends request to a project
router.post("/", auth, role("SOLVER"), requestController.createRequest);

// Buyer views all requests for a project
router.get(
  "/:projectId",
  auth,
  role("BUYER"),
  requestController.getProjectRequests,
);

// Buyer assigns a solver to the project
router.post(
  "/:projectId/assign",
  auth,
  role("BUYER"),
  requestController.assignSolver,
);

module.exports = router;
