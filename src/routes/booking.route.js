import express from "express";
import { addPrescription, approveBooking, createBooking, getAllBookingsForDoctor, rejectBooking } from "../controllers/booking.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import isDoctor from "../middleware/isDoctor.js";
import { sendPrescriptionEmail } from "../utils/mailer.js";

const router = express.Router();

router.post("/create-booking",authMiddleware, createBooking);
router.get("/approve/:id", approveBooking);
router.get("/reject/:id", rejectBooking);
router.post("/add-prescription", authMiddleware, isDoctor, addPrescription);
router.get("/prescription/:id", sendPrescriptionEmail);

// doctor view all bookings
router.get("/admin", authMiddleware,isDoctor, getAllBookingsForDoctor);
export default router;