import { useQuery } from '@tanstack/react-query';
import { callFootballApi } from '@/utils/footballApiClient';
import { FootballApiResponse, PlayerStatisticsResponse } from '@/types/footballApi';
import { getCurrentActiveSeason } from '@/utils/seasonUtils';

export const usePlayerStatistics = (playerId: number | null, season?: string) => {
  const seasonInfo = getCurrentActiveSeason();
  const currentSeason = season || seasonInfo.currentSeason;

  return useQuery({
    queryKey: ['player-statistics', playerId, currentSeason],
    queryFn: async () => {
      if (!playerId) return null;

      console.log('⚽ Fetching player statistics...', { playerId, season: currentSeason });
      const response: FootballApiResponse<PlayerStatisticsResponse> = await callFootballApi('/players', {
        id: playerId.toString(),
        season: currentSeason,
      });

      return response.response[0] || null;
    },
    enabled: !!playerId,
    staleTime: 1000 * 60 * 60, // 1h cache
    retry: 2,
  });
};
