export interface Student {
  id: number;
  studentCode: string;
  fullName: string;
  className: string;
  major: string;
  email: string;
  phone: string;
  updatedAt?: string;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  description: string;
  semester: string;
}

export interface SessionItem {
  id: number;
  courseId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
  note?: string;
  course?: Course | null;
}

export interface Assignment {
  id: number | string;
  courseId: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'todo' | 'done';
  updatedAt?: string;
  course?: Course | null;
}

export interface GradeRecord {
  id: number;
  courseId: number;
  semester: string;
  attendance: number;
  midterm: number;
  final: number;
  total: number;
  letter: string;
  course?: Course | null;
}

export interface OutboxAction {
  id: string;
  method: 'POST' | 'PATCH';
  url: string;
  body: any;
  createdAt: string;
  targetType?: string;
  targetId?: number | string | null;
}

