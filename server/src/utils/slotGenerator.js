export const generateSlots = () => {
  const slots = [];

  let hour = 9;
  let minute = 0;

  // Doctors often have a break from 1:00 PM (13:00) to 2:00 PM (14:00)
  const breakStart = 13; 
  const breakEnd = 14;

  while (hour < 15) {
    // 🔴 Break Logic: Agar hour break ke range mein hai, toh slot push mat karo
    if (hour >= breakStart && hour < breakEnd) {
      hour = breakEnd; // Seedha break khatam hone wale ghante par jump karein
      minute = 0;
      continue; // Agli iteration par jayein
    }

    const start = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

    minute += 30;

    if (minute === 60) {
      hour++;
      minute = 0;
    }

    const end = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

    slots.push(`${start} - ${end}`);
  }

  return slots;
};