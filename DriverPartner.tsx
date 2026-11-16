import { useState } from "react";
import {
  Car,
  Wallet,
  Star,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Users,
  Power,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const TRIPS = [
  { id: "R-4821", from: "وسط البلد", to: "مدينة نصر", price: 62, time: "منذ ١٢ دقيقة" },
  { id: "R-4790", from: "المعادي", to: "الزمالك", price: 48, time: "منذ ساعة" },
  { id: "R-4755", from: "٦ أكتوبر", to: "الشيخ زايد", price: 55, time: "منذ ٣ ساعات" },
];

const REQUESTS = [
  { id: "R-4902", from: "الزمالك", to: "مطار القاهرة", price: 118, distance: "٢٤ كم" },
  { id: "R-4903", from: "مدينة نصر", to: "المعادي", price: 74, distance: "١٥ كم" },
];

export function DriverPartner({ onBack }: { onBack: () => void }) {
  const [online, setOnline] = useState(true);
  const [accepted, setAccepted] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-2xl border-amber-100 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 px-6 py-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-white/15">
                <Car className="size-7" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-amber-100">
                  بوابة الشريك
                </p>
                <h2 className="mt-0.5 font-serif text-2xl font-bold">
                  لوحة السائق
                </h2>
                <p className="mt-0.5 text-sm text-amber-100/90">
                  محمود سيد · تويوتا كورولا
                </p>
              </div>
            </div>
            <Button
              onClick={onBack}
              variant="outline"
              className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <ArrowRight className="me-2 size-4" />
              رجوع للرئيسية
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2.5">
              <Power className={cn("size-4", online ? "text-emerald-300" : "text-amber-100")} />
              <span className="text-sm font-medium">
                {online ? "متصل · بتستقبل طلبات" : "غير متصل"}
              </span>
              <Switch
                checked={online}
                onCheckedChange={setOnline}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
            <Badge className="rounded-full bg-white/15 text-white hover:bg-white/15">
              <Star className="me-1 size-3.5 fill-amber-300 text-amber-300" />
              4.9 تقييم
            </Badge>
          </div>
        </div>

        <CardContent className="grid gap-4 p-6 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Wallet className="size-4" />
              <span className="text-xs font-medium">أرباح اليوم</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              ٤٨٥ <span className="text-sm font-medium text-muted-foreground">ج.م</span>
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Car className="size-4" />
              <span className="text-xs font-medium">رحلات اليوم</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">٩</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="size-4" />
              <span className="text-xs font-medium">ساعات العمل</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">٦.٥</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <TrendingUp className="size-4" />
              <span className="text-xs font-medium">نسبة القبول</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-900">٩٤٪</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm lg:col-span-3">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-amber-600" />
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  طلبات قريبة منك
                </h3>
              </div>
              <Badge className="rounded-full bg-amber-100 text-amber-800 hover:bg-amber-100">
                {online ? "متاح" : "متوقف"}
              </Badge>
            </div>
            <Separator className="my-4" />

            {!online ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <Power className="mx-auto size-8 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-600">
                  أنت غير متصل حالياً
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  فعّل الاتصال عشان تستقبل طلبات جديدة.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {REQUESTS.map((r) => {
                  const isAccepted = accepted === r.id;
                  return (
                    <div
                      key={r.id}
                      className={cn(
                        "rounded-xl border p-4 transition",
                        isAccepted
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-amber-50/50",
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full bg-amber-500" />
                            <p className="text-sm font-semibold text-slate-800">
                              {r.from}
                            </p>
                          </div>
                          <div className="my-1 ms-1 h-3 border-s border-dashed border-slate-300" />
                          <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full bg-teal-600" />
                            <p className="text-sm font-semibold text-slate-800">
                              {r.to}
                            </p>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground" dir="ltr">
                            {r.id} · {r.distance}
                          </p>
                        </div>
                        <div className="text-end">
                          <p className="text-xl font-bold text-amber-700">
                            {r.price} <span className="text-sm">ج.م</span>
                          </p>
                          <Button
                            size="sm"
                            disabled={isAccepted}
                            onClick={() => setAccepted(r.id)}
                            className={cn(
                              "mt-2 rounded-xl font-semibold",
                              isAccepted
                                ? "bg-emerald-600 text-white hover:bg-emerald-600"
                                : "bg-slate-900 text-white hover:bg-slate-800",
                            )}
                          >
                            {isAccepted ? (
                              <>
                                <CheckCircle2 className="me-1.5 size-4" />
                                تم القبول
                              </>
                            ) : (
                              "اقبل الرحلة"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="size-5 text-amber-600" />
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  آخر الرحلات
                </h3>
              </div>
              <Separator className="my-4" />
              <div className="space-y-3">
                {TRIPS.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {t.from} ← {t.to}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.time}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-emerald-700">
                      {t.price} ج.م
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-amber-100 bg-amber-50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-800">
                  <ShieldCheck className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-amber-900">حسابك موثّق</p>
                  <p className="mt-1 text-sm text-amber-800/80">
                    مستنداتك مكتملة وبتستقبل رحلات بدون قيود.
                  </p>
                </div>
              </div>
              <Separator className="my-4 bg-amber-200" />
              <div className="flex items-center gap-3 text-sm text-amber-900">
                <Users className="size-4" />
                <span>٤٢ راكب قيّموك بإيجابية</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}