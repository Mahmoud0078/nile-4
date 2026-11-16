import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { usePlatform } from "@/hooks/usePlatform";
import { platformLabel } from "@/lib/platform";
import { Smartphone, Wifi } from "lucide-react";

type Props = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export function PlatformShell({
  children,
  title = "رحلة",
  subtitle = "تطبيق النقل الذكي",
}: Props) {
  const { platform, standalone, safeTop, safeBottom, statusColor } =
    usePlatform();

  useEffect(() => {
    document.documentElement.style.setProperty("--app-status", statusColor);
  }, [statusColor]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div
        className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-slate-50 shadow-xl"
        style={{
          paddingTop: safeTop,
          paddingBottom: safeBottom,
        }}
      >
        <header
          className={cn(
            "sticky top-0 z-20 border-b border-teal-700/30",
            "bg-gradient-to-l from-teal-700 via-teal-600 to-emerald-600",
          )}
          style={{ paddingTop: safeTop > 0 ? 0 : undefined }}
        >
          <div className="flex items-center gap-3 px-5 py-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
              <Smartphone className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-lg font-bold leading-tight text-white">
                {title}
              </h1>
              <p className="text-xs text-teal-50/80">{subtitle}</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold text-white ring-1 ring-white/25">
              <Wifi className="h-3 w-3" />
              {platformLabel(platform)}
              {standalone ? " · مثبّت" : ""}
            </span>
          </div>
        </header>

        <main className="flex-1 space-y-4 px-4 py-5">{children}</main>

        <footer className="border-t border-slate-200 bg-white px-5 py-3">
          <p className="text-center text-[10px] font-medium text-slate-400">
            يعمل على Android و iOS · {platformLabel(platform)}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default PlatformShell;