import bcrypt from "bcrypt";
import User from "../models/auth.model.js";

export const ensureDoctorAccount = async () => {
  const doctorEmail = process.env.DOCTOR_EMAIL?.trim();
  const doctorPassword = process.env.DOCTOR_PASSWORD?.trim();
  const doctorUsername = process.env.DOCTOR_USERNAME?.trim() || "Doctor";

  if (!doctorEmail) {
    console.log("Doctor seed skipped: DOCTOR_EMAIL is missing.");
    return;
  }

  const existingDoctor = await User.findOne({ email: doctorEmail });

  if (!existingDoctor) {
    if (!doctorPassword) {
      console.log("Doctor seed skipped: DOCTOR_EMAIL not found and DOCTOR_PASSWORD is missing.");
      return;
    }

    const hashedPassword = await bcrypt.hash(doctorPassword, 10);

    await User.create({
      username: doctorUsername,
      email: doctorEmail,
      password: hashedPassword,
      role: "doctor",
    });

    console.log(`Doctor account created for ${doctorEmail}`);
    return;
  }

  if (existingDoctor.role !== "doctor") {
    await User.findByIdAndUpdate(existingDoctor._id, { role: "doctor" });
    console.log(`Doctor role assigned to existing account ${doctorEmail}`);
  }

  if (doctorPassword) {
    const hashedPassword = await bcrypt.hash(doctorPassword, 10);
    await User.findByIdAndUpdate(existingDoctor._id, {
      password: hashedPassword,
      username: doctorUsername || existingDoctor.username,
    });
    console.log(`Doctor password reset for ${doctorEmail}`);
  }
};
