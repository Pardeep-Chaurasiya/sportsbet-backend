const jwt = require("jsonwebtoken");
const { User } = require("../models");

const secretKey = process.env.JWT_SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  try {
    const AuthToken = req.headers.authtoken;
    if (!AuthToken) {
      return res.status(401).json({
        code: "Invalid-Token",
        error: "Please provide a valid JWT token",
      });
    }
    let decodedToken = "";
    try {
      decodedToken = jwt.verify(AuthToken, secretKey);
    } catch (error) {
      return res.status(401).json({
        code: "Unauthorized",
        error: "Invalid token or token expired",
      });
    }
    const existUser = await User.findByPk(decodedToken.id);
    if (!existUser) {
      return res
        .status(401)
        .json({ code: "Unauthorized", error: "User does not exist" });
    }

    req.User = existUser;
    next();
    return 0;
  } catch (error) {
    console.error(error.toString());
    return res
      .status(401)
      .json({ code: "Unauthorized", error: "Unusual Activity" });
  }
};

module.exports = authMiddleware;
