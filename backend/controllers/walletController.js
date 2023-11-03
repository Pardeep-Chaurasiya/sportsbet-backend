const { UserWallet } = require("../models");

// register user with walletId controller
const registerWithWallet = async (req, res) => {
  const { address, Token } = req.UserWallet;
  console.log("kuch bhi");
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
  const walletAddress = req.UserWallet.address;
  const virtual_balance = await UserWallet.findOne({
    where: { walletAddress: walletAddress },
    raw: true,
  });
  return res
    .status(200)
    .json({ virtual_balance: virtual_balance.virtualBalance });
};

module.exports = { registerWithWallet, getWalletBalance };
