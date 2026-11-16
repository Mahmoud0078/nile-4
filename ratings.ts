export type RatingRole = "client" | "captain";

export type RatingRecord = {
  id: string;
  role: RatingRole;
  stars: number;
  tags: string[];
  comment: string;
  createdAt: number;
};

export const CLIENT_TAGS = [
  "قيادة آمنة",
  "التزام بالموعد",
  "سيارة نظيفة",
  "أسلوب محترم",
  "سعر مناسب",
];

export const CAPTAIN_TAGS = [
  "عميل محترم",
  "التزام بالموعد",
  "موقع واضح",
  "تعامل هادئ",
  "بدون انتظار",
];

export function tagsFor(role: RatingRole): string[] {
  return role === "client" ? CLIENT_TAGS : CAPTAIN_TAGS;
}

export function ratingLabel(stars: number): string {
  switch (stars) {
    case 1:
      return "تجربة سيئة";
    case 2:
      return "تحت المستوى";
    case 3:
      return "مقبولة";
    case 4:
      return "جيدة جداً";
    case 5:
      return "ممتازة";
    default:
      return "اختر تقييمك";
  }
}

export function averageOf(records: RatingRecord[]): number {
  if (records.length === 0) return 0;
  const total = records.reduce((sum, r) => sum + r.stars, 0);
  return Math.round((total / records.length) * 10) / 10;
}

export function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}