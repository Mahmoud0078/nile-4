import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFare, type RideType } from "@/lib/data";
import { Check, Users } from "lucide-react";

type RideOptionsProps = {
  rides: RideType[];
  selected: string;
  onSelect: (id: string) => void;
  distanceKm: number;
};

export function RideOptions({
  rides,
  selected,
  onSelect,
  distanceKm,
}: RideOptionsProps) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Choose your ride</CardTitle>
        <p className="text-sm text-slate-500">
          Tap an option to see the price update instantly.
        </p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rides.map((ride) => {
          const fare = ride.baseFare + ride.perKm * distanceKm;
          const active = ride.id === selected;
          return (
            <button
              key={ride.id}
              onClick={() => onSelect(ride.id)}
              aria-pressed={active}
              className={
                "relative flex items-center gap-3 rounded-xl border p-4 text-left transition-all active:scale-[0.98] " +
                (active
                  ? "border-teal-500 bg-teal-50 ring-2 ring-teal-500/30"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50")
              }
            >
              {active && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-white">
                  <Check className="h-3 w-3" />
                </span>
              )}
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                style={{ backgroundColor: `${ride.color}1a` }}
              >
                {ride.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 pr-6">
                  <p className="truncate font-semibold text-slate-800">
                    {ride.name}
                  </p>
                  <p className="shrink-0 font-serif text-sm font-bold text-slate-900">
                    {formatFare(fare)}
                  </p>
                </div>
                <p className="truncate text-xs text-slate-500">
                  {ride.tagline}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                  <Users className="h-3 w-3" /> {ride.seats} seats
                </p>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}