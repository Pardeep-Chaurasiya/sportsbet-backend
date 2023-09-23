const express = require("express");
const authController = require("../controllers/authController");
const joi_validator = require("../middleware/joi-auth-validations");

const router = express.Router();

// register user
router.post(
  "/register",
  joi_validator.validateRegistration,
  authController.register
);

// login user
router.post("/login", joi_validator.validateLogin, authController.login);

// send otp
router.post(
  "/forgetPassword",
  joi_validator.validateSMS,
  authController.sendSMS
);

// reset password
router.post(
  "/resetPassword",
  joi_validator.validateResetPassword,
  authController.resetPassword
);

module.exports = router;
