import { useEredivisieStandings } from "@/hooks/useFootballApi";
import { Standing } from "@/types/footballApi";
import { cn } from "@/lib/utils";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

const AZ_TEAM_ID = 201;

const FormBadges = ({ form }: { form: string }) => {
  const chars = form.slice(-5).split("");
  const styles: Record<string, string> = {
    W: "bg-success/20 text-success",
    D: "bg-warning/20 text-warning",
    L: "bg-danger/20 text-danger",
  };
  const labels: Record<string, string> = { W: "W", D: "G", L: "V" };
  return (
    <div className="flex gap-0.5">
      {chars.map((c, i) => (
        <span key={i} className={cn("w-5 h-5 rounded text-[10px] flex items-center justify-center font-bold", styles[c] || "bg-muted text-muted-foreground")}>
          {labels[c] || c}
        </span>
      ))}
    </div>
  );
};

const Competitie = () => {
  const { data: standings, isLoading } = useEredivisieStandings();

  // Context zones
  const getZone = (rank: number): { label: string; color: string } | null => {
    if (rank === 1) return { label: "Kampioen", color: "bg-success/15 text-success" };
    if (rank <= 3) return { label: "CL-kwalificatie", color: "bg-info/15 text-info" };
    if (rank <= 5) return { label: "Europees", color: "bg-chart-accent-2/15 text-chart-accent-2" };
    if (rank >= 16) return { label: "Degradatie", color: "bg-danger/15 text-danger" };
    if (rank >= 14) return { label: "Playoffs", color: "bg-warning/15 text-warning" };
    return null;
  };

  // AZ context info
  const azStanding = standings?.find(s => s.team.id === AZ_TEAM_ID);
  const azRank = azStanding?.rank || 0;
  const teamAbove = azRank > 1 ? standings?.find(s => s.rank === azRank - 1) : null;
  const teamBelow = standings?.find(s => s.rank === azRank + 1) || null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline text-app-title tracking-tight text-foreground mb-1">Competitie</h2>
        <p className="text-app-small text-muted-foreground">Eredivisie stand, vorm en context</p>
      </div>

      {/* AZ context card */}
      {azStanding && (
        <div className="bg-card border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <img src={azStanding.team.logo} alt="" className="h-6 w-6 object-contain" />
            <span className="text-app-heading text-primary">AZ Alkmaar</span>
            <span className="text-app-tiny text-muted-foreground ml-auto">Positie #{azStanding.rank}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
            <div><div className="text-app-data-lg font-mono text-foreground">{azStanding.points}</div><div className="text-app-tiny text-muted-foreground">Punten</div></div>
            <div><div className="text-app-data-lg font-mono text-foreground">{azStanding.all.played}</div><div className="text-app-tiny text-muted-foreground">Gespeeld</div></div>
            <div><div className={cn("text-app-data-lg font-mono", azStanding.goalsDiff > 0 ? "text-success" : azStanding.goalsDiff < 0 ? "text-danger" : "text-foreground")}>{azStanding.goalsDiff > 0 ? "+" : ""}{azStanding.goalsDiff}</div><div className="text-app-tiny text-muted-foreground">Doelsaldo</div></div>
            <div><div className="text-app-data-lg font-mono text-foreground">{azStanding.all.goals.for}</div><div className="text-app-tiny text-muted-foreground">Doelpunten</div></div>
          </div>
          <div className="flex items-center gap-4 text-app-small">
            {teamAbove && (
              <span className="text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1 text-success" />
                {teamAbove.points - azStanding.points} ptn achter {teamAbove.team.name}
              </span>
            )}
            {teamBelow && (
              <span className="text-muted-foreground">
                <TrendingDown className="h-3 w-3 inline mr-1 text-info" />
                {azStanding.points - teamBelow.points} ptn voor op {teamBelow.team.name}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Full standings table */}
      {isLoading ? (
        <div className="bg-card border border-border rounded-xl p-4 animate-pulse">
          {Array.from({ length: 18 }).map((_, i) => <div key={i} className="h-10 bg-muted rounded w-full mb-1" />)}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-app-tiny text-muted-foreground border-b border-border">
                <th className="text-left p-3 w-8">#</th>
                <th className="text-left p-3">Team</th>
                <th className="text-center p-3 w-10">W</th>
                <th className="text-center p-3 w-8 hidden sm:table-cell">W</th>
                <th className="text-center p-3 w-8 hidden sm:table-cell">G</th>
                <th className="text-center p-3 w-8 hidden sm:table-cell">V</th>
                <th className="text-center p-3 w-14 hidden sm:table-cell">D+</th>
                <th className="text-center p-3 w-14 hidden sm:table-cell">D-</th>
                <th className="text-center p-3 w-12">+/-</th>
                <th className="text-center p-3 w-12 font-semibold">Ptn</th>
                <th className="text-center p-3 w-28 hidden md:table-cell">Vorm</th>
              </tr>
            </thead>
            <tbody>
              {standings?.map((team) => {
                const isAZ = team.team.id === AZ_TEAM_ID;
                const zone = getZone(team.rank);
                return (
                  <tr
                    key={team.team.id}
                    className={cn(
                      "text-app-body border-b border-border/50 transition-colors hover:bg-accent/30",
                      isAZ && "bg-primary/8"
                    )}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-app-data text-muted-foreground">{team.rank}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img src={team.team.logo} alt="" className="h-5 w-5 object-contain" />
                        <span className={cn("truncate", isAZ && "text-primary font-semibold")}>{team.team.name}</span>
                        {zone && (
                          <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full hidden lg:inline-block", zone.color)}>
                            {zone.label}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-center font-mono text-app-data text-muted-foreground">{team.all.played}</td>
                    <td className="p-3 text-center font-mono text-app-data text-success hidden sm:table-cell">{team.all.win}</td>
                    <td className="p-3 text-center font-mono text-app-data text-warning hidden sm:table-cell">{team.all.draw}</td>
                    <td className="p-3 text-center font-mono text-app-data text-danger hidden sm:table-cell">{team.all.lose}</td>
                    <td className="p-3 text-center font-mono text-app-data text-muted-foreground hidden sm:table-cell">{team.all.goals.for}</td>
                    <td className="p-3 text-center font-mono text-app-data text-muted-foreground hidden sm:table-cell">{team.all.goals.against}</td>
                    <td className={cn("p-3 text-center font-mono text-app-data font-bold", team.goalsDiff > 0 ? "text-success" : team.goalsDiff < 0 ? "text-danger" : "text-muted-foreground")}>
                      {team.goalsDiff > 0 ? "+" : ""}{team.goalsDiff}
                    </td>
                    <td className="p-3 text-center font-mono text-app-data font-bold text-foreground">{team.points}</td>
                    <td className="p-3 hidden md:table-cell">
                      {team.form && <FormBadges form={team.form} />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Competitie;
