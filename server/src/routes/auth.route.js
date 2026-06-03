import express from "express";
import { signup, login, verifyOTP, signupDoctor, loginDoctor } from "../controllers/auth.controller.js";

const router = express.Router();

// Patient routes
router.post("/register", signup);
router.post("/login", login);

// Doctor routes
router.post("/doctor/register", signupDoctor);
router.post("/doctor/login", loginDoctor);

// OTP verify (shared)
router.post("/verify-otp", verifyOTP);

export default router;