import { cn } from "@/lib/utils";
import { Bell, BellOff, Smartphone, Volume2, VolumeX } from "lucide-react";

type Props = {
  soundOn: boolean;
  onSoundChange: (v: boolean) => void;
  hapticsOn: boolean;
  onHapticsChange: (v: boolean) => void;
  vibrationSupported: boolean;
  onTest: () => void;
  className?: string;
};

export function NotificationControls({
  soundOn,
  onSoundChange,
  hapticsOn,
  onHapticsChange,
  vibrationSupported,
  onTest,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm",
        className,
      )}
    >
      <span className="flex items-center gap-1.5 px-1 text-xs font-semibold text-slate-600">
        <Bell className="h-3.5 w-3.5 text-teal-600" />
        التنبيهات
      </span>

      <button
        type="button"
        onClick={() => onSoundChange(!soundOn)}
        aria-pressed={soundOn}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition",
          soundOn
            ? "border-teal-500 bg-teal-600 text-white"
            : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100",
        )}
      >
        {soundOn ? (
          <Volume2 className="h-3.5 w-3.5" />
        ) : (
          <VolumeX className="h-3.5 w-3.5" />
        )}
        {soundOn ? "الصوت مفعّل" : "الصوت مغلق"}
      </button>

      <button
        type="button"
        onClick={() => onHapticsChange(!hapticsOn)}
        aria-pressed={hapticsOn}
        disabled={!vibrationSupported}
        title={
          vibrationSupported
            ? undefined
            : "جهازك لا يدعم الاهتزاز في المتصفح"
        }
        className={cn(
          "inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition",
          !vibrationSupported
            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300"
            : hapticsOn
              ? "border-teal-500 bg-teal-600 text-white"
              : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100",
        )}
      >
        <Smartphone className="h-3.5 w-3.5" />
        {vibrationSupported
          ? hapticsOn
            ? "الاهتزاز مفعّل"
            : "الاهتزاز مغلق"
          : "بدون اهتزاز"}
      </button>

      <button
        type="button"
        onClick={onTest}
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
      >
        {soundOn ? (
          <Bell className="h-3.5 w-3.5" />
        ) : (
          <BellOff className="h-3.5 w-3.5" />
        )}
        تجربة التنبيه
      </button>
    </div>
  );
}

export default NotificationControls;