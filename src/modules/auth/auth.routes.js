const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
