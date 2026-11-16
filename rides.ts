export type RideStatus = "available" | "accepted" | "running" | "done";

export type Ride = {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  minutes: number;
  fare: number;
  riderName: string;
  riderRating: number;
  requestedAt: number;
  status: RideStatus;
};

export type DeliveryKind = "ride" | "parcel" | "food";

export type DeliveryOrder = {
  id: string;
  kind: DeliveryKind;
  from: string;
  to: string;
  distanceKm: number;
  minutes: number;
  fare: number;
  note: string;
  createdAt: number;
  status: RideStatus;
};

export const KIND_LABEL: Record<DeliveryKind, string> = {
  ride: "مشوار",
  parcel: "شحنة",
  food: "طلب مطعم",
};

export const KIND_ICON: Record<DeliveryKind, string> = {
  ride: "🚗",
  parcel: "📦",
  food: "🍔",
};

export const RIDE_POOL: Omit<Ride, "status">[] = [
  {
    id: "R-1042",
    from: "مدينة نصر — عباس العقاد",
    to: "مطار القاهرة الدولي",
    distanceKm: 18.4,
    minutes: 32,
    fare: 145,
    riderName: "سارة م.",
    riderRating: 4.9,
    requestedAt: Date.now() - 60_000,
  },
  {
    id: "R-1043",
    from: "المعادي — كورنيش النيل",
    to: "وسط البلد — التحرير",
    distanceKm: 11.2,
    minutes: 24,
    fare: 92,
    riderName: "أحمد ع.",
    riderRating: 4.7,
    requestedAt: Date.now() - 150_000,
  },
  {
    id: "R-1044",
    from: "الزمالك — ٢٦ يوليو",
    to: "سيتي ستارز مول",
    distanceKm: 14.8,
    minutes: 28,
    fare: 118,
    riderName: "منى ح.",
    riderRating: 5.0,
    requestedAt: Date.now() - 240_000,
  },
  {
    id: "R-1045",
    from: "٦ أكتوبر — الحصري",
    to: "الشيخ زايد — أركان",
    distanceKm: 9.6,
    minutes: 18,
    fare: 74,
    riderName: "خالد س.",
    riderRating: 4.6,
    requestedAt: Date.now() - 320_000,
  },
  {
    id: "R-1046",
    from: "مصر الجديدة — الميرغني",
    to: "هليوبوليس — الكوربة",
    distanceKm: 6.3,
    minutes: 14,
    fare: 55,
    riderName: "ياسمين ط.",
    riderRating: 4.8,
    requestedAt: Date.now() - 400_000,
  },
];

export function buildRidePool(): Ride[] {
  return RIDE_POOL.map((r) => ({ ...r, status: "available" as RideStatus }));
}

export function formatEgp(value: number): string {
  return `${value.toLocaleString("ar-EG")} ج.م`;
}

export function timeAgo(ts: number): string {
  const secs = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (secs < 60) return `قبل ${secs} ثانية`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `قبل ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  return `قبل ${hrs} ساعة`;
}

export function estimateFare(kind: DeliveryKind, distanceKm: number): number {
  const base = kind === "ride" ? 12 : kind === "parcel" ? 18 : 22;
  const perKm = kind === "ride" ? 7.5 : kind === "parcel" ? 8 : 9;
  return Math.round(base + distanceKm * perKm);
}

export function estimateMinutes(distanceKm: number): number {
  return Math.max(6, Math.round(distanceKm * 2.2));
}

export function makeOrderId(): string {
  return `D-${Math.floor(1000 + Math.random() * 8999)}`;
}