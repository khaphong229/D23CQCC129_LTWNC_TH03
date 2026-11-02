import { request } from './client';
import { Course } from '../types/study';

export function getAll(): Promise<Course[]> {
  return request<Course[]>('GET', '/courses');
}

export function getById(id: number | string): Promise<Course> {
  return request<Course>('GET', '/courses/' + id);
}

export function update(
  id: number | string,
  data: Partial<Course>,
): Promise<Course> {
  return request<Course>('PATCH', '/courses/' + id, data);
}

export function create(data: Partial<Course>): Promise<Course> {
  return request<Course>('POST', '/courses', data);
}

export default {
  getAll,
  getById,
  update,
  create,
};

