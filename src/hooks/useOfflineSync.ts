
import { useState, useEffect } from 'react';
import { useOfflineDetection } from './useOfflineDetection';
import { articleCache } from '@/services/articleCache';
import { useQueryClient } from '@tanstack/react-query';

export const useOfflineSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { isOnline, updateSyncTime } = useOfflineDetection();
  const queryClient = useQueryClient();

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline) {
      handleAutoSync();
    }
  }, [isOnline]);

  const handleAutoSync = async () => {
    if (isSyncing) return;
    
    console.log('🔄 Auto-syncing data...');
    setIsSyncing(true);
    
    try {
      // Invalidate and refetch all queries
      await queryClient.invalidateQueries();
      updateSyncTime();
      console.log('✅ Auto-sync completed');
    } catch (error) {
      console.error('❌ Auto-sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleManualSync = async () => {
    if (!isOnline || isSyncing) return;
    
    console.log('🔄 Manual sync started...');
    setIsSyncing(true);
    
    try {
      // Force refetch all queries
      await queryClient.refetchQueries();
      updateSyncTime();
      console.log('✅ Manual sync completed');
    } catch (error) {
      console.error('❌ Manual sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    handleManualSync,
    isOnline
  };
};
