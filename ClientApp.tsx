import { useCallback, useMemo, useState } from "react";
import { CaptainArrivalPanel } from "@/components/CaptainArrivalPanel";
import { EarningsPanel } from "@/components/EarningsPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { hapticTap } from "@/lib/platform";
import { Activity, Gauge, MapPinned, Route, Timer, Users } from "lucide-react";

type TripState = "enroute" | "arrived";

const STATS = [
  { label: "رحلة نشطة", value: "1", icon: Route, tone: "teal" },
  { label: "زمن الوصول", value: "6 د", icon: Timer, tone: "amber" },
  { label: "مسافة", value: "2.4 كم", icon: MapPinned, tone: "slate" },
] as const;

export function ClientApp() {
  const [trip, setTrip] = useState<TripState>("enroute");

  const handleArrival = useCallback(() => {
    setTrip("arrived");
  }, []);

  const stats = useMemo(() => STATS, []);
  const arrived = trip === "arrived";

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
        <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-teal-900 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-300/80">
                الرحلة الحالية
              </p>
              <p className="mt-0.5 truncate font-serif text-lg font-bold text-white">
                الرياض ← نقطة الالتقاء A
              </p>
            </div>
            <Badge
              className={cn(
                "shrink-0 rounded-full border-0 px-2.5 py-1 text-[10px] font-bold",
                arrived ? "bg-emerald-500 text-white" : "bg-white/15 text-white",
              )}
            >
              {arrived ? "وصل" : "في الطريق"}
            </Badge>
          </div>
        </div>

        <CardContent className="grid grid-cols-3 gap-3 p-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <span
                  className={cn(
                    "mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg text-white",
                    stat.tone === "teal"
                      ? "bg-teal-600"
                      : stat.tone === "amber"
                        ? "bg-amber-500"
                        : "bg-slate-600",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <p className="text-base font-bold leading-none text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] font-medium text-slate-500">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <EarningsPanel />

      <CaptainArrivalPanel arrived={arrived} onConfirmArrival={handleArrival} />

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Gauge className="h-4 w-4" />
            </span>
            <p className="text-sm font-bold text-slate-900">حالة النظام</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Users className="h-3.5 w-3.5" />
                <p className="text-[10px] font-semibold">مستخدمون متصلون</p>
              </div>
              <p className="mt-1 text-lg font-bold text-slate-900">1.2M</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Activity className="h-3.5 w-3.5" />
                <p className="text-[10px] font-semibold">زمن الاستجابة</p>
              </div>
              <p className="mt-1 text-lg font-bold text-emerald-600">42ms</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => hapticTap()}
            className="flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 transition hover:bg-slate-100 active:scale-[0.99]"
          >
            اختبار الاهتزاز
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ClientApp;