import { useMemo, useState } from "react";
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Session } from "@/lib/auth";
import { TermsDialog } from "@/components/TermsDialog";
import { PrivacyDialog } from "@/components/PrivacyDialog";

export function CustomerSignup({
  onCreated,
}: {
  onCreated: (session: Session) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (name.trim().length < 3) e.name = "الاسم ٣ أحرف على الأقل";
    if (!/^01[0-9]{9}$/.test(phone.trim()))
      e.phone = "رقم موبايل مصري غير صحيح (١١ رقم يبدأ بـ 01)";
    if (email && !/^\S+@\S+\.\S+$/.test(email.trim()))
      e.email = "البريد الإلكتروني غير صحيح";
    if (password.length < 6) e.password = "كلمة المرور ٦ أحرف على الأقل";
    if (!agree) e.agree = "لازم توافق على الشروط وسياسة الخصوصية";
    return e;
  }, [name, phone, email, password, agree]);

  const valid = Object.keys(errors).length === 0;

  function submit() {
    setTouched(true);
    if (!valid || busy) return;
    setBusy(true);
    window.setTimeout(() => {
      onCreated({
        role: "customer",
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
      });
    }, 700);
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
            خطوة واحدة وتبدأ
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold">إنشاء حساب عميل</h2>
          <p className="mt-1 text-sm text-emerald-100/90">
            املأ بياناتك وهنفعّل حسابك على طول.
          </p>
        </div>

        <CardContent className="space-y-5 p-6">
          <div className="space-y-2">
            <Label htmlFor="su-name" className="text-sm font-medium text-slate-700">
              الاسم بالكامل
            </Label>
            <div className={fieldBox(touched && !!errors.name)}>
              <User className="size-4 shrink-0 text-slate-400" />
              <Input
                id="su-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: أحمد محمود"
                className="h-7 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
              />
            </div>
            {touched && errors.name && (
              <p className="text-xs text-rose-600">{errors.name}</p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="su-phone" className="text-sm font-medium text-slate-700">
                رقم الموبايل
              </Label>
              <div className={fieldBox(touched && !!errors.phone)}>
                <Phone className="size-4 shrink-0 text-slate-400" />
                <Input
                  id="su-phone"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 11))
                  }
                  placeholder="01xxxxxxxxx"
                  className="h-7 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                />
              </div>
              {touched && errors.phone && (
                <p className="text-xs text-rose-600">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="su-email" className="text-sm font-medium text-slate-700">
                البريد الإلكتروني <span className="text-slate-400">(اختياري)</span>
              </Label>
              <div className={fieldBox(touched && !!errors.email)}>
                <Mail className="size-4 shrink-0 text-slate-400" />
                <Input
                  id="su-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="h-7 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                />
              </div>
              {touched && errors.email && (
                <p className="text-xs text-rose-600">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="su-pass" className="text-sm font-medium text-slate-700">
              كلمة المرور
            </Label>
            <div className={fieldBox(touched && !!errors.password)}>
              <Lock className="size-4 shrink-0 text-slate-400" />
              <Input
                id="su-pass"
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

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox
                checked={agree}
                onCheckedChange={(v) => setAgree(v === true)}
                className="mt-0.5 data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600"
              />
              <span className="text-sm leading-relaxed text-slate-600">
                أوافق على{" "}
                <TermsDialog>
                  <button
                    type="button"
                    className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 transition hover:text-emerald-800"
                  >
                    شروط الاستخدام
                  </button>
                </TermsDialog>{" "}
                و{" "}
                <PrivacyDialog>
                  <button
                    type="button"
                    className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 transition hover:text-emerald-800"
                  >
                    سياسة الخصوصية
                  </button>
                </PrivacyDialog>
              </span>
            </label>
            {touched && errors.agree && (
              <p className="mt-2 text-xs text-rose-600">{errors.agree}</p>
            )}
          </div>

          <Button
            disabled={busy}
            onClick={submit}
            className="h-12 w-full rounded-xl bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700"
          >
            {busy ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
            {!busy && <ArrowLeft className="ms-2 size-5" />}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6 lg:col-span-2">
        <Card className="rounded-2xl border-slate-200 bg-slate-900 text-white shadow-md">
          <CardContent className="p-6">
            <CheckCircle2 className="size-6 text-emerald-400" />
            <p className="mt-3 font-serif text-xl font-bold">مميزات حسابك</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {[
                "محفظة إلكترونية وكودات خصم",
                "تتبع الرحلة لحظة بلحظة",
                "دعم فني على مدار الساعة",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-emerald-100 bg-emerald-50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-200 text-emerald-800">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-emerald-900">بياناتك في أمان</p>
                <p className="mt-1 text-sm text-emerald-800/80">
                  بنستخدم تشفير كامل ومش بنشارك بياناتك مع أي طرف تالت.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <FileText className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-slate-800">قبل ما تسجّل</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  راجع شروط الاستخدام وسياسة الخصوصية من الروابط في الفورم.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}