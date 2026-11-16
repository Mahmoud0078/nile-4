import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMinutes, type AppUsage } from "@/lib/data";
import { BellOff, Brain, Moon, Sparkles } from "lucide-react";

type FocusPanelProps = {
  focusMode: boolean;
  onToggleFocus: () => void;
  apps: AppUsage[];
};

export function FocusPanel({ focusMode, onToggleFocus, apps }: FocusPanelProps) {
  const overLimit = apps.filter(
    (a) => a.limitMinutes > 0 && a.usedMinutes > a.limitMinutes
  );
  const paused = focusMode ? apps.filter((a) => a.limitMinutes > 0) : [];

  return (
    <div className="space-y-6">
      <Card
        className={
          "rounded-2xl border-0 text-white shadow-md transition-colors " +
          (focusMode
            ? "bg-gradient-to-br from-indigo-700 to-violet-700"
            : "bg-gradient-to-br from-slate-800 to-slate-700")
        }
      >
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            <CardTitle className="font-serif text-xl">Focus mode</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-white/80">
            {focusMode
              ? "Distracting apps are paused and notifications are muted."
              : "Silence notifications and pause apps that hit their limit."}
          </p>
          <Button
            onClick={onToggleFocus}
            className={
              focusMode
                ? "w-full bg-white text-indigo-700 hover:bg-indigo-50"
                : "w-full bg-teal-500 text-white hover:bg-teal-400"
            }
          >
            {focusMode ? (
              <>
                <Moon className="mr-2 h-4 w-4" /> End focus mode
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Turn on focus mode
              </>
            )}
          </Button>
          {focusMode && paused.length > 0 && (
            <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/20">
              <p className="text-xs uppercase tracking-wide text-white/70">
                Paused
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {paused.map((a) => (
                  <span
                    key={a.id}
                    className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium"
                  >
                    {a.icon} {a.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BellOff className="h-5 w-5 text-rose-500" />
            <CardTitle className="font-serif text-lg">Needs attention</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {overLimit.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-sm font-medium text-slate-700">
                All apps within limits
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Nice work keeping your day balanced.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {overLimit.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-rose-800">
                    <span>{a.icon}</span>
                    {a.name}
                  </span>
                  <span className="text-xs font-semibold text-rose-600">
                    +{formatMinutes(a.usedMinutes - a.limitMinutes)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}