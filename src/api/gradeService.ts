import { request } from './client';
import { GradeRecord } from '../types/study';

export function getAll(): Promise<GradeRecord[]> {
  return request<GradeRecord[]>('GET', '/grades?_expand=course');
}

export function getById(id: number | string): Promise<GradeRecord> {
  return request<GradeRecord>('GET', '/grades/' + id + '?_expand=course');
}

export function update(
  id: number | string,
  data: Partial<GradeRecord>,
): Promise<GradeRecord> {
  return request<GradeRecord>('PATCH', '/grades/' + id, data);
}

export function create(data: Partial<GradeRecord>): Promise<GradeRecord> {
  return request<GradeRecord>('POST', '/grades', data);
}

export default {
  getAll,
  getById,
  update,
  create,
};

