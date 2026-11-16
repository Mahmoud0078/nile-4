import { useSyncExternalStore } from "react";
import type { LatLng } from "@/lib/geo";

export type CaptainStatus = "available" | "busy" | "offline";

export type Captain = {
  id: string;
  name: string;
  phone: string;
  vehicleLabel: string;
  plate: string;
  rating: number;
  status: CaptainStatus;
  location: LatLng;
  completedTrips: number;
  joinedAt: number;
};

export type RideStatus = "pending" | "accepted" | "arrived" | "ongoing" | "done" | "cancelled";

export type RideRequest = {
  id: string;
  customerName: string;
  customerPhone: string;
  pickup: LatLng;
  dropoff: LatLng;
  pickupLabel: string;
  dropoffLabel: string;
  fare: number;
  status: RideStatus;
  captainId: string | null;
  createdAt: number;
};

export type Database = {
  captains: Captain[];
  rides: RideRequest[];
  version: number;
};

const STORAGE_KEY = "ride-db-v1";

function seed(): Database {
  const now = Date.now();
  const captains: Captain[] = [
    {
      id: "cap-1",
      name: "أحمد سمير",
      phone: "0100 111 2233",
      vehicleLabel: "تويوتا كورولا · أبيض",
      plate: "س ط ع 4821",
      rating: 4.9,
      status: "available",
      location: { lat: 30.0444, lng: 31.2357 },
      completedTrips: 1284,
      joinedAt: now - 1000 * 60 * 60 * 24 * 420,
    },
    {
      id: "cap-2",
      name: "محمود عبد الله",
      phone: "0111 445 6677",
      vehicleLabel: "هيونداي إلنترا · رمادي",
      plate: "ر ب ن 1190",
      rating: 4.7,
      status: "busy",
      location: { lat: 30.0561, lng: 31.2201 },
      completedTrips: 642,
      joinedAt: now - 1000 * 60 * 60 * 24 * 180,
    },
    {
      id: "cap-3",
      name: "كريم فؤاد",
      phone: "0122 889 0011",
      vehicleLabel: "نيسان صني · أزرق",
      plate: "م ل ك 7734",
      rating: 4.8,
      status: "available",
      location: { lat: 30.0131, lng: 31.2089 },
      completedTrips: 903,
      joinedAt: now - 1000 * 60 * 60 * 24 * 260,
    },
  ];

  const rides: RideRequest[] = [
    {
      id: "ride-1",
      customerName: "سارة منصور",
      customerPhone: "0155 220 3311",
      pickup: { lat: 30.0459, lng: 31.2243 },
      dropoff: { lat: 30.0626, lng: 31.2497 },
      pickupLabel: "التحرير · ميدان التحرير",
      dropoffLabel: "مصر الجديدة · سيتي ستارز",
      fare: 68,
      status: "pending",
      captainId: null,
      createdAt: now - 1000 * 60 * 4,
    },
    {
      id: "ride-2",
      customerName: "يوسف حمدي",
      customerPhone: "0106 774 5522",
      pickup: { lat: 30.033, lng: 31.233 },
      dropoff: { lat: 30.0055, lng: 31.2011 },
      pickupLabel: "وسط البلد · طلعت حرب",
      dropoffLabel: "المعادي · كورنيش النيل",
      fare: 54,
      status: "accepted",
      captainId: "cap-2",
      createdAt: now - 1000 * 60 * 12,
    },
    {
      id: "ride-3",
      customerName: "منى إبراهيم",
      customerPhone: "0128 331 9988",
      pickup: { lat: 30.0712, lng: 31.2401 },
      dropoff: { lat: 30.0888, lng: 31.2802 },
      pickupLabel: "الزمالك · شارع 26 يوليو",
      dropoffLabel: "مدينة نصر · عباس العقاد",
      fare: 72,
      status: "pending",
      captainId: null,
      createdAt: now - 1000 * 60 * 1,
    },
  ];

  return { captains, rides, version: 1 };
}

let db: Database = load();

function load(): Database {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as Database;
    if (!parsed || !Array.isArray(parsed.captains) || !Array.isArray(parsed.rides)) {
      return seed();
    }
    return parsed;
  } catch {
    return seed();
  }
}

const listeners = new Set<() => void>();

function emit() {
  db = { ...db, version: db.version + 1 };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* storage full or unavailable — keep in-memory state */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return db;
}

export function useDatabase(): Database {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

let idCounter = 0;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

export function addCaptain(input: {
  name: string;
  phone: string;
  vehicleLabel: string;
  plate: string;
  location: LatLng;
}): Captain {
  const captain: Captain = {
    id: nextId("cap"),
    name: input.name.trim(),
    phone: input.phone.trim(),
    vehicleLabel: input.vehicleLabel.trim(),
    plate: input.plate.trim(),
    rating: 5,
    status: "available",
    location: input.location,
    completedTrips: 0,
    joinedAt: Date.now(),
  };
  db.captains = [captain, ...db.captains];
  emit();
  return captain;
}

export function addRide(input: {
  customerName: string;
  customerPhone: string;
  pickup: LatLng;
  dropoff: LatLng;
  pickupLabel: string;
  dropoffLabel: string;
  fare: number;
}): RideRequest {
  const ride: RideRequest = {
    id: nextId("ride"),
    customerName: input.customerName.trim(),
    customerPhone: input.customerPhone.trim(),
    pickup: input.pickup,
    dropoff: input.dropoff,
    pickupLabel: input.pickupLabel.trim(),
    dropoffLabel: input.dropoffLabel.trim(),
    fare: Math.max(0, Math.round(input.fare)),
    status: "pending",
    captainId: null,
    createdAt: Date.now(),
  };
  db.rides = [ride, ...db.rides];
  emit();
  return ride;
}

export function updateRideStatus(rideId: string, status: RideStatus) {
  db.rides = db.rides.map((r) => (r.id === rideId ? { ...r, status } : r));
  emit();
}

export function assignRide(rideId: string, captainId: string) {
  db.rides = db.rides.map((r) =>
    r.id === rideId ? { ...r, captainId, status: "accepted" } : r,
  );
  db.captains = db.captains.map((c) =>
    c.id === captainId ? { ...c, status: "busy" } : c,
  );
  emit();
}

export function updateCaptainStatus(captainId: string, status: CaptainStatus) {
  db.captains = db.captains.map((c) =>
    c.id === captainId ? { ...c, status } : c,
  );
  emit();
}

export function removeRide(rideId: string) {
  db.rides = db.rides.filter((r) => r.id !== rideId);
  emit();
}

export function resetDatabase() {
  db = seed();
  emit();
}