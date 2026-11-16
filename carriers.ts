export type Carrier = {
  id: string;
  name: string;
  short: string;
  prefixes: string[];
  color: string;
  badge: string;
};

export const carriers: Carrier[] = [
  {
    id: "vodafone",
    name: "Vodafone Egypt",
    short: "Vodafone",
    prefixes: ["010"],
    color: "bg-red-600",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
  {
    id: "orange",
    name: "Orange Egypt (Mobinil)",
    short: "Orange",
    prefixes: ["012"],
    color: "bg-orange-500",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    id: "etisalat",
    name: "Etisalat Misr",
    short: "Etisalat",
    prefixes: ["011"],
    color: "bg-emerald-600",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "we",
    name: "WE (Telecom Egypt)",
    short: "WE",
    prefixes: ["015"],
    color: "bg-violet-600",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
  },
];

export function detectCarrier(localNumber: string): Carrier | null {
  const digits = localNumber.replace(/\D/g, "");
  if (digits.length < 3) return null;
  const prefix = digits.slice(0, 3);
  return carriers.find((c) => c.prefixes.includes(prefix)) ?? null;
}

export function isValidEgyptianMobile(localNumber: string): boolean {
  const digits = localNumber.replace(/\D/g, "");
  return digits.length === 11 && detectCarrier(digits) !== null;
}

export function formatLocalNumber(localNumber: string): string {
  const d = localNumber.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 7)} ${d.slice(7)}`;
}

export function maskNumber(localNumber: string): string {
  const d = localNumber.replace(/\D/g, "");
  if (d.length < 7) return d;
  return `${d.slice(0, 3)} **** ${d.slice(-4)}`;
}

export function generateOtp(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}