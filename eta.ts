export type Eta = {
  /** Minutes remaining until the captain arrives. */
  minutes: number;
  /** Human label like "4:35 م". */
  clockLabel: string;
  /** Short relative label like "بعد 6 دقائق". */
  relativeLabel: string;
};

const AR_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Formats a Date as Arabic 12-hour clock, e.g. "4:35 م". */
export function formatArabicClock(date: Date): string {
  const hours24 = date.getHours();
  const suffix = hours24 >= 12 ? "م" : "ص";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${pad(date.getMinutes())} ${suffix}`;
}

/** Formats a Date as a friendly Arabic day label, e.g. "اليوم" / "غداً" / "12 مايو". */
export function formatArabicDay(date: Date, now: Date = new Date()): string {
  const startOf = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round(
    (startOf(date) - startOf(now)) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "اليوم";
  if (diffDays === 1) return "غداً";
  if (diffDays === -1) return "أمس";
  return `${date.getDate()} ${AR_MONTHS[date.getMonth()]}`;
}

export function formatArabicRelative(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  if (m === 0) return "الآن";
  if (m === 1) return "بعد دقيقة";
  if (m === 2) return "بعد دقيقتين";
  if (m <= 10) return `بعد ${m} دقائق`;
  return `بعد ${m} دقيقة`;
}

/** Builds an ETA object from minutes remaining, anchored to `now`. */
export function buildEta(minutes: number, now: Date = new Date()): Eta {
  const safe = Math.max(0, Math.round(minutes));
  const arrival = new Date(now.getTime() + safe * 60 * 1000);
  return {
    minutes: safe,
    clockLabel: formatArabicClock(arrival),
    relativeLabel: formatArabicRelative(safe),
  };
}

/** Full sentence for the client, e.g. "يصل الساعة 4:35 م · بعد 6 دقائق". */
export function formatEtaSentence(eta: Eta): string {
  if (eta.minutes === 0) return "الكابتن وصل الآن";
  return `يصل الساعة ${eta.clockLabel} · ${eta.relativeLabel}`;
}