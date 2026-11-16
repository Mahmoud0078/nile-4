import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { hapticTap } from "@/lib/platform";
import {
  buildRidePool,
  formatEgp,
  timeAgo,
  type Ride,
} from "@/lib/rides";
import type { SignupDraft } from "@/lib/auth";
import {
  BadgeCheck,
  Car,
  CheckCircle2,
  Clock3,
  Flag,
  LogOut,
  MapPin,
  Navigation,
  Play,
  Power,
  Star,
  TrendingUp,
  Wallet,
} from "lucide-react";

export function HomeScreen({
  draft,
  onLogout,
}: {
  draft: SignupDraft;
  onLogout: () => void;
}) {
  const [online, setOnline] = useState(false);
  const [rides, setRides] = useState<Ride[]>(() => buildRidePool());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const available = useMemo(
    () => rides.filter((r) => r.status === "available"),
    [rides],
  );
  const running = rides.find((r) => r.status === "running");
  const accepted = rides.find((r) => r.status === "accepted");
  const done = rides.filter((r) => r.status === "done");

  const earnings = done.reduce((sum, r) => sum + r.fare, 0);

  function accept(id: string) {
    hapticTap();
    setRides((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r)),
    );
  }

  function start(id: string) {
    hapticTap();
    setRides((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "running" } : r)),
    );
  }

  function finish(id: string) {
    hapticTap();
    setRides((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "done" } : r)),
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-md px-4 py-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Car className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900">شريك السائق</p>
            <p className="truncate text-[10px] font-medium text-slate-500">
              {draft.fullName} · {draft.phone}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-slate-200"
            onClick={() => {
              hapticTap();
              onLogout();
            }}
          >
            <LogOut className="me-1 h-3.5 w-3.5" />
            خروج
          </Button>
        </div>

        <Card className="mb-4 overflow-hidden rounded-2xl border-slate-800 shadow-sm">
          <div className="bg-gradient-to-l from-slate-900 to-slate-800 px-5 py-4">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-xl",
                  online ? "bg-teal-500 text-white" : "bg-white/10 text-slate-300",
                )}
              >
                <Power className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="font-serif text-lg font-bold text-white">
                  {online ? "أنت متصل الآن" : "أنت غير متصل"}
                </h1>
                <p className="text-[10px] font-medium text-slate-300">
                  {online
                    ? `${available.length} رحلة متاحة للقبول`
                    : "اتصل لتبدأ استقبال الرحلات"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  hapticTap();
                  setOnline((v) => !v);
                }}
                className={cn(
                  "rounded-xl px-3 py-2 text-[10px] font-bold transition",
                  online
                    ? "bg-white/10 text-slate-200 hover:bg-white/20"
                    : "bg-teal-500 text-white hover:bg-teal-600",
                )}
              >
                {online ? "إيقاف" : "اتصال"}
              </button>
            </div>
          </div>

          <CardContent className="grid grid-cols-3 gap-2 p-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <Wallet className="mx-auto h-4 w-4 text-teal-600" />
              <p className="mt-1 font-serif text-base font-bold text-slate-900">
                {formatEgp(earnings)}
              </p>
              <p className="text-[9px] font-bold text-slate-500">أرباح اليوم</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <CheckCircle2 className="mx-auto h-4 w-4 text-teal-600" />
              <p className="mt-1 font-serif text-base font-bold text-slate-900">
                {done.length}
              </p>
              <p className="text-[9px] font-bold text-slate-500">رحلات مكتملة</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <TrendingUp className="mx-auto h-4 w-4 text-teal-600" />
              <p className="mt-1 font-serif text-base font-bold text-slate-900">
                {available.length}
              </p>
              <p className="text-[9px] font-bold text-slate-500">متاحة الآن</p>
            </div>
          </CardContent>
        </Card>

        {running ? (
          <Card className="mb-4 overflow-hidden rounded-2xl border-teal-300 shadow-sm">
            <div className="flex items-center justify-between border-b border-teal-100 bg-teal-50 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white">
                  <Navigation className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    الرحلة جارية
                  </p>
                  <p className="text-[9px] font-medium text-slate-500">
                    {running.id} · {running.riderName}
                  </p>
                </div>
              </div>
              <span className="font-serif text-lg font-bold text-teal-700">
                {formatEgp(running.fare)}
              </span>
            </div>
            <CardContent className="space-y-3 p-5">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
                  <p className="text-[11px] font-semibold text-slate-700">
                    {running.from}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Flag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                  <p className="text-[11px] font-semibold text-slate-700">
                    {running.to}
                  </p>
                </div>
              </div>
              <Button
                className="h-11 w-full rounded-xl bg-teal-600 text-sm font-bold text-white hover:bg-teal-700"
                onClick={() => finish(running.id)}
              >
                <CheckCircle2 className="me-1 h-4 w-4" />
                إنهاء الرحلة
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {accepted && !running ? (
          <Card className="mb-4 overflow-hidden rounded-2xl border-amber-300 shadow-sm">
            <div className="flex items-center justify-between border-b border-amber-100 bg-amber-50 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white">
                  <Clock3 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    رحلة مقبولة — في انتظار البدء
                  </p>
                  <p className="text-[9px] font-medium text-slate-500">
                    {accepted.id} · {accepted.riderName}
                  </p>
                </div>
              </div>
              <span className="font-serif text-lg font-bold text-slate-900">
                {formatEgp(accepted.fare)}
              </span>
            </div>
            <CardContent className="space-y-3 p-5">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
                  <p className="text-[11px] font-semibold text-slate-700">
                    {accepted.from}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Flag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                  <p className="text-[11px] font-semibold text-slate-700">
                    {accepted.to}
                  </p>
                </div>
              </div>
              <Button
                className="h-11 w-full rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800"
                onClick={() => start(accepted.id)}
              >
                <Play className="me-1 h-4 w-4" />
                بدء التشغيل
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <div className="mb-2 flex items-center justify-between px-1">
          <h3 className="font-serif text-base font-bold text-slate-900">
            الرحلات المتاحة
          </h3>
          <span className="text-[10px] font-bold text-slate-400">
            {available.length} رحلة
          </span>
        </div>

        {!online ? (
          <Card className="rounded-2xl border-dashed border-slate-300 bg-white">
            <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Power className="h-6 w-6" />
              </span>
              <p className="text-sm font-bold text-slate-700">
                أنت غير متصل
              </p>
              <p className="text-[10px] font-medium text-slate-400">
                اضغط اتصال بالأعلى لعرض الرحلات المتاحة
              </p>
            </CardContent>
          </Card>
        ) : available.length === 0 ? (
          <Card className="rounded-2xl border-dashed border-slate-300 bg-white">
            <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
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
            {available.map((r) => (
              <Card
                key={r.id}
                className="rounded-2xl border-slate-200 shadow-sm transition hover:border-teal-300 hover:shadow-md"
              >
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-slate-800">
                        {r.id} · {r.riderName}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[9px] font-medium text-slate-400">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {r.riderRating} · {timeAgo(r.requestedAt)}
                      </p>
                    </div>
                    <div className="shrink-0 text-end">
                      <p className="font-serif text-base font-bold text-teal-700">
                        {formatEgp(r.fare)}
                      </p>
                      <p className="text-[9px] font-medium text-slate-400">
                        {r.distanceKm} كم · {r.minutes} د
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 rounded-xl bg-slate-50 p-2.5">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-teal-600" />
                      <p className="text-[10px] font-semibold text-slate-600">
                        {r.from}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Flag className="mt-0.5 h-3 w-3 shrink-0 text-rose-500" />
                      <p className="text-[10px] font-semibold text-slate-600">
                        {r.to}
                      </p>
                    </div>
                  </div>

                  <Button
                    className="h-10 w-full rounded-xl bg-teal-600 text-xs font-bold text-white hover:bg-teal-700"
                    onClick={() => accept(r.id)}
                  >
                    <BadgeCheck className="me-1 h-4 w-4" />
                    قبول الرحلة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;