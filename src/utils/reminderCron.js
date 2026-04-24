import cron from "node-cron";
import Booking from "../models/booking.model.js";
import User from "../models/auth.model.js";
import { sendReminderEmail } from "./mailer.js";

// runs every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    // 1. Sirf wahi bookings uthao jo:
    // - Confirmed hain
    // - Jinka reminder abhi tak NAHI gaya (reminderSent: false)
    const bookings = await Booking.find({ 
      status: "confirmed", 
      reminderSent: false 
    });

    for (let booking of bookings) {
      const [startTime] = booking.time.split(" - ");
      const bookingDateTime = new Date(`${booking.date} ${startTime}`);

      // 2. Check agar appointment 1 ghante ke andar hai
      if (bookingDateTime > now && bookingDateTime <= oneHourFromNow) {
        const user = await User.findById(booking.user);
        if (user?.email) {
          await sendReminderEmail(user.email, booking);
          
          // 3. Status update karo taaki agle minute phir se na bhej de
          booking.reminderSent = true;
          await booking.save();
          console.log(`✅ Reminder sent to ${user.email}`);
        }
      }
    }
  } catch (error) {
    console.log("Cron error:", error.message);
  }
});