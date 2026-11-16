export type LatLng = { lat: number; lng: number };

export type DistanceInfo = {
  km: number;
  minutes: number;
  label: string;
};

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function estimateMinutes(km: number, avgSpeedKmh = 26): number {
  return Math.max(1, Math.round((km / avgSpeedKmh) * 60));
}

export function buildDistance(from: LatLng, to: LatLng): DistanceInfo {
  const km = haversineKm(from, to);
  const minutes = estimateMinutes(km);
  return {
    km: Math.round(km * 10) / 10,
    minutes,
    label: `${(Math.round(km * 10) / 10).toFixed(1)} كم · ${minutes} د`,
  };
}

export function formatKm(km: number): string {
  return `${km.toFixed(1)} كم`;
}

export function formatEta(minutes: number): string {
  if (minutes < 60) return `${minutes} دقيقة`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} ساعة` : `${h} س ${m} د`;
}