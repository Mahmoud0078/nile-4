import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordField } from "@/components/PasswordField";
import { DocumentUploader } from "@/components/DocumentUploader";
import { ReviewStatusCard } from "@/components/ReviewStatusCard";
import { cn } from "@/lib/utils";
import { hapticTap } from "@/lib/platform";
import { isValidPhone, normalizePhone } from "@/lib/auth";
import { docsProgress, missingDocs, type DocMap } from "@/lib/documents";
import { createSubmission, type ReviewSubmission } from "@/lib/review";
import type { SignupDraft } from "@/lib/auth";
import {
  ArrowLeft,
  Car,
  IdCard,
  ShieldCheck,
  UserRound,
} from "lucide-react";

type Step = "info" | "docs" | "review";

export function SignupScreen({
  onComplete,
}: {
  onComplete: (draft: SignupDraft) => void;
}) {
  const [step, setStep] = useState<Step>("info");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [docs, setDocs] = useState<DocMap>({});
  const [submission, setSubmission] = useState<ReviewSubmission | null>(null);
  const [error, setError] = useState("");

  const progress = docsProgress(docs);
  const missing = missingDocs(docs);

  function goDocs() {
    if (fullName.trim().length < 3) {
      setError("اكتب الاسم بالكامل (٣ أحرف على الأقل)");
      return;
    }
    if (!isValidPhone(phone)) {
      setError("أدخل رقم موبايل مصري صحيح (مثال: 01012345678)");
      return;
    }
    if (password.length < 6) {
      setError("كلمة المرور ٦ أحرف على الأقل");
      return;
    }
    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    hapticTap();
    setError("");
    setStep("docs");
  }

  function submitDocs() {
    if (missing.length > 0) {
      setError(`متبقي ${missing.length} صورة مطلوبة`);
      return;
    }
    hapticTap();
    setError("");
    setSubmission(createSubmission(docs));
    setStep("review");
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
              إنشاء حساب كابتن
            </p>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          {(
            [
              { id: "info", label: "البيانات", icon: UserRound },
              { id: "docs", label: "الأوراق", icon: IdCard },
              { id: "review", label: "المراجعة", icon: ShieldCheck },
            ] as const
          ).map((s, i) => {
            const active = step === s.id;
            const passed =
              (step === "docs" && i === 0) || (step === "review" && i < 2);
            return (
              <div key={s.id} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[10px] font-bold transition",
                    active
                      ? "bg-teal-600 text-white shadow-sm"
                      : passed
                        ? "bg-teal-100 text-teal-700"
                        : "bg-white text-slate-400",
                  )}
                >
                  <s.icon className="h-3.5 w-3.5" />
                  {s.label}
                </div>
                {i < 2 ? (
                  <span
                    className={cn(
                      "h-px flex-1",
                      passed ? "bg-teal-300" : "bg-slate-200",
                    )}
                  />
                ) : null}
              </div>
            );
          })}
        </div>

        {step === "info" ? (
          <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-l from-teal-50 to-white px-5 py-4">
              <h1 className="font-serif text-xl font-bold text-slate-900">
                بيانات الكابتن
              </h1>
              <p className="mt-1 text-xs font-medium text-slate-500">
                املأ بياناتك ثم ارفع الأوراق المطلوبة
              </p>
            </div>
            <CardContent className="space-y-4 p-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">
                  الاسم بالكامل
                </Label>
                <Input
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setError("");
                  }}
                  placeholder="محمد أحمد علي"
                  className="h-11 rounded-xl border-slate-200 text-sm font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">
                  رقم الموبايل
                </Label>
                <Input
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => {
                    setPhone(normalizePhone(e.target.value));
                    setError("");
                  }}
                  placeholder="01012345678"
                  className="h-11 rounded-xl border-slate-200 text-sm font-bold tracking-wide"
                />
              </div>

              <PasswordField
                id="signup-password"
                label="كلمة المرور"
                value={password}
                onChange={(v) => {
                  setPassword(v);
                  setError("");
                }}
                autoComplete="new-password"
                hint="٦ أحرف على الأقل"
              />

              <PasswordField
                id="signup-confirm"
                label="تأكيد كلمة المرور"
                value={confirm}
                onChange={(v) => {
                  setConfirm(v);
                  setError("");
                }}
                autoComplete="new-password"
              />

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5">
                  <p className="text-[10px] font-bold text-rose-700">{error}</p>
                </div>
              ) : null}

              <Button
                className="h-11 w-full rounded-xl bg-teal-600 text-sm font-bold text-white hover:bg-teal-700"
                onClick={goDocs}
              >
                التالي: رفع الأوراق
                <ArrowLeft className="ms-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {step === "docs" ? (
          <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-l from-teal-50 to-white px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-serif text-xl font-bold text-slate-900">
                    الأوراق المطلوبة
                  </h1>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    ارفع ٥ صور واضحة للمراجعة
                  </p>
                </div>
                <span className="rounded-xl bg-teal-100 px-2.5 py-1 text-[11px] font-bold text-teal-700">
                  {progress}%
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-teal-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <CardContent className="space-y-4 p-5">
              <DocumentUploader docs={docs} onChange={setDocs} />

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5">
                  <p className="text-[10px] font-bold text-rose-700">{error}</p>
                </div>
              ) : null}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="h-11 rounded-xl border-slate-200 text-sm font-bold text-slate-600"
                  onClick={() => {
                    hapticTap();
                    setStep("info");
                  }}
                >
                  رجوع
                </Button>
                <Button
                  className="h-11 flex-1 rounded-xl bg-teal-600 text-sm font-bold text-white hover:bg-teal-700"
                  onClick={submitDocs}
                >
                  إرسال للمراجعة
                  <ShieldCheck className="ms-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {step === "review" && submission ? (
          <ReviewStatusCard
            submission={submission}
            onFinish={() =>
              onComplete({
                fullName: fullName.trim(),
                phone,
                password,
                role: "captain",
              })
            }
            onCancel={() => {
              setSubmission(null);
              setStep("docs");
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export default SignupScreen;