import { useEffect, useRef, useState } from "react";
import type { Place } from "@/lib/data";

type MapCanvasProps = {
  pickup: Place;
  dropoff: Place;
  booked: boolean;
  rideColor: string;
  tracking: boolean;
  onToggleTracking: () => void;
  onDriverArrived: () => void;
};

export function MapCanvas({
  pickup,
  dropoff,
  booked,
  rideColor,
  tracking,
  onToggleTracking,
  onDriverArrived,
}: MapCanvasProps) {
  const midX = (pickup.x + dropoff.x) / 2;
  const midY = (pickup.y + dropoff.y) / 2 - 10;
  const [progress, setProgress] = useState(0);
  const arrivedRef = useRef(false);

  useEffect(() => {
    if (!booked) {
      setProgress(0);
      arrivedRef.current = false;
      return;
    }
    if (!tracking) return;

    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = (Date.now() - start) / 8000;
      const next = Math.min(1, elapsed);
      setProgress(next);
      if (next >= 1 && !arrivedRef.current) {
        arrivedRef.current = true;
        onDriverArrived();
      }
    }, 80);
    return () => clearInterval(timer);
  }, [booked, tracking, onDriverArrived]);

  const t = progress;
  const carX =
    (1 - t) * (1 - t) * pickup.x +
    2 * (1 - t) * t * midX +
    t * t * dropoff.x;
  const carY =
    (1 - t) * (1 - t) * pickup.y +
    2 * (1 - t) * t * midY +
    t * t * dropoff.y;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-teal-50 shadow-sm">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute left-0 top-1/3 h-3 w-full bg-teal-200/60" />
      <div className="absolute left-1/4 top-0 h-full w-3 bg-teal-200/60" />
      <div className="absolute bottom-0 right-1/4 h-2/3 w-4 rotate-12 bg-teal-200/50" />

      <div className="relative h-72 w-full sm:h-96">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d={`M ${pickup.x} ${pickup.y} Q ${midX} ${midY} ${dropoff.x} ${dropoff.y}`}
            fill="none"
            stroke={rideColor}
            strokeWidth="0.8"
            strokeDasharray="2 2"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d={`M ${pickup.x} ${pickup.y} Q ${midX} ${midY} ${dropoff.x} ${dropoff.y}`}
            fill="none"
            stroke={rideColor}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="200"
            strokeDashoffset={200 - 200 * progress}
          />
        </svg>

        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${pickup.x}%`, top: `${pickup.y}%` }}
        >
          <div className="flex flex-col items-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white shadow-md ring-4 ring-white sm:h-9 sm:w-9 sm:text-sm">
              A
            </span>
            <span className="mt-1 max-w-28 truncate rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-700 shadow-sm">
              {pickup.name}
            </span>
          </div>
        </div>

        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${dropoff.x}%`, top: `${dropoff.y}%` }}
        >
          <div className="flex flex-col items-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white shadow-md ring-4 ring-white sm:h-9 sm:w-9 sm:text-sm">
              B
            </span>
            <span className="mt-1 max-w-28 truncate rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-700 shadow-sm">
              {dropoff.name}
            </span>
          </div>
        </div>

        {booked && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${carX}%`, top: `${carY}%` }}
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-lg shadow-lg ring-4 ring-white"
              style={{ backgroundColor: rideColor }}
            >
              🚕
            </span>
          </div>
        )}
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-2 border-t border-teal-100 bg-white/80 px-4 py-2.5 backdrop-blur">
        <span className="text-xs font-medium text-slate-500">
          Egypt map · {pickup.area} → {dropoff.area}
        </span>
        <div className="flex items-center gap-2">
          {booked && (
            <button
              onClick={onToggleTracking}
              className={
                "rounded-full px-3 py-1 text-xs font-semibold transition-colors " +
                (tracking
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200")
              }
            >
              {tracking ? "Auto-tracking on" : "Auto-tracking off"}
            </button>
          )}
          <span
            className={
              "rounded-full px-2.5 py-1 text-xs font-semibold " +
              (booked
                ? "bg-teal-100 text-teal-700"
                : "bg-slate-100 text-slate-600")
            }
          >
            {booked
              ? progress >= 1
                ? "Arrived"
                : `Driver en route · ${Math.round(progress * 100)}%`
              : "Awaiting booking"}
          </span>
        </div>
      </div>
    </div>
  );
}