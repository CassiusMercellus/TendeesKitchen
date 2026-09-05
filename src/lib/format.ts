export function formatMoney(amount: number) {
  return `$${amount.toLocaleString("en-US")}`;
}

export function formatEventDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatOrderedAt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Converts an <input type="time"> value ("HH:MM", 24-hour) to a display label like "1:00 PM". */
export function formatTimeInput(value: string) {
  const [hourStr, minuteStr] = value.split(":");
  const hour = Number(hourStr);
  if (!Number.isFinite(hour) || !minuteStr) return value;
  const period = hour >= 12 ? "PM" : "AM";
  const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelveHour}:${minuteStr} ${period}`;
}

export function isDueSoon(iso: string) {
  const due = new Date(iso).getTime();
  const now = Date.now();
  const hoursAway = (due - now) / (1000 * 60 * 60);
  return hoursAway <= 48;
}
