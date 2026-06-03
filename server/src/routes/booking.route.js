import express from "express";
import { addPrescription, approveBooking, archiveBookingForDoctor, createBooking, getAllBookingsForDoctor, getMyBookings, rejectBooking } from "../controllers/booking.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import isDoctor from "../middleware/isDoctor.js";
import { sendPrescriptionEmail } from "../utils/mailer.js";
import {bookingLimiter} from '../middleware/bookingLimiter.js'

const router = express.Router();

router.post("/create-booking",authMiddleware,bookingLimiter, createBooking);
router.get("/my-bookings", authMiddleware, getMyBookings);
router.patch("/approve/:id", authMiddleware, isDoctor, approveBooking);
router.patch("/reject/:id", authMiddleware, isDoctor, rejectBooking);
router.delete("/archive/:id", authMiddleware, isDoctor, archiveBookingForDoctor);
router.post("/add-prescription", authMiddleware, isDoctor, addPrescription);
// router.get("/prescription/:id", sendPrescriptionEmail);

// doctor view all bookings
router.get("/admin", authMiddleware,isDoctor, getAllBookingsForDoctor);
export default router;
