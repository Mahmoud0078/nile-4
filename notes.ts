export type PresetNote = {
  id: string;
  label: string;
  text: string;
};

export const PRESET_NOTES: PresetNote[] = [
  {
    id: "gate",
    label: "بجوار البوابة",
    text: "أنا واقف بجوار البوابة الرئيسية، هاتلاقيني على اليمين.",
  },
  {
    id: "call",
    label: "اتصل عند الوصول",
    text: "من فضلك اتصل بي عند الوصول بدل ما تزمر.",
  },
  {
    id: "luggage",
    label: "معي شنطة كبيرة",
    text: "معي شنطة كبيرة، محتاج مساحة في الشنطة الخلفية.",
  },
  {
    id: "cash",
    label: "الدفع كاش",
    text: "هحاسب كاش، من فضلك جهز الباقي.",
  },
  {
    id: "quiet",
    label: "رحلة هادئة",
    text: "أفضل رحلة هادئة بدون كلام، شكراً.",
  },
];

export function findPreset(id: string | null): PresetNote | null {
  if (!id) return null;
  return PRESET_NOTES.find((n) => n.id === id) ?? null;
}