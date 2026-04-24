import rateLimit from "express-rate-limit";

export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2, // 2 requests per hour
  message: {
    success: false,
    message: "Aap 1 ghantay mein sirf 2 bookings kar sakte hain."
  },
  standardHeaders: true,
  legacyHeaders: false,
});