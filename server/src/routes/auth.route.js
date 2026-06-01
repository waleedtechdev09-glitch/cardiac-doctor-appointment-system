import express from "express";
import { signup,login,verifyOTP } from "../controllers/auth.controller.js";

const router = express.Router();

//  Signup route
router.post("/register", signup);
// Login route
router.post("/login", login);
// OTP verify
router.post("/verify-otp", verifyOTP);

export default router;