import { useMemo, useState } from "react";
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Session } from "@/lib/auth";
import { TermsDialog } from "@/components/TermsDialog";
import { PrivacyDialog } from "@/components/PrivacyDialog";

export function CustomerLogin({
  onLogin,
  onSignup,
}: {
  onLogin: (session: Session) => void;
  onSignup: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);

  const errors = useMemo(() => {
    const e: { phone?: string; password?: string } = {};
    if (!/^01[0-9]{9}$/.test(phone.trim()))
      e.phone = "رقم موبايل مصري غير صحيح (١١ رقم يبدأ بـ 01)";
    if (password.length < 6) e.password = "كلمة المرور ٦ أحرف على الأقل";
    return e;
  }, [phone, password]);

  const valid = Object.keys(errors).length === 0;

  function submit() {
    setTouched(true);
    if (!valid || busy) return;
    setBusy(true);
    window.setTimeout(() => {
      onLogin({
        role: "customer",
        name: "أحمد محمود",
        phone: phone.trim(),
        email: "ahmed@example.com",
      });
    }, 650);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="overflow-hidden rounded-2xl border-emerald-100 bg-white shadow-sm lg:col-span-3">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-6 py-5 text-white">
          <p className="text-xs font-medium uppercase tracking-widest text-emerald-100">
            مرحباً بعودتك
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold">تسجيل دخول العميل</h2>
          <p className="mt-1 text-sm text-emerald-100/90">
            ادخل برقم موبايلك وكلمة المرور للمتابعة.
          </p>
        </div>

        <CardContent className="space-y-5 p-6">
          <div className="space-y-2">
            <Label htmlFor="login-phone" className="text-sm font-medium text-slate-700">
              رقم الموبايل
            </Label>
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl border bg-slate-50 px-4 py-2.5 transition focus-within:bg-white",
                touched && errors.phone
                  ? "border-rose-300 focus-within:border-rose-400"
                  : "border-slate-200 focus-within:border-emerald-400",
              )}
            >
              <Phone className="size-4 shrink-0 text-slate-400" />
              <Input
                id="login-phone"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 11))}
                placeholder="01xxxxxxxxx"
                className="h-7 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
              />
            </div>
            {touched && errors.phone && (
              <p className="text-xs text-rose-600">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-pass" className="text-sm font-medium text-slate-700">
                كلمة المرور
              </Label>
              <button
                type="button"
                className="text-xs font-medium text-emerald-700 transition hover:text-emerald-800"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl border bg-slate-50 px-4 py-2.5 transition focus-within:bg-white",
                touched && errors.password
                  ? "border-rose-300 focus-within:border-rose-400"
                  : "border-slate-200 focus-within:border-emerald-400",
              )}
            >
              <Lock className="size-4 shrink-0 text-slate-400" />
              <Input
                id="login-pass"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-7 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="text-slate-400 transition hover:text-slate-600"
                aria-label="إظهار كلمة المرور"
              >
                {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {touched && errors.password && (
              <p className="text-xs text-rose-600">{errors.password}</p>
            )}
          </div>

          <Button
            disabled={busy}
            onClick={submit}
            className="h-12 w-full rounded-xl bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700"
          >
            {busy ? "جاري الدخول..." : "دخول"}
            {!busy && <ArrowLeft className="ms-2 size-5" />}
          </Button>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-muted-foreground">أو</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <Button
            variant="outline"
            onClick={onSignup}
            className="h-11 w-full rounded-xl border-slate-200 font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
          >
            <UserPlus className="me-2 size-4" />
            إنشاء حساب عميل جديد
          </Button>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            بالدخول، إنت بتوافق على{" "}
            <TermsDialog>
              <button
                type="button"
                className="font-medium text-emerald-700 underline decoration-emerald-300 underline-offset-4 transition hover:text-emerald-800"
              >
                شروط الاستخدام
              </button>
            </TermsDialog>{" "}
            و{" "}
            <PrivacyDialog>
              <button
                type="button"
                className="font-medium text-emerald-700 underline decoration-emerald-300 underline-offset-4 transition hover:text-emerald-800"
              >
                سياسة الخصوصية
              </button>
            </PrivacyDialog>
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6 lg:col-span-2">
        <Card className="rounded-2xl border-slate-200 bg-slate-900 text-white shadow-md">
          <CardContent className="p-6">
            <Sparkles className="size-6 text-emerald-400" />
            <p className="mt-3 font-serif text-xl font-bold">أهلاً فيك من تاني</p>
            <p className="mt-2 text-sm text-slate-300">
              كل رحلاتك ومحفظتك وكودات الخصم في مكان واحد.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              {[
                { v: "٤.٩", l: "تقييم" },
                { v: "٢ د", l: "متوسط الوصول" },
                { v: "٢٤/٧", l: "دعم" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl bg-white/5 px-2 py-3">
                  <p className="text-lg font-bold text-emerald-400">{s.v}</p>
                  <p className="text-xs text-slate-400">{s.l}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-emerald-100 bg-emerald-50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-200 text-emerald-800">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-emerald-900">دخول آمن</p>
                <p className="mt-1 text-sm text-emerald-800/80">
                  بنستخدم تشفير كامل لبياناتك، ومش بنشارك رقمك مع أي طرف تالت.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}