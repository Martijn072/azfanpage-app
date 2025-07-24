import { useQuery } from '@tanstack/react-query';
import { callFootballApi } from '@/utils/footballApiClient';
import { FootballApiResponse } from '@/types/footballApi';

export interface FixtureEvent {
  time: {
    elapsed: number;
    extra: number | null;
  };
  type: string;
  detail: string;
  player: {
    id: number;
    name: string;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  assist?: {
    id: number;
    name: string;
  };
}

export const useFixtureEvents = (fixtureId: string | null) => {
  return useQuery({
    queryKey: ['fixture-events', fixtureId],
    queryFn: async () => {
      if (!fixtureId) {
        console.log('⏸️ No fixture ID available for events');
        return [];
      }
      
      console.log('⚽ Fetching fixture events...', { fixtureId });
      const response: FootballApiResponse<FixtureEvent> = await callFootballApi('/fixtures/events', {
        fixture: fixtureId
      });
      
      console.log('📊 Events API Response:', response);
      return response.response || [];
    },
    enabled: !!fixtureId,
    staleTime: 0, // No cache for live events
    refetchInterval: (query) => {
      // Only refetch during live matches
      const context = query.state.data as FixtureEvent[] | undefined;
      return context && context.length > 0 ? 30000 : false; // 30 seconds
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};