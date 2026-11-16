import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { hapticTap } from "@/lib/platform";
import { formatEgp, timeAgo, type Ride } from "@/lib/rides";
import {
  BadgeCheck,
  Car,
  CheckCircle2,
  Clock3,
  Flag,
  MapPin,
  Navigation,
  Play,
  Star,
  Wallet,
} from "lucide-react";

export function DriverPartnerPanel({
  rides,
  onAccept,
  onStart,
  onComplete,
}: {
  rides: Ride[];
  onAccept: (id: string) => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
}) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const active = rides.find((r) => r.status === "accepted" || r.status === "running");
  const available = rides.filter((r) => r.status === "available");
  const done = rides.filter((r) => r.status === "done");
  const earnings = done.reduce((sum, r) => sum + r.fare, 0);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden rounded-2xl border-teal-200 shadow-sm">
        <div className="border-b border-teal-100 bg-gradient-to-l from-teal-600 to-teal-500 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
              <BadgeCheck className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-lg font-bold text-white">
                شريك السائق
              </h2>
              <p className="text-[10px] font-medium text-teal-50">
                تم تفعيل الحساب بعد قبول الأوراق · جاهز لاستقبال الرحلات
              </p>
            </div>
            <span className="rounded-xl bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white">
              متصل
            </span>
          </div>
        </div>

        <CardContent className="grid grid-cols-3 gap-2 p-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <p className="text-[9px] font-bold text-slate-500">رحلات متاحة</p>
            <p className="mt-0.5 font-serif text-xl font-bold text-slate-900">
              {available.length}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <p className="text-[9px] font-bold text-slate-500">مكتملة</p>
            <p className="mt-0.5 font-serif text-xl font-bold text-slate-900">
              {done.length}
            </p>
          </div>
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-center">
            <p className="text-[9px] font-bold text-teal-700">الأرباح</p>
            <p className="mt-0.5 font-serif text-xl font-bold text-teal-800">
              {earnings}
            </p>
          </div>
        </CardContent>
      </Card>

      {active ? (
        <Card
          className={cn(
            "overflow-hidden rounded-2xl shadow-sm",
            active.status === "running"
              ? "border-teal-300 bg-teal-50"
              : "border-amber-300 bg-amber-50",
          )}
        >
          <div className="flex items-center justify-between border-b border-white/60 px-5 py-3">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-xl text-white",
                  active.status === "running" ? "bg-teal-600" : "bg-amber-500",
                )}
              >
                {active.status === "running" ? (
                  <Navigation className="h-4 w-4" />
                ) : (
                  <Clock3 className="h-4 w-4" />
                )}
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {active.status === "running" ? "الرحلة جارية" : "في انتظار البدء"}
                </p>
                <p className="text-[9px] font-medium text-slate-500">
                  {active.id} · {active.riderName} · ⭐ {active.riderRating}
                </p>
              </div>
            </div>
            <span className="font-serif text-lg font-bold text-slate-900">
              {formatEgp(active.fare)}
            </span>
          </div>

          <CardContent className="space-y-3 p-5">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
                <p className="text-[11px] font-semibold text-slate-700">
                  {active.from}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Flag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                <p className="text-[11px] font-semibold text-slate-700">
                  {active.to}
                </p>
              </div>
            </div>

            <div className="flex gap-2 text-[10px] font-bold text-slate-600">
              <span className="rounded-lg bg-white px-2 py-1">
                {active.distanceKm} كم
              </span>
              <span className="rounded-lg bg-white px-2 py-1">
                {active.minutes} دقيقة
              </span>
            </div>

            {active.status === "accepted" ? (
              <Button
                className="h-11 w-full rounded-xl bg-teal-600 text-sm font-bold text-white hover:bg-teal-700"
                onClick={() => {
                  hapticTap();
                  onStart(active.id);
                }}
              >
                <Play className="me-1 h-4 w-4" />
                بدء التشغيل
              </Button>
            ) : (
              <Button
                className="h-11 w-full rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800"
                onClick={() => {
                  hapticTap();
                  onComplete(active.id);
                }}
              >
                <CheckCircle2 className="me-1 h-4 w-4" />
                إنهاء الرحلة
              </Button>
            )}
          </CardContent>
        </Card>
      ) : null}

      <div>
        <div className="mb-2 flex items-center justify-between px-1">
          <h3 className="font-serif text-base font-bold text-slate-900">
            الرحلات المتاحة
          </h3>
          <span className="text-[10px] font-bold text-slate-400">
            {available.length} رحلة
          </span>
        </div>

        {available.length === 0 ? (
          <Card className="rounded-2xl border-dashed border-slate-300 bg-white">
            <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Car className="h-6 w-6" />
              </span>
              <p className="text-sm font-bold text-slate-700">
                لا توجد رحلات متاحة الآن
              </p>
              <p className="text-[10px] font-medium text-slate-400">
                سيتم تحديث القائمة تلقائيًا عند وصول طلبات جديدة
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2.5">
            {available.map((ride) => (
              <Card
                key={ride.id}
                className="rounded-2xl border-slate-200 shadow-sm transition hover:border-teal-300 hover:shadow-md"
              >
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
                        <p className="truncate text-[11px] font-semibold text-slate-700">
                          {ride.from}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Flag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                        <p className="truncate text-[11px] font-semibold text-slate-700">
                          {ride.to}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-end">
                      <p className="font-serif text-lg font-bold text-teal-700">
                        {formatEgp(ride.fare)}
                      </p>
                      <p className="text-[9px] font-medium text-slate-400">
                        {timeAgo(ride.requestedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                    <span className="rounded-lg bg-slate-100 px-2 py-1">
                      {ride.distanceKm} كم
                    </span>
                    <span className="rounded-lg bg-slate-100 px-2 py-1">
                      {ride.minutes} دقيقة
                    </span>
                    <span className="ms-auto flex items-center gap-1 text-slate-500">
                      {ride.riderName}
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {ride.riderRating}
                    </span>
                  </div>

                  <Button
                    className="h-10 w-full rounded-xl bg-teal-600 text-xs font-bold text-white hover:bg-teal-700"
                    onClick={() => {
                      hapticTap();
                      onAccept(ride.id);
                    }}
                  >
                    <CheckCircle2 className="me-1 h-3.5 w-3.5" />
                    قبول الرحلة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {done.length > 0 ? (
        <Card className="rounded-2xl border-slate-200 bg-slate-50 shadow-sm">
          <CardContent className="space-y-2 p-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-teal-600" />
              <p className="text-xs font-bold text-slate-800">
                الرحلات المكتملة
              </p>
            </div>
            {done.map((ride) => (
              <div
                key={ride.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2"
              >
                <p className="truncate text-[10px] font-semibold text-slate-600">
                  {ride.from} ← {ride.to}
                </p>
                <span className="shrink-0 text-[10px] font-bold text-teal-700">
                  {formatEgp(ride.fare)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <p className="px-1 text-center text-[9px] font-medium text-slate-400">
        آخر تحديث {new Date(now).toLocaleTimeString("ar-EG")}
      </p>
    </div>
  );
}

export default DriverPartnerPanel;