import { useCallback, useEffect, useRef, useState } from "react";
import {
  ARRIVAL_RADIUS_M,
  PICKUP_POINT,
  distanceMeters,
  isWithinArrivalRadius,
  proximityRatio,
  type GeoPoint,
} from "@/lib/geofence";

type Options = {
  /** Simulated captain position when geolocation is unavailable. */
  fallback?: GeoPoint;
  /** Auto-demo: drift the captain toward the pickup point over time. */
  simulateApproach?: boolean;
};

type Result = {
  position: GeoPoint;
  distance: number;
  withinRadius: boolean;
  proximity: number;
  radius: number;
  usingDevice: boolean;
  error: string | null;
  refresh: () => void;
};

const DEFAULT_FALLBACK: GeoPoint = { lat: 30.0521, lng: 31.2468 };

export function useCaptainLocation({
  fallback = DEFAULT_FALLBACK,
  simulateApproach = true,
}: Options = {}): Result {
  const [position, setPosition] = useState<GeoPoint>(fallback);
  const [usingDevice, setUsingDevice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deviceRef = useRef(false);

  const refresh = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("خدمة الموقع غير متاحة على هذا الجهاز");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        deviceRef.current = true;
        setUsingDevice(true);
        setError(null);
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setError("تم رفض إذن الموقع — يتم استخدام موقع تجريبي");
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 5000 },
    );
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Demo drift: move the simulated captain toward the pickup point.
  useEffect(() => {
    if (!simulateApproach || usingDevice) return;
    const timer = window.setInterval(() => {
      setPosition((prev) => {
        const next: GeoPoint = {
          lat: prev.lat + (PICKUP_POINT.lat - prev.lat) * 0.22,
          lng: prev.lng + (PICKUP_POINT.lng - prev.lng) * 0.22,
        };
        return next;
      });
    }, 2200);
    return () => window.clearInterval(timer);
  }, [simulateApproach, usingDevice]);

  const distance = distanceMeters(position, PICKUP_POINT);

  return {
    position,
    distance,
    withinRadius: isWithinArrivalRadius(position),
    proximity: proximityRatio(position),
    radius: ARRIVAL_RADIUS_M,
    usingDevice,
    error,
    refresh,
  };
}