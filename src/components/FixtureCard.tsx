import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Fixture } from '@/types/footballApi';

interface FixtureCardProps {
  fixture: Fixture;
  onFixtureClick: (fixtureId: number) => void;
  formatDate: (dateString: string) => string;
  getCompetitionName: (leagueId: number, leagueName: string) => string;
  getCompetitionBadgeVariant: (leagueId: number) => "default" | "secondary" | "destructive" | "outline";
  translateRound: (round: string) => string;
  normalizeVenueName?: (venueName: string | undefined, homeTeamName: string, awayTeamName: string) => string;
}

// Helper to get competition color for mobile dot indicator
const getCompetitionColor = (leagueId: number) => {
  switch (leagueId) {
    case 88: return 'bg-az-red'; // Eredivisie
    case 848: 
    case 3: 
    case 2: return 'bg-blue-500'; // Europa
    case 94: return 'bg-orange-500'; // Beker
    case 89: return 'bg-emerald-500'; // Eerste Divisie
    default: return 'bg-muted-foreground';
  }
};

// Short date format for mobile: "Wo 18 dec, 20:00"
const formatShortDate = (dateString: string) => {
  const date = new Date(dateString);
  const dayNames = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
  const monthNames = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  
  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${dayName} ${day} ${month}, ${hours}:${minutes}`;
};

export const FixtureCard = ({ 
  fixture, 
  onFixtureClick, 
  formatDate, 
  getCompetitionName, 
  getCompetitionBadgeVariant, 
  translateRound,
  normalizeVenueName
}: FixtureCardProps) => {
  const hasScore = fixture.goals.home !== null && fixture.goals.away !== null;
  
  return (
    <div 
      onClick={() => onFixtureClick(fixture.fixture.id)}
      className="card-premium p-3 sm:p-4 hover:shadow-md transition-all cursor-pointer"
    >
      {/* Mobile: Compact 2-row layout */}
      <div className="sm:hidden">
        {/* Row 1: Date + competition color dot */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium">
            {formatShortDate(fixture.fixture.date)}
          </span>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${getCompetitionColor(fixture.league.id)}`} />
            <span className="text-xs text-muted-foreground">
              {getCompetitionName(fixture.league.id, fixture.league.name)}
            </span>
          </div>
        </div>
        
        {/* Row 2: Logos + Score/VS */}
        <div className="flex items-center justify-center gap-6">
          <img 
            src={fixture.teams.home.logo} 
            alt={fixture.teams.home.name}
            className="w-10 h-10 object-contain"
          />
          
          {hasScore ? (
            <div className="text-xl font-bold text-az-red min-w-[60px] text-center">
              {fixture.goals.home} - {fixture.goals.away}
            </div>
          ) : (
            <div className="text-muted-foreground font-medium text-lg min-w-[60px] text-center">
              vs
            </div>
          )}
          
          <img 
            src={fixture.teams.away.logo} 
            alt={fixture.teams.away.name}
            className="w-10 h-10 object-contain"
          />
        </div>
        
        {/* Row 3: Venue only */}
        <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 mr-1" />
          <span className="truncate">
            {normalizeVenueName 
              ? normalizeVenueName(fixture.fixture.venue?.name, fixture.teams.home.name, fixture.teams.away.name)
              : fixture.fixture.venue?.name || 'Onbekend'
            }
          </span>
        </div>
      </div>

      {/* Desktop: Full layout */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{formatDate(fixture.fixture.date)}</span>
          </div>
          <Badge 
            variant={getCompetitionBadgeVariant(fixture.league.id)}
            className={`text-xs font-semibold ${
              fixture.league.id === 88 
                ? 'bg-az-red text-white hover:bg-az-red/90 border-az-red' 
                : fixture.league.id === 848
                ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600'
                : fixture.league.id === 94
                ? 'bg-orange-600 text-white hover:bg-orange-700 border-orange-600'
                : 'border-border text-muted-foreground'
            }`}
          >
            {getCompetitionName(fixture.league.id, fixture.league.name)}
          </Badge>
        </div>

        <div className="flex items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <img 
              src={fixture.teams.home.logo} 
              alt={fixture.teams.home.name}
              className="w-12 h-12 object-contain"
            />
            <span className="font-semibold text-foreground text-center text-sm">
              {fixture.teams.home.name}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            {hasScore ? (
              <div className="text-3xl font-bold text-az-red">
                {fixture.goals.home} - {fixture.goals.away}
              </div>
            ) : (
              <div className="text-muted-foreground font-medium text-lg">
                vs
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <img 
              src={fixture.teams.away.logo} 
              alt={fixture.teams.away.name}
              className="w-12 h-12 object-contain"
            />
            <span className="font-semibold text-foreground text-center text-sm">
              {fixture.teams.away.name}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="truncate">
              {normalizeVenueName 
                ? normalizeVenueName(fixture.fixture.venue?.name, fixture.teams.home.name, fixture.teams.away.name)
                : fixture.fixture.venue?.name || 'Onbekend'
              }
            </span>
          </div>
          <Badge 
            variant="outline" 
            className="text-xs bg-muted/50 border-border text-muted-foreground"
          >
            {translateRound(fixture.league.round)}
          </Badge>
        </div>
      </div>
    </div>
  );
};
