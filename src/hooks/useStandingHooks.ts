
import { useQuery } from '@tanstack/react-query';
import { callFootballApi } from '@/utils/footballApiClient';
import { FootballApiResponse, Standing } from '@/types/footballApi';
import { getCurrentActiveSeason } from '@/utils/seasonUtils';

// Hook for Eredivisie standings
export const useEredivisieStandings = (season?: string) => {
  const seasonInfo = getCurrentActiveSeason();
  const currentSeason = season || seasonInfo.currentSeason;
  
  return useQuery({
    queryKey: ['eredivisie-standings', currentSeason],
    queryFn: async () => {
      console.log(`🏆 Fetching Eredivisie standings for season ${currentSeason}...`);
      const response: FootballApiResponse<{ league: { standings: Standing[][] } }> = await callFootballApi('/standings', {
        league: '88', // Eredivisie league ID
        season: currentSeason
      });
      
      console.log('📊 Standings API Response:', response);
      return response.response[0]?.league.standings[0] || [];
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
