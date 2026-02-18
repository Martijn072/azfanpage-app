import { BarChart3 } from "lucide-react";

const Spelers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline text-app-title tracking-tight text-foreground mb-1">Spelers</h2>
        <p className="text-app-small text-muted-foreground">Statistieken en vergelijkingen</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <BarChart3 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-app-heading text-foreground mb-2">Spelersstatistieken</h3>
        <p className="text-app-body text-muted-foreground max-w-md mx-auto">
          Individuele spelersdata, vergelijkingen en trends worden hier beschikbaar in een volgende fase.
        </p>
      </div>
    </div>
  );
};

export default Spelers;
