export interface StudentProfile {
  studentId: string;
  fullName: string;
  className: string;
  major: string;
  email: string;
  phone: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor: string;
  description: string;
}

export interface ScheduleItem {
  id: string;
  courseId: string;
  courseName: string;
  day: string;
  time: string;
  room: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  dueDate: string;
  completed: boolean;
  description: string;
}

export interface GradeRecord {
  id: string;
  courseId: string;
  courseName: string;
  credits: number;
  midtermScore: number;
  finalScore: number;
  totalScore: number;
}

export type MainTabParamList = {
  Home: undefined;
  Courses: undefined;
  Schedule: undefined;
  Assignments: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  CourseDetail: { course: Course };
  ScheduleDetail: { schedule: ScheduleItem };
  AssignmentDetail: { assignmentId: string };
  GradeDetail: { grade: GradeRecord };
};
