import { useQuery } from '@tanstack/react-query';
import { callFootballApi } from '@/utils/footballApiClient';
import { FootballApiResponse, Fixture } from '@/types/footballApi';

/**
 * Fetches recent fixtures for any team (not limited to a specific league).
 * Useful for opponent form analysis in Voorbeschouwing.
 */
export const useOpponentRecentForm = (teamId: number | null, count: number = 5) => {
  return useQuery({
    queryKey: ['opponent-recent-form', teamId, count],
    queryFn: async () => {
      if (!teamId) return [];
      
      console.log('📊 Fetching opponent recent form...', { teamId, count });
      const response: FootballApiResponse<Fixture> = await callFootballApi('/fixtures', {
        team: teamId.toString(),
        last: count.toString(),
        timezone: 'Europe/Amsterdam'
      });
      
      return response.response || [];
    },
    enabled: !!teamId,
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });
};
