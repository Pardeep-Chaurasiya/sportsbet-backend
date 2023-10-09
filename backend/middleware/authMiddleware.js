const jwt = require("jsonwebtoken");
const { User } = require("../models");

const secretKey = process.env.JWT_SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  console.log("kuchbhi");
  try {
    const AuthToken = req.headers.authorization;
    if (!AuthToken && !AuthToken.startsWith("Bearer")) {
      return res
        .status(400)
        .json({ message: "Invalid token or token formet wrong" });
    }
    if (AuthToken && AuthToken.startsWith("Bearer")) {
      const token = AuthToken.split(" ")[1];

      const decodedToken = jwt.verify(token, secretKey);

      req.User = await User.findByPk(decodedToken.id);
      next();
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json(error);
  }
};
module.exports = authMiddleware;
