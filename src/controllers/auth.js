const OTP = require("../models/OTP");
const User = require("../models/User");
const Profile = require("../models/Profile"); // you forgot this
const otpgenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ======================================================
// SEND OTP
// ======================================================
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    // Generate OTP
    let otp = otpgenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Ensure unique OTP (no duplication in DB)
    let existingOtp = await OTP.findOne({ otp });
    while (existingOtp) {
      otp = otpgenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      existingOtp = await OTP.findOne({ otp });
    }

    // Save OTP to DB
    const otpPayload = { email, otp };
    await OTP.create(otpPayload);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log("Error in sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// SIGN UP
// ======================================================
exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    // Find most recent OTP
    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (recentOtp[0].otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create profile
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Signup failed, please try again",
    });
  }
};

// ======================================================
// LOGIN
// ======================================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, Please try again",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please sign up first",
      });
    }

    // Match password
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      // Generate JWT token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined; // Never send password back

      // Set cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failure, please try again",
    });
  }
};
