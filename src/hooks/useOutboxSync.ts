import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { request } from '../api/client';
import * as outbox from '../storage/outbox';
import { OutboxAction } from '../types/study';
import { useNetworkStatus } from './useNetworkStatus';

export function useOutboxSync(onSynced?: () => Promise<void>) {
  const { isOnline } = useNetworkStatus();
  const [pendingList, setPendingList] = useState<OutboxAction[]>([]);
  const [syncing, setSyncing] = useState<boolean>(false);
  const syncingRef = useRef<boolean>(false);
  const wasOnlineRef = useRef<boolean>(isOnline);
  const onSyncedRef = useRef(onSynced);
  onSyncedRef.current = onSynced;

  const refreshQueue = useCallback(async () => {
    const list = await outbox.getAll();
    setPendingList(list);
    return list;
  }, []);

  const syncNow = useCallback(async () => {
    if (syncingRef.current || !isOnline) {
      return;
    }
    const list = await outbox.getAll();
    setPendingList(list);
    if (list.length === 0) {
      return;
    }

    syncingRef.current = true;
    setSyncing(true);
    let doneCount = 0;
    let conflictCount = 0;

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      try {
        if (item.method === 'PATCH') {
          const serverItem = await request<any>('GET', item.url);
          if (
            serverItem &&
            serverItem.updatedAt &&
            item.createdAt &&
            new Date(serverItem.updatedAt).getTime() >
              new Date(item.createdAt).getTime()
          ) {
            await outbox.remove(item.id);
            conflictCount += 1;
            continue;
          }
        }

        let payload = item.body;
        if (item.method === 'POST' && payload && payload.id) {
          const copy = { ...payload };
          delete copy.id;
          delete copy.course;
          payload = copy;
        }

        await request(item.method, item.url, payload);
        await outbox.remove(item.id);
        doneCount += 1;
      } catch (err) {
        console.log('sync err:', err);
      }
    }

    const remain = await outbox.getAll();
    setPendingList(remain);
    syncingRef.current = false;
    setSyncing(false);

    if (onSyncedRef.current && (doneCount > 0 || conflictCount > 0)) {
      await onSyncedRef.current();
    }

    if (conflictCount > 0) {
      Alert.alert(
        'Xung đột dữ liệu',
        'Dữ liệu trên máy chủ mới hơn thao tác khi offline nên hệ thống đã ưu tiên giữ bản trên máy chủ.',
      );
    }

    if (doneCount > 0) {
      Alert.alert('Đồng bộ thành công', 'Đã đồng bộ ' + doneCount + ' thay đổi');
    }
  }, [isOnline]);

  useEffect(() => {
    refreshQueue();
  }, [refreshQueue]);

  useEffect(() => {
    if (isOnline && !wasOnlineRef.current) {
      syncNow();
    } else if (isOnline && pendingList.length > 0) {
      syncNow();
    }
    wasOnlineRef.current = isOnline;
  }, [isOnline, pendingList.length, syncNow]);

  return {
    pendingCount: pendingList.length,
    pendingList,
    syncing,
    syncNow,
    refreshQueue,
  };
}

export default useOutboxSync;

