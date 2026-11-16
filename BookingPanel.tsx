import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  findPlaceByQuery,
  formatFare,
  makeCustomPlace,
  type Place,
  type RideType,
} from "@/lib/data";
import type { GeoStatus } from "@/lib/geo";
import {
  ArrowUpDown,
  Info,
  Loader2,
  LocateFixed,
  Plus,
  Search,
} from "lucide-react";

type BookingPanelProps = {
  pickup: Place;
  dropoff: Place;
  places: Place[];
  onPickup: (p: Place) => void;
  onDropoff: (p: Place) => void;
  onSwap: () => void;
  fare: number;
  ride: RideType;
  booked: boolean;
  onBook: () => void;
  geoStatus: GeoStatus;
  onUseCurrentLocation: () => void;
};

export function BookingPanel({
  pickup,
  dropoff,
  places,
  onPickup,
  onDropoff,
  onSwap,
  fare,
  ride,
  booked,
  onBook,
  geoStatus,
  onUseCurrentLocation,
}: BookingPanelProps) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const quickPicks = places.filter(
    (p) => p.id !== pickup.id && p.id !== dropoff.id
  );

  const applyManual = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError("Type a destination name first.");
      return;
    }
    const found = findPlaceByQuery(trimmed);
    if (found) {
      onDropoff(found);
    } else {
      onDropoff(makeCustomPlace(trimmed));
    }
    setQuery("");
    setError("");
  };

  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm lg:sticky lg:top-6">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Plan your trip</CardTitle>
        <p className="text-sm text-slate-500">
          Use your current location or pick any Egyptian city.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <Button
          onClick={onUseCurrentLocation}
          disabled={geoStatus === "locating"}
          variant="outline"
          className="w-full justify-start border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100"
        >
          {geoStatus === "locating" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LocateFixed className="mr-2 h-4 w-4" />
          )}
          {geoStatus === "locating"
            ? "Detecting your location…"
            : "Use my current location"}
        </Button>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <span className="h-2 w-2 rounded-full bg-teal-600" /> Pickup
            </label>
            <Select
              value={pickup.id}
              onValueChange={(v) => {
                const p = places.find((x) => x.id === v);
                if (p) onPickup(p);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {places.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} · {p.area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full"
              onClick={onSwap}
              aria-label="Swap pickup and drop-off"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Drop-off
            </label>
            <Select
              value={dropoff.id}
              onValueChange={(v) => {
                const p = places.find((x) => x.id === v);
                if (p) onDropoff(p);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {places.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} · {p.area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-teal-100 bg-teal-50/60 p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-teal-800">
            <Search className="h-3.5 w-3.5" /> Manual destination
          </p>
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyManual();
              }}
              placeholder="e.g. Tahrir Square"
              className="bg-white"
            />
            <Button
              onClick={applyManual}
              className="shrink-0 bg-teal-600 text-white hover:bg-teal-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {error ? (
            <p className="text-xs text-rose-600">{error}</p>
          ) : (
            <p className="text-xs text-teal-700/80">
              Type any place in Egypt — we'll match it or add it as a custom stop.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500">Quick picks</p>
          <div className="flex max-h-28 flex-wrap gap-2 overflow-y-auto">
            {quickPicks.map((p) => (
              <button
                key={p.id}
                onClick={() => onDropoff(p)}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-slate-600">
              <span className="text-lg">{ride.icon}</span>
              {ride.name}
            </span>
            <span className="font-serif text-xl font-bold text-slate-900">
              {formatFare(fare)}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">{ride.tagline}</p>
        </div>

        <p className="flex items-start gap-2 text-xs text-slate-500">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
          Fare is an estimate and may vary with traffic.
        </p>

        <Button
          onClick={onBook}
          disabled={booked}
          className="hidden w-full bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60 lg:flex"
        >
          {booked ? "Ride booked" : `Book ${ride.name}`}
        </Button>
      </CardContent>
    </Card>
  );
}