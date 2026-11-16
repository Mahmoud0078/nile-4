import { cn } from "@/lib/utils";
import { MapPin, Navigation } from "lucide-react";

type Props = {
  pickup: string;
  dropoff: string;
  className?: string;
};

export function TripMap({ pickup, dropoff, className }: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100",
        className,
      )}
    >
      <div className="absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50" />
        <div className="absolute left-0 top-1/3 h-px w-full bg-slate-300/60" />
        <div className="absolute left-0 top-2/3 h-px w-full bg-slate-300/60" />
        <div className="absolute left-1/4 top-0 h-full w-px bg-slate-300/60" />
        <div className="absolute left-2/3 top-0 h-full w-px bg-slate-300/60" />
        <div className="absolute left-0 top-1/2 h-3 w-full -translate-y-1/2 bg-amber-200/50" />
      </div>

      <svg
        viewBox="0 0 400 240"
        className="relative h-full w-full"
        preserveAspectRatio="none"
      >
        <path
          d="M 60 190 C 130 190, 140 90, 210 90 S 300 60, 340 50"
          fill="none"
          stroke="#0d9488"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="10 8"
        />
        <circle cx="60" cy="190" r="9" fill="#0d9488" />
        <circle cx="60" cy="190" r="16" fill="#0d9488" opacity="0.2" />
        <circle cx="340" cy="50" r="9" fill="#059669" />
        <circle cx="340" cy="50" r="16" fill="#059669" opacity="0.2" />
      </svg>

      <div className="absolute bottom-3 right-3 left-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white">
            <Navigation className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-teal-700">نقطة A · الانطلاق</p>
            <p className="truncate text-xs text-slate-700">{pickup}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <MapPin className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-emerald-700">نقطة B · الوصول</p>
            <p className="truncate text-xs text-slate-700">{dropoff}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripMap;