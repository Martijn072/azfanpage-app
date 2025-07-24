import { FixtureEvent } from '@/hooks/useFixtureEvents';

interface FixtureEventCardProps {
  event: FixtureEvent;
  isAZEvent: boolean;
}

const getEventIcon = (type: string, detail: string) => {
  switch (type) {
    case 'Goal':
      if (detail === 'Own Goal') return '⚽';
      if (detail === 'Penalty') return '⚽';
      return '⚽';
    case 'Card':
      if (detail === 'Yellow Card') return '🟨';
      if (detail === 'Red Card') return '🟥';
      return '📋';
    case 'subst':
      return '🔄';
    case 'Var':
      return '📺';
    default:
      return '•';
  }
};

const getEventTypeText = (type: string, detail: string) => {
  switch (type) {
    case 'Goal':
      if (detail === 'Normal Goal') return 'Doelpunt';
      if (detail === 'Own Goal') return 'Eigen doelpunt';
      if (detail === 'Penalty') return 'Penalty';
      return 'Doelpunt';
    case 'Card':
      if (detail === 'Yellow Card') return 'Gele kaart';
      if (detail === 'Red Card') return 'Rode kaart';
      return 'Kaart';
    case 'subst':
      return 'Wissel';
    case 'Var':
      return 'VAR';
    default:
      return detail;
  }
};

export const FixtureEventCard = ({ event, isAZEvent }: FixtureEventCardProps) => {
  const eventIcon = getEventIcon(event.type, event.detail);
  const eventText = getEventTypeText(event.type, event.detail);
  
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
      isAZEvent 
        ? 'bg-az-red/5 border-az-red/20 dark:bg-az-red/10 dark:border-az-red/30' 
        : 'bg-premium-gray-50 dark:bg-gray-700 border-premium-gray-100 dark:border-gray-600'
    }`}>
      <div className="w-8 text-center font-bold text-sm bg-az-red text-white rounded px-1 py-1">
        {event.time.elapsed}'
        {event.time.extra && `+${event.time.extra}`}
      </div>
      <div className="text-lg">
        {eventIcon}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-sm text-az-black dark:text-white">
          {event.player.name}
          {event.type === 'Goal' && event.assist?.name && (
            <span className="text-premium-gray-600 dark:text-gray-400 font-normal"> (assist: {event.assist.name})</span>
          )}
        </div>
        <div className="text-xs text-premium-gray-600 dark:text-gray-400">
          {eventText} - <span className={`font-medium ${isAZEvent ? 'text-az-red' : 'text-premium-gray-700 dark:text-gray-300'}`}>
            {event.team.name}
          </span>
        </div>
      </div>
    </div>
  );
};