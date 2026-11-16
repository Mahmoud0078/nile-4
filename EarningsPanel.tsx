import { memo, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  COMMISSION_RATE,
  CURRENCY,
  TRIPS,
  dailyBuckets,
  filterOn,
  filterSince,
  formatDuration,
  formatEGP,
  formatEGPShort,
  startOfMonthISO,
  startOfWeekISO,
  summarize,
  todayISO,
  type EarningsSummary,
} from "@/lib/earnings";
import {
  Banknote,
  CalendarDays,
  CalendarRange,
  Clock,
  Percent,
  Route,
  TrendingUp,
  Wallet,
} from "lucide-react";

type Range = "today" | "week" | "month";

const RANGE_LABEL: Record<Range, string> = {
  today: "اليوم",
  week: "الأسبوع",
  month: "الشهر",
};

function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: typeof Wallet;
  tone: "teal" | "amber" | "slate" | "emerald";
}) {
  const toneBg =
    tone === "teal"
      ? "bg-teal-600"
      : tone === "amber"
        ? "bg-amber-500"
        : tone === "emerald"
          ? "bg-emerald-600"
          : "bg-slate-600";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <span
        className={cn(
          "mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg text-white",
          toneBg,
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <p className="text-base font-bold leading-none text-slate-900">{value}</p>
      <p className="mt-1 text-[10px] font-medium text-slate-500">{label}</p>
      {hint ? (
        <p className="mt-1 text-[10px] font-semibold text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

function EarningsPanelBase() {
  const [range, setRange] = useState<Range>("today");

  const data = useMemo(() => {
    const today = summarize(filterOn(TRIPS, todayISO()));
    const week = summarize(filterSince(TRIPS, startOfWeekISO()));
    const month = summarize(filterSince(TRIPS, startOfMonthISO()));
    const buckets = dailyBuckets(TRIPS, 7);
    const peak = buckets.reduce((m, b) => Math.max(m, b.net), 0);
    return { today, week, month, buckets, peak };
  }, []);

  const active: EarningsSummary =
    range === "today" ? data.today : range === "week" ? data.week : data.month;

  const avgPerTrip = active.trips > 0 ? active.net / active.trips : 0;

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
      <div className="bg-gradient-to-l from-teal-900 via-slate-900 to-slate-800 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-300/80">
              الأرباح المحققة · {RANGE_LABEL[range]}
            </p>
            <p className="mt-1 font-serif text-2xl font-bold leading-tight text-white">
              {formatEGP(active.net)}
            </p>
            <p className="mt-1 text-[10px] font-medium text-teal-200/70">
              صافي بعد عمولة المنصة {Math.round(COMMISSION_RATE * 100)}% ·{" "}
              {CURRENCY}
            </p>
          </div>
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-teal-200">
            <Wallet className="h-5 w-5" />
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {(["today", "week", "month"] as const).map((key) => {
            const value =
              key === "today"
                ? data.today.net
                : key === "week"
                  ? data.week.net
                  : data.month.net;
            const isActive = range === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setRange(key)}
                className={cn(
                  "rounded-xl border px-2 py-2 text-right transition active:scale-[0.98]",
                  isActive
                    ? "border-teal-400/60 bg-white/15"
                    : "border-white/10 bg-white/5 hover:bg-white/10",
                )}
              >
                <p className="text-[10px] font-semibold text-teal-200/80">
                  {RANGE_LABEL[key]}
                </p>
                <p className="mt-0.5 text-xs font-bold text-white">
                  {formatEGPShort(value)}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <CardContent className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <StatTile
            label="إجمالي الأجرة"
            value={formatEGP(active.gross)}
            icon={Banknote}
            tone="teal"
          />
          <StatTile
            label="عمولة المنصة"
            value={formatEGP(active.commission)}
            hint={`${Math.round(COMMISSION_RATE * 100)}% من الأجرة`}
            icon={Percent}
            tone="amber"
          />
          <StatTile
            label="عدد الرحلات"
            value={`${active.trips}`}
            hint={`متوسط ${formatEGP(avgPerTrip)} / رحلة`}
            icon={Route}
            tone="slate"
          />
          <StatTile
            label="زمن القيادة"
            value={formatDuration(active.minutes)}
            hint={`${active.distanceKm.toFixed(1)} كم`}
            icon={Clock}
            tone="emerald"
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-teal-600" />
              <p className="text-xs font-bold text-slate-700">
                صافي الأرباح · آخر 7 أيام
              </p>
            </div>
            <p className="text-[10px] font-semibold text-slate-400">
              الأعلى {formatEGP(data.peak)}
            </p>
          </div>

          <div className="flex h-28 items-end gap-2">
            {data.buckets.map((bucket) => {
              const height =
                data.peak > 0 ? Math.max(6, (bucket.net / data.peak) * 100) : 6;
              const isToday = bucket.date === todayISO();
              return (
                <div
                  key={bucket.date}
                  className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
                >
                  <span className="text-[9px] font-bold text-slate-500">
                    {formatEGPShort(bucket.net)}
                  </span>
                  <div
                    className={cn(
                      "w-full rounded-t-md transition-all duration-500",
                      isToday ? "bg-teal-600" : "bg-teal-300",
                    )}
                    style={{ height: `${height}%` }}
                    title={`${bucket.label} · ${formatEGP(bucket.net)}`}
                  />
                  <span
                    className={cn(
                      "truncate text-[9px] font-semibold",
                      isToday ? "text-teal-700" : "text-slate-400",
                    )}
                  >
                    {bucket.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-center">
            <CalendarDays className="mx-auto h-3.5 w-3.5 text-teal-600" />
            <p className="mt-1 text-[10px] font-semibold text-slate-500">
              اليوم
            </p>
            <p className="text-xs font-bold text-slate-900">
              {formatEGPShort(data.today.net)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-center">
            <CalendarRange className="mx-auto h-3.5 w-3.5 text-teal-600" />
            <p className="mt-1 text-[10px] font-semibold text-slate-500">
              الأسبوع
            </p>
            <p className="text-xs font-bold text-slate-900">
              {formatEGPShort(data.week.net)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-center">
            <Wallet className="mx-auto h-3.5 w-3.5 text-teal-600" />
            <p className="mt-1 text-[10px] font-semibold text-slate-500">
              الشهر
            </p>
            <p className="text-xs font-bold text-slate-900">
              {formatEGPShort(data.month.net)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const EarningsPanel = memo(EarningsPanelBase);
export default EarningsPanel;