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
      // await UserWallet.update(
      //   {
      //     virtualBalance:
      //       parseFloat(virtual_balance.virtualBalance) - withdrawlAmount,
      //   },
      //   { where: { walletAddress } }
      // );
      // return res.status(200).json({ message: "Amount withdrawl successfully" });
      await Application.create({
        walletAddress: walletAddress,
        amount: withdrawalAmount,
      });
      return res
        .status(201)
        .json({ message: "Withdrawal request created successfully" });
    } else {
      return res
        .status(404)
        .json({ error: "Withdrawal amount is higher then Virtual balance" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the virtual balance" });
  }
};

module.exports = { withdrawalAmount };
