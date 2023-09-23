const jwt = require("jsonwebtoken");
const { User } = require("../models");

const secretKey = process.env.JWT_SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  try {
    const AuthToken = req.headers.authorization;
    if (!AuthToken) {
      return res.status(401).json({
        code: "Invalid-Token",
        error: "Please provide a valid JWT token",
      });
    }
    let decodedToken = "";
    decodedToken = jwt.verify(AuthToken, secretKey);
    const existUser = await User.findByPk(decodedToken.id);
    if (!existUser) {
      return res
        .status(401)
        .json({ code: "Unauthorized", error: "User does not exist" });
    }

    req.User = existUser;
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ code: "Unauthorized", error: "Unusual Activity or no token" });
  }
};

module.exports = authMiddleware;
