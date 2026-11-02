import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus(): { isOnline: boolean } {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    NetInfo.fetch().then(state => {
      setIsOnline(Boolean(state.isConnected));
    });

    const unsub = NetInfo.addEventListener(state => {
      setIsOnline(Boolean(state.isConnected));
    });

    return () => {
      unsub();
    };
  }, []);

  return { isOnline };
}

export default useNetworkStatus;
