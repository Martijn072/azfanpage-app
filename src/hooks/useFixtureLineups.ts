import { useQuery } from '@tanstack/react-query';
import { callFootballApi } from '@/utils/footballApiClient';
import { FootballApiResponse } from '@/types/footballApi';

export interface LineupPlayer {
  player: {
    id: number;
    name: string;
    number: number;
    pos: string;
    grid: string;
  };
}

export interface TeamLineup {
  team: {
    id: number;
    name: string;
    logo: string;
    colors: {
      player: {
        primary: string;
        number: string;
        border: string;
      };
      goalkeeper: {
        primary: string;
        number: string;
        border: string;
      };
    };
  };
  formation: string;
  startXI: LineupPlayer[];
  substitutes: LineupPlayer[];
  coach: {
    id: number;
    name: string;
    photo: string;
  };
}

export const useFixtureLineups = (fixtureId: string | null) => {
  return useQuery({
    queryKey: ['fixture-lineups', fixtureId],
    queryFn: async () => {
      if (!fixtureId) {
        console.log('⏸️ No fixture ID available for lineups');
        return [];
      }
      
      console.log('👥 Fetching fixture lineups...', { fixtureId });
      const response: FootballApiResponse<TeamLineup> = await callFootballApi('/fixtures/lineups', {
        fixture: fixtureId
      });
      
      console.log('📊 Lineups API Response:', response);
      return response.response || [];
    },
    enabled: !!fixtureId,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};