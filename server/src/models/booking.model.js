import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // --- Patient Information (Filled during booking) ---
    patientName: { type: String, required: true },
    patientAge: { type: Number, required: true },
    patientGender: { type: String, enum: ["Male", "Female", "Other"] },
    riskScore: {
      type: Number,
      default: 0,
    },
    date: { type: String, required: true }, // "2026-04-21"
    time: { type: String, required: true }, // "09:00 - 09:30"
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    doctorArchived: { type: Boolean, default: false },
    decisionReason: { type: String, default: "" },
    decisionAt: { type: Date, default: null },
    decisionBy: { type: String, default: "" },
    isEmergency: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
    symptoms: { type: String },
    vitals: {
      bloodPressure: { type: String },
      heartRate: { type: Number },
    },
    prescription: {
      medicines: [
        {
          name: { type: String },
          dosage: { type: String },
          timing: { type: String },
          duration: { type: String },
        },
      ],
      doctorNotes: { type: String },
      prescribedAt: { type: Date },
    },
  },
  { timestamps: true }
);

// bookingSchema.index(
//   { date: 1, time: 1 }, 
//   { 
//     unique: true, 
//     partialFilterExpression: { status: { $in: ["pending", "confirmed"] } } 
//   }
// );

export default mongoose.model("Booking", bookingSchema);
