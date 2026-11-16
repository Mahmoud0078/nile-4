import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GeoPoint } from "@/lib/geofence";
import { throttle } from "@/lib/perf";

export type PermissionState = "unknown" | "prompt" | "granted" | "denied";

type Options = {
  watch?: boolean;
  fallback?: GeoPoint;
  /** Minimum ms between accepted position updates (default 1500). */
  minIntervalMs?: number;
  /** Ignore fixes worse than this accuracy in meters (default 200). */
  maxAccuracyM?: number;
};

type Result = {
  position: GeoPoint | null;
  accuracy: number | null;
  permission: PermissionState;
  loading: boolean;
  error: string | null;
  live: boolean;
  request: () => void;
  stop: () => void;
};

export function useGeolocation({
  watch = true,
  fallback,
  minIntervalMs = 1500,
  maxAccuracyM = 200,
}: Options = {}): Result {
  const [position, setPosition] = useState<GeoPoint | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [permission, setPermission] = useState<PermissionState>("unknown");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(false);

  const watchIdRef = useRef<number | null>(null);
  const activeRef = useRef(false);
  const lastFixRef = useRef(0);

  const stop = useCallback(() => {
    activeRef.current = false;
    if (watchIdRef.current !== null && typeof navigator !== "undefined") {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setLive(false);
  }, []);

  const applyFallback = useCallback(
    (message: string) => {
      if (fallback) {
        setPosition(fallback);
        setAccuracy(null);
      }
      setError(message);
      setLoading(false);
      setLive(false);
    },
    [fallback],
  );

  const commitFix = useMemo(
    () =>
      throttle((lat: number, lng: number, acc: number | null) => {
        setPosition({ lat, lng });
        setAccuracy(acc);
        setPermission("granted");
        setError(null);
        setLoading(false);
        setLive(true);
      }, minIntervalMs),
    [minIntervalMs],
  );

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setPermission("denied");
      applyFallback("خدمة الموقع غير مدعومة على هذا الجهاز");
      return;
    }

    setLoading(true);
    setError(null);
    activeRef.current = true;

    const onSuccess = (pos: GeolocationPosition) => {
      if (!activeRef.current) return;
      const acc = pos.coords.accuracy ?? null;
      const now = Date.now();

      // Drop noisy fixes to avoid jitter and wasted renders.
      if (acc !== null && acc > maxAccuracyM && lastFixRef.current > 0) return;
      if (now - lastFixRef.current < minIntervalMs && lastFixRef.current > 0) {
        return;
      }
      lastFixRef.current = now;
      commitFix(pos.coords.latitude, pos.coords.longitude, acc);
    };

    const onError = (err: GeolocationPositionError) => {
      if (!activeRef.current) return;
      if (err.code === err.PERMISSION_DENIED) {
        setPermission("denied");
        applyFallback("تم رفض إذن الموقع — فعّل الموقع من إعدادات الجهاز");
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        applyFallback("تعذّر تحديد الموقع — تحقق من تشغيل GPS");
      } else {
        applyFallback("انتهت مهلة تحديد الموقع — حاول مرة أخرى");
      }
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 3000,
    };

    if (watch) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      watchIdRef.current = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        options,
      );
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }
  }, [watch, applyFallback, commitFix, minIntervalMs, maxAccuracyM]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.permissions?.query) {
      return;
    }
    let cancelled = false;
    let status: PermissionStatus | null = null;

    const onChange = () => {
      if (!cancelled && status) {
        setPermission(status.state as PermissionState);
      }
    };

    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((result) => {
        if (cancelled) return;
        status = result;
        setPermission(result.state as PermissionState);
        result.addEventListener("change", onChange);
      })
      .catch(() => {
        /* Permissions API unsupported */
      });

    return () => {
      cancelled = true;
      status?.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      activeRef.current = false;
      if (watchIdRef.current !== null && typeof navigator !== "undefined") {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  return {
    position,
    accuracy,
    permission,
    loading,
    error,
    live,
    request,
    stop,
  };
}

export default useGeolocation;