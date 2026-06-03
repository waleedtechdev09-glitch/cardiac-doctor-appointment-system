import User from "../models/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/mailer.js";

const OTP_TTL_MS = 5 * 60 * 1000;

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const issueOtp = async (user) => {
  const otp = generateOtp();

  user.otp = otp;
  user.otpExpire = new Date(Date.now() + OTP_TTL_MS);
  await user.save();

  await sendOTPEmail(user.email, otp);
};

const registerAccount = async (req, res, role) => {
  try {
    const { username, email, password } = req.body;
    const cleanUsername = username?.trim();
    const cleanEmail = email?.trim();

    if (!cleanUsername || !cleanEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if(password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message:
        role === "doctor"
          ? "Doctor account registered successfully."
          : "User registered successfully.",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================== SIGNUP ======================
export const signup = async (req, res) => registerAccount(req, res, "user");

// ====================== DOCTOR SIGNUP ======================
export const signupDoctor = async (req, res) =>
  registerAccount(req, res, "doctor");

// ====================== LOGIN ======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email?.trim();

    if (!cleanEmail || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "doctor") {
      return res.status(403).json({ message: "Doctors must use the doctor login portal." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await issueOtp(user);

    res.json({
      message: "OTP sent to email. Please verify to login.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================== DOCTOR LOGIN ======================
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email?.trim();

    if (!cleanEmail || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied. Doctor account required." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await issueOtp(user);

    res.json({
      message: "OTP sent to email. Please verify to login.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================== VERIFY OTP ======================
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = email?.trim();
    const cleanOtp = otp?.trim();

    if (!cleanEmail || !cleanOtp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || !user.otpExpire) {
      return res.status(400).json({ message: "OTP not requested" });
    }

    if (user.otpExpire.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.otp !== cleanOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = null;
    user.otpExpire = null;
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
