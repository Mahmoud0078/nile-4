import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IS_ANDROID, IS_IOS, platformLabel } from "@/lib/platform";
import { Smartphone, Wifi } from "lucide-react";

type Props = {
  children: ReactNode;
};

export function AppShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div
        className="mx-auto w-full max-w-md"
        style={{
          paddingTop: "var(--safe-top)",
          paddingBottom: "var(--safe-bottom)",
          paddingLeft: "var(--safe-left)",
          paddingRight: "var(--safe-right)",
        }}
      >
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
              <Smartphone className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-serif text-base font-bold leading-tight text-slate-900">
                وصلني · Wasalni
              </h1>
              <p className="text-[10px] font-medium text-slate-500">
                تتبع الرحلة وتأكيد الوصول
              </p>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold",
                IS_IOS
                  ? "border-slate-300 bg-slate-100 text-slate-700"
                  : IS_ANDROID
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-teal-300 bg-teal-50 text-teal-700",
              )}
            >
              <Wifi className="h-3 w-3" />
              {platformLabel()}
            </span>
          </div>
        </header>

        <main className="px-4 py-4">{children}</main>

        <footer className="px-4 pb-6 pt-2">
          <p className="text-center text-[10px] font-medium text-slate-400">
            نسخة نهائية · جاهزة للعرض والتشغيل
          </p>
        </footer>
      </div>
    </div>
  );
}

export default AppShell;