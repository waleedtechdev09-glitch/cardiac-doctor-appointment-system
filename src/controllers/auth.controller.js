import User from "../models/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/mailer.js";


// ====================== SIGNUP ======================
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ====================== LOGIN (SEND OTP ONLY) ======================
export const login = async (req, res) => {
  console.log("hit login");
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    console.log("Incoming email:", email);

const user = await User.findOne({ email });

console.log("User found:", user);

    // const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔐 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    // 📧 Send OTP
    await sendOTPEmail(email, otp);

    res.json({
      message: "OTP sent to email. Please verify to login.",
    });
  } catch (error) {
    console.log(error.message);
    
    res.status(500).json({ message: error.message });
  }
};



// ====================== VERIFY OTP (CREATE JWT HERE) ======================
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // check expiry
    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // clear OTP
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    // 🔐 CREATE JWT HERE
   const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
    username: user.username,
    role: user.role, 
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};