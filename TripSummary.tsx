import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFare, type Place, type RideType } from "@/lib/data";
import { CheckCircle2, Clock, MapPin, Phone, X } from "lucide-react";

type TripSummaryProps = {
  pickup: Place;
  dropoff: Place;
  ride: RideType;
  fare: number;
  etaMin: number;
  distanceKm: number;
  tracking: boolean;
  arrived: boolean;
  onToggleTracking: () => void;
  onCancel: () => void;
};

export function TripSummary({
  pickup,
  dropoff,
  ride,
  fare,
  etaMin,
  distanceKm,
  tracking,
  arrived,
  onToggleTracking,
  onCancel,
}: TripSummaryProps) {
  return (
    <Card className="rounded-2xl border-teal-200 bg-teal-50/60 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-teal-600" />
          <CardTitle className="font-serif text-xl text-teal-900">
            {arrived ? "Driver has arrived" : "Trip confirmed"}
          </CardTitle>
        </div>
        <p className="text-sm text-teal-800/80">
          {arrived
            ? "Your driver is waiting at the pickup point."
            : "Your driver is on the way. Auto-tracking follows the trip live."}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-teal-100 bg-white p-4">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: `${ride.color}1a` }}
          >
            {ride.icon}
          </span>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">{ride.name}</p>
            <p className="text-xs text-slate-500">
              {arrived
                ? `Arrived · ${distanceKm} km trip`
                : `Arriving in about ${etaMin} min · ${distanceKm} km trip`}
            </p>
          </div>
          <Button size="icon" variant="outline" className="h-9 w-9">
            <Phone className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3 rounded-xl border border-teal-100 bg-white p-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
              A
            </span>
            <div>
              <p className="text-sm font-medium text-slate-800">{pickup.name}</p>
              <p className="text-xs text-slate-500">{pickup.area}</p>
            </div>
          </div>
          <div className="ml-3 h-5 w-px bg-slate-200" />
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
              B
            </span>
            <div>
              <p className="text-sm font-medium text-slate-800">{dropoff.name}</p>
              <p className="text-xs text-slate-500">{dropoff.area}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-teal-100 bg-white p-3">
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" /> ETA
            </p>
            <p className="mt-1 font-serif text-lg font-bold text-slate-900">
              {arrived ? "Now" : `${etaMin} min`}
            </p>
          </div>
          <div className="rounded-xl border border-teal-100 bg-white p-3">
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" /> Fare
            </p>
            <p className="mt-1 font-serif text-lg font-bold text-slate-900">
              {formatFare(fare)}
            </p>
          </div>
        </div>

        <Button
          onClick={onToggleTracking}
          variant="outline"
          className={
            "w-full " +
            (tracking
              ? "border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100"
              : "border-slate-200 text-slate-600 hover:bg-slate-50")
          }
        >
          {tracking ? "Auto-tracking enabled" : "Enable auto-tracking"}
        </Button>

        <Button
          onClick={onCancel}
          variant="outline"
          className="w-full border-rose-200 text-rose-600 hover:bg-rose-50"
        >
          <X className="mr-2 h-4 w-4" /> Cancel trip
        </Button>
      </CardContent>
    </Card>
  );
}