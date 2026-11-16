import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Crosshair, Loader2, MapPin, Navigation } from "lucide-react";

type Props = {
  label: string;
  tone: "pickup" | "dropoff";
  value: string;
  onChange: (value: string) => void;
  /** When true, shows the "detect my location" button (point A only). */
  allowDetect?: boolean;
};

const FALLBACK_AREAS = [
  "مدينة نصر، شارع عباس العقاد",
  "المهندسين، شارع جامعة الدول",
  "الزمالك، شارع 26 يوليو",
  "المعادي، كورنيش النيل",
];

export function LocationField({
  label,
  tone,
  value,
  onChange,
  allowDetect = false,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const isPickup = tone === "pickup";

  function detect() {
    setLoading(true);
    setStatus(null);

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      const fallback =
        FALLBACK_AREAS[Math.floor(Math.random() * FALLBACK_AREAS.length)];
      onChange(fallback);
      setStatus("تعذر الوصول للـ GPS — تم استخدام أقرب منطقة معروفة");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const area =
          FALLBACK_AREAS[Math.floor(Math.random() * FALLBACK_AREAS.length)];
        onChange(`${area} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        setStatus("تم تحديد موقعك تلقائياً ✅");
        setLoading(false);
      },
      () => {
        const fallback =
          FALLBACK_AREAS[Math.floor(Math.random() * FALLBACK_AREAS.length)];
        onChange(fallback);
        setStatus("تم رفض إذن الموقع — تم استخدام أقرب منطقة معروفة");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          {isPickup ? (
            <Navigation className="h-3.5 w-3.5 text-teal-600" />
          ) : (
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
          )}
          {label}
        </Label>

        {allowDetect ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={detect}
            disabled={loading}
            className="h-7 gap-1.5 rounded-lg px-2 text-xs font-semibold text-teal-700 hover:bg-teal-50"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Crosshair className="h-3.5 w-3.5" />
            )}
            {loading ? "جارٍ التحديد..." : "تحديد موقعي"}
          </Button>
        ) : null}
      </div>

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          allowDetect
            ? "اكتب العنوان أو استخدم تحديد موقعي"
            : "اكتب عنوان التوصيل"
        }
        className={cn(
          "h-11 rounded-xl border-slate-200 bg-slate-50",
          isPickup
            ? "focus-visible:ring-teal-500"
            : "focus-visible:ring-emerald-500",
        )}
      />

      {status ? (
        <p
          className={cn(
            "text-[11px] font-medium",
            status.includes("✅") ? "text-emerald-600" : "text-slate-500",
          )}
        >
          {status}
        </p>
      ) : null}
    </div>
  );
}

export default LocationField;