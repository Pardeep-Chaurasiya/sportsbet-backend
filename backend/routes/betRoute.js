const express = require("express");
const betController = require("../controllers/betController");
const joi_validator = require("../joi-validator/joi-bet-validations");
// const authMiddleware = require("../middleware/authMiddleware");
const wallethMiddleware = require("../middleware/walletTokenMiddleware");

const router = express.Router();

// create bet and tournament for tricky-route
router.post(
  "/tricky-route",
  // authMiddleware,
  wallethMiddleware,
  joi_validator.validateCreateBet,
  betController.createBet
);

// create bet history for user route
router.post(
  "/getUserBetHistory",
  // authMiddleware,,
  wallethMiddleware,
  joi_validator.validateBetHistory,
  betController.betHistory
);

module.exports = router;
