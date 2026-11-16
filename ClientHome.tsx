import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { hapticTap } from "@/lib/platform";
import {
  KIND_ICON,
  KIND_LABEL,
  estimateFare,
  estimateMinutes,
  formatEgp,
  makeOrderId,
  timeAgo,
  type DeliveryKind,
  type DeliveryOrder,
} from "@/lib/rides";
import type { SignupDraft } from "@/lib/auth";
import {
  BadgeCheck,
  Car,
  Clock3,
  Flag,
  LogOut,
  MapPin,
  Navigation,
  Package,
  Plus,
  Star,
  UtensilsCrossed,
} from "lucide-react";

const KIND_TABS: { kind: DeliveryKind; icon: typeof Car }[] = [
  { kind: "ride", icon: Car },
  { kind: "parcel", icon: Package },
  { kind: "food", icon: UtensilsCrossed },
];

const QUICK_PLACES = [
  "وسط البلد — التحرير",
  "مطار القاهرة الدولي",
  "سيتي ستارز مول",
  "المعادي — كورنيش النيل",
];

export function ClientHome({
  draft,
  onLogout,
  onOpenPartner,
}: {
  draft: SignupDraft;
  onLogout: () => void;
  onOpenPartner: () => void;
}) {
  const [kind, setKind] = useState<DeliveryKind>("ride");
  const [from, setFrom] = useState("موقعي الحالي — الزمالك");
  const [to, setTo] = useState("");
  const [note, setNote] = useState("");
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [error, setError] = useState("");

  const distanceKm = useMemo(() => {
    const seed = (from.length + to.length) % 9;
    return Number((4.5 + seed * 1.7).toFixed(1));
  }, [from, to]);

  const fare = estimateFare(kind, distanceKm);
  const minutes = estimateMinutes(distanceKm);
  const active = orders.find((o) => o.status !== "done");

  function submit() {
    if (to.trim().length < 3) {
      setError("اكتب عنوان الوصول أولًا");
      return;
    }
    setError("");
    hapticTap();
    setOrders((prev) => [
      {
        id: makeOrderId(),
        kind,
        from: from.trim(),
        to: to.trim(),
        distanceKm,
        minutes,
        fare,
        note: note.trim(),
        createdAt: Date.now(),
        status: "available",
      },
      ...prev,
    ]);
    setTo("");
    setNote("");
  }

  function cancel(id: string) {
    hapticTap();
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-md px-4 py-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
            <Car className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900">مشوار</p>
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

        <Card className="mb-4 overflow-hidden rounded-2xl border-teal-200 shadow-sm">
          <div className="border-b border-teal-100 bg-gradient-to-l from-teal-600 to-teal-500 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                <Navigation className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="font-serif text-lg font-bold text-white">
                  اطلب توصيلك الآن
                </h1>
                <p className="text-[10px] font-medium text-teal-50">
                  مشوار · شحنة · طلب مطعم — خلال دقائق
                </p>
              </div>
              <BadgeCheck className="h-5 w-5 shrink-0 text-teal-50" />
            </div>
          </div>

          <CardContent className="space-y-4 p-5">
            <div className="grid grid-cols-3 gap-2">
              {KIND_TABS.map(({ kind: k, icon: Icon }) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    hapticTap();
                    setKind(k);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border p-3 transition",
                    kind === k
                      ? "border-teal-300 bg-teal-50 text-teal-800 shadow-sm"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[10px] font-bold">{KIND_LABEL[k]}</span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-600">
                  نقطة الانطلاق
                </Label>
                <div className="relative">
                  <MapPin className="absolute end-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-teal-600" />
                  <Input
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 pe-9 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-600">
                  عنوان الوصول
                </Label>
                <div className="relative">
                  <Flag className="absolute end-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-rose-500" />
                  <Input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="اكتب المكان اللي رايح له"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 pe-9 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {QUICK_PLACES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      hapticTap();
                      setTo(p);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-bold text-slate-600 transition hover:border-teal-300 hover:text-teal-700"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-600">
                  ملاحظات للسائق (اختياري)
                </Label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="مثال: عندي شنطتين، اتصل عند الوصول"
                  className="min-h-16 rounded-xl border-slate-200 bg-slate-50 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex-1">
                <p className="text-[9px] font-bold text-slate-500">
                  المسافة التقديرية
                </p>
                <p className="text-xs font-bold text-slate-800">
                  {distanceKm} كم · {minutes} دقيقة
                </p>
              </div>
              <div className="text-end">
                <p className="text-[9px] font-bold text-slate-500">
                  السعر التقديري
                </p>
                <p className="font-serif text-lg font-bold text-teal-700">
                  {formatEgp(fare)}
                </p>
              </div>
            </div>

            {error ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[10px] font-bold text-rose-700">
                {error}
              </p>
            ) : null}

            <Button
              className="h-11 w-full rounded-xl bg-teal-600 text-sm font-bold text-white hover:bg-teal-700"
              onClick={submit}
            >
              <Plus className="me-1 h-4 w-4" />
              اطلب {KIND_LABEL[kind]}
            </Button>
          </CardContent>
        </Card>

        {active ? (
          <Card className="mb-4 overflow-hidden rounded-2xl border-amber-300 bg-amber-50 shadow-sm">
            <div className="flex items-center justify-between border-b border-amber-200 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white">
                  <Clock3 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    جاري البحث عن سائق
                  </p>
                  <p className="text-[9px] font-medium text-slate-500">
                    {active.id} · {KIND_ICON[active.kind]} {KIND_LABEL[active.kind]}
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
              <Button
                variant="outline"
                className="h-10 w-full rounded-xl border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50"
                onClick={() => cancel(active.id)}
              >
                إلغاء الطلب
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <div className="mb-2 flex items-center justify-between px-1">
          <h3 className="font-serif text-base font-bold text-slate-900">
            طلباتي
          </h3>
          <span className="text-[10px] font-bold text-slate-400">
            {orders.length} طلب
          </span>
        </div>

        {orders.length === 0 ? (
          <Card className="rounded-2xl border-dashed border-slate-300 bg-white">
            <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <Package className="h-6 w-6" />
              </span>
              <p className="text-sm font-bold text-slate-700">
                لا توجد طلبات بعد
              </p>
              <p className="text-[10px] font-medium text-slate-400">
                املأ العنوان واضغط اطلب لتظهر طلباتك هنا
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2.5">
            {orders.map((o) => (
              <Card
                key={o.id}
                className="rounded-2xl border-slate-200 shadow-sm transition hover:border-teal-300 hover:shadow-md"
              >
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-slate-800">
                        {KIND_ICON[o.kind]} {KIND_LABEL[o.kind]} · {o.id}
                      </p>
                      <p className="mt-1 truncate text-[10px] font-semibold text-slate-500">
                        {o.from} ← {o.to}
                      </p>
                    </div>
                    <div className="shrink-0 text-end">
                      <p className="font-serif text-base font-bold text-teal-700">
                        {formatEgp(o.fare)}
                      </p>
                      <p className="text-[9px] font-medium text-slate-400">
                        {timeAgo(o.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                    <span className="rounded-lg bg-slate-100 px-2 py-1">
                      {o.distanceKm} كم
                    </span>
                    <span className="rounded-lg bg-slate-100 px-2 py-1">
                      {o.minutes} دقيقة
                    </span>
                    <span className="ms-auto flex items-center gap-1 text-slate-500">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      بانتظار سائق
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            hapticTap();
            onOpenPartner();
          }}
          className="mt-5 w-full rounded-2xl border border-slate-200 bg-white p-4 text-start shadow-sm transition hover:border-teal-300 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Car className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900">
                وضع شريك السائق
              </p>
              <p className="text-[10px] font-medium text-slate-500">
                استقبل الرحلات وابدأ التشغيل
              </p>
            </div>
            <span className="text-[10px] font-bold text-teal-700">
              فتح
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default ClientHome;