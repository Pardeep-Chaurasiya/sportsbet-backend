const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);
const { User, SMS } = require("../models");

const register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    CPassword,
    source,
    dialing_code,
    mobilenumber,
  } = req.body;

  try {
    if (password !== CPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm password does not match" });
    }

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

const sendSMS = async (req, res) => {
  const { mobile, dialing_code } = req.body;

  const user = await User.findOne({ where: { mobilenumber: mobile } });

  console.log(user);
  //   if (!user) {
  //     // return res.status(404);
  //   }

  if (!user) {
    return res.json({
      message:
        "If you are register user then please check for OTP on register mobile number",
    });
  }

  let newmobile = dialing_code + mobile;
  let digits = "123456789";
  let OTP = "";

  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random(4) * 10)];
  }
  try {
    client.messages
      .create({
        body: `Your OTP verification code is ${OTP}`,
        to: newmobile, // Text your number
        from: process.env.TWILIO_NUMBER, // From a valid Twilio number
      })
      .then(async (message) => {
        const sms = new SMS({ otp: OTP, userId: user.id });
        await sms.save();
        return res.status(200).json({
          message:
            "If you are register user then please check for OTP on register mobile number",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500);
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const resetPassword = async (req, res) => {
  const { mobilenumber, sms, password, CPassword, dialing_code } = req.body;

  if (password !== CPassword) {
    return res
      .status(400)
      .json({ message: "Password and confirm password does not matched" });
  }

  try {
    const user = await User.findOne({
      where: { mobilenumber },
    });

    console.log(user + "jfkjn");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

module.exports = { register, login, sendSMS, resetPassword };
