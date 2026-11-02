import React, { createContext, useCallback, useContext, useRef } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useOutboxSync } from '../hooks/useOutboxSync';
import { OutboxAction } from '../types/study';

interface SyncContextType {
  isOnline: boolean;
  pendingCount: number;
  pendingList: OutboxAction[];
  syncing: boolean;
  syncNow: () => Promise<void>;
  refreshQueue: () => Promise<OutboxAction[]>;
  registerOnSynced: (fn: () => Promise<void>) => void;
  isPendingItem: (targetType: string, targetId?: number | string) => boolean;
}

const SyncContext = createContext<SyncContextType | null>(null);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { isOnline } = useNetworkStatus();
  const syncListenerRef = useRef<(() => Promise<void>) | null>(null);

  const handleSynced = useCallback(async () => {
    if (syncListenerRef.current) {
      await syncListenerRef.current();
    }
  }, []);

  const { pendingCount, pendingList, syncing, syncNow, refreshQueue } =
    useOutboxSync(handleSynced);

  const registerOnSynced = useCallback((fn: () => Promise<void>) => {
    syncListenerRef.current = fn;
  }, []);

  const isPendingItem = useCallback(
    (targetType: string, targetId?: number | string) => {
      return pendingList.some(
        item =>
          item.targetType === targetType &&
          String(item.targetId) === String(targetId),
      );
    },
    [pendingList],
  );

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        pendingCount,
        pendingList,
        syncing,
        syncNow,
        refreshQueue,
        registerOnSynced,
        isPendingItem,
      }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync(): SyncContextType {
  const ctx = useContext(SyncContext);
  if (!ctx) {
    throw new Error('useSync must be used inside SyncProvider');
  }
  return ctx;
}

export default SyncContext;

