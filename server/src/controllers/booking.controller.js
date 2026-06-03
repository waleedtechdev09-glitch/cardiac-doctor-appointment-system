import Booking from "../models/booking.model.js";
import User from "../models/auth.model.js";
import { generateSlots } from "../utils/slotGenerator.js";
import {
  sendDoctorNotification,
  sendBookingConfirmationEmail,
  sendRejectionEmail,
  sendPrescriptionEmail
} from "../utils/mailer.js";
import PDFDocument from "pdfkit";
import { calculateRiskScore } from "../utils/riskCalculator.js";

const formatTo24Hour = (timeValue) => {
  if (!timeValue) return null;

  const normalizedValue = timeValue.trim();
  const [timePart, meridiem] = normalizedValue.split(/\s+/);
  const [hourPart, minutePart] = timePart.split(":");
  const hour = Number(hourPart);
  const minute = Number(minutePart);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }

  let normalizedHour = hour;

  if (meridiem) {
    const normalizedMeridiem = meridiem.toUpperCase();

    if (normalizedMeridiem === "PM" && normalizedHour !== 12) {
      normalizedHour += 12;
    }

    if (normalizedMeridiem === "AM" && normalizedHour === 12) {
      normalizedHour = 0;
    }
  } else if (normalizedHour >= 1 && normalizedHour <= 8) {
    normalizedHour += 12;
  }

  return `${String(normalizedHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const normalizeTimeRange = (timeRange) => {
  if (!timeRange) return null;

  const [rawStart, rawEnd] = timeRange.split(" - ").map((part) => part.trim());
  if (!rawStart || !rawEnd) return null;

  const startTime = formatTo24Hour(rawStart);
  const endTime = formatTo24Hour(rawEnd);

  if (!startTime || !endTime) return null;

  return `${startTime} - ${endTime}`;
};

// ====================== CREATE BOOKING ======================

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      date, time, patientName, patientAge, patientGender, 
      symptoms, bloodPressure, isEmergency 
    } = req.body;

    const now = new Date();
    const todayStr = now.toLocaleDateString("en-CA");
    const selectedDateStr = date;

    if (!date || !time || !patientName || !patientAge || !patientGender) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required booking details.",
      });
    }

    if (selectedDateStr < todayStr) {
      return res.status(400).json({
        success: false,
        message: "You cannot select a past date.",
      });
    }

    const normalizedTime = normalizeTimeRange(time);
    if (!normalizedTime) {
      return res.status(400).json({
        success: false,
        message: "Invalid time slot format.",
      });
    }

    const normalizedStartHour = parseInt(normalizedTime.split(":")[0], 10);

    if (normalizedStartHour === 13) {
      return res.status(400).json({
        success: false,
        message: "The clinic is closed for lunch and prayer from 1:00 PM to 2:00 PM.",
      });
    }

    if (selectedDateStr === todayStr) {
      const [sHour, sMinute] = normalizedTime.split(' - ')[0].split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(sHour, sMinute, 0, 0);

      if (slotTime < now) {
        return res.status(400).json({
          success: false,
          message: `The selected time (${time}) has already passed.`,
        });
      }
    }

    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0) {
      return res.status(400).json({
        success: false,
        message: "The clinic is closed on Sundays.",
      });
    }

    const allSlots = generateSlots();

    if (!allSlots.includes(normalizedTime)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid time slot. Available slots are 9:00 AM to 1:00 PM and 2:00 PM to 9:00 PM.",
      });
    }

    const existing = await Booking.findOne({
      date,
      time: normalizedTime,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This slot is already booked.",
      });
    }

    const riskScore = calculateRiskScore(patientAge, bloodPressure, symptoms);

    const booking = await Booking.create({
      user: userId,
      date,
      time: normalizedTime,
      patientName,
      patientAge,
      patientGender,
      symptoms,
      riskScore,
      isEmergency: riskScore >= 8 ? true : (isEmergency || false),
      vitals: { bloodPressure },
      status: "pending",
      doctorArchived: false,
    });

    await sendDoctorNotification(booking);

    res.status(201).json({
      success: true,
      message: "Your appointment request has been submitted successfully.",
      booking,
    });
  } catch (error) {
    console.error("Booking Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create booking.",
    });
  }
};
// ====================== APPROVE BOOKING ======================
export const approveBooking = async (req, res) => {
  try {
    const { reason = "" } = req.body;
    const booking = await Booking.findById(req.params.id).populate("user");
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    booking.status = "confirmed";
    booking.decisionReason = reason?.trim() || "Your request has been accepted.";
    booking.decisionAt = new Date();
    booking.decisionBy = req.user?.email || req.user?.username || "doctor";
    booking.doctorArchived = false;
    await booking.save();

    if (booking.user?.email) {
      await sendBookingConfirmationEmail(
        booking.user.email,
        booking,
        booking.decisionReason,
      );
    }
    res.json({ success: true, message: "Booking approved successfully." });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to approve booking.",
    });
  }
};

// ====================== REJECT BOOKING ======================
export const rejectBooking = async (req, res) => {
  try {
    const { reason = "" } = req.body;
    const booking = await Booking.findById(req.params.id).populate("user");
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    booking.status = "cancelled";
    booking.decisionReason = reason?.trim() || "Your request has been rejected.";
    booking.decisionAt = new Date();
    booking.decisionBy = req.user?.email || req.user?.username || "doctor";
    booking.doctorArchived = false;
    await booking.save();

    if (booking.user?.email) {
      await sendRejectionEmail(booking.user.email, booking, booking.decisionReason);
    }
    res.json({ success: true, message: "Booking rejected successfully." });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to reject booking.",
    });
  }
};

// ====================== GET BOOKINGS FOR DOCTOR ======================
export const getAllBookingsForDoctor = async (req, res) => {
  try {
    const { status, date } = req.query;
    let filter = { doctorArchived: { $ne: true } };
    if (status) filter.status = status;
    if (date) filter.date = date;

    const bookings = await Booking.find(filter)
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== GET BOOKINGS FOR PATIENT ======================
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("date time status createdAt updatedAt patientName prescription");

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bookings.",
    });
  }
};

// ====================== ARCHIVE BOOKING FOR DOCTOR ======================
export const archiveBookingForDoctor = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.status === "pending") {
      return res.status(400).json({
        success: false,
        message: "Please accept or reject the request before deleting it.",
      });
    }

    booking.doctorArchived = true;
    await booking.save();

    res.json({
      success: true,
      message: "Booking removed from doctor dashboard.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to archive booking.",
    });
  }
};

// ====================== ADD PRESCRIPTION & GENERATE PDF ======================
export const addPrescription = async (req, res) => {
  try {
    const { bookingId, medicines, doctorNotes } = req.body;

    const booking = await Booking.findById(bookingId).populate("user");
    if (!booking) return res.status(404).json({ message: "Booking not found." });

    if (booking.status !== "confirmed" && booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Only confirmed requests can be marked as checkup complete.",
      });
    }

    const normalizedMedicines = Array.isArray(medicines)
      ? medicines
          .map((medicine) => ({
            name: String(medicine?.name ?? "").trim(),
            dosage: String(medicine?.dosage ?? "").trim(),
            timing: String(medicine?.timing ?? "").trim(),
            duration: String(medicine?.duration ?? "").trim(),
          }))
          .filter(
            (medicine) =>
              medicine.name || medicine.dosage || medicine.timing || medicine.duration,
          )
      : [];

    if (!normalizedMedicines.length) {
      return res.status(400).json({
        success: false,
        message: "Please add at least one medicine.",
      });
    }

    const cleanDoctorNotes = String(doctorNotes ?? "").trim();

    // Database Update
    booking.prescription = {
      medicines: normalizedMedicines,
      doctorNotes: cleanDoctorNotes,
      prescribedAt: new Date(),
    };
    booking.status = "completed"; 
    await booking.save();

    // PDF Creation
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    
    doc.on('end', async () => {
      let pdfData = Buffer.concat(buffers);
      await sendPrescriptionEmail(booking.user.email, pdfData, booking);
      res.json({ success: true, message: "Prescription sent to patient!" });
    });

    // --- PDF DESIGN (Dr. Waleed Ahmad Theme) ---
    doc.rect(0, 0, 612, 110).fill('#1a365d'); // Header

    doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text("Dr. Waleed Ahmad", 50, 25);
    doc.fillColor('#cbd5e1').fontSize(9).font('Helvetica').text("MBBS, CCD, CCC, CMJ | Cardiologist", 50, 55);
    doc.text("Wah Institute of Cardiology | Reg. No. 123456", 50, 68);
    doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold').text("Mon to Friday (9am - 3pm)", 400, 25, { align: 'right' });

    doc.moveDown(4);

    // Patient Details from Booking Data
    doc.fillColor('#000000').fontSize(12).font('Helvetica');
    doc.text(`Name:   ${booking.patientName}`, 50, 140);
    doc.text(`Age:    ${booking.patientAge} Years`, 50, 160);
    doc.text(`Sex:    ${booking.patientGender || 'N/A'}`, 50, 180);
    doc.text(`Date:   ${new Date().toLocaleDateString()}`, 400, 140);

    doc.moveTo(50, 210).lineTo(550, 210).strokeColor('#e2e8f0').stroke();

    // Rx Symbol
    doc.fontSize(36).font('Helvetica-Bold').fillColor('#1a365d').text("R", 50, 230, { continued: true }).fillColor('#ef4444').text("x");

    // Medicines List
    let yPos = 310;
    normalizedMedicines.forEach((med, i) => {
      doc.fillColor('#000000').fontSize(12).font('Helvetica-Bold').text(`${i + 1}. ${med.name}`, 70, yPos);
      doc.fontSize(10).font('Helvetica').fillColor('#4b5563').text(`   Dosage: ${med.dosage} | Timing: ${med.timing} | Duration: ${med.duration}`, 70, yPos + 15);
      yPos += 45;
    });

    // Notes
    doc.moveDown(2);
    doc.rect(50, yPos + 10, 510, 70).fill('#f1f5f9'); 
    doc.fillColor('#1a365d').fontSize(11).font('Helvetica-Bold').text("Doctor's Advice:", 60, yPos + 20);
    doc.fillColor('#475569').fontSize(10).font('Helvetica').text(cleanDoctorNotes || "No additional notes.", 60, yPos + 35, { width: 480 });

    // Footer
    doc.rect(0, 780, 612, 15).fill('#1a365d'); 
    doc.fillColor('#ffffff').fontSize(8).text("Address: Wah City, Wah Cantt | Contact: +92 3123456789", 50, 784, { align: 'center' });

    doc.end();

  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to add prescription." });
  }
};
