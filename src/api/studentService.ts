import { request } from './client';
import { Student } from '../types/study';

export function getAll(): Promise<Student[]> {
  return request<Student[]>('GET', '/students');
}

export function getById(id: number | string = 1): Promise<Student> {
  return request<Student>('GET', '/students/' + id);
}

export function update(
  id: number | string = 1,
  data: Partial<Student>,
): Promise<Student> {
  return request<Student>('PATCH', '/students/' + id, data);
}

export function create(data: Partial<Student>): Promise<Student> {
  return request<Student>('POST', '/students', data);
}

export default {
  getAll,
  getById,
  update,
  create,
};

