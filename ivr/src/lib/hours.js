const HOURS = {
  0: null,
  1: { open: 9, close: 18 },
  2: { open: 9, close: 18 },
  3: { open: 9, close: 18 },
  4: { open: 9, close: 18 },
  5: { open: 9, close: 18 },
  6: { open: 9, close: 19 },
  7: { open: 9, close: 19 },
};

export function isOpen(now = new Date()) {
  const tz = process.env.BUSINESS_TIMEZONE || "America/New_York";
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    hour: "numeric",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(now).map((p) => [p.type, p.value]),
  );
  const dayMap = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };
  const day = dayMap[parts.weekday];
  const hour = parseInt(parts.hour, 10);
  const slot = HOURS[day];
  if (!slot) return false;
  return hour >= slot.open && hour < slot.close;
}
