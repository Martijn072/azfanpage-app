import { TeamLineup } from '@/hooks/useFixtureLineups';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield } from 'lucide-react';

interface FixtureLineupDisplayProps {
  homeLineup: TeamLineup | null;
  awayLineup: TeamLineup | null;
}

const LineupTeamCard = ({ lineup, isHome }: { lineup: TeamLineup; isHome: boolean }) => {
  return (
    <Card className="bg-white dark:bg-gray-800 border border-premium-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <img 
            src={lineup.team.logo} 
            alt={lineup.team.name}
            className="w-8 h-8 object-contain"
          />
          <div>
            <CardTitle className="text-base text-az-black dark:text-white">
              {lineup.team.name}
            </CardTitle>
            <Badge className="text-xs bg-premium-gray-100 text-premium-gray-700 dark:bg-gray-700 dark:text-gray-300 border-none">
              {lineup.formation}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Starting XI */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-az-red" />
            <h4 className="font-semibold text-sm text-az-black dark:text-white">Opstelling</h4>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {lineup.startXI.map((playerData) => (
              <div 
                key={playerData.player.id}
                className="flex items-center justify-between p-2 bg-premium-gray-50 dark:bg-gray-700 rounded border border-premium-gray-100 dark:border-gray-600"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-az-red text-white rounded text-xs font-bold flex items-center justify-center">
                    {playerData.player.number}
                  </div>
                  <span className="text-sm font-medium text-az-black dark:text-white">
                    {playerData.player.name}
                  </span>
                </div>
                <Badge className="text-xs bg-premium-gray-200 text-premium-gray-700 dark:bg-gray-600 dark:text-gray-300 border-none">
                  {playerData.player.pos}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Substitutes */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-premium-gray-600 dark:text-gray-400" />
            <h4 className="font-semibold text-sm text-az-black dark:text-white">Wisselspelers</h4>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {lineup.substitutes.map((playerData) => (
              <div 
                key={playerData.player.id}
                className="flex items-center justify-between p-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-premium-gray-300 dark:bg-gray-600 text-premium-gray-700 dark:text-gray-300 rounded text-xs font-bold flex items-center justify-center">
                    {playerData.player.number}
                  </div>
                  <span className="text-premium-gray-600 dark:text-gray-400">
                    {playerData.player.name}
                  </span>
                </div>
                <Badge className="text-xs bg-premium-gray-100 text-premium-gray-600 dark:bg-gray-700 dark:text-gray-400 border-none">
                  {playerData.player.pos}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Coach */}
        <div className="pt-2 border-t border-premium-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-premium-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-premium-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <div className="text-xs text-premium-gray-600 dark:text-gray-400">Trainer</div>
              <div className="text-sm font-medium text-az-black dark:text-white">{lineup.coach.name}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const FixtureLineupDisplay = ({ homeLineup, awayLineup }: FixtureLineupDisplayProps) => {
  if (!homeLineup || !awayLineup) {
    return (
      <Card className="bg-white dark:bg-gray-800 border border-premium-gray-200 dark:border-gray-700">
        <CardContent className="text-center py-8">
          <p className="text-premium-gray-600 dark:text-gray-300">
            Opstellingen nog niet beschikbaar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <LineupTeamCard lineup={homeLineup} isHome={true} />
      <LineupTeamCard lineup={awayLineup} isHome={false} />
    </div>
  );
};