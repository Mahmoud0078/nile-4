import { cn } from "@/lib/utils";
import { BellRing, Navigation, Volume2 } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  subtitle: string;
  repeatCount: number;
  onAcknowledge: () => void;
  className?: string;
};

export function AlertOverlay({
  open,
  title,
  subtitle,
  repeatCount,
  onAcknowledge,
  className,
}: Props) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 p-4 sm:inset-0 sm:flex sm:items-center sm:justify-center",
        className,
      )}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      <div className="relative w-full overflow-hidden rounded-2xl border border-amber-300 bg-white shadow-2xl sm:max-w-sm">
        <div className="flex items-center gap-3 bg-gradient-to-l from-amber-100 to-amber-50 p-4">
          <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-50" />
            <BellRing className="relative h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-amber-900">{title}</p>
            <p className="mt-0.5 text-xs font-medium text-amber-800">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
            <Volume2 className="h-4 w-4 shrink-0 animate-pulse text-amber-600" />
            <p className="text-xs font-semibold text-amber-800">
              {repeatCount > 0
                ? `تنبيه متكرر (${repeatCount}) — يزيد كل مرة حتى تؤكّد`
                : "تنبيه صوتي واهتزاز قيد التشغيل"}
            </p>
          </div>

          <button
            type="button"
            onClick={onAcknowledge}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 text-sm font-bold text-white transition hover:bg-teal-700 active:scale-[0.99]"
          >
            <Navigation className="h-4 w-4" />
            أنا في طريقي
          </button>

          <p className="text-center text-[11px] text-slate-500">
            اضغط الزر لإيقاف التنبيهات الصوتية والاهتزاز
          </p>
        </div>
      </div>
    </div>
  );
}

export default AlertOverlay;