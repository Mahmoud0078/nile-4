import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RatingForm } from "@/components/RatingForm";
import { cn } from "@/lib/utils";
import { averageOf, type RatingRecord } from "@/lib/ratings";
import { BadgeCheck, Star, Users } from "lucide-react";

type Props = {
  pickup: string;
  dropoff: string;
  fare: number;
  onBothRated?: () => void;
  className?: string;
};

export function TripCompletion({
  pickup,
  dropoff,
  fare,
  onBothRated,
  className,
}: Props) {
  const [records, setRecords] = useState<RatingRecord[]>([]);

  function handleSubmit(record: RatingRecord) {
    setRecords((prev) => {
      const next = [...prev, record];
      if (next.length >= 2) onBothRated?.();
      return next;
    });
  }

  const clientRated = records.some((r) => r.role === "client");
  const captainRated = records.some((r) => r.role === "captain");
  const bothDone = clientRated && captainRated;
  const avg = averageOf(records);

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="overflow-hidden rounded-2xl border-emerald-200 shadow-sm">
        <div className="flex items-center gap-3 bg-gradient-to-l from-emerald-100 to-emerald-50 p-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <BadgeCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-emerald-900">
              تم إتمام الرحلة بنجاح
            </p>
            <p className="truncate text-xs text-emerald-700">
              {pickup} ← {dropoff}
            </p>
          </div>
          <p className="shrink-0 text-base font-bold text-emerald-700">
            {fare} ج.م
          </p>
        </div>
      </Card>

      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Users className="h-4 w-4 shrink-0 text-slate-500" />
        <p className="flex-1 text-xs font-semibold text-slate-600">
          التقييم المتبادل
        </p>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
          {records.length}/2
        </span>
        {avg > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
            <Star className="h-3 w-3" fill="currentColor" />
            {avg}
          </span>
        ) : null}
      </div>

      {!clientRated ? (
        <RatingForm
          role="client"
          subjectName="Karim Hassan"
          subjectInitials="KH"
          onSubmit={handleSubmit}
        />
      ) : null}

      {!captainRated ? (
        <RatingForm
          role="captain"
          subjectName="Sara M."
          subjectInitials="SM"
          onSubmit={handleSubmit}
        />
      ) : null}

      {bothDone ? (
        <div className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-center">
          <p className="text-xs font-semibold text-teal-800">
            شكراً! تم إكمال التقييم المتبادل بنجاح
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default TripCompletion;