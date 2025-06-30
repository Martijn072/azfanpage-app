
import { useState, useEffect } from 'react';

export const useOfflineDetection = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastSync(new Date());
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial sync time from localStorage
    const savedSync = localStorage.getItem('lastSync');
    if (savedSync) {
      setLastSync(new Date(savedSync));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateSyncTime = () => {
    const now = new Date();
    setLastSync(now);
    localStorage.setItem('lastSync', now.toISOString());
  };

  return { isOnline, lastSync, updateSyncTime };
};
