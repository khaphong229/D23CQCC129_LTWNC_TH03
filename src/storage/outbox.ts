import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './keys';
import { OutboxAction } from '../types/study';

export async function getAll(): Promise<OutboxAction[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.OUTBOX);
    if (!raw) {
      return [];
    }
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (err) {
    return [];
  }
}

export async function enqueue(
  action: Omit<OutboxAction, 'id' | 'createdAt'> & {
    id?: string;
    createdAt?: string;
  },
): Promise<OutboxAction | null> {
  try {
    const list = await getAll();
    const item: OutboxAction = {
      id:
        action.id ||
        String(Date.now()) + '_' + Math.floor(Math.random() * 1000),
      method: action.method,
      url: action.url,
      body: action.body,
      createdAt: action.createdAt || new Date().toISOString(),
      targetType: action.targetType || '',
      targetId: action.targetId || null,
    };
    list.push(item);
    await AsyncStorage.setItem(STORAGE_KEYS.OUTBOX, JSON.stringify(list));
    return item;
  } catch (err) {
    return null;
  }
}

export async function remove(id: string): Promise<OutboxAction[]> {
  try {
    const list = await getAll();
    const next = list.filter(item => String(item.id) !== String(id));
    await AsyncStorage.setItem(STORAGE_KEYS.OUTBOX, JSON.stringify(next));
    return next;
  } catch (err) {
    return [];
  }
}

export default {
  enqueue,
  getAll,
  remove,
};

