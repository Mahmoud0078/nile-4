import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatNationalId,
  validateProfile,
  type ProfileDraft,
  type ProfileErrors,
} from "@/lib/profile";
import type { AuthUser } from "@/components/LoginScreen";

type ProfileSetupProps = {
  user: AuthUser;
  onComplete: (user: AuthUser) => void;
};

export function ProfileSetup({ user, onComplete }: ProfileSetupProps) {
  const [draft, setDraft] = useState<ProfileDraft>({
    name: "",
    nationalId: "",
    photo: null,
  });
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const readFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) {
      setErrors((e) => ({ ...e, photo: "من فضلك اختر ملف صورة صالح." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((d) => ({ ...d, photo: String(reader.result) }));
      setErrors((e) => ({ ...e, photo: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const submit = () => {
    const found = validateProfile(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onComplete({
      ...user,
      name: draft.name.trim(),
      nationalId: draft.nationalId.replace(/\D/g, ""),
      photo: draft.photo ?? undefined,
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-900 px-6 py-12">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />

      <Card className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-white/10 bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 px-8 py-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-100">
            خطوة أخيرة
          </p>
          <h1 className="mt-1 font-serif text-2xl font-bold text-white">
            إكمال بيانات الحساب
          </h1>
          <p className="mt-1 text-sm text-teal-50">
            الصورة الشخصية والاسم والرقم القومي إجبارية لاستكمال التسجيل.
          </p>
        </div>

        <CardContent className="grid gap-6 p-8 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label className="text-slate-700">الصورة الشخصية *</Label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                readFile(e.dataTransfer.files?.[0]);
              }}
              className={
                "mt-2 flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed p-6 transition-colors sm:flex-row " +
                (dragging
                  ? "border-teal-400 bg-teal-50"
                  : errors.photo
                    ? "border-rose-300 bg-rose-50"
                    : "border-slate-200 bg-slate-50")
              }
            >
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md">
                {draft.photo ? (
                  <img
                    src={draft.photo}
                    alt="الصورة الشخصية"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-slate-400">👤</span>
                )}
              </div>
              <div className="flex-1 text-center sm:text-right">
                <p className="text-sm font-semibold text-slate-800">
                  {draft.photo ? "تم اختيار الصورة" : "ارفع صورة واضحة للوجه"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  اسحب الصورة هنا أو اخترها من جهازك (JPG / PNG).
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <Button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="rounded-xl bg-teal-600 text-white hover:bg-teal-700"
                  >
                    {draft.photo ? "تغيير الصورة" : "اختيار صورة"}
                  </Button>
                  {draft.photo && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDraft((d) => ({ ...d, photo: null }))}
                      className="rounded-xl border-slate-200 text-slate-600 hover:bg-white"
                    >
                      حذف
                    </Button>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => readFile(e.target.files?.[0])}
                />
              </div>
            </div>
            {errors.photo && (
              <p className="mt-2 text-xs font-medium text-rose-600">
                {errors.photo}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="fullname" className="text-slate-700">
              الاسم بالكامل *
            </Label>
            <Input
              id="fullname"
              value={draft.name}
              onChange={(e) => {
                setDraft((d) => ({ ...d, name: e.target.value }));
                setErrors((er) => ({ ...er, name: undefined }));
              }}
              placeholder="مثال: أحمد محمد علي"
              className="mt-2 rounded-xl"
            />
            {errors.name && (
              <p className="mt-2 text-xs font-medium text-rose-600">
                {errors.name}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="nid" className="text-slate-700">
              الرقم القومي *
            </Label>
            <Input
              id="nid"
              inputMode="numeric"
              value={formatNationalId(draft.nationalId)}
              onChange={(e) => {
                setDraft((d) => ({ ...d, nationalId: e.target.value }));
                setErrors((er) => ({ ...er, nationalId: undefined }));
              }}
              placeholder="١٤ رقمًا"
              className="mt-2 rounded-xl tracking-widest"
            />
            <p className="mt-2 text-xs text-slate-400">
              {draft.nationalId.replace(/\D/g, "").length}/14
            </p>
            {errors.nationalId && (
              <p className="mt-1 text-xs font-medium text-rose-600">
                {errors.nationalId}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                بيانات الدخول
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {user.identifier}
              </p>
              {user.carrier && (
                <p className="text-xs text-slate-500">{user.carrier}</p>
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <Button
              onClick={submit}
              className="w-full rounded-xl bg-teal-600 py-6 text-base text-white hover:bg-teal-700"
            >
              إكمال التسجيل
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}