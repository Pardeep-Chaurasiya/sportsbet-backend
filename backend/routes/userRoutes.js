const express = require("express");
const userController = require("../controllers/userController");
const joi_validator = require("../middleware/joi-userProfile-validation");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// change password after logged in
router.put(
  "/changePassword",
  authMiddleware,
  joi_validator.validateChangePassword,
  userController.changePassword
);

//  get user profile
router.get("/get-profile", authMiddleware, userController.getUserProfile);

// create user profile
router.post(
  "/create-profile",
  authMiddleware,
  joi_validator.validateCreateUserProfile,
  userController.createUserProfile
);

// update user profile
router.patch(
  "/update-profile",
  authMiddleware,
  joi_validator.validateUpdateUserProfile,
  userController.updateUserProfile
);

module.exports = router;
