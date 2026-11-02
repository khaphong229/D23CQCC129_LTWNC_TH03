import { request } from './client';
import { Assignment } from '../types/study';

export function getAll(): Promise<Assignment[]> {
  return request<Assignment[]>(
    'GET',
    '/assignments?_expand=course&_sort=dueDate',
  );
}

export function getById(id: number | string): Promise<Assignment> {
  return request<Assignment>('GET', '/assignments/' + id + '?_expand=course');
}

export function update(
  id: number | string,
  data: Partial<Assignment>,
): Promise<Assignment> {
  return request<Assignment>('PATCH', '/assignments/' + id, data);
}

export function create(data: Partial<Assignment>): Promise<Assignment> {
  return request<Assignment>('POST', '/assignments', data);
}

export default {
  getAll,
  getById,
  update,
  create,
};

