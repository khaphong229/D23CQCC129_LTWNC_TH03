import { useCallback, useEffect, useRef, useState } from 'react';
import { getCache, setCache } from '../storage/cache';
import { useNetworkStatus } from './useNetworkStatus';

export interface CachedQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  lastUpdated: string;
  refresh: () => Promise<void>;
  updateLocalCache: (nextData: T) => Promise<void>;
}

export function useCachedQuery<T = any>(
  key: string,
  fetcher: () => Promise<T>,
): CachedQueryResult<T> {
  const { isOnline } = useNetworkStatus();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      }
      setError(null);

      let hasCache = false;
      const cached = await getCache<T>(key);
      if (cached && cached.data !== undefined && cached.data !== null) {
        hasCache = true;
        setData(cached.data);
        setLastUpdated(cached.savedAt || '');
        setLoading(false);
      }

      if (!isOnline) {
        if (!hasCache) {
          setError('Không có kết nối mạng và chưa có dữ liệu bộ nhớ đệm.');
        }
        setLoading(false);
        setRefreshing(false);
        return;
      }

      try {
        const res = await fetcherRef.current();
        const saved = await setCache<T>(key, res);
        setData(res);
        if (saved && saved.savedAt) {
          setLastUpdated(saved.savedAt);
        } else {
          setLastUpdated(new Date().toISOString());
        }
        setError(null);
      } catch (err: any) {
        if (!hasCache) {
          setError(err?.message || 'Không thể tải dữ liệu từ máy chủ.');
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [key, isOnline],
  );

  useEffect(() => {
    load(false);
  }, [load]);

  const refresh = useCallback(async () => {
    await load(true);
  }, [load]);

  const updateLocalCache = useCallback(
    async (nextData: T) => {
      setData(nextData);
      const saved = await setCache<T>(key, nextData);
      if (saved && saved.savedAt) {
        setLastUpdated(saved.savedAt);
      }
    },
    [key],
  );

  return {
    data,
    loading,
    error,
    refreshing,
    lastUpdated,
    refresh,
    updateLocalCache,
  };
}

export default useCachedQuery;

