const express = require("express");
const router = express.Router();

router.use("/auth", require("./modules/auth/auth.routes"));
router.use("/users", require("./modules/users/user.routes"));
router.use("/projects", require("./modules/projects/project.routes"));

router.use("/requests", require("./modules/requests/request.routes"));

router.use("/tasks", require("./modules/tasks/task.routes"));
router.use("/submissions", require("./modules/submissions/submission.routes"));

module.exports = router;
