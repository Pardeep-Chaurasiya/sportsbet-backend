const express = require("express");
const authController = require("../controller/authController");
const joi_validator = require("../middleware/joi-validations");

const router = express.Router();

router.post(
  "/register",
  joi_validator.validateRegistration,
  authController.register
);
router.post("/login", joi_validator.validateLogin, authController.login);

module.exports = router;
