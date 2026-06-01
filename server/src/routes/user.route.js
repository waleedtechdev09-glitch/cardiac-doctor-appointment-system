import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 Protected route
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Profile access granted",
    user: req.user,
  });
});

export default router;