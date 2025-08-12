
import { useQuery } from '@tanstack/react-query';
import { callFootballApi } from '@/utils/footballApiClient';
import { FootballApiResponse } from '@/types/footballApi';
import { getCurrentActiveSeason } from '@/utils/seasonUtils';

interface League {
  id: number;
  name: string;
  type: string;
  logo: string;
  country: {
    name: string;
    code: string;
    flag: string;
  };
  seasons: Array<{
    year: number;
    start: string;
    end: string;
    current: boolean;
  }>;
}

export const useLeagueIdByName = (country: string, leagueName: string) => {
  const seasonInfo = getCurrentActiveSeason();
  
  return useQuery({
    queryKey: ['league-id', country, leagueName, seasonInfo.currentSeason],
    queryFn: async () => {
      console.log(`🔍 Searching for league: "${leagueName}" in ${country} for season ${seasonInfo.currentSeason}...`);
      
      const response: FootballApiResponse<League> = await callFootballApi('/leagues', {
        country: country,
        season: seasonInfo.currentSeason
      });
      
      console.log('📊 Leagues API Response:', response);
      
      // Find the league by name (case insensitive)
      const league = response.response.find(item => 
        item.name.toLowerCase().includes(leagueName.toLowerCase()) ||
        item.name.toLowerCase().includes('eerste divisie') ||
        item.name.toLowerCase().includes('keuken kampioen divisie')
      );
      
      const leagueId = league ? league.id : null;
      const foundName = league ? league.name : null;
      
      console.log(`🆔 League found: "${foundName}" with ID: ${leagueId}`);
      
      return { id: leagueId, name: foundName };
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
