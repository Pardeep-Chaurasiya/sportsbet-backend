const bcrypt = require("bcrypt");
const { UserProfile, User } = require("../models");

// change password after login controller
const changePassword = async (req, res) => {
  try {
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
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// get user profile controller
const getUserProfile = async (req, res) => {
  try {
    const user = req.User;
    const newuser = await UserProfile.findAll({
      where: { userId: user.id },
    });
    const userData = await User.findOne({
      attributes: ["firstName", "lastName", "email", "mobilenumber", "dialing_code"],
      where: { id: user.id },
    });

    return res.status(200).json({ newuser, userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// update user profile controller
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

    console.log(updatedUser, update)
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
  updateUserProfile,
};
