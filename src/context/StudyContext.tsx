import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Assignment,
  Course,
  GradeRecord,
  ScheduleItem,
  StudentProfile,
} from '../types/study';
import {
  INITIAL_ASSIGNMENTS,
  INITIAL_COURSES,
  INITIAL_GRADES,
  INITIAL_SCHEDULES,
  INITIAL_STUDENT,
} from '../data/mockData';

interface StudyContextType {
  student: StudentProfile;
  courses: Course[];
  schedules: ScheduleItem[];
  assignments: Assignment[];
  grades: GradeRecord[];
  toggleAssignment: (id: string) => void;
  updateStudent: (fullName: string, email: string, phone: string) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const STUDENT_KEY = '@student_data';
const ASSIGNMENTS_KEY = '@assignments_data';

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  const [courses] = useState<Course[]>(INITIAL_COURSES);
  const [schedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [assignments, setAssignments] =
    useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [grades] = useState<GradeRecord[]>(INITIAL_GRADES);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedStudent = await AsyncStorage.getItem(STUDENT_KEY);
        const savedAssignments = await AsyncStorage.getItem(ASSIGNMENTS_KEY);

        if (savedStudent) {
          setStudent(JSON.parse(savedStudent));
        }
        if (savedAssignments) {
          setAssignments(JSON.parse(savedAssignments));
        }
      } catch (error) {
        console.log('Lỗi đọc dữ liệu:', error);
      }
    };

    loadData();
  }, []);

  const toggleAssignment = async (id: string) => {
    const updated = assignments.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item,
    );
    setAssignments(updated);
    try {
      await AsyncStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.log('Lỗi lưu bài tập:', error);
    }
  };

  const updateStudent = async (
    fullName: string,
    email: string,
    phone: string,
  ) => {
    const updated: StudentProfile = {
      ...student,
      fullName,
      email,
      phone,
    };
    setStudent(updated);
    try {
      await AsyncStorage.setItem(STUDENT_KEY, JSON.stringify(updated));
    } catch (error) {
      console.log('Lỗi lưu thông tin sinh viên:', error);
    }
  };

  return (
    <StudyContext.Provider
      value={{
        student,
        courses,
        schedules,
        assignments,
        grades,
        toggleAssignment,
        updateStudent,
      }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy phải được dùng bên trong StudyProvider');
  }
  return context;
};
