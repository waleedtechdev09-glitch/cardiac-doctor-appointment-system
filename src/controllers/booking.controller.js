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

// ====================== CREATE BOOKING ======================

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      date, time, patientName, patientAge, patientGender, 
      symptoms, bloodPressure, isEmergency 
    } = req.body;

    // 1. --- DATE & TIME INITIALIZATION ---
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-CA'); 
    const selectedDateStr = date;

    // 2. --- PAST DATE VALIDATION ---
    if (selectedDateStr < todayStr) {
      return res.status(400).json({ 
        success: false, 
        message: "Pichli tareekh select nahi ki ja sakti." 
      });
    }

    // 3. --- TIME NORMALIZATION (String ko 24-hour mein convert karna) ---
    const timeParts = time.split(' - ');
    const startTime = timeParts[0];
    const endTime = timeParts[1];

    const convertTo24 = (timeStr) => {
      let [hour, minute] = timeStr.split(':').map(Number);
      // Agar hour 1 se 8 ke darmiyan hai, toh usey 13-20 (PM) bana dein
      if (hour >= 1 && hour <= 8) hour += 12;
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    // normalizedTime ban jayega "14:30 - 15:00" agar user ne "02:30 - 03:00" bheja
    const normalizedTime = `${convertTo24(startTime)} - ${convertTo24(endTime)}`;
    const normalizedStartHour = parseInt(normalizedTime.split(':')[0]);

    // 4. --- LUNCH / NAMAZ BREAK CHECK (01:00 PM = 13:00) ---
    if (normalizedStartHour === 13) {
      return res.status(400).json({ 
        success: false, 
        message: "01:00 PM se 02:00 PM tak Lunch aur Namaz ka break hota hai." 
      });
    }

    // 5. --- SAME DAY EXPIRED SLOT CHECK ---
    if (selectedDateStr === todayStr) {
      const [sHour, sMinute] = normalizedTime.split(' - ')[0].split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(sHour, sMinute, 0, 0);

      if (slotTime < now) {
        return res.status(400).json({ 
          success: false, 
          message: `Ye waqt (${time}) guzar chuka hai.` 
        });
      }
    }

    // 6. --- CLINIC HOLIDAY CHECK (SUNDAY) ---
    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0) {
      return res.status(400).json({ success: false, message: "Sunday ko clinic band hota hai." });
    }

    // 7. --- SLOT VALIDITY & DUPLICATE CHECK ---
    const allSlots = generateSlots();
    
    // Ab hum normalizedTime check karenge jo generator ki array se match karega
    if (!allSlots.includes(normalizedTime)) {
      return res.status(400).json({ 
        success: false, 
        message: "Ghalat time slot! Available slots: 09:00 to 13:00 aur 14:00 to 21:00." 
      });
    }

   const existing = await Booking.findOne({ 
  date, 
  time: normalizedTime, 
  status: { $in: ["pending", "confirmed"] } // Sirf in statuses ko block karein
});

if (existing) {
  return res.status(400).json({ success: false, message: "Ye slot pehle se book hai." });
}

    // 8. --- RISK SCORE CALCULATION ---
    const riskScore = calculateRiskScore(patientAge, bloodPressure, symptoms);

    // 9. --- DATABASE ENTRY ---
    const booking = await Booking.create({
      user: userId,
      date,
      time: normalizedTime, // Save as 24h format for consistency
      patientName,
      patientAge,
      patientGender,
      symptoms,
      riskScore,
      isEmergency: riskScore >= 8 ? true : (isEmergency || false), 
      vitals: { bloodPressure },
      status: "pending",
    });

    // 10. --- NOTIFY DOCTOR ---
    await sendDoctorNotification(booking);

    res.status(201).json({ 
      success: true, 
      message: "Appointment request bhej di gayi hai.", 
      booking 
    });

  } catch (error) {
    console.error("Booking Controller Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ====================== APPROVE BOOKING ======================
export const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("user");
    if (!booking) return res.status(404).json({ success: false, message: "Not found" });

    booking.status = "confirmed";
    await booking.save();

    if (booking.user?.email) {
      await sendBookingConfirmationEmail(booking.user.email, booking);
    }
    res.json({ success: true, message: "Approved" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ====================== REJECT BOOKING ======================
export const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("user");
    if (!booking) return res.status(404).json({ success: false, message: "Not found" });

    booking.status = "cancelled";
    await booking.save();

    if (booking.user?.email) {
      await sendRejectionEmail(booking.user.email, booking);
    }
    res.json({ success: true, message: "Rejected" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ====================== GET BOOKINGS FOR DOCTOR ======================
export const getAllBookingsForDoctor = async (req, res) => {
  try {
    const { status, date } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (date) filter.date = date;

    const bookings = await Booking.find(filter).populate("user", "name email").sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== ADD PRESCRIPTION & GENERATE PDF ======================
export const addPrescription = async (req, res) => {
  try {
    const { bookingId, medicines, doctorNotes } = req.body;

    const booking = await Booking.findById(bookingId).populate("user");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Database Update
    booking.prescription = { medicines, doctorNotes, prescribedAt: new Date() };
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
    medicines.forEach((med, i) => {
      doc.fillColor('#000000').fontSize(12).font('Helvetica-Bold').text(`${i + 1}. ${med.name}`, 70, yPos);
      doc.fontSize(10).font('Helvetica').fillColor('#4b5563').text(`   Dosage: ${med.dosage} | Timing: ${med.timing} | Duration: ${med.duration}`, 70, yPos + 15);
      yPos += 45;
    });

    // Notes
    doc.moveDown(2);
    doc.rect(50, yPos + 10, 510, 70).fill('#f1f5f9'); 
    doc.fillColor('#1a365d').fontSize(11).font('Helvetica-Bold').text("Doctor's Advice:", 60, yPos + 20);
    doc.fillColor('#475569').fontSize(10).font('Helvetica').text(doctorNotes, 60, yPos + 35, { width: 480 });

    // Footer
    doc.rect(0, 780, 612, 15).fill('#1a365d'); 
    doc.fillColor('#ffffff').fontSize(8).text("Address: Wah City, Wah Cantt | Contact: +92 3123456789", 50, 784, { align: 'center' });

    doc.end();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};