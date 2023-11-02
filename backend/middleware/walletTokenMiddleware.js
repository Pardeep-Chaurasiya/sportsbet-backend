const Web3Token = require("web3-token");
const { UserWallet } = require("../models");

const walletTokenhMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token && !token.startsWith("Bearer")) {
      return res
        .status(400)
        .json({ message: "Invalid token or token formet wrong" });
    }
    if (token && token.startsWith("Bearer")) {
      let Token = token.split(" ")[1];

      let { address, body } = await Web3Token.verify(Token);
      req.UserWallet = { address, Token, body };
      next();

      // let { address, body } = await Web3Token.verify(Token);
      // console.log(address, "===========");
      // let newUserWallet = await UserWallet.findByPk(`${address}`);
      // console.log(newUserWallet, "========");
      // let newAddress = newUserWallet.dataValues.walletAddress;

      // if (!Token) {
      //   req.UserWallet = newAddress;
      // } else {
      //   req.UserWallet = { address, Token, body };
      // }
      // next();
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json(error);
  }
};
module.exports = walletTokenhMiddleware;
