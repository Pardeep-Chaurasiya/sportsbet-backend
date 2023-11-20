const { UserWallet, Application } = require("../models");

const withdrawalAmount = async (req, res) => {
  try {
    const walletAddress = req.UserWallet.address;
    const { withdrawalAmount } = req.body;
    const virtual_balance = await UserWallet.findOne({
      where: { walletAddress: walletAddress },
      raw: true,
    });

    if (virtual_balance.virtualBalance >= withdrawalAmount) {
      // Check if there's an existing application for the user
      let existingApplication = await Application.findOne({
        where: { walletAddress: walletAddress },
      });

      if (existingApplication) {
        // If an existing application is found, update the amount
        await existingApplication.update({
          amount: withdrawalAmount,
          timestamp: Math.floor(Date.now() / 1000),
        });
      } else {
        // If no existing application, create a new one
        let application = new Application({
          walletAddress: walletAddress,
          amount: withdrawalAmount,
          timestamp: Math.floor(Date.now() / 1000),
        });
        await application.save();
      }

      return res.status(201).json({
        message: "Withdrawal request created or updated successfully",
      });
    } else {
      return res.status(400).json({
        error: "Bad Request",
        message: "Withdrawal amount is higher than Virtual balance",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing the withdrawal request",
    });
  }
};

module.exports = { withdrawalAmount };
