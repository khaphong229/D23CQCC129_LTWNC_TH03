import { request } from './client';
import { SessionItem } from '../types/study';

export function getAll(): Promise<SessionItem[]> {
  return request<SessionItem[]>('GET', '/sessions?_expand=course');
}

export function getById(id: number | string): Promise<SessionItem> {
  return request<SessionItem>('GET', '/sessions/' + id + '?_expand=course');
}

export function update(
  id: number | string,
  data: Partial<SessionItem>,
): Promise<SessionItem> {
  return request<SessionItem>('PATCH', '/sessions/' + id, data);
}

export function create(data: Partial<SessionItem>): Promise<SessionItem> {
  return request<SessionItem>('POST', '/sessions', data);
}

export default {
  getAll,
  getById,
  update,
  create,
};

