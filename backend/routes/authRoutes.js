const express = require("express");
const authController = require("../controllers/authController");
const joi_validator = require("../joi-validator/joi-auth-validations");

const router = express.Router();

// register user route
router.post(
  "/register",
  joi_validator.validateRegistration,
  authController.register
);

// login user route
router.post("/login", joi_validator.validateLogin, authController.login);

// send otp route
router.post(
  "/forgetPassword",
  joi_validator.validateSMS,
  authController.sendSMS
);

// reset password route
router.post(
  "/resetPassword",
  joi_validator.validateResetPassword,
  authController.resetPassword
);

module.exports = router;
