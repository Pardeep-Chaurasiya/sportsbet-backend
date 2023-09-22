const express = require("express");
const authController = require("../controllers/authController");
const joi_validator = require("../middleware/joi-validations");
const authMiddleware = require("../middleware/authMiddleware");

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

router.post(
  "/changePassword",
  authMiddleware,
  joi_validator.validateChangePassword,
  authController.changePassword
);

module.exports = router;
