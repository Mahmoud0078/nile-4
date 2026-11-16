import { Button } from "@/components/ui/button";
import { MapPin, Navigation, RotateCcw } from "lucide-react";

type HeaderProps = {
  distanceKm: number;
  etaMin: number;
  booked: boolean;
  arrived: boolean;
  onReset: () => void;
};

export function Header({ distanceKm, etaMin, booked, arrived, onReset }: HeaderProps) {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
      <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="absolute -bottom-28 left-1/4 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/20 ring-1 ring-teal-300/30 backdrop-blur">
              <Navigation className="h-6 w-6 text-teal-300" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold leading-tight sm:text-3xl">
                Zaki Rides
              </h1>
              <p className="text-sm text-slate-300">
                Smart transport across Egypt
              </p>
            </div>
          </div>
          {booked && (
            <Button
              onClick={onReset}
              className="bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              New ride
            </Button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur sm:p-5">
            <p className="text-xs uppercase tracking-wide text-slate-300">
              Distance
            </p>
            <p className="mt-1 font-serif text-xl font-bold sm:text-3xl">
              {distanceKm} km
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur sm:p-5">
            <p className="text-xs uppercase tracking-wide text-slate-300">
              Arrival
            </p>
            <p className="mt-1 font-serif text-xl font-bold sm:text-3xl">
              {arrived ? "Now" : `${etaMin} min`}
            </p>
          </div>
          <div
            className={
              "rounded-2xl p-3 ring-1 backdrop-blur sm:p-5 " +
              (booked
                ? "bg-teal-500/25 ring-teal-200/40"
                : "bg-slate-500/20 ring-slate-200/20")
            }
          >
            <p className="text-xs uppercase tracking-wide text-slate-200">
              Status
            </p>
            <p className="mt-1 flex items-center gap-1.5 font-serif text-base font-bold sm:text-xl">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {arrived ? "Arrived" : booked ? "On the way" : "Ready"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}