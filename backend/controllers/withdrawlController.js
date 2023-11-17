const { UserWallet, Application } = require("../models");

const withdrawlAmount = async (req, res) => {
  try {
    const walletAddress = req.UserWallet.address;
    // const { withdrawlAmount, walletAddress } = req.body;
    const { withdrawlAmount } = req.body;
    const virtual_balance = await UserWallet.findOne({
      where: { walletAddress: walletAddress },
      raw: true,
    });
    // console.log(req.body);

    if (virtual_balance.virtualBalance >= withdrawlAmount) {
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
        amount: withdrawlAmount,
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

module.exports = { withdrawlAmount };
