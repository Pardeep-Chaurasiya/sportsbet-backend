const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userTable");

const register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    source,
    dialing_code,
    mobilenumber,
  } = req.body;

  try {
    const existingUserEmail = await User.findOne({
      where: { email },
    });
    if (existingUserEmail) {
      return res.status(409).json({ message: "Email already register" });
    }
    const existingUserMobile = await User.findOne({
      where: { mobilenumber },
    });
    if (existingUserMobile) {
      return res
        .status(409)
        .json({ message: "Mobile Number already register" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      mobilenumber,
      source,
      dialing_code,
    });

    return res.json({ success: true, message: "User Register Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(422)
        .json({ code: "Invalid_INPUT", error: "Please fill all feilds" });
    }
    const existUserEmail = await User.findOne({ where: { email } });
    if (!existUserEmail) {
      return res
        .status(404)
        .json({ code: "Email-Not-Found", error: "Email not found" });
    }
    const pass = await bcrypt.compare(password, existUserEmail.password);
    if (!pass) {
      return res.status(400).json({ message: "Invalid Credientials" });
    }
    const token = await jwt.sign(
      { id: existUserEmail.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2h" }
    );
    const date = moment().format("MMMM Do YYYY, h:mm:ss a");
    // console.log("login time", date);
    return res.status(200).json({
      code: "Success",
      message: "Login successfully",
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { register, login };
