import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  digitalToEgp,
  egpToDigital,
  formatDigital,
  formatEgp,
  sumBalance,
  todayEarnings,
  txTone,
  type WalletTx,
} from "@/lib/wallet";

type CaptainWalletProps = {
  transactions: WalletTx[];
  onTopUp: (egp: number) => void;
  onWithdraw: (egp: number) => void;
  onCreditEarning: (egp: number, label: string) => void;
};

const QUICK_TOPUPS = [100, 250, 500, 1000];

export function CaptainWallet({
  transactions,
  onTopUp,
  onWithdraw,
  onCreditEarning,
}: CaptainWalletProps) {
  const [amount, setAmount] = useState("250");
  const [tab, setTab] = useState<"topup" | "withdraw">("topup");

  const balanceDigital = useMemo(() => sumBalance(transactions), [transactions]);
  const balanceEgp = digitalToEgp(balanceDigital);
  const earnedToday = useMemo(() => todayEarnings(transactions), [transactions]);

  const parsed = Number(amount);
  const valid = Number.isFinite(parsed) && parsed > 0;
  const previewDigital = valid ? egpToDigital(parsed) : 0;

  const submit = () => {
    if (!valid) return;
    if (tab === "topup") {
      onTopUp(parsed);
    } else {
      if (parsed > balanceEgp) return;
      onWithdraw(parsed);
    }
    setAmount("250");
  };

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="font-serif text-xl text-slate-900">
              Captain Wallet
            </CardTitle>
            <CardDescription className="text-slate-600">
              Digital balance pegged 1:1 to the Egyptian Pound
            </CardDescription>
          </div>
          <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white">
            1 ₡ = 1 EGP
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              Digital balance
            </p>
            <p className="mt-1 font-serif text-3xl font-bold text-teal-900">
              {formatDigital(balanceDigital)}
            </p>
            <p className="mt-1 text-sm text-teal-700">
              ≈ {formatEgp(balanceEgp)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Earned today
            </p>
            <p className="mt-1 font-serif text-3xl font-bold text-slate-900">
              {formatEgp(earnedToday)}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {formatDigital(egpToDigital(earnedToday))} credited
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setTab("topup")}
              className={
                "flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors " +
                (tab === "topup"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200")
              }
            >
              Top up
            </button>
            <button
              onClick={() => setTab("withdraw")}
              className={
                "flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors " +
                (tab === "withdraw"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200")
              }
            >
              Withdraw
            </button>
          </div>

          <Label htmlFor="wallet-amount" className="text-slate-700">
            Amount (EGP)
          </Label>
          <div className="mt-2 flex gap-2">
            <Input
              id="wallet-amount"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-xl"
            />
            <Button
              onClick={submit}
              disabled={!valid || (tab === "withdraw" && parsed > balanceEgp)}
              className="rounded-xl bg-teal-600 text-white hover:bg-teal-700"
            >
              {tab === "topup" ? "Add funds" : "Cash out"}
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK_TOPUPS.map((q) => (
              <button
                key={q}
                onClick={() => setAmount(String(q))}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
              >
                {q} EGP
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs text-slate-500">
            You will receive{" "}
            <span className="font-semibold text-teal-700">
              {formatDigital(previewDigital)}
            </span>{" "}
            at the fixed rate of 1 ₡ = 1 EGP.
          </p>

          <Button
            variant="outline"
            onClick={() => onCreditEarning(87.5, "Trip · Mohandessin → Nasr City")}
            className="mt-4 w-full rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50"
          >
            Simulate completed trip earning (+87.50 EGP)
          </Button>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              Recent activity
            </h3>
            <span className="text-xs text-slate-500">
              {transactions.length} entries
            </span>
          </div>
          <ul className="space-y-2">
            {transactions.slice(0, 6).map((tx) => (
              <li
                key={tx.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {tx.label}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(tx.at).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={
                      "text-sm font-semibold " +
                      (tx.amount >= 0 ? "text-teal-700" : "text-rose-600")
                    }
                  >
                    {tx.amount >= 0 ? "+" : ""}
                    {formatDigital(tx.amount)}
                  </p>
                  <span
                    className={
                      "mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize " +
                      txTone(tx.type)
                    }
                  >
                    {tx.type}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}