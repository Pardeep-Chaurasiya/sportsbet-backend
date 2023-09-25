const bcrypt = require("bcrypt");
const { UserProfile, User } = require("../models");

const changePassword = async (req, res) => {
  try {
    console.log(req.User);
    const { old_pass, c_password, password } = req.body;

    const savedPassword = await bcrypt.compare(old_pass, req.User.password);
    if (!savedPassword) {
      return res.status(400).json({ message: "Old password not correct !" });
    }

    if (password !== c_password) {
      return res
        .status(400)
        .json({ message: "password and confirm password does not matched !" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    req.User.password = hashPassword;
    await req.User.save();
    return res
      .status(200)
      .json({ message: "Password changed successfully !!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = req.User;
    // console.log(user);
    const newuser = await UserProfile.findAll({
      where: { userId: user.id },
    });
    const userData = await User.findOne({
      attributes: ["firstName", "lastName"],
      where: { id: user.id },
    });

    return res.status(200).json({ newuser, userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const createUserProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      idnumber,
      address,
      gender,
      dob,
      nickname,
      document_type,
    } = req.body;

    const user = req.User;

    const newUser = await UserProfile.create({
      idnumber,
      address,
      gender,
      dob,
      nickname,
      document_type,
      userId: user.id,
    });

    const update = await User.update(
      {
        firstName: firstName,
        lastName: lastName,
      },
      { where: { id: req.User.id } }
    );

    if (newUser && update) {
      return res.status(200).json({
        success: true,
        message: "User Profile Register Successfully",
        newUser,
        update,
      });
    } else {
      return res.status(400).json({ message: "User not Added" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "user not register",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const {
      idnumber,
      address,
      gender,
      dob,
      nickname,
      firstName,
      lastName,
      document_type,
    } = req.body;

    const updatedUser = await UserProfile.update(
      {
        gender: gender,
        dob: dob,
        document_type: document_type,
        nickname: nickname,
        address: address,
        idnumber: idnumber,
      },
      { where: { userId: req.User.id } }
    );

    const update = await User.update(
      {
        firstName: firstName,
        lastName: lastName,
      },
      { where: { id: req.User.id } }
    );

    if (updatedUser && update) {
      return res.status(200).json({
        message: "Profile updated successfully !",
        updatedUser,
        update,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "user not register",
    });
  }
};

module.exports = {
  getUserProfile,
  changePassword,
  createUserProfile,
  updateUserProfile,
};
