const { UserWallet } = require("../models");

// register user with walletId controller
const registerWithWallet = async (req, res) => {
  const { address, Token } = req.UserWallet;
  console.log("kuch bhi");
  try {
    const userwalletAddress = await UserWallet.findOne({
      where: { walletAddress: address },
    });
    console.log(userwalletAddress);
    if (userwalletAddress && userwalletAddress?.walletToken !== Token) {
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

module.exports = { registerWithWallet };
