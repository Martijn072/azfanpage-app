import { useQuery } from '@tanstack/react-query';
import { callFootballApi } from '@/utils/footballApiClient';
import { FootballApiResponse, Fixture } from '@/types/footballApi';

export const useHeadToHead = (teamId1: number, teamId2: number | null) => {
  return useQuery({
    queryKey: ['head-to-head', teamId1, teamId2],
    queryFn: async () => {
      if (!teamId2) return [];
      
      console.log('🔄 Fetching H2H...', { teamId1, teamId2 });
      const response: FootballApiResponse<Fixture> = await callFootballApi('/fixtures/headtohead', {
        h2h: `${teamId1}-${teamId2}`,
        last: '10',
        timezone: 'Europe/Amsterdam'
      });
      
      return response.response || [];
    },
    enabled: !!teamId2,
    staleTime: 1000 * 60 * 60,
    retry: 2,
  });
};
