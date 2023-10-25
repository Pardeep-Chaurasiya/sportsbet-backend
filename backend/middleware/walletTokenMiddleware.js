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
      const Token = token.split(" ")[1];

      const { address, body } = await Web3Token.verify(Token);
      req.UserWallet = { address, Token };
      next();
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json(error);
  }
};
module.exports = walletTokenhMiddleware;
