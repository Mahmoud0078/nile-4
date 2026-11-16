import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StarPicker } from "@/components/StarPicker";
import { cn } from "@/lib/utils";
import { makeId, tagsFor, type RatingRecord, type RatingRole } from "@/lib/ratings";
import { CheckCircle2, Send, Star } from "lucide-react";

type Props = {
  role: RatingRole;
  subjectName: string;
  subjectInitials: string;
  onSubmit: (record: RatingRecord) => void;
  className?: string;
};

export function RatingForm({
  role,
  subjectName,
  subjectInitials,
  onSubmit,
  className,
}: Props) {
  const [stars, setStars] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);

  const available = tagsFor(role);

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function submit() {
    if (stars === 0) return;
    onSubmit({
      id: makeId(),
      role,
      stars,
      tags,
      comment: comment.trim(),
      createdAt: Date.now(),
    });
    setDone(true);
  }

  const heading =
    role === "client" ? `قيّم الكابتن ${subjectName}` : `قيّم العميل ${subjectName}`;

  if (done) {
    return (
      <Card
        className={cn(
          "rounded-2xl border-emerald-200 bg-emerald-50 shadow-sm",
          className,
        )}
      >
        <CardContent className="flex items-center gap-3 p-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-emerald-900">
              تم إرسال تقييمك
            </p>
            <p className="text-xs text-emerald-700">
              {stars} نجوم {tags.length > 0 ? `· ${tags.length} ملاحظات` : ""}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("rounded-2xl border-slate-200 shadow-sm", className)}>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white",
              role === "client" ? "bg-teal-600" : "bg-slate-800",
            )}
          >
            {subjectInitials}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900">{heading}</p>
            <p className="text-xs text-slate-500">
              تقييمك يساعد في تحسين الخدمة للجميع
            </p>
          </div>
          <Star className="ms-auto h-4 w-4 shrink-0 text-amber-400" />
        </div>

        <StarPicker value={stars} onChange={setStars} />

        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600">
            ما الذي أعجبك؟ (اختياري)
          </p>
          <div className="flex flex-wrap gap-2">
            {available.map((tag) => {
              const active = tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition active:scale-95",
                    active
                      ? "border-teal-300 bg-teal-50 text-teal-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50/50",
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="اكتب ملاحظة إضافية..."
          className="min-h-20 rounded-xl border-slate-200 text-sm"
        />

        <Button
          onClick={submit}
          disabled={stars === 0}
          className="h-11 w-full gap-2 rounded-xl bg-teal-600 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          إرسال التقييم
        </Button>
      </CardContent>
    </Card>
  );
}

export default RatingForm;