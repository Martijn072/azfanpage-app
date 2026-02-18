import { cn } from "@/lib/utils";

interface H2HVisualBarProps {
  azWins: number;
  draws: number;
  oppWins: number;
  total: number;
  opponentName: string;
}

export const H2HVisualBar = ({ azWins, draws, oppWins, total, opponentName }: H2HVisualBarProps) => {
  if (total === 0) return null;

  const azPct = (azWins / total) * 100;
  const drawPct = (draws / total) * 100;
  const oppPct = (oppWins / total) * 100;

  return (
    <div>
      <div className="flex items-center justify-between text-app-tiny text-muted-foreground mb-2">
        <span className="text-primary font-medium">AZ ({azWins})</span>
        <span>Gelijk ({draws})</span>
        <span>{opponentName} ({oppWins})</span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        {azPct > 0 && (
          <div
            className="bg-primary rounded-l-full transition-all"
            style={{ width: `${azPct}%` }}
          />
        )}
        {drawPct > 0 && (
          <div
            className="bg-warning/60 transition-all"
            style={{ width: `${drawPct}%` }}
          />
        )}
        {oppPct > 0 && (
          <div
            className="bg-muted-foreground/40 rounded-r-full transition-all"
            style={{ width: `${oppPct}%` }}
          />
        )}
      </div>
    </div>
  );
};
