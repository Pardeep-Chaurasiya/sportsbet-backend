const { UserWallet } = require("../models");

// register user with walletId controller
const registerWithWallet = async (req, res) => {
  const { address, Token } = req.UserWallet;

  try {
    const userwalletAddress = await UserWallet.findOne({
      where: { walletAddress: address },
      raw: true,
    });
    if (userwalletAddress && userwalletAddress.walletToken !== Token) {
      await UserWallet.update(
        {
          walletToken: Token,
        },
        { where: { walletAddress: address } }
      );
      return res.status(200).json("Token updated");
    } else {
      await UserWallet.create({
        walletAddress: address,
        walletToken: Token,
      });
      return res.status(201).json({
        success: true,
        message: "User Registered Successfully with WalletId",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getWalletBalance = async (req, res) => {
  try {
    const walletAddress = req.UserWallet.address;
    const virtual_balance = await UserWallet.findOne({
      where: { walletAddress: walletAddress },
      raw: true,
    });

    if (virtual_balance.virtualBalance) {
      return res
        .status(200)
        .json({ virtual_balance: virtual_balance.virtualBalance });
    } else {
      return res.status(404).json({ error: "Virtual balance not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the virtual balance" });
  }
};

module.exports = { registerWithWallet, getWalletBalance };
