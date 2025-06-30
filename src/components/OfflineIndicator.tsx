
import { Wifi, WifiOff, RefreshCw, Clock } from 'lucide-react';
import { useOfflineDetection } from '@/hooks/useOfflineDetection';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

interface OfflineIndicatorProps {
  onSyncNow?: () => void;
  issyncing?: boolean;
}

export const OfflineIndicator = ({ onSyncNow, issyncing = false }: OfflineIndicatorProps) => {
  const { isOnline, lastSync } = useOfflineDetection();

  // Only show when offline OR when we have sync info to display
  if (isOnline && !lastSync) return null;

  return (
    <div className={`w-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
      isOnline 
        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-b border-green-200 dark:border-green-800' 
        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-b border-red-200 dark:border-red-800'
    }`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}
          
          <span>
            {isOnline ? 'Online' : 'Offline modus'}
          </span>
          
          {lastSync && (
            <div className="flex items-center gap-1 text-xs opacity-75">
              <Clock className="w-3 h-3" />
              <span>
                Laatste sync: {formatDistanceToNow(lastSync, { 
                  addSuffix: true, 
                  locale: nl 
                })}
              </span>
            </div>
          )}
        </div>

        {isOnline && onSyncNow && (
          <button
            onClick={onSyncNow}
            disabled={issyncing}
            className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-current/20 hover:bg-current/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${issyncing ? 'animate-spin' : ''}`} />
            <span className="text-xs">
              {issyncing ? 'Syncing...' : 'Sync nu'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
