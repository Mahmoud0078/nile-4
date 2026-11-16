import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatEGP } from "@/lib/chat";
import { timeAgo, type TripRequest } from "@/lib/requests";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Navigation,
  NotebookPen,
  Route,
  Star,
  Zap,
} from "lucide-react";

type Props = {
  requests: TripRequest[];
  onAccept: (id: string) => void;
  captainName: string;
};

export function RequestBroadcast({ requests, onAccept, captainName }: Props) {
  if (requests.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
          <Zap className="h-6 w-6" />
        </span>
        <p className="text-base font-semibold text-slate-800">
          لا توجد طلبات متاحة الآن
        </p>
        <p className="max-w-xs text-sm text-slate-500">
          سيظهر هنا أي ريكوست جديد من العملاء تلقائياً. ابقَ متصلاً.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">الطلبات المتاحة</h2>
          <p className="text-xs text-slate-500">
            {requests.length} ريكوست في انتظار القبول
          </p>
        </div>
        <Badge className="gap-1 rounded-full bg-teal-50 text-teal-700 hover:bg-teal-50">
          <span className="h-2 w-2 animate-pulse rounded-full bg-teal-500" />
          مباشر
        </Badge>
      </div>

      <div className="space-y-3">
        {requests.map((r) => (
          <Card
            key={r.id}
            className="rounded-2xl border-slate-200 shadow-sm transition hover:border-teal-300 hover:shadow-md"
          >
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">
                    {r.clientName.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {r.clientName}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      {r.clientRating}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-700">
                    {formatEGP(r.fare)}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {timeAgo(r.createdAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 rounded-xl bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal-600 text-white">
                    <Navigation className="h-3 w-3" />
                  </span>
                  <span className="font-semibold text-teal-700">A</span>
                  <span className="truncate text-slate-700">{r.pickup}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white">
                    <MapPin className="h-3 w-3" />
                  </span>
                  <span className="font-semibold text-emerald-700">B</span>
                  <span className="truncate text-slate-700">{r.dropoff}</span>
                </div>
              </div>

              {r.note ? (
                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                  <NotebookPen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                  <p className="text-xs leading-relaxed text-amber-900">
                    {r.note}
                  </p>
                </div>
              ) : null}

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Route className="h-3.5 w-3.5" />
                  {r.distanceKm} كم
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {r.etaMin} د للوصول
                </span>
              </div>

              <Button
                onClick={() => onAccept(r.id)}
                className={cn(
                  "h-11 w-full gap-2 rounded-xl bg-teal-600 text-sm font-semibold text-white",
                  "hover:bg-teal-700",
                )}
              >
                قبول الريكوست
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-center text-[11px] text-slate-400">
        مسجل الدخول كـ {captainName}
      </p>
    </div>
  );
}

export default RequestBroadcast;