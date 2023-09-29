const express = require("express");
const userController = require("../controllers/userController");
const joi_validator = require("../joi-validator/joi-userProfile-validation");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// change password after logged in route
router.put(
  "/changePassword",
  authMiddleware,
  joi_validator.validateChangePassword,
  userController.changePassword
);

//  get user profile route
router.get("/get-profile", authMiddleware, userController.getUserProfile);

// update user profile route
router.patch(
  "/update-profile",
  authMiddleware,
  joi_validator.validateUpdateUserProfile,
  userController.updateUserProfile
);

module.exports = router;
