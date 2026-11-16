import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { formatMinutes, type AppUsage } from "@/lib/data";
import { Minus, Plus } from "lucide-react";

type AppUsageListProps = {
  apps: AppUsage[];
  onToggleLimit: (id: string) => void;
  onSetLimit: (id: string, minutes: number) => void;
};

export function AppUsageList({
  apps,
  onToggleLimit,
  onSetLimit,
}: AppUsageListProps) {
  const sorted = [...apps].sort((a, b) => b.usedMinutes - a.usedMinutes);

  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="font-serif text-xl">App usage & limits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.map((app) => {
          const hasLimit = app.limitMinutes > 0;
          const pct = hasLimit
            ? Math.min(Math.round((app.usedMinutes / app.limitMinutes) * 100), 100)
            : 0;
          const over = hasLimit && app.usedMinutes > app.limitMinutes;

          return (
            <div
              key={app.id}
              className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
                    style={{ backgroundColor: `${app.color}1a` }}
                  >
                    {app.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">
                      {app.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {app.category} · {formatMinutes(app.usedMinutes)} used
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden text-xs text-slate-500 sm:inline">
                    Limit
                  </span>
                  <Switch
                    checked={hasLimit}
                    onCheckedChange={() => onToggleLimit(app.id)}
                  />
                </div>
              </div>

              {hasLimit && (
                <div className="mt-3 space-y-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: over ? "#e11d48" : app.color,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        "text-xs font-medium " +
                        (over ? "text-rose-600" : "text-slate-500")
                      }
                    >
                      {over
                        ? `Over by ${formatMinutes(app.usedMinutes - app.limitMinutes)}`
                        : `${formatMinutes(app.limitMinutes - app.usedMinutes)} left`}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() =>
                          onSetLimit(app.id, Math.max(15, app.limitMinutes - 15))
                        }
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-14 text-center text-xs font-semibold text-slate-700">
                        {formatMinutes(app.limitMinutes)}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => onSetLimit(app.id, app.limitMinutes + 15)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}