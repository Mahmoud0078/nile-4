import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TripMap } from "@/components/TripMap";
import { FareCard } from "@/components/FareCard";
import { cn } from "@/lib/utils";
import { formatEGP } from "@/lib/chat";
import type { TripRequest } from "@/lib/requests";
import {
  Clock,
  MapPin,
  Navigation,
  NotebookPen,
  Phone,
  Route,
  Star,
  X,
} from "lucide-react";

type Props = {
  request: TripRequest;
  onComplete: () => void;
};

export function ActiveTrip({ request, onComplete }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">رحلتك الحالية</h2>
          <p className="text-xs text-slate-500">
            لديك ريكوست نشط — لن تظهر لك طلبات أخرى
          </p>
        </div>
        <Badge className="gap-1 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          جارية
        </Badge>
      </div>

      <TripMap
        pickup={request.pickup}
        dropoff={request.dropoff}
        className="h-56"
      />

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">
                {request.clientName.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {request.clientName}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  {request.clientRating}
                </span>
              </div>
            </div>
            <Button
              asChild
              size="icon"
              variant="ghost"
              className="text-teal-700 hover:bg-teal-50"
            >
              <a href="tel:+201000000001" aria-label="اتصال بالعميل">
                <Phone className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="space-y-2 rounded-xl bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal-600 text-white">
                <Navigation className="h-3 w-3" />
              </span>
              <span className="font-semibold text-teal-700">A</span>
              <span className="truncate text-slate-700">{request.pickup}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white">
                <MapPin className="h-3 w-3" />
              </span>
              <span className="font-semibold text-emerald-700">B</span>
              <span className="truncate text-slate-700">{request.dropoff}</span>
            </div>
          </div>

          {request.note ? (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
              <NotebookPen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
              <p className="text-xs leading-relaxed text-amber-900">
                {request.note}
              </p>
            </div>
          ) : null}

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Route className="h-3.5 w-3.5" />
              {request.distanceKm} كم
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {request.etaMin} د للوصول
            </span>
            <span className="ml-auto text-base font-bold text-emerald-700">
              {formatEGP(request.fare)}
            </span>
          </div>
        </CardContent>
      </Card>

      <FareCard />

      <Button
        onClick={onComplete}
        variant="outline"
        className={cn(
          "h-11 w-full gap-2 rounded-xl border-slate-300 text-sm font-semibold text-slate-600",
          "hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700",
        )}
      >
        <X className="h-4 w-4" />
        إنهاء الرحلة وإتاحة طلبات جديدة
      </Button>
    </div>
  );
}

export default ActiveTrip;