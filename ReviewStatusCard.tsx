import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { hapticTap } from "@/lib/platform";
import type { ReviewSubmission } from "@/lib/review";
import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  ShieldCheck,
} from "lucide-react";

const STEPS = [
  { key: "upload", label: "استلام الأوراق" },
  { key: "verify", label: "التحقق من البيانات" },
  { key: "approve", label: "اعتماد الحساب" },
] as const;

export function ReviewStatusCard({
  submission,
  onFinish,
  onCancel,
}: {
  submission: ReviewSubmission;
  onFinish: () => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= STEPS.length) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), 1400);
    return () => window.clearTimeout(t);
  }, [step]);

  const finished = step >= STEPS.length;

  return (
    <Card className="overflow-hidden rounded-2xl border-teal-200 shadow-sm">
      <div className="border-b border-teal-100 bg-gradient-to-l from-teal-600 to-teal-500 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-lg font-bold text-white">
              {finished ? "تم اعتماد حسابك" : "جاري مراجعة الأوراق"}
            </h1>
            <p className="text-[10px] font-medium text-teal-50">
              {finished
                ? "يمكنك الآن بدء استقبال الرحلات"
                : "لن يستغرق الأمر أكثر من لحظات"}
            </p>
          </div>
        </div>
      </div>

      <CardContent className="space-y-4 p-5">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-teal-600" />
            <p className="text-[11px] font-bold text-slate-800">
              {submission.documentName}
            </p>
          </div>
          <p className="mt-1 text-[10px] font-medium text-slate-500">
            {submission.vehicleLabel} · {submission.plate}
          </p>
        </div>

        <div className="space-y-2.5">
          {STEPS.map((s, i) => {
            const state = i < step ? "done" : i === step ? "active" : "idle";
            return (
              <div
                key={s.key}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 transition",
                  state === "done" && "border-teal-200 bg-teal-50",
                  state === "active" && "border-amber-200 bg-amber-50",
                  state === "idle" && "border-slate-200 bg-white",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-xl",
                    state === "done" && "bg-teal-600 text-white",
                    state === "active" && "bg-amber-500 text-white",
                    state === "idle" && "bg-slate-100 text-slate-400",
                  )}
                >
                  {state === "done" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : state === "active" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Clock3 className="h-4 w-4" />
                  )}
                </span>
                <p
                  className={cn(
                    "text-[11px] font-bold",
                    state === "idle" ? "text-slate-400" : "text-slate-800",
                  )}
                >
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>

        {finished ? (
          <Button
            className="h-11 w-full rounded-xl bg-teal-600 text-sm font-bold text-white hover:bg-teal-700"
            onClick={() => {
              hapticTap();
              onFinish();
            }}
          >
            <BadgeCheck className="me-1 h-4 w-4" />
            العودة للصفحة الرئيسية
          </Button>
        ) : (
          <Button
            variant="outline"
            className="h-11 w-full rounded-xl border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50"
            onClick={() => {
              hapticTap();
              onCancel();
            }}
          >
            تخطي المراجعة
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default ReviewStatusCard;