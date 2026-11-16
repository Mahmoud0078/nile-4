import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { PRESET_NOTES, type PresetNote } from "@/lib/notes";
import { Check, PenLine, StickyNote, X } from "lucide-react";

type Props = {
  author: "client" | "captain";
  onAttach: (note: PresetNote | null) => void;
};

export function NotePicker({ author, onAttach }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const [writing, setWriting] = useState(false);

  const accent =
    author === "client"
      ? {
          chip: "border-teal-200 bg-teal-50 text-teal-800",
          active: "border-teal-500 bg-teal-600 text-white",
          ring: "focus-visible:ring-teal-500",
          button: "text-teal-700 hover:bg-teal-50",
        }
      : {
          chip: "border-amber-200 bg-amber-50 text-amber-800",
          active: "border-amber-500 bg-amber-500 text-white",
          ring: "focus-visible:ring-amber-500",
          button: "text-amber-700 hover:bg-amber-50",
        };

  function pick(preset: PresetNote) {
    const next = selectedId === preset.id ? null : preset.id;
    setSelectedId(next);
    if (next) {
      setCustom("");
      setWriting(false);
      onAttach(preset);
    } else {
      onAttach(null);
    }
  }

  function commitCustom() {
    const text = custom.trim();
    if (!text) return;
    setSelectedId(null);
    onAttach({
      id: "custom",
      label: "ملاحظة مكتوبة",
      text,
    });
  }

  function clearAll() {
    setSelectedId(null);
    setCustom("");
    setWriting(false);
    onAttach(null);
  }

  const hasNote = Boolean(selectedId) || Boolean(custom.trim());

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <StickyNote className="h-3.5 w-3.5 text-slate-500" />
          ملاحظة للرحلة
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setWriting((w) => !w)}
            className={cn(
              "h-7 gap-1.5 rounded-lg px-2 text-xs font-semibold",
              accent.button,
            )}
          >
            <PenLine className="h-3.5 w-3.5" />
            {writing ? "إخفاء الكتابة" : "اكتب ملاحظتك"}
          </Button>
          {hasNote ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-7 gap-1 rounded-lg px-2 text-xs font-semibold text-slate-500 hover:bg-slate-100"
            >
              <X className="h-3.5 w-3.5" />
              مسح
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PRESET_NOTES.map((preset) => {
          const active = selectedId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => pick(preset)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition",
                active ? accent.active : accent.chip,
                "hover:opacity-90",
              )}
            >
              {active ? <Check className="h-3 w-3" /> : null}
              {preset.label}
            </button>
          );
        })}
      </div>

      {writing ? (
        <div className="space-y-2">
          <Textarea
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onBlur={commitCustom}
            placeholder="اكتب ملاحظتك للكابتن... مثال: أنا واقف أمام صيدلية العزبي"
            rows={3}
            className={cn(
              "resize-none rounded-xl border-slate-200 bg-slate-50 text-sm",
              accent.ring,
            )}
          />
          <Button
            type="button"
            size="sm"
            onClick={commitCustom}
            disabled={!custom.trim()}
            className={cn(
              "h-8 rounded-lg px-3 text-xs font-semibold text-white",
              author === "client"
                ? "bg-teal-600 hover:bg-teal-700"
                : "bg-amber-500 hover:bg-amber-600",
            )}
          >
            إرفاق الملاحظة
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default NotePicker;