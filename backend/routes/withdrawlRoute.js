const express = require("express");
const walletController = require("../controllers/withdrawlController");
const joi_validator = require("../joi-validator/joi-withdrawl-validation");
const wallethMiddleware = require("../middleware/walletTokenMiddleware");

const router = express.Router();

// register user using wallet id
router.post(
  "/withdrawalAmount",
  wallethMiddleware,
  joi_validator.validateWithdrawalAmount,
  walletController.withdrawalAmount
);

module.exports = router;
