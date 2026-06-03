export const generateSlots = () => {
  const slots = [];

  const workingPeriods = [
    { start: 9 * 60, end: 13 * 60 },
    { start: 14 * 60, end: 21 * 60 },
  ];

  const formatTime = (minutes) => {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  };

  for (const period of workingPeriods) {
    for (let start = period.start; start < period.end; start += 30) {
      const end = start + 30;

      if (end > period.end) {
        break;
      }

      slots.push(`${formatTime(start)} - ${formatTime(end)}`);
    }
  }

  return slots;
};
