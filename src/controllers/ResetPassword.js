const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// create resetpassword token
exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({
        success: false,
        message: "Your email is not registered ",
      });
    }

    // generate token
    const token = crypto.randomUUID();
    //update user by adding token and expiration time
    const updateDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );
    // create url
    const url = `http://localhost:3000/update-password/${token}`;
    // send mail with url
    await mailSender(
      email,
      "password reset link",
      `Password reset link: ${url}`
    );

    return res.json({
      success: true,
      message: "Email sent successfully, please check and change password",
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset password mail",
    });
  }
};

//ResetPassword

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    // validate
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password not match",
      });
    }
    // get user details from db using token
    const userDetails = await User.findOne({ token: token });
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is invalid",
      });
    }
    // check token expires
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token expired, Please regenerate token",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );
    //return response
    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
      console.log("Error", error);
      return res.status(500).json({
          success: false,
          message:"Something went wrong while sending reset mail"
      })
  }
};
