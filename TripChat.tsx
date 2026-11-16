import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotePicker } from "@/components/NotePicker";
import { cn } from "@/lib/utils";
import {
  arrivalText,
  demoCaptain,
  demoClient,
  formatClock,
  quickReplies,
  seedMessages,
  smsHref,
  telHref,
  type ChatMessage,
  type ChatRole,
} from "@/lib/chat";
import type { PresetNote } from "@/lib/notes";
import {
  Check,
  MapPin,
  MessageSquare,
  NotebookPen,
  Phone,
  Send,
  Star,
} from "lucide-react";

type Props = {
  role: ChatRole;
};

export function TripChat({ role }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => seedMessages());
  const [draft, setDraft] = useState("");
  const [arrived, setArrived] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const me = role === "captain" ? demoCaptain : demoClient;
  const other = role === "captain" ? demoClient : demoCaptain;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const initials = useMemo(
    () =>
      other.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2),
    [other.name],
  );

  function push(
    text: string,
    sender: ChatRole,
    kind: ChatMessage["kind"] = "text",
  ) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: sender,
        text: trimmed,
        at: Date.now(),
        kind,
      },
    ]);
  }

  function handleSend() {
    if (!draft.trim()) return;
    push(draft, role);
    setDraft("");
  }

  function handleArrived() {
    if (arrived) return;
    setArrived(true);
    push(arrivalText, "captain", "arrival");
    setToast("تم إرسال إشعار الوصول إلى العميل ✅");
  }

  function handleAttachNote(note: PresetNote) {
    push(note.text, role, "note");
    setToast(`تم إرسال الملاحظة: ${note.label}`);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <Avatar className="h-11 w-11 ring-2 ring-white">
          <AvatarFallback className="bg-teal-600 text-sm font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-slate-900">
              {other.name}
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              {other.rating}
            </span>
          </div>
          <p className="truncate text-xs text-slate-500">
            {other.vehicle} · {other.plate}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            asChild
            size="icon"
            variant="ghost"
            className="text-teal-700 hover:bg-teal-50"
          >
            <a href={telHref(other.phone)} aria-label="اتصال">
              <Phone className="h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            size="icon"
            variant="ghost"
            className="text-teal-700 hover:bg-teal-50"
          >
            <a href={smsHref(other.phone)} aria-label="رسالة نصية">
              <MessageSquare className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </header>

      {toast ? (
        <div className="border-b border-teal-100 bg-teal-50 px-4 py-2 text-center text-xs font-medium text-teal-800">
          {toast}
        </div>
      ) : null}

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto bg-slate-50/60 px-4 py-4"
      >
        {messages.map((m) => {
          const mine = m.role === role;
          const isArrival = m.kind === "arrival";
          const isNote = m.kind === "note";
          return (
            <div
              key={m.id}
              className={cn("flex", mine ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
                  isArrival
                    ? "border border-teal-200 bg-teal-600 text-white"
                    : isNote
                      ? "border border-amber-200 bg-amber-50 text-amber-900"
                      : mine
                        ? "bg-teal-600 text-white"
                        : "border border-slate-200 bg-white text-slate-800",
                )}
              >
                {isArrival ? (
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-teal-50">
                    <MapPin className="h-3.5 w-3.5" />
                    إشعار وصول
                  </div>
                ) : null}
                {isNote ? (
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                    <NotebookPen className="h-3.5 w-3.5" />
                    ملاحظة مسجلة
                  </div>
                ) : null}
                <p className="leading-relaxed">{m.text}</p>
                <div
                  className={cn(
                    "mt-1 flex items-center gap-1 text-[11px]",
                    isArrival || mine
                      ? "text-teal-50/80"
                      : isNote
                        ? "text-amber-600/80"
                        : "text-slate-400",
                  )}
                >
                  <span>{formatClock(m.at)}</span>
                  {mine ? <Check className="h-3 w-3" /> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {role === "captain" ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3">
          <Button
            onClick={handleArrived}
            disabled={arrived}
            className={cn(
              "h-11 w-full gap-2 rounded-xl text-sm font-semibold",
              arrived
                ? "bg-slate-100 text-slate-500"
                : "bg-emerald-600 text-white hover:bg-emerald-700",
            )}
          >
            <MapPin className="h-4 w-4" />
            {arrived ? "تم إرسال إشعار الوصول" : "لقد وصلت"}
          </Button>
        </div>
      ) : null}

      <div className="border-t border-slate-200 bg-white px-4 py-3">
        <div className="mb-3">
          <NotePicker author={role} onAttach={handleAttachNote} />
        </div>
        <div className="mb-2 flex flex-wrap gap-2">
          {quickReplies.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => push(q, role)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="اكتب رسالة..."
            className="h-11 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-teal-500"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl bg-teal-600 text-white hover:bg-teal-700"
            aria-label="إرسال"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TripChat;