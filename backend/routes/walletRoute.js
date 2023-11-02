const express = require("express");
const walletController = require("../controllers/walletController");
const joi_validator = require("../joi-validator/joi-wallet-validation");
const wallethMiddleware = require("../middleware/walletTokenMiddleware");

const router = express.Router();

// register user using wallet id
router.post(
  "/registerWithWallet",
  wallethMiddleware,
  joi_validator.validateWalletId,
  walletController.registerWithWallet
);

router.get(
  "/getWalletBalance",
  wallethMiddleware,
  walletController.getWalletBalance
);

module.exports = router;
