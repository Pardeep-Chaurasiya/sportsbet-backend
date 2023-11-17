const express = require("express");
const walletController = require("../controllers/withdrawlController");
const joi_validator = require("../joi-validator/joi-withdrawl-validation");
const wallethMiddleware = require("../middleware/walletTokenMiddleware");

const router = express.Router();

// register user using wallet id
router.patch(
  "/withdrawlAmount",
  wallethMiddleware,
  joi_validator.validateWithdrawlAmount,
  walletController.withdrawlAmount
);

module.exports = router;
