const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const SECRET = process.env.JWT_SECRET;

//transporter for rest password
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//signup for user
const signUpUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      latitude,
      longitude,
      address,
      services,
    } = req.body;
    let role;

    if (services && services.length > 0) {
      // If services array is not empty, assign "worker" role
      role = "worker";
    } else {
      // If services array is empty or undefined, assign "user" role
      role = "user";
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPass,
      phoneNumber,
      latitude,
      longitude,
      address,
      services,
      role, // Assign the determined role
    });

    await newUser.save();

    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message)
  }
};


//login
const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email });

    if (
      user &&
      (await bcrypt.compare(password, user.password)) &&
      user.access === "accepted"
    ) {
      const token = jwt.sign({ _id: user._id, role: user.role }, SECRET, {
        expiresIn: "6hr",
      });
      user = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      };
      res.status(200).json({ token, user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const otp = Math.floor(Math.random() * 9999);

    user.resetOtp = otp;
    user.resetExpiry = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    //  url='http://localhost:5000/user'
    // const resetLink = `${url}/reset-password/${otp}`;
    const link = `http://localhost:5173/auth/newPassword`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Click on the following link to reset your password: ${link} - this is your otp ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// reset password
const resetPassword = async (req, res) => {
  try {
    const resetOtp = req.params.otp;
    const user = await User.findOne({
      resetOtp: resetOtp,
      resetExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }
    // Update user's password and reset token fields
    user.resetOtp = null;
    user.resetExpiry = null;
    user.otpVerified = true;
    user.save();
    res.status(200).json({ message: "otp verified" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const newPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }
    //Update user's password and reset token fields
    if (user.otpVerified == true) {
      user.resetOtp = null;
      user.resetExpiry = null;
      user.otpVerified = true;
      user.save();
      res.status(200).json({ message: "otp verified" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signUpUser,
  LoginUser,
  resetPassword,
  forgotPassword,
  newPassword,
};
