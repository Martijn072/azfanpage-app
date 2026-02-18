import { useAZFixtures } from "@/hooks/useFootballApi";
import { useFixtureStatistics } from "@/hooks/useFixtureStatistics";
import { useFixtureEvents } from "@/hooks/useFixtureEvents";
import { useFixtureLineups } from "@/hooks/useFixtureLineups";
import { StatComparisonBars } from "@/components/wedstrijd/StatComparisonBars";
import { EventsTimeline } from "@/components/wedstrijd/EventsTimeline";
import { FormationDisplay } from "@/components/wedstrijd/FormationDisplay";
import { Fixture } from "@/types/footballApi";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, ArrowRight } from "lucide-react";

const AZ_TEAM_ID = 201;

type Tab = "statistieken" | "tijdlijn" | "opstelling";

const Nabeschouwing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("statistieken");
  const { data: lastFixtures, isLoading: fixtureLoading } = useAZFixtures(AZ_TEAM_ID, 1);

  const fixture = lastFixtures?.[0] || null;
  const fixtureId = fixture?.fixture.id.toString() || null;

  const { data: stats, isLoading: statsLoading } = useFixtureStatistics(fixtureId);
  const { data: events, isLoading: eventsLoading } = useFixtureEvents(fixtureId);
  const { data: lineups, isLoading: lineupsLoading } = useFixtureLineups(fixtureId);

  const isPlayed = fixture && (fixture.fixture.status.short === "FT" || fixture.fixture.status.short === "AET" || fixture.fixture.status.short === "PEN");

  // Quick insights
  const insights = useMemo(() => {
    if (!fixture || !stats || stats.length < 2 || !isPlayed) return [];
    const items: string[] = [];
    const isAZHome = fixture.teams.home.id === AZ_TEAM_ID;
    const azStats = stats.find(s => s.team.id === AZ_TEAM_ID);
    const oppStats = stats.find(s => s.team.id !== AZ_TEAM_ID);
    if (!azStats || !oppStats) return items;

    const getStat = (team: typeof azStats, type: string) => {
      const s = team.statistics.find(s => s.type === type);
      if (!s || !s.value) return 0;
      return parseFloat(String(s.value).replace("%", "")) || 0;
    };

    const azPoss = getStat(azStats, "Ball Possession");
    const oppPoss = getStat(oppStats, "Ball Possession");
    if (azPoss > 55) items.push(`AZ domineerde het balbezit met ${azPoss}%`);
    else if (oppPoss > 55) items.push(`Tegenstander had meer balbezit: ${oppPoss}%`);

    const azShots = getStat(azStats, "Total Shots");
    const oppShots = getStat(oppStats, "Total Shots");
    if (azShots > oppShots * 1.5) items.push(`AZ creëerde veel meer kansen (${azShots} vs ${oppShots} schoten)`);

    const azGoals = isAZHome ? fixture.goals.home! : fixture.goals.away!;
    const oppGoals = isAZHome ? fixture.goals.away! : fixture.goals.home!;
    if (azGoals > oppGoals) items.push(`Overwinning met ${azGoals}-${oppGoals}`);
    else if (azGoals < oppGoals) items.push(`Verlies met ${azGoals}-${oppGoals}`);
    else items.push(`Gelijkspel: ${azGoals}-${oppGoals}`);

    return items;
  }, [fixture, stats, isPlayed]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "statistieken", label: "Statistieken" },
    { key: "tijdlijn", label: "Tijdlijn" },
    { key: "opstelling", label: "Opstelling" },
  ];

  if (fixtureLoading) {
    return (
      <div className="space-y-6">
        <div><h2 className="font-headline text-app-title tracking-tight text-foreground mb-1">Nabeschouwing</h2></div>
        <div className="bg-card border border-border rounded-xl p-6 animate-pulse h-48" />
      </div>
    );
  }

  if (!fixture || !isPlayed) {
    return (
      <div className="space-y-6">
        <div><h2 className="font-headline text-app-title tracking-tight text-foreground mb-1">Nabeschouwing</h2></div>
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-app-body text-muted-foreground">Geen recente gespeelde wedstrijd gevonden</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-app-title tracking-tight text-foreground mb-1">Nabeschouwing</h2>
          <p className="text-app-small text-muted-foreground">Analyse van de laatste wedstrijd</p>
        </div>
        <button
          onClick={() => navigate(`/wedstrijden/${fixture.fixture.id}`)}
          className="flex items-center gap-1 text-app-small text-primary hover:underline"
        >
          Volledig detail <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Match header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="text-center mb-4">
          <div className="text-app-tiny text-muted-foreground">{fixture.league.name} · {fixture.league.round}</div>
          <div className="text-app-tiny text-muted-foreground">
            {format(new Date(fixture.fixture.date), "EEEE d MMMM yyyy", { locale: nl })}
          </div>
        </div>
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center gap-3 flex-1 justify-end">
            <span className={cn("text-app-heading text-right", fixture.teams.home.id === AZ_TEAM_ID && "text-primary font-bold")}>
              {fixture.teams.home.name}
            </span>
            <img src={fixture.teams.home.logo} alt="" className="h-12 w-12 object-contain" />
          </div>
          <div className="text-center shrink-0">
            <div className="text-app-data-lg font-mono text-foreground tracking-tight">
              {fixture.goals.home} — {fixture.goals.away}
            </div>
            <div className="text-app-tiny text-muted-foreground">
              HT: {fixture.score.halftime.home} - {fixture.score.halftime.away}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-1">
            <img src={fixture.teams.away.logo} alt="" className="h-12 w-12 object-contain" />
            <span className={cn("text-app-heading", fixture.teams.away.id === AZ_TEAM_ID && "text-primary font-bold")}>
              {fixture.teams.away.name}
            </span>
          </div>
        </div>
      </div>

      {/* Quick insights */}
      {insights.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-info" />
            <h3 className="text-app-body-strong text-foreground">Data-highlights</h3>
          </div>
          <ul className="space-y-1">
            {insights.map((insight, i) => (
              <li key={i} className="text-app-small text-muted-foreground flex items-start gap-2">
                <span className="text-info mt-0.5">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-card border border-border rounded-lg p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-1.5 rounded-md text-app-body transition-colors duration-150",
              activeTab === tab.key
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-card border border-border rounded-xl p-6">
        {activeTab === "statistieken" && (
          statsLoading ? (
            <div className="space-y-4 animate-pulse">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-6 bg-muted rounded w-full" />)}</div>
          ) : stats && stats.length >= 2 ? (
            <StatComparisonBars stats={stats} homeTeamId={fixture.teams.home.id} />
          ) : (
            <p className="text-app-body text-muted-foreground text-center py-8">Geen statistieken beschikbaar</p>
          )
        )}
        {activeTab === "tijdlijn" && (
          eventsLoading ? (
            <div className="space-y-2 animate-pulse">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-8 bg-muted rounded w-full" />)}</div>
          ) : (
            <EventsTimeline events={events || []} homeTeamId={fixture.teams.home.id} />
          )
        )}
        {activeTab === "opstelling" && (
          lineupsLoading ? (
            <div className="grid grid-cols-2 gap-6"><div className="h-80 bg-muted rounded-xl animate-pulse" /><div className="h-80 bg-muted rounded-xl animate-pulse" /></div>
          ) : (
            <FormationDisplay lineups={lineups || []} homeTeamId={fixture.teams.home.id} />
          )
        )}
      </div>
    </div>
  );
};

export default Nabeschouwing;
