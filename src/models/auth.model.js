import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "doctor"],
    default: "user",
  },

  // 🔐 OTP FIELDS
  otp: {
    type: String,
    default: null,
  },
  otpExpire: {
    type: Date,
    default: null,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return ;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

  } catch (err) {
    next(err);
  }
});

export default mongoose.model("User", userSchema);