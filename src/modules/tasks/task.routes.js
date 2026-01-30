const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");
const multer = require("multer");
const path = require("path");

const taskController = require("./task.controller");

// Multer config for ZIP files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/zip" ||
    file.mimetype === "application/x-zip-compressed"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only ZIP files allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Solver creates task
router.post("/", auth, role("SOLVER"), taskController.createTask);

// Solver submits task ZIP
router.post(
  "/:taskId/submit",
  auth,
  role("SOLVER"),
  upload.single("file"),
  taskController.submitTask,
);

// Buyer reviews task
router.post("/:taskId/review", auth, role("BUYER"), taskController.reviewTask);

// Buyer sees all tasks of a project
router.get(
  "/project/:projectId",
  auth,
  role("BUYER"),
  taskController.getProjectTasks,
);

module.exports = router;
