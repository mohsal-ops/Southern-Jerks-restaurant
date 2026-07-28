import db from "@/db/db";

export const DEFAULT_HOURS = [
  { day: "Sunday", dayIndex: 0, open: 11, close: 16 },
  { day: "Monday", dayIndex: 1, open: null, close: null },
  { day: "Tuesday", dayIndex: 2, open: 11, close: 21 },
  { day: "Wednesday", dayIndex: 3, open: 11, close: 21 },
  { day: "Thursday", dayIndex: 4, open: 11, close: 21 },
  { day: "Friday", dayIndex: 5, open: 11, close: 21 },
  { day: "Saturday", dayIndex: 6, open: 12, close: 20 },
];

// Falls back to seeding the table from DEFAULT_HOURS if it's ever empty
// (fresh DB, or the seed script was never run) instead of returning nothing.
// Also resilient if the DB is unreachable/timing out (or the table doesn't
// exist yet) — returns defaults so the root layout doesn't 500 the whole app.
export async function getBusinessHours() {
  try {
    const hours = await db.businessHours.findMany({ orderBy: { dayIndex: "asc" } });
    if (hours.length > 0) return hours;

    await Promise.all(
      DEFAULT_HOURS.map((h) =>
        db.businessHours.upsert({ where: { dayIndex: h.dayIndex }, update: h, create: h }),
      ),
    );
    return await db.businessHours.findMany({ orderBy: { dayIndex: "asc" } });
  } catch {
    return DEFAULT_HOURS.map((h, i) => ({ id: `default-${i}`, updatedAt: new Date(), ...h }));
  }
}

export function formatHour(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:00 ${period}`;
}

export function getOpenStatus(
  hours: { dayIndex: number; open: number | null; close: number | null }[],
) {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  const today = hours.find((h) => h.dayIndex === day);

  if (!today?.open || !today?.close) return { isOpen: false, label: "Closed today", next: "" };
  if (hour >= today.open && hour < today.close) {
    return { isOpen: true, label: "Open now", next: `Closes at ${formatHour(today.close)}` };
  }
  return { isOpen: false, label: "Currently closed", next: `Opens at ${formatHour(today.open)}` };
}
