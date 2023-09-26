const express = require("express");
const betController = require("../controllers/betController");
const joi_validator = require("../middleware/joi-bet-validations");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// create tournament
router.post(
  "/create-bet",
  authMiddleware,
  joi_validator.validateCreateBet,
  betController.createBet
);

module.exports = router;
