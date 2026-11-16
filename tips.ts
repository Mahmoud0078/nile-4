import { COMMISSION_RATE } from "@/lib/earnings";

export type TipOption = {
  id: string;
  /** Amount in EGP. */
  amount: number;
  label: string;
};

export const TIP_OPTIONS: TipOption[] = [
  { id: "none", amount: 0, label: "بدون" },
  { id: "small", amount: 10, label: "١٠" },
  { id: "medium", amount: 20, label: "٢٠" },
  { id: "large", amount: 35, label: "٣٥" },
  { id: "xlarge", amount: 50, label: "٥٠" },
];

export type TipRecord = {
  id: string;
  /** ISO date of the trip the tip belongs to. */
  date: string;
  amount: number;
  from: string;
};

/**
 * Tips are paid in full to the captain — the platform takes no commission
 * on gratuity, so they are added on top of the net fare.
 */
export function tipNet(amount: number): number {
  return Number(amount.toFixed(2));
}

export function commissionOnTip(amount: number): number {
  return Number((amount * 0).toFixed(2));
}

/** Convenience: net fare for a trip plus its tip. */
export function netWithTip(fare: number, tip: number): number {
  return Number((fare - fare * COMMISSION_RATE + tipNet(tip)).toFixed(2));
}

export function sumTips(tips: TipRecord[]): number {
  let total = 0;
  for (let i = 0; i < tips.length; i += 1) total += tips[i].amount;
  return Number(total.toFixed(2));
}

/** Deterministic demo history of tips received over the last 90 days. */
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

const TIP_NAMES = ["منى", "خالد", "سارة", "يوسف", "هالة", "عمر", "نورهان"];

function buildTips(): TipRecord[] {
  const rand = seeded(778899);
  const out: TipRecord[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let offset = 89; offset >= 0; offset -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - offset);
    const date = isoDate(d);
    // Roughly 40% of days include at least one tip.
    if (rand() > 0.6) {
      const count = rand() > 0.85 ? 2 : 1;
      for (let i = 0; i < count; i += 1) {
        const pick = TIP_OPTIONS[1 + Math.floor(rand() * 4)];
        out.push({
          id: `${date}-tip-${i}`,
          date,
          amount: pick.amount,
          from: TIP_NAMES[Math.floor(rand() * TIP_NAMES.length)],
        });
      }
    }
  }
  return out;
}

export const TIPS: TipRecord[] = buildTips();

export function tipsSince(sinceISO: string): TipRecord[] {
  return TIPS.filter((t) => t.date >= sinceISO);
}

export function tipsOn(dateISO: string): TipRecord[] {
  return TIPS.filter((t) => t.date === dateISO);
}