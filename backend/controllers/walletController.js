const { UserWallet } = require("../models");

// register user with walletId controller
const registerWithWallet = async (req, res) => {
  const { address, Token } = req.UserWallet;

  try {
    const userwalletAddress = await UserWallet.findOne({
      where: { walletAddress: address },
    });
    if (userwalletAddress && userwalletAddress?.walletToken !== Token) {
      await UserWallet.update(
        {
          walletToken: Token,
        },
        { where: { walletAddress: address } }
      );
      return res
        .status(409)
        .json({ message: "User already registered with this WalletAddress" });
    } else {
      await UserWallet.create({
        walletAddress: address,
        walletToken: Token,
      });

      return res.json({
        success: true,
        message: "User Registered Successfully with WalletId",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { registerWithWallet };
