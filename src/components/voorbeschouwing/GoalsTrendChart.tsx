import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";
import { Fixture } from "@/types/footballApi";
import { useMemo } from "react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

const AZ_TEAM_ID = 201;

interface GoalsTrendChartProps {
  fixtures: Fixture[];
}

export const GoalsTrendChart = ({ fixtures }: GoalsTrendChartProps) => {
  const data = useMemo(() => {
    return fixtures
      .filter(f => ["FT", "AET", "PEN"].includes(f.fixture.status.short))
      .sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime())
      .slice(-8)
      .map(f => {
        const isHome = f.teams.home.id === AZ_TEAM_ID;
        const scored = (isHome ? f.goals.home : f.goals.away) ?? 0;
        const conceded = (isHome ? f.goals.away : f.goals.home) ?? 0;
        const opponent = isHome ? f.teams.away : f.teams.home;
        return {
          label: opponent.name.slice(0, 3).toUpperCase(),
          date: format(new Date(f.fixture.date), "d MMM", { locale: nl }),
          scored,
          conceded,
        };
      });
  }, [fixtures]);

  if (data.length < 3) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-app-tiny uppercase tracking-wider text-muted-foreground font-medium mb-4">
        Doelpuntentrend AZ (laatste {data.length} wedstrijden)
      </h3>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-success rounded" />
          <span className="text-app-tiny text-muted-foreground">Gescoord</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-danger rounded" />
          <span className="text-app-tiny text-muted-foreground">Tegendoelpunten</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="scoredGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="concededGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--danger))" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(var(--danger))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
          />
          <YAxis
            domain={[0, "auto"]}
            tickLine={false}
            axisLine={false}
            width={16}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={(_, payload) => {
              if (payload?.[0]?.payload?.date) return payload[0].payload.date;
              return "";
            }}
            formatter={(value: number, name: string) => [
              value,
              name === "scored" ? "Gescoord" : "Tegen",
            ]}
          />
          <Area
            type="monotone"
            dataKey="scored"
            stroke="hsl(var(--success))"
            fill="url(#scoredGrad)"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--success))", r: 3, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="conceded"
            stroke="hsl(var(--danger))"
            fill="url(#concededGrad)"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--danger))", r: 3, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
