import { cn } from "@/lib/utils";
import type { PermissionState } from "@/hooks/useGeolocation";
import {
  AlertTriangle,
  Loader2,
  LocateFixed,
  MapPinOff,
  ShieldAlert,
} from "lucide-react";

type Props = {
  permission: PermissionState;
  loading: boolean;
  error: string | null;
  onRequest: () => void;
  className?: string;
};

export function LocationGate({
  permission,
  loading,
  error,
  onRequest,
  className,
}: Props) {
  const denied = permission === "denied";

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 shadow-sm",
        denied
          ? "border-rose-200 bg-rose-50"
          : "border-teal-200 bg-teal-50",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white",
            denied ? "bg-rose-600" : "bg-teal-600",
          )}
        >
          {denied ? (
            <MapPinOff className="h-5 w-5" />
          ) : (
            <LocateFixed className="h-5 w-5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">
            {denied ? "الموقع غير مُفعّل" : "تفعيل خدمة الموقع"}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
            {denied
              ? "افتح إعدادات الجهاز وامنح التطبيق إذن الموقع (أثناء الاستخدام) لتأكيد وصولك لنقطة الالتقاء."
              : "نحتاج موقعك الحالي لتحديد المسافة إلى النقطة A وفتح زر «لقد وصلت» تلقائياً."}
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
          <p className="text-[11px] font-medium leading-relaxed text-amber-800">
            {error}
          </p>
        </div>
      ) : null}

      {denied ? (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2">
          <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
          <p className="text-[11px] font-medium leading-relaxed text-rose-700">
            iOS: الإعدادات ← الخصوصية ← خدمات الموقع. Android: الإعدادات ←
            التطبيقات ← الأذونات ← الموقع.
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onRequest}
        disabled={loading}
        className={cn(
          "mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition active:scale-[0.99]",
          denied
            ? "bg-rose-600 hover:bg-rose-700"
            : "bg-teal-600 hover:bg-teal-700",
          loading && "cursor-not-allowed opacity-70",
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            جاري تحديد الموقع...
          </>
        ) : (
          <>
            <LocateFixed className="h-4 w-4" />
            {denied ? "إعادة المحاولة" : "تفعيل الموقع"}
          </>
        )}
      </button>
    </div>
  );
}

export default LocationGate;