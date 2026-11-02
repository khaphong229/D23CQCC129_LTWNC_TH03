import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CacheEntry<T = any> {
  data: T;
  savedAt: string;
}

export async function getCache<T = any>(
  key: string,
): Promise<CacheEntry<T> | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as CacheEntry<T>;
  } catch (err) {
    return null;
  }
}

export async function setCache<T = any>(
  key: string,
  data: T,
): Promise<CacheEntry<T> | null> {
  try {
    const item: CacheEntry<T> = {
      data,
      savedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(item));
    return item;
  } catch (err) {
    return null;
  }
}

export default {
  getCache,
  setCache,
};

