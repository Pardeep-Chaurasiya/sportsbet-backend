const bcrypt = require("bcrypt");
const { UserProfile } = require("../models");

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

    console.log(newuser);

    return res.status(200).json(newuser);
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
      idnumber,
      address,
      gender,
      dob,
      nickname,
      firstName,
      lastName,
      document_type,
    } = req.body;

    const user = req.User;

    const newUser = await UserProfile.create({
      firstName,
      lastName,
      email: user.email,
      mobilenumber: user.mobilenumber,
      idnumber,
      address,
      gender,
      dob,
      nickname,
      document_type,
      userId: user.id,
    });

    return res.json({
      success: true,
      message: "User Register Successfully",
      newUser,
    });
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
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        dob: dob,
        document_type: document_type,
        nickname: nickname,
        address: address,
        idnumber: idnumber,
      },
      { where: { userId: req.User.id } }
    );
    return res.status(200).json({ message: "Profile updated successfully !" });
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
