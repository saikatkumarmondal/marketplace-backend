const express = require("express");
const router = express.Router();

const userController = require("./user.controller");
const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");

// PATCH /api/users/:userId/assign-buyer
router.patch(
  "/:userId/assign-buyer",
  auth,
  role("ADMIN"),
  userController.assignBuyerRole,
);

// Optional: GET all users (all authenticated)
router.get("/", auth, userController.getAllUsers);

// Optional: GET single user
router.get("/:userId", auth, userController.getUserById);

// Optional: DELETE user (Admin only)
router.delete("/:userId", auth, role("ADMIN"), userController.deleteUser);

module.exports = router;
