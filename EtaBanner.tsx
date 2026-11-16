import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { buildEta, formatArabicClock, formatEtaSentence } from "@/lib/eta";
import { Clock, Navigation, Timer } from "lucide-react";

type Props = {
  /** Initial minutes until arrival (e.g. 12). */
  initialMinutes?: number;
  /** Simulated travel speed: minutes shaved off per real second. */
  speed?: number;
  /** Fired once when the countdown reaches zero. */
  onArrive?: () => void;
  className?: string;
};

export function EtaBanner({
  initialMinutes = 12,
  speed = 0.35,
  onArrive,
  className,
}: Props) {
  const [remaining, setRemaining] = useState(initialMinutes);
  const [now, setNow] = useState(() => new Date());
  const tickRef = useRef<number | null>(null);
  const arrivedRef = useRef(false);

  useEffect(() => {
    tickRef.current = window.setInterval(() => {
      setNow(new Date());
      setRemaining((prev) => {
        const next = prev - speed;
        return next <= 0 ? 0 : next;
      });
    }, 1000);
    return () => {
      if (tickRef.current !== null) window.clearInterval(tickRef.current);
    };
  }, [speed]);

  const eta = useMemo(() => buildEta(remaining, now), [remaining, now]);
  const arrived = eta.minutes === 0;

  useEffect(() => {
    if (arrived && !arrivedRef.current) {
      arrivedRef.current = true;
      onArrive?.();
    }
  }, [arrived, onArrive]);

  const progress = Math.min(
    100,
    Math.max(0, ((initialMinutes - remaining) / initialMinutes) * 100),
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border shadow-sm",
        arrived
          ? "border-emerald-300 bg-emerald-50"
          : "border-teal-200 bg-gradient-to-l from-teal-50 to-white",
        className,
      )}
    >
      <div className="flex items-center gap-3 p-4">
        <span
          className={cn(
            "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white",
            arrived ? "bg-emerald-600" : "bg-teal-600",
          )}
        >
          {arrived ? (
            <Navigation className="h-5 w-5" />
          ) : (
            <Timer className="h-5 w-5" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm font-bold",
              arrived ? "text-emerald-800" : "text-teal-800",
            )}
          >
            {arrived ? "الكابتن وصل الآن 🎉" : "الوقت المقدر لوصول الكابتن"}
          </p>
          <p
            className={cn(
              "mt-0.5 text-xs font-medium",
              arrived ? "text-emerald-700" : "text-teal-700",
            )}
          >
            {formatEtaSentence(eta)}
          </p>
        </div>

        <div className="shrink-0 text-left">
          <p
            className={cn(
              "text-2xl font-bold tabular-nums",
              arrived ? "text-emerald-700" : "text-teal-700",
            )}
          >
            {eta.minutes}
          </p>
          <p className="text-[10px] font-semibold text-slate-500">دقيقة</p>
        </div>
      </div>

      <div className="h-1.5 w-full bg-slate-100">
        <div
          className={cn(
            "h-full transition-all duration-1000 ease-linear",
            arrived ? "bg-emerald-500" : "bg-teal-500",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-white/60 px-4 py-2">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <Clock className="h-3 w-3" />
          وقت الوصول المتوقع
        </span>
        <span
          className={cn(
            "text-xs font-bold tabular-nums",
            arrived ? "text-emerald-700" : "text-teal-700",
          )}
        >
          {formatArabicClock(
            new Date(now.getTime() + eta.minutes * 60 * 1000),
          )}
        </span>
      </div>
    </div>
  );
}

export default EtaBanner;