import { useMemo, useState } from "react";
import {
  MapPin,
  Navigation,
  Car,
  Clock,
  Wallet,
  CheckCircle2,
  Loader2,
  X,
  Star,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Stage = "form" | "searching" | "matched" | "done";

type Ride = {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  price: number;
  etaMin: number;
  driver: { name: string; car: string; plate: string; rating: number };
};

const DRIVERS = [
  { name: "محمود سيد", car: "تويوتا كورولا · أبيض", plate: "ر ط ب ٤٢٧", rating: 4.9 },
  { name: "كريم عبد الله", car: "هيونداي إلنترا · رمادي", plate: "س ن م ١٨٣", rating: 4.8 },
  { name: "حسام فتحي", car: "نيسان صني · فضي", plate: "ق ل ه ٩٠٥", rating: 4.7 },
];

const PLACES = [
  "وسط البلد، القاهرة",
  "مدينة نصر، القاهرة",
  "المعادي، القاهرة",
  "الزمالك، القاهرة",
  "٦ أكتوبر، الجيزة",
  "الشيخ زايد، الجيزة",
  "مطار القاهرة الدولي",
];

export function RequestRide({
  wallet,
  onWalletChange,
}: {
  wallet: number;
  onWalletChange: (next: number) => void;
}) {
  const [stage, setStage] = useState<Stage>("form");
  const [from, setFrom] = useState("وسط البلد، القاهرة");
  const [to, setTo] = useState("مدينة نصر، القاهرة");
  const [ride, setRide] = useState<Ride | null>(null);
  const [touched, setTouched] = useState(false);

  const errors = useMemo(() => {
    const e: { from?: string; to?: string } = {};
    if (from.trim().length < 3) e.from = "اكتب مكان الانطلاق";
    if (to.trim().length < 3) e.to = "اكتب مكان الوصول";
    if (from.trim() && from.trim() === to.trim())
      e.to = "مكان الوصول لازم يختلف عن الانطلاق";
    return e;
  }, [from, to]);

  const valid = Object.keys(errors).length === 0;

  const estimate = useMemo(() => {
    const seed = (from.length * 7 + to.length * 13) % 9;
    const distanceKm = 4 + seed;
    const price = 18 + distanceKm * 6;
    const etaMin = 3 + (seed % 5);
    return { distanceKm, price, etaMin };
  }, [from, to]);

  function requestRide() {
    setTouched(true);
    if (!valid) return;
    setStage("searching");
    window.setTimeout(() => {
      const driver = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
      setRide({
        id: `R-${Math.floor(1000 + Math.random() * 9000)}`,
        from: from.trim(),
        to: to.trim(),
        distanceKm: estimate.distanceKm,
        price: estimate.price,
        etaMin: estimate.etaMin,
        driver,
      });
      setStage("matched");
    }, 1800);
  }

  function completeRide() {
    if (!ride) return;
    onWalletChange(wallet - ride.price);
    setStage("done");
  }

  function reset() {
    setStage("form");
    setRide(null);
    setTouched(false);
  }

  const fieldBox = (bad: boolean) =>
    cn(
      "flex items-center gap-3 rounded-xl border bg-slate-50 px-4 py-2.5 transition focus-within:bg-white",
      bad
        ? "border-rose-300 focus-within:border-rose-400"
        : "border-slate-200 focus-within:border-emerald-400",
    );

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="overflow-hidden rounded-2xl border-emerald-100 bg-white shadow-sm lg:col-span-3">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-6 py-5 text-white">
          <p className="text-xs font-medium uppercase tracking-widest text-emerald-100">
            اطلب رحلتك
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold">فين رايح؟</h2>
          <p className="mt-1 text-sm text-emerald-100/90">
            حدد مكان الانطلاق والوصول وهنجيبلك أقرب سائق.
          </p>
        </div>

        <CardContent className="space-y-5 p-6">
          {stage === "form" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="ride-from" className="text-sm font-medium text-slate-700">
                  مكان الانطلاق
                </Label>
                <div className={fieldBox(touched && !!errors.from)}>
                  <MapPin className="size-4 shrink-0 text-emerald-600" />
                  <Input
                    id="ride-from"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="اكتب مكان الانطلاق"
                    className="h-7 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                  />
                </div>
                {touched && errors.from && (
                  <p className="text-xs text-rose-600">{errors.from}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ride-to" className="text-sm font-medium text-slate-700">
                  مكان الوصول
                </Label>
                <div className={fieldBox(touched && !!errors.to)}>
                  <Navigation className="size-4 shrink-0 text-teal-600" />
                  <Input
                    id="ride-to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="اكتب مكان الوصول"
                    className="h-7 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                  />
                </div>
                {touched && errors.to && (
                  <p className="text-xs text-rose-600">{errors.to}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {PLACES.slice(0, 4).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTo(p)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Car className="size-4" />
                    <span className="text-xs font-medium">المسافة</span>
                  </div>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {estimate.distanceKm} <span className="text-xs text-muted-foreground">كم</span>
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="size-4" />
                    <span className="text-xs font-medium">الوصول</span>
                  </div>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {estimate.etaMin} <span className="text-xs text-muted-foreground">دقيقة</span>
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Wallet className="size-4" />
                    <span className="text-xs font-medium">السعر التقديري</span>
                  </div>
                  <p className="mt-2 text-lg font-bold text-emerald-900">
                    {estimate.price} <span className="text-xs">ج.م</span>
                  </p>
                </div>
              </div>

              <Button
                onClick={requestRide}
                className="h-12 w-full rounded-xl bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700"
              >
                <Car className="me-2 size-5" />
                اطلب الرحلة
              </Button>
            </>
          )}

          {stage === "searching" && (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <span className="relative flex size-20 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-200/60" />
                <span className="relative flex size-16 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Loader2 className="size-7 animate-spin" />
                </span>
              </span>
              <p className="mt-6 font-serif text-xl font-bold text-slate-900">
                بندور على أقرب سائق...
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                من {from} إلى {to}
              </p>
              <Button
                variant="outline"
                onClick={reset}
                className="mt-6 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <X className="me-2 size-4" />
                إلغاء الطلب
              </Button>
            </div>
          )}

          {stage === "matched" && ride && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <CheckCircle2 className="size-5 text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-900">
                  تم قبول طلبك! السائق في الطريق إليك.
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <Avatar className="size-14 border-2 border-emerald-100">
                  <AvatarFallback className="bg-emerald-100 text-lg font-bold text-emerald-800">
                    {ride.driver.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{ride.driver.name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {ride.driver.car}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100" dir="ltr">
                      {ride.driver.plate}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                      <Star className="size-3.5 fill-amber-500 text-amber-500" />
                      {ride.driver.rating}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  aria-label="اتصال بالسائق"
                >
                  <Phone className="size-4" />
                </Button>
              </div>

              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-1 size-2.5 shrink-0 rounded-full bg-emerald-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">من</p>
                    <p className="text-sm font-medium text-slate-800">{ride.from}</p>
                  </div>
                </div>
                <div className="ms-1 h-4 border-s border-dashed border-slate-300" />
                <div className="flex items-start gap-3">
                  <span className="mt-1 size-2.5 shrink-0 rounded-full bg-teal-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">إلى</p>
                    <p className="text-sm font-medium text-slate-800">{ride.to}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">رقم الرحلة</p>
                  <p className="text-sm font-semibold text-slate-800" dir="ltr">
                    {ride.id}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-xs text-muted-foreground">الإجمالي</p>
                  <p className="text-xl font-bold text-emerald-700">
                    {ride.price} <span className="text-sm">ج.م</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={completeRide}
                  className="h-12 flex-1 rounded-xl bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700"
                >
                  <CheckCircle2 className="me-2 size-5" />
                  وصلت · ادفع من المحفظة
                </Button>
                <Button
                  variant="outline"
                  onClick={reset}
                  className="h-12 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}

          {stage === "done" && ride && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="size-8" />
              </span>
              <p className="mt-5 font-serif text-2xl font-bold text-slate-900">
                رحلة سعيدة!
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                تم خصم {ride.price} ج.م من محفظتك.
              </p>
              <div className="mt-6 w-full max-w-xs rounded-xl border border-slate-200 bg-slate-50 p-4 text-start">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">الرصيد الحالي</span>
                  <span className="font-bold text-slate-900">{wallet} ج.م</span>
                </div>
              </div>
              <Button
                onClick={reset}
                className="mt-6 h-11 rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
              >
                اطلب رحلة جديدة
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6 lg:col-span-2">
        <Card className="rounded-2xl border-slate-200 bg-slate-900 text-white shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Wallet className="size-4" />
              <span className="text-xs font-medium">محفظتك</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {wallet} <span className="text-base font-medium text-slate-400">ج.م</span>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              الرصيد بيتخصم تلقائياً بعد كل رحلة.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-emerald-100 bg-emerald-50 shadow-sm">
          <CardContent className="p-6">
            <p className="font-semibold text-emerald-900">ليه تطلب من عندنا؟</p>
            <ul className="mt-3 space-y-2 text-sm text-emerald-800/80">
              {[
                "أسعار واضحة قبل تأكيد الرحلة",
                "سائقين موثّقين بتقييمات حقيقية",
                "دعم فني على مدار الساعة",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}