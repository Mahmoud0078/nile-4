import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createPerson,
  removePerson,
  searchPeople,
  updatePerson,
  type PersonRecord,
  type PersonRole,
} from "@/lib/db";
import { isValidNationalId, maskNationalId } from "@/lib/profile";

type PeopleDirectoryProps = {
  people: PersonRecord[];
  onChange: (next: PersonRecord[]) => void;
};

type Draft = {
  role: PersonRole;
  name: string;
  nationalId: string;
  photo: string | null;
  phone: string;
  carrier: string;
};

const emptyDraft: Draft = {
  role: "client",
  name: "",
  nationalId: "",
  photo: null,
  phone: "",
  carrier: "",
};

export function PeopleDirectory({ people, onChange }: PeopleDirectoryProps) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<PersonRole | "all">("all");
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const results = useMemo(
    () => searchPeople(people, query, roleFilter),
    [people, query, roleFilter]
  );

  const counts = useMemo(
    () => ({
      clients: people.filter((p) => p.role === "client").length,
      captains: people.filter((p) => p.role === "captain").length,
    }),
    [people]
  );

  const readFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("من فضلك اختر ملف صورة صالح.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((d) => ({ ...d, photo: String(reader.result) }));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setDraft(emptyDraft);
    setEditingId(null);
    setError("");
  };

  const submit = () => {
    if (!draft.photo) {
      setError("الصورة الشخصية إجبارية لكل عميل وكابتن.");
      return;
    }
    if (draft.name.trim().length < 3) {
      setError("اكتب الاسم بالكامل.");
      return;
    }
    if (!isValidNationalId(draft.nationalId)) {
      setError("الرقم القومي يجب أن يكون ١٤ رقمًا.");
      return;
    }
    if (draft.phone.replace(/\D/g, "").length < 10) {
      setError("اكتب رقم موبايل صحيح.");
      return;
    }

    const payload = {
      role: draft.role,
      name: draft.name.trim(),
      nationalId: draft.nationalId.replace(/\D/g, ""),
      photo: draft.photo,
      phone: draft.phone.trim(),
      carrier: draft.carrier.trim() || undefined,
    };

    if (editingId) {
      onChange(updatePerson(people, editingId, payload));
    } else {
      onChange([createPerson(payload), ...people]);
    }
    resetForm();
  };

  const startEdit = (p: PersonRecord) => {
    setEditingId(p.id);
    setDraft({
      role: p.role,
      name: p.name,
      nationalId: p.nationalId,
      photo: p.photo,
      phone: p.phone,
      carrier: p.carrier ?? "",
    });
    setError("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="rounded-2xl border-slate-200 shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-slate-900">
            {editingId ? "تعديل السجل" : "إضافة سجل جديد"}
          </CardTitle>
          <p className="text-sm text-slate-500">
            قاعدة البيانات تحفظ الاسم والصورة والرقم القومي لكل عميل وكابتن.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-700">النوع</Label>
            <Select
              value={draft.role}
              onValueChange={(v) =>
                setDraft((d) => ({ ...d, role: v as PersonRole }))
              }
            >
              <SelectTrigger className="mt-2 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">عميل</SelectItem>
                <SelectItem value="captain">كابتن</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-700">الصورة الشخصية *</Label>
            <div className="mt-2 flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-sm">
                {draft.photo ? (
                  <img
                    src={draft.photo}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl text-slate-400">👤</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-xl bg-teal-600 text-white hover:bg-teal-700"
                >
                  {draft.photo ? "تغيير" : "اختيار صورة"}
                </Button>
                {draft.photo && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDraft((d) => ({ ...d, photo: null }))}
                    className="rounded-xl border-slate-200 text-slate-600"
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

          <div>
            <Label className="text-slate-700">الاسم بالكامل *</Label>
            <Input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="مثال: أحمد محمد علي"
              className="mt-2 rounded-xl"
            />
          </div>

          <div>
            <Label className="text-slate-700">الرقم القومي *</Label>
            <Input
              inputMode="numeric"
              value={draft.nationalId}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  nationalId: e.target.value.replace(/\D/g, "").slice(0, 14),
                }))
              }
              placeholder="١٤ رقمًا"
              className="mt-2 rounded-xl tracking-widest"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-slate-700">رقم الموبايل *</Label>
              <Input
                value={draft.phone}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, phone: e.target.value }))
                }
                placeholder="+20 1xx xxx xxxx"
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label className="text-slate-700">الشبكة</Label>
              <Input
                value={draft.carrier}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, carrier: e.target.value }))
                }
                placeholder="Vodafone / Orange…"
                className="mt-2 rounded-xl"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {error}
            </p>
          )}

          <div className="flex gap-2">
            <Button
              onClick={submit}
              className="flex-1 rounded-xl bg-teal-600 text-white hover:bg-teal-700"
            >
              {editingId ? "حفظ التعديلات" : "إضافة إلى قاعدة البيانات"}
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={resetForm}
                className="rounded-xl border-slate-200 text-slate-600"
              >
                إلغاء
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              عملاء
            </p>
            <p className="mt-1 font-serif text-3xl font-bold text-teal-800">
              {counts.clients}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              كباتن
            </p>
            <p className="mt-1 font-serif text-3xl font-bold text-emerald-800">
              {counts.captains}
            </p>
          </div>
        </div>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="gap-4">
            <CardTitle className="font-serif text-xl text-slate-900">
              سجلات العملاء والكباتن
            </CardTitle>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث بالاسم أو الرقم القومي أو الموبايل…"
                className="rounded-xl"
              />
              <Select
                value={roleFilter}
                onValueChange={(v) => setRoleFilter(v as PersonRole | "all")}
              >
                <SelectTrigger className="rounded-xl sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="client">عملاء</SelectItem>
                  <SelectItem value="captain">كباتن</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                <p className="text-3xl">🗂️</p>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  لا توجد سجلات مطابقة
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  أضف عميلاً أو كابتن من النموذج المجاور.
                </p>
              </div>
            )}

            {results.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-slate-100 bg-slate-200">
                  {p.photo ? (
                    <img
                      src={p.photo}
                      alt={p.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-slate-500">
                      {p.name.slice(0, 1)}
                    </span>
                  )}
                </div>
                <div className="min-w-40 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {p.name}
                    </p>
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-xs font-semibold " +
                        (p.role === "captain"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-teal-100 text-teal-700")
                      }
                    >
                      {p.role === "captain" ? "كابتن" : "عميل"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    الرقم القومي: {maskNationalId(p.nationalId)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {p.phone}
                    {p.carrier ? ` · ${p.carrier}` : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => startEdit(p)}
                    className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onChange(removePerson(people, p.id))}
                    className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    حذف
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}