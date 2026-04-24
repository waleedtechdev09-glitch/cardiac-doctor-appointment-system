import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const appName = "CarePulse";
const accentColor = "#111827";
const brandBlue = "#2563eb";
const doctorEmail = process.env.DOCTOR_EMAIL;

// ---------------- TRANSPORTER ----------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ---------------- BASE WRAPPER ----------------
const baseTemplate = (content) => `
  <div style="background:#f6f6f6;padding:40px;font-family:Arial;">
    <div style="max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:8px;">
      <h2 style="color:${accentColor};text-align:center;">${appName}</h2>
      <hr/>
      ${content}
      <hr/>
      <p style="font-size:12px;color:#777;text-align:center;">
        © 2026 ${appName}. All rights reserved.
      </p>
    </div>
  </div>
`;

// ---------------- OTP EMAIL ----------------
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
    console.log("OTP sent");
  } catch (err) {
    console.log("OTP error:", err.message);
  }
};

// ---------------- BOOKING CONFIRMATION ----------------
export const sendBookingConfirmationEmail = async (email, booking) => {
  const html = baseTemplate(`
    <h3>🎉 Appointment Confirmed</h3>
    <p><b>Date:</b> ${booking.date}</p>
    <p><b>Time:</b> ${booking.time}</p>
    <p>Please arrive 10 minutes early.</p>
  `);

  try {
    await transporter.sendMail({
      from: `"${appName}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Appointment Confirmed",
      html,
    });
    console.log("Booking confirmation sent");
  } catch (err) {
    console.log("Booking error:", err.message);
  }
};

// ---------------- REMINDER EMAIL ----------------
export const sendReminderEmail = async (email, booking) => {
  const html = baseTemplate(`
    <h3>⏰ Appointment Reminder</h3>
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
    console.log("Reminder sent");
  } catch (err) {
    console.log("Reminder error:", err.message);
  }
};

// ---------------- DOCTOR NOTIFICATION ----------------
export const sendDoctorNotification = async (booking) => {
  const approveUrl = `${process.env.BACKEND_URL}/api/booking/approve/${booking._id}`;
  const rejectUrl = `${process.env.BACKEND_URL}/api/booking/reject/${booking._id}`;

  const html = baseTemplate(`
    <h3>📅 New Booking Request</h3>

    <p><b>Date:</b> ${booking.date}</p>
    <p><b>Time:</b> ${booking.time}</p>

    <br/>

    <a href="${approveUrl}"
      style="padding:10px 15px;background:green;color:white;text-decoration:none;margin-right:10px;">
      Approve
    </a>

    <a href="${rejectUrl}"
      style="padding:10px 15px;background:red;color:white;text-decoration:none;">
      Reject
    </a>

    <p style="margin-top:20px;">Click action to confirm decision.</p>
  `);

  try {
    await transporter.sendMail({
      from: `"${appName}" <${process.env.EMAIL_USER}>`,
      to: doctorEmail,
      subject: "New Appointment Request",
      html,
    });

    console.log("Doctor notified");
  } catch (err) {
    console.log("Doctor email error:", err.message);
  }
};

// ---------------- REJECTION EMAIL ----------------
export const sendRejectionEmail = async (email, booking) => {
  const html = baseTemplate(`
    <h3>❌ Appointment Not Approved</h3>
    <p>Your appointment was rejected by the doctor.</p>
    <p><b>Date:</b> ${booking.date}</p>
    <p><b>Time:</b> ${booking.time}</p>
    <p>You can book another slot anytime.</p>
  `);

  try {
    await transporter.sendMail({
      from: `"${appName}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Appointment Not Approved",
      html,
    });
    console.log("Rejection email sent");
  } catch (err) {
    console.log("Rejection error:", err.message);
  }
};

// ---------------- PRESCRIPTION EMAIL ----------------
export const sendPrescriptionEmail = async (email, pdfBuffer, booking) => {
  await transporter.sendMail({
    from: `"${appName}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Digital Prescription - CarePulse",
    text: "Please find your attached digital prescription.",
    attachments: [
      {
        filename: `Prescription_${booking._id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  });
};