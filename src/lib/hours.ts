// Restaurant operating hours by day of week (0 = Sunday ... 6 = Saturday), America/Chicago.
export const HOURS: { open: number | null; close: number | null }[] = [
  { open: 11, close: 16 }, // Sunday    11AM–4PM
  { open: null, close: null }, // Monday    Closed
  { open: 11, close: 21 }, // Tuesday   11AM–9PM
  { open: 11, close: 21 }, // Wednesday 11AM–9PM
  { open: 11, close: 21 }, // Thursday  11AM–9PM
  { open: 11, close: 21 }, // Friday    11AM–9PM
  { open: 12, close: 20 }, // Saturday  12PM–8PM
];

const ALL_TIME_SLOTS = [
  "10:15 AM",
  "11:00 AM",
  "11:45 AM",
  "12:30 PM",
  "1:15 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:15 PM",
  "7:15 PM",
  "8:15 PM",
];

function parseSlotToHour(slot: string): number {
  const [time, period] = slot.split(" ");
  const [hourStr, minuteStr] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return hour + minute / 60;
}

// Returns only the time slots that fall within the restaurant's open hours for the given day.
export function getAvailableTimeSlots(day: Date | null): string[] {
  if (!day) return ALL_TIME_SLOTS;
  const todayHours = HOURS[day.getDay()];
  if (!todayHours.open || !todayHours.close) return [];

  return ALL_TIME_SLOTS.filter((slot) => {
    const hour = parseSlotToHour(slot);
    return hour >= todayHours.open! && hour < todayHours.close!;
  });
}
