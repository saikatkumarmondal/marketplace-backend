const express = require("express");
const fs = require("fs");
const router = express.Router();
const multer = require("multer");
const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");
const submissionController = require("./submission.controller");

// Create uploads directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

// File upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/zip") cb(null, true);
    else cb(new Error("Only ZIP files allowed"));
  },
});

// Solver submits a ZIP
router.post(
  "/",
  auth,
  role("SOLVER"),
  upload.single("file"),
  submissionController.createSubmission,
);
// Buyer views submissions for a project
router.get(
  "/project/:projectId",
  auth,
  role("BUYER"),
  submissionController.getProjectSubmissions,
);

// Buyer accepts submission
router.patch(
  "/:submissionId/accept",
  auth,
  role("BUYER"),
  submissionController.acceptSubmission,
);

// Buyer rejects submission
router.patch(
  "/:submissionId/reject",
  auth,
  role("BUYER"),
  submissionController.rejectSubmission,
);

module.exports = router;
