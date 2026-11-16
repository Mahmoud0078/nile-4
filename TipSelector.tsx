import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { hapticTap } from "@/lib/platform";
import { formatEGP } from "@/lib/earnings";
import { TIP_OPTIONS, tipNet } from "@/lib/tips";
import { HandCoins, Heart, Sparkles } from "lucide-react";

function TipSelectorBase({
  fare,
  onTipChange,
}: {
  /** Gross fare in EGP, used to show the resulting captain total. */
  fare: number;
  onTipChange?: (amount: number) => void;
}) {
  const [selected, setSelected] = useState<string>("none");
  const [custom, setCustom] = useState("");

  const active = TIP_OPTIONS.find((o) => o.id === selected);
  const customValue = Number(custom);
  const customValid = custom.trim() !== "" && Number.isFinite(customValue) && customValue > 0;
  const tipAmount = customValid ? customValue : (active?.amount ?? 0);

  function choose(id: string) {
    hapticTap();
    setSelected(id);
    setCustom("");
    const option = TIP_OPTIONS.find((o) => o.id === id);
    onTipChange?.(option?.amount ?? 0);
  }

  function applyCustom(value: string) {
    setCustom(value);
    const parsed = Number(value);
    if (value.trim() !== "" && Number.isFinite(parsed) && parsed > 0) {
      setSelected("custom");
      onTipChange?.(parsed);
    }
  }

  const captainTotal = Number((fare * 0.85 + tipNet(tipAmount)).toFixed(2));

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-l from-amber-50 to-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
            <HandCoins className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">إضافة تبس</p>
            <p className="text-[10px] font-medium text-slate-500">
              ١٠٠٪ من التبس يذهب للكابتن
            </p>
          </div>
        </div>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700">
          بدون عمولة
        </span>
      </div>

      <CardContent className="space-y-3 p-4">
        <div className="grid grid-cols-5 gap-2">
          {TIP_OPTIONS.map((option) => {
            const isActive = selected === option.id && !customValid;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => choose(option.id)}
                className={cn(
                  "rounded-xl border px-1 py-2.5 text-center transition active:scale-95",
                  isActive
                    ? "border-amber-500 bg-amber-500 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50",
                )}
              >
                <p className="text-xs font-bold">{option.label}</p>
                <p
                  className={cn(
                    "mt-0.5 text-[9px] font-semibold",
                    isActive ? "text-amber-50" : "text-slate-400",
                  )}
                >
                  {option.amount === 0 ? "ج.م" : "ج.م"}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              inputMode="decimal"
              value={custom}
              onChange={(e) => applyCustom(e.target.value)}
              placeholder="مبلغ آخر"
              className={cn(
                "h-10 w-full rounded-xl border bg-white px-3 text-sm font-bold text-slate-900 outline-none transition placeholder:text-xs placeholder:font-medium placeholder:text-slate-400",
                customValid
                  ? "border-amber-500 ring-2 ring-amber-100"
                  : "border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100",
              )}
            />
            <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-[11px] font-bold text-slate-400">
              ج.م
            </span>
          </div>
          <Button
            variant="outline"
            className="h-10 shrink-0 rounded-xl border-slate-200 text-xs font-bold text-slate-600"
            onClick={() => {
              hapticTap();
              setCustom("");
              setSelected("none");
              onTipChange?.(0);
            }}
          >
            مسح
          </Button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <p className="text-[11px] font-bold text-slate-600">
                قيمة التبس
              </p>
            </div>
            <p className="text-sm font-bold text-amber-600">
              {formatEGP(tipAmount)}
            </p>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2">
            <p className="text-[11px] font-bold text-slate-600">
              إجمالي الكابتن
            </p>
            <p className="text-sm font-bold text-teal-700">
              {formatEGP(captainTotal)}
            </p>
          </div>
        </div>

        {tipAmount > 0 ? (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5">
            <Heart className="h-3.5 w-3.5 shrink-0 fill-amber-500 text-amber-500" />
            <p className="text-[10px] font-semibold text-amber-800">
              شكراً لك! التبس يظهر فوراً في أرباح الكابتن اليومية.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export const TipSelector = memo(TipSelectorBase);
export default TipSelector;