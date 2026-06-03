import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const appName = "CarePulse";
const accentColor = "#111827";
const doctorEmail = process.env.DOCTOR_EMAIL;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const baseTemplate = (content) => `
  <div style="background:#f6f6f6;padding:40px;font-family:Arial;">
    <div style="max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:8px;">
      <h2 style="color:${accentColor};text-align:center;">${appName}</h2>
      <hr/>
      ${content}
      <hr/>
      <p style="font-size:12px;color:#777;text-align:center;">
        &copy; 2026 ${appName}. All rights reserved.
      </p>
    </div>
  </div>
`;

export const sendOTPEmail = async (email, otp) => {
  const html = baseTemplate(`
    <h3>Verify Your Account</h3>
    <p>Your OTP code is:</p>
    <h1 style="letter-spacing:6px;color:${accentColor};">${otp}</h1>
    <p>This code is valid for 5 minutes.</p>
  `);

  try {
    await transporter.sendMail({
      from: `"${appName}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${appName} OTP Verification`,
      html,
    });
  } catch (error) {
    console.log("OTP email error:", error.message);
    throw error;
  }
};

export const sendBookingStatusEmail = async (
  email,
  booking,
  status,
  reason = "",
) => {
  const isApproved = status === "confirmed";
  const statusLabel = isApproved ? "Accepted" : "Rejected";
  const accent = isApproved ? "#059669" : "#dc2626";
  const message = isApproved
    ? "Your appointment request has been accepted by the doctor."
    : "Your appointment request has been rejected by the doctor.";
  const actionText = isApproved
    ? "Please arrive 10 minutes early."
    : "You can book another slot anytime.";

  const html = baseTemplate(`
    <h3 style="color:${accent};">${isApproved ? "Appointment Accepted" : "Appointment Rejected"}</h3>
    <p>${message}</p>
    <p><b>Date:</b> ${booking.date}</p>
    <p><b>Time:</b> ${booking.time}</p>
    <p><b>Status:</b> ${statusLabel}</p>
    ${reason ? `<p><b>Doctor Note:</b> ${reason}</p>` : ""}
    <p>${actionText}</p>
  `);

  try {
    await transporter.sendMail({
      from: `"${appName}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Appointment ${statusLabel}`,
      html,
    });
  } catch (error) {
    console.log("Booking status email error:", error.message);
  }
};

export const sendBookingConfirmationEmail = async (email, booking, reason = "") =>
  sendBookingStatusEmail(email, booking, "confirmed", reason);

export const sendReminderEmail = async (email, booking) => {
  const html = baseTemplate(`
    <h3>Appointment Reminder</h3>
    <p>Your appointment is in <b>1 hour</b>.</p>
    <p><b>Date:</b> ${booking.date}</p>
    <p><b>Time:</b> ${booking.time}</p>
    <p style="color:#d97706;">Please be on time.</p>
  `);

  try {
    await transporter.sendMail({
      from: `"${appName}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reminder: Appointment in 1 Hour",
      html,
    });
  } catch (error) {
    console.log("Reminder email error:", error.message);
  }
};

export const sendDoctorNotification = async (booking) => {
  const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const dashboardUrl = `${frontendBaseUrl}/doctor/login`;

  const html = baseTemplate(`
    <h3>New Booking Request</h3>
    <p><b>Patient:</b> ${booking.patientName}</p>
    <p><b>Date:</b> ${booking.date}</p>
    <p><b>Time:</b> ${booking.time}</p>
    <p>A new appointment request is waiting in your dashboard.</p>
    <br/>
    <a href="${dashboardUrl}"
      style="padding:10px 15px;background:${accentColor};color:white;text-decoration:none;">
      Open Doctor Login
    </a>
    <p style="margin-top:20px;">Log in to review, accept, reject, and manage the request from your dashboard.</p>
  `);

  try {
    await transporter.sendMail({
      from: `"${appName}" <${process.env.EMAIL_USER}>`,
      to: doctorEmail,
      subject: "New Appointment Request",
      html,
    });
  } catch (error) {
    console.log("Doctor notification email error:", error.message);
  }
};

export const sendRejectionEmail = async (email, booking, reason = "") =>
  sendBookingStatusEmail(email, booking, "cancelled", reason);

export const sendPrescriptionEmail = async (email, pdfBuffer, booking) => {
  try {
    await transporter.sendMail({
      from: `"${appName}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Digital Prescription - CarePulse",
      text: "Please find your attached digital prescription.",
      attachments: [
        {
          filename: `Prescription_${booking._id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
  } catch (error) {
    console.log("Prescription email error:", error.message);
  }
};
