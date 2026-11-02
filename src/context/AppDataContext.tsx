import React, { createContext, useCallback, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import * as studentService from '../api/studentService';
import * as courseService from '../api/courseService';
import * as sessionService from '../api/sessionService';
import * as assignmentService from '../api/assignmentService';
import * as gradeService from '../api/gradeService';
import { STORAGE_KEYS } from '../storage/keys';
import * as outbox from '../storage/outbox';
import { CachedQueryResult, useCachedQuery } from '../hooks/useCachedQuery';
import {
  Assignment,
  Course,
  GradeRecord,
  SessionItem,
  Student,
} from '../types/study';
import { useSync } from './SyncContext';

interface AppDataContextType {
  student: Student | null;
  courses: Course[];
  sessions: SessionItem[];
  assignments: Assignment[];
  grades: GradeRecord[];
  studentQuery: CachedQueryResult<Student>;
  coursesQuery: CachedQueryResult<Course[]>;
  sessionsQuery: CachedQueryResult<SessionItem[]>;
  assignmentsQuery: CachedQueryResult<Assignment[]>;
  gradesQuery: CachedQueryResult<GradeRecord[]>;
  getCourseDetail: (id: number | string) => Promise<Course | null>;
  getSessionDetail: (id: number | string) => Promise<SessionItem | null>;
  getAssignmentDetail: (id: number | string) => Promise<Assignment | null>;
  getGradeDetail: (id: number | string) => Promise<GradeRecord | null>;
  toggleAssignmentStatus: (item: Assignment) => Promise<void>;
  addAssignment: (form: {
    courseId: number | string;
    title: string;
    dueDate: string;
    description?: string;
  }) => Promise<Assignment>;
  updateProfile: (form: {
    fullName: string;
    email: string;
    phone: string;
  }) => Promise<Student>;
  refreshAll: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { isOnline, refreshQueue, registerOnSynced } = useSync();

  const studentQuery = useCachedQuery<Student>(STORAGE_KEYS.STUDENT, () =>
    studentService.getById(1),
  );
  const coursesQuery = useCachedQuery<Course[]>(STORAGE_KEYS.COURSES, () =>
    courseService.getAll(),
  );
  const sessionsQuery = useCachedQuery<SessionItem[]>(
    STORAGE_KEYS.SESSIONS,
    () => sessionService.getAll(),
  );
  const assignmentsQuery = useCachedQuery<Assignment[]>(
    STORAGE_KEYS.ASSIGNMENTS,
    () => assignmentService.getAll(),
  );
  const gradesQuery = useCachedQuery<GradeRecord[]>(STORAGE_KEYS.GRADES, () =>
    gradeService.getAll(),
  );

  const refreshAll = useCallback(async () => {
    await Promise.all([
      studentQuery.refresh(),
      coursesQuery.refresh(),
      sessionsQuery.refresh(),
      assignmentsQuery.refresh(),
      gradesQuery.refresh(),
    ]);
  }, [
    studentQuery,
    coursesQuery,
    sessionsQuery,
    assignmentsQuery,
    gradesQuery,
  ]);

  useEffect(() => {
    registerOnSynced(refreshAll);
  }, [registerOnSynced, refreshAll]);

  const getCourseDetail = useCallback(
    async (id: number | string) => {
      const list = coursesQuery.data || [];
      const cachedItem = list.find(item => String(item.id) === String(id));
      if (!isOnline) {
        return cachedItem || null;
      }
      try {
        const res = await courseService.getById(id);
        return res;
      } catch (err) {
        if (cachedItem) {
          return cachedItem;
        }
        throw err;
      }
    },
    [coursesQuery.data, isOnline],
  );

  const getSessionDetail = useCallback(
    async (id: number | string) => {
      const list = sessionsQuery.data || [];
      const cachedItem = list.find(item => String(item.id) === String(id));
      if (!isOnline) {
        return cachedItem || null;
      }
      try {
        const res = await sessionService.getById(id);
        return res;
      } catch (err) {
        if (cachedItem) {
          return cachedItem;
        }
        throw err;
      }
    },
    [sessionsQuery.data, isOnline],
  );

  const getAssignmentDetail = useCallback(
    async (id: number | string) => {
      const list = assignmentsQuery.data || [];
      const cachedItem = list.find(item => String(item.id) === String(id));
      if (!isOnline || String(id).startsWith('temp_')) {
        return cachedItem || null;
      }
      try {
        const res = await assignmentService.getById(id);
        if (cachedItem) {
          return { ...res, status: cachedItem.status };
        }
        return res;
      } catch (err) {
        if (cachedItem) {
          return cachedItem;
        }
        throw err;
      }
    },
    [assignmentsQuery.data, isOnline],
  );

  const getGradeDetail = useCallback(
    async (id: number | string) => {
      const list = gradesQuery.data || [];
      const cachedItem = list.find(item => String(item.id) === String(id));
      if (!isOnline) {
        return cachedItem || null;
      }
      try {
        const res = await gradeService.getById(id);
        return res;
      } catch (err) {
        if (cachedItem) {
          return cachedItem;
        }
        throw err;
      }
    },
    [gradesQuery.data, isOnline],
  );

  const toggleAssignmentStatus = async (item: Assignment) => {
    const list = assignmentsQuery.data || [];
    const oldStatus = item.status;
    const nextStatus: 'todo' | 'done' = oldStatus === 'done' ? 'todo' : 'done';
    const now = new Date().toISOString();

    const nextList = list.map(a =>
      String(a.id) === String(item.id)
        ? { ...a, status: nextStatus, updatedAt: now }
        : a,
    );
    await assignmentsQuery.updateLocalCache(nextList);

    if (isOnline) {
      try {
        await assignmentService.update(item.id, {
          status: nextStatus,
          updatedAt: now,
        });
      } catch (err) {
        const revertList = list.map(a =>
          String(a.id) === String(item.id) ? { ...a, status: oldStatus } : a,
        );
        await assignmentsQuery.updateLocalCache(revertList);
        Alert.alert(
          'Lỗi',
          'Không thể cập nhật trạng thái bài tập. Hệ thống đã hoàn tác.',
        );
      }
    } else {
      await outbox.enqueue({
        method: 'PATCH',
        url: '/assignments/' + item.id,
        body: { status: nextStatus, updatedAt: now },
        createdAt: now,
        targetType: 'assignment',
        targetId: item.id,
      });
      await refreshQueue();
    }
  };

  const addAssignment = async (form: {
    courseId: number | string;
    title: string;
    dueDate: string;
    description?: string;
  }) => {
    const now = new Date().toISOString();
    const courses = coursesQuery.data || [];
    const foundCourse = courses.find(
      c => Number(c.id) === Number(form.courseId),
    );
    const body = {
      courseId: Number(form.courseId),
      title: form.title.trim(),
      description: (form.description || '').trim(),
      dueDate: form.dueDate,
      status: 'todo' as const,
      updatedAt: now,
    };

    if (isOnline) {
      const created = await assignmentService.create(body);
      const itemWithCourse: Assignment = {
        ...created,
        course: foundCourse || null,
      };
      const list = assignmentsQuery.data || [];
      await assignmentsQuery.updateLocalCache([...list, itemWithCourse]);
      return itemWithCourse;
    } else {
      const tempId = 'temp_' + Date.now();
      const offlineItem: Assignment = {
        id: tempId,
        ...body,
        course: foundCourse || null,
      };
      const list = assignmentsQuery.data || [];
      await assignmentsQuery.updateLocalCache([...list, offlineItem]);
      await outbox.enqueue({
        method: 'POST',
        url: '/assignments',
        body: offlineItem,
        createdAt: now,
        targetType: 'assignment',
        targetId: tempId,
      });
      await refreshQueue();
      return offlineItem;
    }
  };

  const updateProfile = async (form: {
    fullName: string;
    email: string;
    phone: string;
  }) => {
    const now = new Date().toISOString();
    const cur: Student = studentQuery.data || {
      id: 1,
      studentCode: 'SV2021001',
      fullName: '',
      className: 'CNTT-K21A',
      major: 'Công nghệ thông tin',
      email: '',
      phone: '',
    };
    const body = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      updatedAt: now,
    };
    const nextStudent: Student = {
      ...cur,
      ...body,
    };
    await studentQuery.updateLocalCache(nextStudent);

    if (isOnline) {
      const res = await studentService.update(cur.id || 1, body);
      await studentQuery.updateLocalCache({ ...nextStudent, ...res });
      return res;
    } else {
      await outbox.enqueue({
        method: 'PATCH',
        url: '/students/' + (cur.id || 1),
        body,
        createdAt: now,
        targetType: 'student',
        targetId: cur.id || 1,
      });
      await refreshQueue();
      return nextStudent;
    }
  };

  return (
    <AppDataContext.Provider
      value={{
        student: studentQuery.data,
        courses: coursesQuery.data || [],
        sessions: sessionsQuery.data || [],
        assignments: assignmentsQuery.data || [],
        grades: gradesQuery.data || [],
        studentQuery,
        coursesQuery,
        sessionsQuery,
        assignmentsQuery,
        gradesQuery,
        getCourseDetail,
        getSessionDetail,
        getAssignmentDetail,
        getGradeDetail,
        toggleAssignmentStatus,
        addAssignment,
        updateProfile,
        refreshAll,
      }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextType {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used inside AppDataProvider');
  }
  return ctx;
}

export default AppDataContext;

