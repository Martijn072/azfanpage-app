import { useNextAZFixture, useEredivisieStandings } from "@/hooks/useFootballApi";
import { useTeamStatistics } from "@/hooks/useTeamStatistics";
import { useHeadToHead } from "@/hooks/useHeadToHead";
import { useTeamFixtures } from "@/hooks/useTeamFixtures";
import { Fixture, Standing } from "@/types/footballApi";
import { format, formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { Trophy, MapPin, TrendingUp, Swords, BarChart3 } from "lucide-react";

const AZ_TEAM_ID = 201;

const FormBadge = ({ form }: { form: string | undefined }) => {
  if (!form) return null;
  const chars = form.slice(-5).split("");
  const styles: Record<string, string> = {
    W: "bg-success/20 text-success",
    D: "bg-warning/20 text-warning",
    L: "bg-danger/20 text-danger",
  };
  const labels: Record<string, string> = { W: "W", D: "G", L: "V" };
  return (
    <div className="flex gap-1">
      {chars.map((c, i) => (
        <span key={i} className={cn("w-6 h-6 rounded flex items-center justify-center text-app-tiny font-bold", styles[c] || "bg-muted text-muted-foreground")}>
          {labels[c] || c}
        </span>
      ))}
    </div>
  );
};

const Voorbeschouwing = () => {
  const { data: nextFixture, isLoading: fixtureLoading } = useNextAZFixture(AZ_TEAM_ID);
  const { data: standings, isLoading: standingsLoading } = useEredivisieStandings();
  const { data: azStats } = useTeamStatistics(AZ_TEAM_ID);
  const { data: allFixtures } = useTeamFixtures(AZ_TEAM_ID);

  const opponentId = useMemo(() => {
    if (!nextFixture) return null;
    return nextFixture.teams.home.id === AZ_TEAM_ID
      ? nextFixture.teams.away.id
      : nextFixture.teams.home.id;
  }, [nextFixture]);

  const { data: opponentStats } = useTeamStatistics(opponentId || 0);
  const { data: h2hFixtures } = useHeadToHead(AZ_TEAM_ID, opponentId);

  // Recent form from fixtures
  const recentForm = useMemo(() => {
    if (!allFixtures) return [];
    return allFixtures
      .filter(f => f.fixture.status.short === "FT" || f.fixture.status.short === "AET")
      .sort((a, b) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime())
      .slice(0, 5);
  }, [allFixtures]);

  const azStanding = standings?.find(s => s.team.id === AZ_TEAM_ID);
  const oppStanding = opponentId ? standings?.find(s => s.team.id === opponentId) : null;

  // H2H summary
  const h2hSummary = useMemo(() => {
    if (!h2hFixtures || h2hFixtures.length === 0) return null;
    let azWins = 0, draws = 0, oppWins = 0;
    h2hFixtures.forEach((f: Fixture) => {
      const azHome = f.teams.home.id === AZ_TEAM_ID;
      const azGoals = azHome ? f.goals.home : f.goals.away;
      const oppGoals = azHome ? f.goals.away : f.goals.home;
      if (azGoals !== null && oppGoals !== null) {
        if (azGoals > oppGoals) azWins++;
        else if (azGoals < oppGoals) oppWins++;
        else draws++;
      }
    });
    return { azWins, draws, oppWins, total: h2hFixtures.length };
  }, [h2hFixtures]);

  if (fixtureLoading) {
    return (
      <div className="space-y-6">
        <div><h2 className="font-headline text-app-title tracking-tight text-foreground mb-1">Voorbeschouwing</h2></div>
        <div className="bg-card border border-border rounded-xl p-6 animate-pulse h-48" />
      </div>
    );
  }

  if (!nextFixture) {
    return (
      <div className="space-y-6">
        <div><h2 className="font-headline text-app-title tracking-tight text-foreground mb-1">Voorbeschouwing</h2></div>
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-app-body text-muted-foreground">Geen aankomende wedstrijd gevonden</p>
        </div>
      </div>
    );
  }

  const matchDate = new Date(nextFixture.fixture.date);
  const isAZHome = nextFixture.teams.home.id === AZ_TEAM_ID;
  const opponent = isAZHome ? nextFixture.teams.away : nextFixture.teams.home;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline text-app-title tracking-tight text-foreground mb-1">Voorbeschouwing</h2>
        <p className="text-app-small text-muted-foreground">
          Data-analyse voor de volgende wedstrijd
        </p>
      </div>

      {/* Match header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <span className="text-app-small text-muted-foreground">{nextFixture.league.name} · {nextFixture.league.round}</span>
          </div>
          <span className="text-app-tiny bg-info/15 text-info px-2 py-0.5 rounded-full font-medium">
            {formatDistanceToNow(matchDate, { addSuffix: true, locale: nl })}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img src={nextFixture.teams.home.logo} alt="" className="h-12 w-12 object-contain" />
            <div>
              <span className={cn("text-app-heading block", isAZHome && "text-primary")}>{nextFixture.teams.home.name}</span>
              {azStanding && isAZHome && <span className="text-app-tiny text-muted-foreground">#{azStanding.rank} · {azStanding.points} ptn</span>}
              {oppStanding && !isAZHome && <span className="text-app-tiny text-muted-foreground">#{oppStanding.rank} · {oppStanding.points} ptn</span>}
            </div>
          </div>
          <div className="text-center shrink-0">
            <div className="text-app-data-lg font-mono text-foreground">{format(matchDate, "HH:mm")}</div>
            <div className="text-app-tiny text-muted-foreground">{format(matchDate, "EEEE d MMMM", { locale: nl })}</div>
          </div>
          <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
            <div className="text-right">
              <span className={cn("text-app-heading block", !isAZHome && "text-primary")}>{nextFixture.teams.away.name}</span>
              {azStanding && !isAZHome && <span className="text-app-tiny text-muted-foreground">#{azStanding.rank} · {azStanding.points} ptn</span>}
              {oppStanding && isAZHome && <span className="text-app-tiny text-muted-foreground">#{oppStanding.rank} · {oppStanding.points} ptn</span>}
            </div>
            <img src={nextFixture.teams.away.logo} alt="" className="h-12 w-12 object-contain" />
          </div>
        </div>

        {nextFixture.fixture.venue && (
          <div className="mt-3 flex items-center gap-1 text-app-tiny text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {nextFixture.fixture.venue.name}, {nextFixture.fixture.venue.city}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Vorm AZ */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-app-body-strong text-foreground">Vorm AZ</h3>
          </div>
          {azStats?.form ? (
            <>
              <FormBadge form={azStats.form} />
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-app-data-lg font-mono text-success">{azStats.fixtures.wins.total}</div>
                  <div className="text-app-tiny text-muted-foreground">Winst</div>
                </div>
                <div>
                  <div className="text-app-data-lg font-mono text-warning">{azStats.fixtures.draws.total}</div>
                  <div className="text-app-tiny text-muted-foreground">Gelijk</div>
                </div>
                <div>
                  <div className="text-app-data-lg font-mono text-danger">{azStats.fixtures.loses.total}</div>
                  <div className="text-app-tiny text-muted-foreground">Verlies</div>
                </div>
              </div>
              <div className="mt-3 flex justify-between text-app-small">
                <span className="text-muted-foreground">Doelpunten voor</span>
                <span className="text-foreground font-mono">{azStats.goals.for.total.total} ({azStats.goals.for.average.total}/wed)</span>
              </div>
              <div className="flex justify-between text-app-small">
                <span className="text-muted-foreground">Doelpunten tegen</span>
                <span className="text-foreground font-mono">{azStats.goals.against.total.total} ({azStats.goals.against.average.total}/wed)</span>
              </div>
            </>
          ) : (
            <p className="text-app-small text-muted-foreground">Laden...</p>
          )}
        </div>

        {/* Vorm Tegenstander */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-app-body-strong text-foreground">Vorm {opponent.name}</h3>
          </div>
          {opponentStats?.form ? (
            <>
              <FormBadge form={opponentStats.form} />
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-app-data-lg font-mono text-success">{opponentStats.fixtures.wins.total}</div>
                  <div className="text-app-tiny text-muted-foreground">Winst</div>
                </div>
                <div>
                  <div className="text-app-data-lg font-mono text-warning">{opponentStats.fixtures.draws.total}</div>
                  <div className="text-app-tiny text-muted-foreground">Gelijk</div>
                </div>
                <div>
                  <div className="text-app-data-lg font-mono text-danger">{opponentStats.fixtures.loses.total}</div>
                  <div className="text-app-tiny text-muted-foreground">Verlies</div>
                </div>
              </div>
              <div className="mt-3 flex justify-between text-app-small">
                <span className="text-muted-foreground">Doelpunten voor</span>
                <span className="text-foreground font-mono">{opponentStats.goals.for.total.total} ({opponentStats.goals.for.average.total}/wed)</span>
              </div>
              <div className="flex justify-between text-app-small">
                <span className="text-muted-foreground">Doelpunten tegen</span>
                <span className="text-foreground font-mono">{opponentStats.goals.against.total.total} ({opponentStats.goals.against.average.total}/wed)</span>
              </div>
            </>
          ) : (
            <p className="text-app-small text-muted-foreground">Laden...</p>
          )}
        </div>
      </div>

      {/* Head to Head */}
      {h2hSummary && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Swords className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-app-body-strong text-foreground">Onderlinge resultaten (laatste {h2hSummary.total})</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <div className="text-app-data-lg font-mono text-primary">{h2hSummary.azWins}</div>
              <div className="text-app-tiny text-muted-foreground">AZ winst</div>
            </div>
            <div>
              <div className="text-app-data-lg font-mono text-warning">{h2hSummary.draws}</div>
              <div className="text-app-tiny text-muted-foreground">Gelijk</div>
            </div>
            <div>
              <div className="text-app-data-lg font-mono text-muted-foreground">{h2hSummary.oppWins}</div>
              <div className="text-app-tiny text-muted-foreground">{opponent.name} winst</div>
            </div>
          </div>

          {/* Recent H2H matches */}
          <div className="space-y-2">
            {h2hFixtures?.slice(0, 5).map((f: Fixture) => {
              const azHome = f.teams.home.id === AZ_TEAM_ID;
              const azGoals = azHome ? f.goals.home : f.goals.away;
              const oppGoals = azHome ? f.goals.away : f.goals.home;
              let result = "G";
              if (azGoals !== null && oppGoals !== null) {
                if (azGoals > oppGoals) result = "W";
                else if (azGoals < oppGoals) result = "V";
              }
              const resultStyles: Record<string, string> = {
                W: "text-success",
                G: "text-warning",
                V: "text-danger",
              };
              return (
                <div key={f.fixture.id} className="flex items-center justify-between text-app-small">
                  <span className="text-muted-foreground w-20">{format(new Date(f.fixture.date), "d MMM yy", { locale: nl })}</span>
                  <span className="flex-1 text-foreground">
                    {f.teams.home.name} <span className={cn("font-mono font-bold", resultStyles[result])}>{f.goals.home} - {f.goals.away}</span> {f.teams.away.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stand context */}
      {azStanding && oppStanding && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-app-body-strong text-foreground">Stand-context</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[azStanding, oppStanding].map(s => {
              const isAZ = s.team.id === AZ_TEAM_ID;
              return (
                <div key={s.team.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <img src={s.team.logo} alt="" className="h-5 w-5 object-contain" />
                    <span className={cn("text-app-body-strong", isAZ && "text-primary")}>{s.team.name}</span>
                    <span className="text-app-tiny text-muted-foreground">#{s.rank}</span>
                  </div>
                  <div className="space-y-1 text-app-small">
                    <div className="flex justify-between"><span className="text-muted-foreground">Punten</span><span className="font-mono text-foreground">{s.points}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Gespeeld</span><span className="font-mono text-foreground">{s.all.played}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">W-G-V</span><span className="font-mono text-foreground">{s.all.win}-{s.all.draw}-{s.all.lose}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Doelsaldo</span><span className={cn("font-mono", s.goalsDiff > 0 ? "text-success" : s.goalsDiff < 0 ? "text-danger" : "text-foreground")}>{s.goalsDiff > 0 ? "+" : ""}{s.goalsDiff}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Voorbeschouwing;
