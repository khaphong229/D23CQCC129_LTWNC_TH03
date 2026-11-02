import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus(): { isOnline: boolean } {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    NetInfo.fetch().then(state => {
      const ok = Boolean(
        state.isConnected && state.isInternetReachable !== false,
      );
      setIsOnline(ok);
    });

    const unsub = NetInfo.addEventListener(state => {
      const ok = Boolean(
        state.isConnected && state.isInternetReachable !== false,
      );
      setIsOnline(ok);
    });

    return () => {
      unsub();
    };
  }, []);

  return { isOnline };
}

export default useNetworkStatus;

