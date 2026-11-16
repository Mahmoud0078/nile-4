import { useRef, useState } from "react";
import {
  IdCard,
  UserRound,
  Upload,
  Check,
  X,
  ShieldCheck,
  Camera,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SlotId = "front" | "back" | "selfie";

type Slot = {
  id: SlotId;
  title: string;
  hint: string;
  Icon: typeof IdCard;
};

const SLOTS: Slot[] = [
  {
    id: "front",
    title: "البطاقة الشخصية — الوجه الأمامي",
    hint: "تأكد أن الاسم والرقم واضحان تماماً",
    Icon: IdCard,
  },
  {
    id: "back",
    title: "البطاقة الشخصية — الوجه الخلفي",
    hint: "صوّر الظهر كاملاً بدون انعكاس ضوء",
    Icon: IdCard,
  },
  {
    id: "selfie",
    title: "صورة شخصية",
    hint: "صورة واضحة لوجهك بدون نظارة أو قبعة",
    Icon: UserRound,
  },
];

type Shot = { url: string; name: string };

export function CustomerKyc() {
  const [shots, setShots] = useState<Partial<Record<SlotId, Shot>>>({});
  const [submitted, setSubmitted] = useState(false);

  const done = SLOTS.filter((s) => shots[s.id]).length;
  const progress = Math.round((done / SLOTS.length) * 100);
  const complete = done === SLOTS.length;

  function setShot(id: SlotId, shot: Shot | undefined) {
    setShots((prev) => {
      const next = { ...prev };
      if (shot) next[id] = shot;
      else delete next[id];
      return next;
    });
    setSubmitted(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-3">
        {SLOTS.map((slot) => (
          <UploadCard
            key={slot.id}
            slot={slot}
            shot={shots[slot.id]}
            onChange={(s) => setShot(slot.id, s)}
          />
        ))}
      </div>

      <div className="space-y-6 lg:col-span-2">
        <Card className="overflow-hidden rounded-2xl border-emerald-100 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-6 py-5 text-white">
            <div className="flex items-center gap-2 text-emerald-100">
              <ShieldCheck className="size-4" />
              <p className="text-xs font-medium uppercase tracking-widest">
                توثيق الحساب
              </p>
            </div>
            <h2 className="mt-1 font-serif text-2xl font-bold">
              التحقق من الهوية
            </h2>
          </div>
          <CardContent className="space-y-5 p-6">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">اكتمال الملف</span>
                <span className="font-semibold text-emerald-700">
                  {done} / {SLOTS.length}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="space-y-3">
              {SLOTS.map((s) => {
                const ok = Boolean(shots[s.id]);
                return (
                  <li key={s.id} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full",
                        ok
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-400",
                      )}
                    >
                      {ok ? <Check className="size-4" /> : <s.Icon className="size-4" />}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        ok ? "text-slate-800" : "text-muted-foreground",
                      )}
                    >
                      {s.id === "selfie" ? "صورة شخصية" : s.title.split("—")[1]?.trim() ?? s.title}
                    </span>
                    {ok && (
                      <Badge className="ms-auto rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                        تم
                      </Badge>
                    )}
                  </li>
                );
              })}
            </ul>

            <Button
              disabled={!complete}
              onClick={() => setSubmitted(true)}
              className="h-11 w-full rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
            >
              {submitted ? "تم إرسال المستندات ✓" : "إرسال للمراجعة"}
            </Button>

            {submitted && (
              <p className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-800">
                وصلتنا مستنداتك، والمراجعة تستغرق حتى ٢٤ ساعة.
              </p>
            )}
            {!complete && (
              <p className="text-center text-xs text-muted-foreground">
                أكمل الصور الثلاث لتفعيل زر الإرسال
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-amber-100 bg-amber-50 shadow-sm">
          <CardContent className="p-6">
            <p className="font-semibold text-amber-900">نصائح لصورة مقبولة</p>
            <ul className="mt-3 space-y-2 text-sm text-amber-800/90">
              <li>• إضاءة جيدة وبدون فلاش مباشر.</li>
              <li>• البطاقة داخل الإطار بالكامل.</li>
              <li>• لا تستخدم صوراً من الشاشة أو نسخاً مصوّرة.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UploadCard({
  slot,
  shot,
  onChange,
}: {
  slot: Slot;
  shot?: Shot;
  onChange: (shot: Shot | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    onChange({ url: URL.createObjectURL(file), name: file.name });
  }

  return (
    <Card
      className={cn(
        "rounded-2xl border bg-white shadow-sm transition",
        dragging ? "border-emerald-400 ring-2 ring-emerald-200" : "border-slate-200",
      )}
    >
      <CardContent className="p-5">
        <div className="mb-4 flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <slot.Icon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">{slot.title}</p>
            <p className="text-xs text-muted-foreground">{slot.hint}</p>
          </div>
          {shot && (
            <Badge className="rounded-full bg-emerald-600 text-white hover:bg-emerald-600">
              مرفوع
            </Badge>
          )}
        </div>

        {shot ? (
          <div className="flex items-center gap-4">
            <img
              src={shot.url}
              alt={slot.title}
              className="size-24 rounded-xl border border-slate-200 object-cover shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700">
                {shot.name}
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-lg border-slate-200"
                >
                  <RotateCcw className="me-1.5 size-3.5" /> استبدال
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onChange(undefined)}
                  className="rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                >
                  <X className="me-1.5 size-3.5" /> حذف
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50/50"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
              {slot.id === "selfie" ? (
                <Camera className="size-5" />
              ) : (
                <Upload className="size-5" />
              )}
            </span>
            <span className="text-sm font-medium text-slate-700">
              اضغط للرفع أو اسحب الصورة هنا
            </span>
            <span className="text-xs text-muted-foreground">JPG أو PNG</span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </CardContent>
    </Card>
  );
}