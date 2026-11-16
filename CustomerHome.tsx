import { useEffect, useState } from "react";
import {
  LogOut,
  Wallet,
  MapPin,
  Clock,
  History,
  User,
  Phone,
  Mail,
  CalendarClock,
  ShieldCheck,
  Car,
  Home,
  CircleUser,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatLoginTime, loadLastLogin, type Session } from "@/lib/auth";
import { RequestRide } from "@/components/RequestRide";
import { DriverPartner } from "@/components/DriverPartner";

type Tab = "home" | "ride" | "driver";

export function CustomerHome({
  session,
  onLogout,
}: {
  session: Session;
  onLogout: () => void;
}) {
  const [lastLogin, setLastLogin] = useState<Session | null>(null);
  const [tab, setTab] = useState<Tab>("home");
  const [wallet, setWallet] = useState(245);

  useEffect(() => {
    setLastLogin(loadLastLogin());
  }, [session]);

  const initials = session.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
    { id: "home", label: "الرئيسية", icon: Home },
    { id: "ride", label: "اطلب رحلة", icon: Car },
    { id: "driver", label: "الشريك السائق", icon: CircleUser },
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-2xl border-emerald-100 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-6 py-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-14 border-2 border-white/30">
                <AvatarFallback className="bg-white/15 text-lg font-bold text-white">
                  {initials || "ع"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-emerald-100/90">أهلاً بيك من تاني</p>
                <h2 className="font-serif text-2xl font-bold">{session.name}</h2>
                <p className="mt-0.5 text-sm text-emerald-100/90" dir="ltr">
                  {session.phone}
                </p>
              </div>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <LogOut className="me-2 size-4" />
              تسجيل خروج
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "bg-white/10 text-white hover:bg-white/20",
                  )}
                >
                  <Icon className="size-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Wallet className="size-4" />
              <span className="text-xs font-medium">رصيد المحفظة</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {wallet} <span className="text-sm font-medium text-muted-foreground">ج.م</span>
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="size-4" />
              <span className="text-xs font-medium">عدد الرحلات</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">١٨</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <Clock className="size-4" />
              <span className="text-xs font-medium">آخر تسجيل دخول</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-emerald-900">
              {formatLoginTime(session.loggedInAt)}
            </p>
          </div>
        </CardContent>
      </Card>

      {tab === "ride" && (
        <RequestRide wallet={wallet} onWalletChange={setWallet} />
      )}

      {tab === "driver" && <DriverPartner onBack={() => setTab("home")} />}

      {tab === "home" && (
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm lg:col-span-3">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <History className="size-5 text-emerald-600" />
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  سجل آخر تسجيل دخول
                </h3>
              </div>
              <Separator className="my-4" />

              {lastLogin ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                        <CalendarClock className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {formatLoginTime(lastLogin.loggedInAt)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          تم الحفظ تلقائياً على هذا الجهاز
                        </p>
                      </div>
                    </div>
                    <Badge className="rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                      ناجح
                    </Badge>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                      <User className="size-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">الاسم</p>
                        <p className="text-sm font-medium text-slate-800">
                          {lastLogin.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                      <Phone className="size-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">الموبايل</p>
                        <p className="text-sm font-medium text-slate-800" dir="ltr">
                          {lastLogin.phone}
                        </p>
                      </div>
                    </div>
                    {lastLogin.email && (
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 sm:col-span-2">
                        <Mail className="size-4 text-slate-400" />
                        <div>
                          <p className="text-xs text-muted-foreground">البريد الإلكتروني</p>
                          <p className="text-sm font-medium text-slate-800" dir="ltr">
                            {lastLogin.email}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                  <History className="mx-auto size-8 text-slate-300" />
                  <p className="mt-3 text-sm font-medium text-slate-600">
                    مفيش سجل تسجيل دخول سابق
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    أول تسجيل دخول ليك هيتحفظ هنا تلقائياً.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6 lg:col-span-2">
            <Card className="rounded-2xl border-emerald-100 bg-emerald-50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-200 text-emerald-800">
                    <ShieldCheck className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-emerald-900">
                      جلستك محفوظة بأمان
                    </p>
                    <p className="mt-1 text-sm text-emerald-800/80">
                      بنحفظ آخر تسجيل دخول على جهازك بس، ومش بنرفعه لأي سيرفر خارجي.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200 bg-slate-900 text-white shadow-md">
              <CardContent className="p-6">
                <p className="font-serif text-lg font-bold">رحلتك الجاية</p>
                <p className="mt-2 text-sm text-slate-300">
                  اطلب رحلة جديدة وسائقك هيوصل خلال دقايق.
                </p>
                <Button
                  onClick={() => setTab("ride")}
                  className="mt-4 w-full rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
                >
                  <MapPin className="me-2 size-4" />
                  اطلب رحلة
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-amber-100 bg-amber-50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-800">
                    <Car className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-amber-900">
                      عندك عربية؟ ابقى شريك سائق
                    </p>
                    <p className="mt-1 text-sm text-amber-800/80">
                      انضم لفريق السائقين وابدأ تكسب من أول يوم.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setTab("driver")}
                  className="mt-4 w-full rounded-xl bg-amber-600 font-semibold text-white hover:bg-amber-700"
                >
                  <Car className="me-2 size-4" />
                  بوابة الشريك السائق
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}