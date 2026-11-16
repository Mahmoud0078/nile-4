import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PasswordField } from "@/components/PasswordField";
import { cn } from "@/lib/utils";
import { hapticTap } from "@/lib/platform";
import { isValidPhone, maskPhone, normalizePhone } from "@/lib/auth";
import {
  DEMO_ACCOUNTS,
  DEMO_PASSWORD,
  findAccount,
  initialsOf,
  roleLabel,
  type Account,
} from "@/lib/session";
import {
  ArrowLeft,
  Car,
  KeyRound,
  Phone,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

export function LoginScreen({
  onLogin,
  onSignup,
}: {
  onLogin: (account: Account) => void;
  onSignup: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function attemptLogin() {
    if (!isValidPhone(phone)) {
      setError("أدخل رقم موبايل مصري صحيح (مثال: 01012345678)");
      return;
    }
    if (password.length < 6) {
      setError("كلمة المرور ٦ أحرف على الأقل");
      return;
    }
    const account = findAccount(phone);
    if (!account) {
      setError("لا يوجد حساب بهذا الرقم. أنشئ حساباً جديداً.");
      return;
    }
    if (account.password !== password) {
      setError("كلمة المرور غير صحيحة");
      return;
    }
    hapticTap();
    setError("");
    onLogin(account);
  }

  function quickLogin(account: Account) {
    hapticTap();
    setError("");
    onLogin(account);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-md px-4 py-6">
        <div className="mb-5 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
            <Car className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">مشوار</p>
            <p className="text-[10px] font-medium text-slate-500">
              تسجيل الدخول
            </p>
          </div>
        </div>

        <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-l from-teal-50 to-white px-5 py-4">
            <h1 className="font-serif text-xl font-bold text-slate-900">
              أهلاً بعودتك
            </h1>
            <p className="mt-1 text-xs font-medium text-slate-500">
              سجّل الدخول لمتابعة رحلاتك وأرباحك
            </p>
          </div>

          <CardContent className="space-y-4 p-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">
                رقم الموبايل
              </Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-slate-400" />
                <Input
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => {
                    setPhone(normalizePhone(e.target.value));
                    setError("");
                  }}
                  placeholder="01012345678"
                  className="h-11 rounded-xl border-slate-200 ps-9 text-sm font-bold tracking-wide"
                />
              </div>
            </div>

            <PasswordField
              id="login-password"
              label="كلمة المرور"
              value={password}
              onChange={(v) => {
                setPassword(v);
                setError("");
              }}
              hint="اضغط العين للإظهار"
            />

            <Button
              className="h-11 w-full rounded-xl bg-teal-600 text-sm font-bold text-white hover:bg-teal-700"
              onClick={attemptLogin}
            >
              تسجيل الدخول
              <ArrowLeft className="ms-1 h-4 w-4" />
            </Button>

            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5">
                <p className="text-[10px] font-bold text-rose-700">{error}</p>
              </div>
            ) : null}

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] font-bold text-slate-400">
                دخول سريع للتجربة
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => quickLogin(account)}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-start transition hover:border-teal-300 hover:bg-teal-50 active:scale-95"
                >
                  <Avatar className="h-9 w-9 border border-slate-200">
                    <AvatarFallback className="bg-teal-100 text-[11px] font-bold text-teal-700">
                      {initialsOf(account.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {account.fullName}
                    </p>
                    <p className="text-[10px] font-medium text-slate-500">
                      {maskPhone(account.phone)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold",
                      account.role === "captain"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-teal-100 text-teal-700",
                    )}
                  >
                    {roleLabel(account.role)}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <KeyRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
              <p className="text-[10px] font-semibold leading-relaxed text-slate-600">
                كلمة المرور التجريبية لكل الحسابات:{" "}
                <span className="font-bold text-slate-900">{DEMO_PASSWORD}</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              <p className="text-[10px] font-medium text-slate-500">
                ليس لديك حساب؟
              </p>
              <button
                type="button"
                onClick={() => {
                  hapticTap();
                  onSignup();
                }}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 hover:underline"
              >
                <UserPlus className="h-3.5 w-3.5" />
                إنشاء حساب جديد
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default LoginScreen;