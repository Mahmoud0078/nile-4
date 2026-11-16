export type ProfileDraft = {
  name: string;
  nationalId: string;
  photo: string | null;
};

export type ProfileErrors = Partial<Record<keyof ProfileDraft, string>>;

export function isValidNationalId(id: string): boolean {
  const d = id.replace(/\D/g, "");
  return d.length === 14;
}

export function formatNationalId(id: string): string {
  return id.replace(/\D/g, "").slice(0, 14);
}

export function maskNationalId(id: string): string {
  const d = id.replace(/\D/g, "");
  if (d.length < 6) return d;
  return `${d.slice(0, 3)} ******** ${d.slice(-3)}`;
}

export function validateProfile(draft: ProfileDraft): ProfileErrors {
  const errors: ProfileErrors = {};
  if (!draft.photo) {
    errors.photo = "الصورة الشخصية مطلوبة لإكمال التسجيل.";
  }
  if (draft.name.trim().length < 3) {
    errors.name = "من فضلك اكتب الاسم بالكامل (٣ أحرف على الأقل).";
  }
  if (!isValidNationalId(draft.nationalId)) {
    errors.nationalId = "الرقم القومي يجب أن يكون ١٤ رقمًا.";
  }
  return errors;
}