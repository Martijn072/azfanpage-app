import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { Fixture } from "@/types/footballApi";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const AZ_TEAM_ID = 201;

interface FormComparisonChartProps {
  azFixtures: Fixture[];
  opponentFixtures: Fixture[];
  opponentId: number;
  opponentName: string;
}

const getPointsFromFixture = (fixture: Fixture, teamId: number) => {
  const isHome = fixture.teams.home.id === teamId;
  const tGoals = isHome ? fixture.goals.home : fixture.goals.away;
  const oGoals = isHome ? fixture.goals.away : fixture.goals.home;
  if (tGoals === null || oGoals === null) return 0;
  if (tGoals > oGoals) return 3;
  if (tGoals === oGoals) return 1;
  return 0;
};

export const FormComparisonChart = ({
  azFixtures,
  opponentFixtures,
  opponentId,
  opponentName,
}: FormComparisonChartProps) => {
  const data = useMemo(() => {
    const azPlayed = azFixtures
      .filter(f => ["FT", "AET", "PEN"].includes(f.fixture.status.short))
      .sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime())
      .slice(-5);

    const oppPlayed = opponentFixtures
      .filter(f => ["FT", "AET", "PEN"].includes(f.fixture.status.short))
      .sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime())
      .slice(-5);

    return Array.from({ length: 5 }, (_, i) => ({
      match: `${i + 1}`,
      az: azPlayed[i] ? getPointsFromFixture(azPlayed[i], AZ_TEAM_ID) : 0,
      opp: oppPlayed[i] ? getPointsFromFixture(oppPlayed[i], opponentId) : 0,
    }));
  }, [azFixtures, opponentFixtures, opponentId]);

  const azTotal = data.reduce((sum, d) => sum + d.az, 0);
  const oppTotal = data.reduce((sum, d) => sum + d.opp, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-app-tiny uppercase tracking-wider text-muted-foreground font-medium mb-4">
        Puntenverloop laatste 5 wedstrijden
      </h3>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-primary" />
          <span className="text-app-small text-foreground">AZ ({azTotal} ptn)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-muted-foreground/50" />
          <span className="text-app-small text-foreground">{opponentName} ({oppTotal} ptn)</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} barGap={2}>
          <XAxis
            dataKey="match"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            tickFormatter={(v) => `Wed ${v}`}
          />
          <YAxis
            domain={[0, 3]}
            ticks={[0, 1, 3]}
            tickLine={false}
            axisLine={false}
            width={20}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value: number) => [value === 3 ? "Winst (3)" : value === 1 ? "Gelijk (1)" : "Verlies (0)", ""]}
          />
          <Bar dataKey="az" radius={[3, 3, 0, 0]} maxBarSize={24}>
            {data.map((_, i) => (
              <Cell key={i} fill="hsl(var(--primary))" />
            ))}
          </Bar>
          <Bar dataKey="opp" radius={[3, 3, 0, 0]} maxBarSize={24}>
            {data.map((_, i) => (
              <Cell key={i} fill="hsl(var(--muted-foreground) / 0.4)" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
