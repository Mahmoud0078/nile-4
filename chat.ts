export type ChatRole = "client" | "captain";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  at: number;
  kind?: "text" | "arrival" | "note";
};

export type ChatParticipant = {
  name: string;
  photo: string | null;
  rating: number;
  vehicle: string;
  plate: string;
  phone?: string;
};

export type TripFare = {
  base: number;
  distance: number;
  time: number;
  total: number;
};

export const demoClient: ChatParticipant = {
  name: "Mona Adel",
  photo: null,
  rating: 4.9,
  vehicle: "Client account",
  plate: "—",
  phone: "+201000000001",
};

export const demoCaptain: ChatParticipant = {
  name: "Karim Hassan",
  photo: null,
  rating: 4.8,
  vehicle: "Toyota Corolla · White",
  plate: "ن ط ر 4821",
  phone: "+201000000002",
};

export const tripFare: TripFare = {
  base: 12,
  distance: 34,
  time: 9,
  total: 55,
};

export const quickReplies: string[] = [
  "أنا في الطريق",
  "وصلت، أنا بالخارج",
  "من فضلك انتظر دقيقة",
  "تم، شكراً لك",
];

export const arrivalText = "وصلت إلى موقعك، أنا في انتظارك بالخارج 🚗";

export function formatClock(at: number): string {
  const d = new Date(at);
  const h = d.getHours();
  const m = d.getMinutes();
  const period = h >= 12 ? "م" : "ص";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function formatEGP(amount: number): string {
  const value = Number.isFinite(amount) ? amount : 0;
  const rounded = Math.round(value * 100) / 100;
  const text = rounded.toLocaleString("en-EG", {
    minimumFractionDigits: rounded % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${text} ج.م`;
}

export function telHref(phone?: string | null): string {
  const cleaned = (phone ?? "").replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
}

export function smsHref(phone?: string | null, body?: string): string {
  const cleaned = (phone ?? "").replace(/[^\d+]/g, "");
  return body
    ? `sms:${cleaned}?body=${encodeURIComponent(body)}`
    : `sms:${cleaned}`;
}

export function seedMessages(): ChatMessage[] {
  const now = Date.now();
  return [
    {
      id: "msg-seed-1",
      role: "captain",
      text: "أهلاً بك، أنا في الطريق إليك الآن.",
      at: now - 1000 * 60 * 6,
      kind: "text",
    },
    {
      id: "msg-seed-2",
      role: "client",
      text: "تمام، أنا واقف عند المدخل الرئيسي.",
      at: now - 1000 * 60 * 5,
      kind: "text",
    },
    {
      id: "msg-seed-3",
      role: "captain",
      text: "وصلت خلال ٣ دقائق إن شاء الله.",
      at: now - 1000 * 60 * 2,
      kind: "text",
    },
  ];
}