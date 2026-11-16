export type Place = {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
};

export type RideType = {
  id: string;
  name: string;
  tagline: string;
  seats: number;
  baseFare: number;
  perKm: number;
  etaBase: number;
  color: string;
  icon: string;
};

export const places: Place[] = [
  { id: "cairo", name: "Cairo", area: "Cairo Governorate", lat: 30.0444, lng: 31.2357 },
  { id: "giza", name: "Giza", area: "Giza Governorate", lat: 30.0131, lng: 31.2089 },
  { id: "alexandria", name: "Alexandria", area: "Alexandria Governorate", lat: 31.2001, lng: 29.9187 },
  { id: "port-said", name: "Port Said", area: "Port Said Governorate", lat: 31.2653, lng: 32.3019 },
  { id: "suez", name: "Suez", area: "Suez Governorate", lat: 29.9668, lng: 32.5498 },
  { id: "ismailia", name: "Ismailia", area: "Ismailia Governorate", lat: 30.5965, lng: 32.2715 },
  { id: "luxor", name: "Luxor", area: "Luxor Governorate", lat: 25.6872, lng: 32.6396 },
  { id: "aswan", name: "Aswan", area: "Aswan Governorate", lat: 24.0889, lng: 32.8998 },
  { id: "hurghada", name: "Hurghada", area: "Red Sea Governorate", lat: 27.2579, lng: 33.8116 },
  { id: "sharm", name: "Sharm El Sheikh", area: "South Sinai Governorate", lat: 27.9158, lng: 34.33 },
  { id: "dahab", name: "Dahab", area: "South Sinai Governorate", lat: 28.5091, lng: 34.5136 },
  { id: "tanta", name: "Tanta", area: "Gharbia Governorate", lat: 30.7865, lng: 31.0004 },
  { id: "mansoura", name: "Mansoura", area: "Dakahlia Governorate", lat: 31.0409, lng: 31.3785 },
  { id: "asyut", name: "Asyut", area: "Asyut Governorate", lat: 27.1809, lng: 31.1837 },
  { id: "sohag", name: "Sohag", area: "Sohag Governorate", lat: 26.5591, lng: 31.6957 },
  { id: "minya", name: "Minya", area: "Minya Governorate", lat: 28.1099, lng: 30.7503 },
  { id: "fayoum", name: "Fayoum", area: "Fayoum Governorate", lat: 29.3084, lng: 30.8428 },
  { id: "beni-suef", name: "Beni Suef", area: "Beni Suef Governorate", lat: 29.0661, lng: 31.0994 },
  { id: "marsa-matrouh", name: "Marsa Matrouh", area: "Matrouh Governorate", lat: 31.3543, lng: 27.2373 },
  { id: "siwa", name: "Siwa Oasis", area: "Matrouh Governorate", lat: 29.2032, lng: 25.5195 },
  { id: "new-valley", name: "Kharga Oasis", area: "New Valley Governorate", lat: 25.4514, lng: 30.5464 },
  { id: "el-arish", name: "El Arish", area: "North Sinai Governorate", lat: 31.1249, lng: 33.8006 },
  { id: "banha", name: "Banha", area: "Qalyubia Governorate", lat: 30.4667, lng: 31.1833 },
  { id: "zagazig", name: "Zagazig", area: "Sharqia Governorate", lat: 30.5877, lng: 31.502 },
  { id: "kafr-el-sheikh", name: "Kafr El Sheikh", area: "Kafr El Sheikh Governorate", lat: 31.1107, lng: 30.9388 },
  { id: "damietta", name: "Damietta", area: "Damietta Governorate", lat: 31.4165, lng: 31.8133 },
  { id: "qena", name: "Qena", area: "Qena Governorate", lat: 26.1551, lng: 32.716 },
  { id: "edfu", name: "Edfu", area: "Aswan Governorate", lat: 24.9778, lng: 32.8731 },
];

export const rideTypes: RideType[] = [
  {
    id: "economy",
    name: "Economy",
    tagline: "Affordable everyday rides · 10 EGP/km",
    seats: 4,
    baseFare: 12,
    perKm: 10,
    etaBase: 3,
    color: "#0d9488",
    icon: "🚗",
  },
  {
    id: "comfort",
    name: "Comfort",
    tagline: "Newer cars, extra legroom · 12 EGP/km",
    seats: 4,
    baseFare: 20,
    perKm: 12,
    etaBase: 4,
    color: "#2563eb",
    icon: "🚙",
  },
  {
    id: "xl",
    name: "Family XL",
    tagline: "Room for the whole crew · 15 EGP/km",
    seats: 6,
    baseFare: 28,
    perKm: 15,
    etaBase: 6,
    color: "#7c3aed",
    icon: "🚐",
  },
  {
    id: "moto",
    name: "Moto",
    tagline: "Beat the traffic, solo · 6 EGP/km",
    seats: 1,
    baseFare: 8,
    perKm: 6,
    etaBase: 2,
    color: "#f97316",
    icon: "🏍️",
  },
];

export function formatFare(value: number): string {
  return `${value.toFixed(2)} EGP`;
}

export function haversineKm(a: Place, b: Place): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return Math.max(1.2, Math.round(2 * R * Math.asin(Math.sqrt(h)) * 10) / 10);
}

export function interpolate(a: Place, b: Place, t: number): { lat: number; lng: number } {
  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
  };
}

export function findPlaceByQuery(query: string): Place | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return places.find(
    (p) =>
      p.name.toLowerCase() === q ||
      p.area.toLowerCase() === q ||
      p.name.toLowerCase().includes(q)
  );
}

export function makeCustomPlace(name: string): Place {
  const hash = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return {
    id: `custom-${Date.now()}`,
    name: name.trim(),
    area: "Custom destination",
    lat: 22 + (hash % 9),
    lng: 25 + ((hash * 7) % 12),
  };
}