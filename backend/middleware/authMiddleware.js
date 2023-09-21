const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const secretKey = process.env.JWT_SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  try {
    const { AuthToken } = req.headers;
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

    const existUser = await User.findById(decodedToken._id).select({
      password: 0,
    });

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
