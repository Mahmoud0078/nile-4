import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMinutes, weeklyTrend, type AppUsage } from "@/lib/data";

type UsageOverviewProps = {
  apps: AppUsage[];
  totalMinutes: number;
};

export function UsageOverview({ apps, totalMinutes }: UsageOverviewProps) {
  const topApps = [...apps].sort((a, b) => b.usedMinutes - a.usedMinutes).slice(0, 4);
  const maxUsed = Math.max(...apps.map((a) => a.usedMinutes), 1);

  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Weekly trend</CardTitle>
        <CardDescription>
          Minutes of screen time across the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "#f1f5f9" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
                formatter={(value: number) => [formatMinutes(value), "Screen time"]}
              />
              <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                {weeklyTrend.map((entry, index) => (
                  <Cell
                    key={entry.day}
                    fill={index === weeklyTrend.length - 1 ? "#0d9488" : "#99f6e4"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {topApps.map((app) => (
            <div
              key={app.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{app.icon}</span>
                <span className="truncate text-sm font-medium text-slate-700">
                  {app.name}
                </span>
              </div>
              <p className="mt-2 font-serif text-lg font-bold text-slate-900">
                {formatMinutes(app.usedMinutes)}
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round((app.usedMinutes / maxUsed) * 100)}%`,
                    backgroundColor: app.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500">
          Total tracked today:{" "}
          <span className="font-semibold text-slate-700">
            {formatMinutes(totalMinutes)}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}