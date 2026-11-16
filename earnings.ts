export type Trip = {
  id: string;
  /** ISO date, e.g. "2025-06-14" */
  date: string;
  /** Gross fare in EGP. */
  fare: number;
  /** Platform commission in EGP. */
  commission: number;
  distanceKm: number;
  minutes: number;
};

export type EarningsSummary = {
  gross: number;
  commission: number;
  net: number;
  trips: number;
  distanceKm: number;
  minutes: number;
};

export const EMPTY_SUMMARY: EarningsSummary = {
  gross: 0,
  commission: 0,
  net: 0,
  trips: 0,
  distanceKm: 0,
  minutes: 0,
};

/** Commission rate applied to every fare. */
export const COMMISSION_RATE = 0.15;

/** Currency symbol for the Egyptian pound. */
export const CURRENCY = "ج.م";

/** Deterministic pseudo-random so the demo data is stable across reloads. */
function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Builds ~90 days of trip history ending today.
 * Generated once at module load and reused everywhere.
 */
function buildTrips(): Trip[] {
  const rand = seeded(20250614);
  const trips: Trip[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let dayOffset = 89; dayOffset >= 0; dayOffset -= 1) {
    const day = new Date(today);
    day.setDate(day.getDate() - dayOffset);
    const date = isoDate(day);

    // Weekends are busier for the captain.
    const weekday = day.getDay();
    const isWeekend = weekday === 5 || weekday === 6;
    const base = isWeekend ? 9 : 6;
    const count = Math.max(2, Math.round(base + rand() * 5));

    for (let i = 0; i < count; i += 1) {
      const distanceKm = Number((2 + rand() * 16).toFixed(1));
      const minutes = Math.round(8 + distanceKm * 2.4 + rand() * 8);
      // Egyptian fare scale: base 15 EGP + ~9 EGP per km.
      const fare = Number((15 + distanceKm * 9 + rand() * 25).toFixed(2));
      trips.push({
        id: `${date}-${i}`,
        date,
        fare,
        commission: Number((fare * COMMISSION_RATE).toFixed(2)),
        distanceKm,
        minutes,
      });
    }
  }

  return trips;
}

export const TRIPS: Trip[] = buildTrips();

export function summarize(trips: Trip[]): EarningsSummary {
  let gross = 0;
  let commission = 0;
  let distanceKm = 0;
  let minutes = 0;

  for (let i = 0; i < trips.length; i += 1) {
    const t = trips[i];
    gross += t.fare;
    commission += t.commission;
    distanceKm += t.distanceKm;
    minutes += t.minutes;
  }

  return {
    gross: Number(gross.toFixed(2)),
    commission: Number(commission.toFixed(2)),
    net: Number((gross - commission).toFixed(2)),
    trips: trips.length,
    distanceKm: Number(distanceKm.toFixed(1)),
    minutes,
  };
}

export function todayISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return isoDate(d);
}

/** Start of the current week (Saturday in the region). */
export function startOfWeekISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=Sun … 6=Sat
  const diff = (day + 1) % 7; // days since Saturday
  d.setDate(d.getDate() - diff);
  return isoDate(d);
}

export function startOfMonthISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(1);
  return isoDate(d);
}

export function filterSince(trips: Trip[], sinceISO: string): Trip[] {
  return trips.filter((t) => t.date >= sinceISO);
}

export function filterOn(trips: Trip[], dateISO: string): Trip[] {
  return trips.filter((t) => t.date === dateISO);
}

export type DayBucket = {
  date: string;
  label: string;
  net: number;
  trips: number;
};

const AR_DAYS = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

/** Last `days` days aggregated for the chart, oldest → newest. */
export function dailyBuckets(trips: Trip[], days = 7): DayBucket[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const byDate = new Map<string, { net: number; trips: number }>();
  for (let i = 0; i < trips.length; i += 1) {
    const t = trips[i];
    const entry = byDate.get(t.date);
    if (entry) {
      entry.net += t.fare - t.commission;
      entry.trips += 1;
    } else {
      byDate.set(t.date, { net: t.fare - t.commission, trips: 1 });
    }
  }

  const out: DayBucket[] = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - offset);
    const key = isoDate(d);
    const entry = byDate.get(key);
    out.push({
      date: key,
      label: AR_DAYS[d.getDay()],
      net: Number((entry?.net ?? 0).toFixed(2)),
      trips: entry?.trips ?? 0,
    });
  }
  return out;
}

export function formatEGP(value: number): string {
  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${CURRENCY}`;
}

export function formatEGPShort(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toFixed(0);
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h <= 0) return `${m} د`;
  return `${h} س ${m} د`;
}