import { useEffect, useMemo, useRef, useState } from "react";
import type { Place } from "@/lib/data";

type GoogleMapProps = {
  pickup: Place;
  dropoff: Place;
  driver: { lat: number; lng: number } | null;
  booked: boolean;
  tracking: boolean;
  onToggleTracking: () => void;
  progress: number;
  arrived: boolean;
};

const API_KEY = "AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY";

function zoomForDistance(km: number): number {
  if (km < 15) return 13;
  if (km < 40) return 11;
  if (km < 120) return 9;
  if (km < 300) return 8;
  if (km < 600) return 7;
  return 6;
}

export function GoogleMap({
  pickup,
  dropoff,
  driver,
  booked,
  tracking,
  onToggleTracking,
  progress,
  arrived,
}: GoogleMapProps) {
  const [mode, setMode] = useState<"embed" | "static">("embed");

  const center = useMemo(
    () => ({
      lat: (pickup.lat + dropoff.lat) / 2,
      lng: (pickup.lng + dropoff.lng) / 2,
    }),
    [pickup, dropoff]
  );

  const distanceKm = useMemo(() => {
    const R = 6371;
    const dLat = ((dropoff.lat - pickup.lat) * Math.PI) / 180;
    const dLng = ((dropoff.lng - pickup.lng) * Math.PI) / 180;
    const lat1 = (pickup.lat * Math.PI) / 180;
    const lat2 = (dropoff.lat * Math.PI) / 180;
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }, [pickup, dropoff]);

  const zoom = zoomForDistance(distanceKm);

  const embedSrc = useMemo(() => {
    const origin = `${pickup.lat},${pickup.lng}`;
    const dest = `${dropoff.lat},${dropoff.lng}`;
    return `https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=${origin}&destination=${dest}&mode=driving&zoom=${zoom}&language=en&region=EG`;
  }, [pickup, dropoff, zoom]);

  const staticSrc = useMemo(() => {
    const markers = [
      `markers=color:0x0d9488|label:A|${pickup.lat},${pickup.lng}`,
      `markers=color:0xe11d48|label:B|${dropoff.lat},${dropoff.lng}`,
    ];
    if (driver) {
      markers.push(`markers=color:0x2563eb|label:D|${driver.lat},${driver.lng}`);
    }
    return `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=${zoom}&size=900x520&scale=2&maptype=roadmap&language=en&region=EG&${markers.join(
      "&"
    )}&key=${API_KEY}`;
  }, [pickup, dropoff, driver, center, zoom]);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setMode("embed");
    const timer = setTimeout(() => {
      setMode((m) => (m === "embed" ? "static" : m));
    }, 2500);
    return () => clearTimeout(timer);
  }, [embedSrc]);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${pickup.lat},${pickup.lng}&destination=${dropoff.lat},${dropoff.lng}&travelmode=driving&dir_action=navigate`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm">
      <div className="relative h-72 w-full sm:h-96">
        {mode === "embed" ? (
          <iframe
            ref={iframeRef}
            title="Google Maps route"
            src={embedSrc}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <img
            src={staticSrc}
            alt="Map of the route across Egypt"
            className="h-full w-full object-cover"
            onError={() => setMode("embed")}
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="pointer-events-auto rounded-xl bg-white/95 px-3 py-2 shadow-md backdrop-blur">
            <p className="text-xs font-semibold text-slate-800">Google Maps</p>
            <p className="text-xs text-slate-500">
              {pickup.name} → {dropoff.name}
            </p>
          </div>
          <button
            onClick={openInGoogleMaps}
            className="pointer-events-auto rounded-xl bg-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-teal-700"
          >
            Open in Google Maps
          </button>
        </div>

        {booked && (
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl bg-white/95 px-3 py-2 shadow-md backdrop-blur">
            <p className="text-xs font-semibold text-slate-800">
              {arrived ? "Driver arrived" : "Driver en route"}
            </p>
            <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-teal-600 transition-all duration-200"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-white/90 px-4 py-2.5 backdrop-blur">
        <span className="text-xs font-medium text-slate-500">
          {pickup.area} → {dropoff.area}
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
              ? arrived
                ? "Arrived"
                : `En route · ${Math.round(progress * 100)}%`
              : "Awaiting booking"}
          </span>
        </div>
      </div>
    </div>
  );
}