export type WalletTx = {
  id: string;
  type: "topup" | "earning" | "withdraw" | "fee";
  label: string;
  amount: number;
  at: number;
};

export const DIGITAL_RATE = 1;

export function egpToDigital(egp: number): number {
  return Math.round((egp / DIGITAL_RATE) * 100) / 100;
}

export function digitalToEgp(digital: number): number {
  return Math.round(digital * DIGITAL_RATE * 100) / 100;
}

export function formatDigital(value: number): string {
  return `${value.toFixed(2)} ₡`;
}

export function formatEgp(value: number): string {
  return `${value.toFixed(2)} EGP`;
}

export const seedTransactions: WalletTx[] = [
  { id: "t1", type: "earning", label: "Trip · Nasr City → Maadi", amount: 148.5, at: Date.now() - 1000 * 60 * 42 },
  { id: "t2", type: "earning", label: "Trip · Zamalek → Heliopolis", amount: 96.0, at: Date.now() - 1000 * 60 * 190 },
  { id: "t3", type: "fee", label: "Platform commission (12%)", amount: -29.34, at: Date.now() - 1000 * 60 * 191 },
  { id: "t4", type: "topup", label: "Top-up · Vodafone Cash", amount: 500, at: Date.now() - 1000 * 60 * 60 * 26 },
  { id: "t5", type: "withdraw", label: "Withdrawal · InstaPay", amount: -300, at: Date.now() - 1000 * 60 * 60 * 30 },
  { id: "t6", type: "earning", label: "Trip · Dokki → 6th of October", amount: 210.75, at: Date.now() - 1000 * 60 * 60 * 33 },
];

export function sumBalance(txs: WalletTx[]): number {
  return Math.round(txs.reduce((acc, t) => acc + t.amount, 0) * 100) / 100;
}

export function todayEarnings(txs: WalletTx[]): number {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return Math.round(
    txs
      .filter((t) => t.type === "earning" && t.at >= start.getTime())
      .reduce((acc, t) => acc + t.amount, 0) * 100
  ) / 100;
}

export function txTone(type: WalletTx["type"]): string {
  switch (type) {
    case "earning":
      return "bg-teal-100 text-teal-700";
    case "topup":
      return "bg-emerald-100 text-emerald-700";
    case "withdraw":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-rose-100 text-rose-700";
  }
}