const express = require("express");
const authController = require("../controllers/authController");
const joi_validator = require("../middleware/joi-validations");

const router = express.Router();

router.post(
  "/register",
  joi_validator.validateRegistration,
  authController.register
);
router.post("/login", joi_validator.validateLogin, authController.login);

router.post(
  "/forgetPassword",
  joi_validator.validateSMS,
  authController.sendSMS
);
router.post(
  "/resetPassword",
  joi_validator.validateResetPassword,
  authController.resetPassword
);

module.exports = router;
