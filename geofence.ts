export type GeoPoint = { lat: number; lng: number };

/** Pickup point (النقطة A) — Riyadh city center. */
export const PICKUP_POINT: GeoPoint = { lat: 24.7136, lng: 46.6753 };

/** Radius in meters within which the captain may confirm arrival. */
export const ARRIVAL_RADIUS_M = 150;

const EARTH_RADIUS_M = 6_371_000;
const DEG_TO_RAD = Math.PI / 180;

/** Great-circle distance in meters (Haversine). */
export function distanceMeters(a: GeoPoint, b: GeoPoint): number {
  const dLat = (b.lat - a.lat) * DEG_TO_RAD;
  const dLng = (b.lng - a.lng) * DEG_TO_RAD;
  const lat1 = a.lat * DEG_TO_RAD;
  const lat2 = b.lat * DEG_TO_RAD;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function isWithinArrivalRadius(
  point: GeoPoint,
  radius = ARRIVAL_RADIUS_M,
): boolean {
  return distanceMeters(point, PICKUP_POINT) <= radius;
}

/** 0 → far away, 1 → at the pickup point. */
export function proximityRatio(point: GeoPoint): number {
  const d = distanceMeters(point, PICKUP_POINT);
  const span = ARRIVAL_RADIUS_M * 6;
  return Math.max(0, Math.min(1, 1 - d / span));
}

export function formatDistance(meters: number): string {
  if (!Number.isFinite(meters)) return "—";
  if (meters < 1000) return `${Math.round(meters)} م`;
  return `${(meters / 1000).toFixed(1)} كم`;
}

export function formatCoord(point: GeoPoint): string {
  return `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`;
}