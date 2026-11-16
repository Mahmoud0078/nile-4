export type TripRequest = {
  id: string;
  clientName: string;
  clientRating: number;
  pickup: string;
  dropoff: string;
  distanceKm: number;
  etaMin: number;
  fare: number;
  note?: string;
  createdAt: number;
  status: "open" | "accepted";
  acceptedBy?: string;
};

export const demoRequests: TripRequest[] = [
  {
    id: "req-1001",
    clientName: "Mona Adel",
    clientRating: 4.9,
    pickup: "مدينة نصر، شارع عباس العقاد",
    dropoff: "التجمع الخامس، مول كايرو فستيفال",
    distanceKm: 14.2,
    etaMin: 6,
    fare: 68,
    note: "معي حقيبتان، أحتاج مساعدة في تحميلها عند الوصول.",
    createdAt: Date.now() - 1000 * 45,
    status: "open",
  },
  {
    id: "req-1002",
    clientName: "Ahmed Samir",
    clientRating: 4.7,
    pickup: "المهندسين، شارع جامعة الدول",
    dropoff: "مطار القاهرة الدولي - صالة 3",
    distanceKm: 22.8,
    etaMin: 9,
    fare: 145,
    createdAt: Date.now() - 1000 * 120,
    status: "open",
  },
  {
    id: "req-1003",
    clientName: "Salma Nabil",
    clientRating: 5.0,
    pickup: "الزمالك، شارع 26 يوليو",
    dropoff: "وسط البلد، ميدان التحرير",
    distanceKm: 7.4,
    etaMin: 4,
    fare: 42,
    note: "أفضل رحلة هادئة بدون محادثة، شكراً لك.",
    createdAt: Date.now() - 1000 * 200,
    status: "open",
  },
];

export function timeAgo(at: number): string {
  const diff = Math.max(0, Date.now() - at);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "الآن";
  if (mins === 1) return "منذ دقيقة";
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  return hours === 1 ? "منذ ساعة" : `منذ ${hours} ساعات`;
}