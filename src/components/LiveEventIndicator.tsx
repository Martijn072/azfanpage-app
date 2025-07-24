import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface LiveEventIndicatorProps {
  status: string;
  elapsed?: number | null;
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'NS': return 'Te spelen';
    case 'FT': return 'Afgelopen';
    case 'LIVE': return 'Live';
    case '1H': return '1e helft';
    case 'HT': return 'Rust';
    case '2H': return '2e helft';
    case 'ET': return 'Verlenging';
    case 'P': return 'Penalty\'s';
    default: return status;
  }
};

const isLiveStatus = (status: string) => {
  return ['LIVE', '1H', 'HT', '2H', 'ET', 'P'].includes(status);
};

export const LiveEventIndicator = ({ status, elapsed }: LiveEventIndicatorProps) => {
  const statusText = getStatusText(status);
  const isLive = isLiveStatus(status);

  if (isLive) {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-az-red text-white hover:bg-red-700 animate-pulse">
          <Clock className="w-3 h-3 mr-1" />
          {statusText}
        </Badge>
        {elapsed && (
          <span className="text-sm font-medium text-az-red">
            {elapsed}'
          </span>
        )}
      </div>
    );
  }

  return (
    <Badge className="text-xs bg-premium-gray-100 text-premium-gray-700 dark:bg-gray-700 dark:text-gray-300 border-none">
      {statusText}
    </Badge>
  );
};