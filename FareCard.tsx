import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatEGP, tripFare } from "@/lib/chat";
import { Banknote, Clock, Route } from "lucide-react";

export function FareCard() {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Banknote className="h-4 w-4" />
          </span>
          تفاصيل الأجرة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-slate-500">
            <Banknote className="h-4 w-4 text-slate-400" />
            الأجرة الأساسية
          </span>
          <span className="font-medium text-slate-800">
            {formatEGP(tripFare.base)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-slate-500">
            <Route className="h-4 w-4 text-slate-400" />
            المسافة
          </span>
          <span className="font-medium text-slate-800">
            {formatEGP(tripFare.distance)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-slate-500">
            <Clock className="h-4 w-4 text-slate-400" />
            الوقت
          </span>
          <span className="font-medium text-slate-800">
            {formatEGP(tripFare.time)}
          </span>
        </div>
        <Separator className="bg-slate-100" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">
            الإجمالي
          </span>
          <span className="text-xl font-bold text-emerald-700">
            {formatEGP(tripFare.total)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default FareCard;