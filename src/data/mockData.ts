import {
  Assignment,
  Course,
  GradeRecord,
  ScheduleItem,
  StudentProfile,
} from '../types/study';

export const INITIAL_STUDENT: StudentProfile = {
  studentId: 'SV001',
  fullName: 'Nguyễn Văn A',
  className: 'CNTT-K16',
  major: 'Công nghệ thông tin',
  email: 'nguyenvana@gmail.com',
  phone: '0912345678',
};

export const INITIAL_COURSES: Course[] = [
  {
    id: '1',
    code: 'INT101',
    name: 'Lập trình Thiết bị Di động',
    credits: 3,
    instructor: 'TS. Trần Văn B',
    description: 'Xây dựng ứng dụng di động đa nền tảng với React Native.',
  },
  {
    id: '2',
    code: 'INT102',
    name: 'Cơ sở Dữ liệu',
    credits: 3,
    instructor: 'ThS. Lê Thị C',
    description: 'Thiết kế cơ sở dữ liệu quan hệ và ngôn ngữ truy vấn SQL.',
  },
  {
    id: '3',
    code: 'INT103',
    name: 'Cấu trúc Dữ liệu và Giải thuật',
    credits: 4,
    instructor: 'PGS.TS. Phạm Văn D',
    description: 'Các cấu trúc dữ liệu cơ bản và thuật toán sắp xếp, tìm kiếm.',
  },
  {
    id: '4',
    code: 'INT104',
    name: 'Mạng Máy tính',
    credits: 3,
    instructor: 'ThS. Hoàng Văn E',
    description: 'Mô hình OSI, TCP/IP và các giao thức mạng máy tính.',
  },
];

export const INITIAL_SCHEDULES: ScheduleItem[] = [
  {
    id: '1',
    courseId: '1',
    courseName: 'Lập trình Thiết bị Di động',
    day: 'Thứ 2',
    time: '07:30 - 09:30',
    room: 'P.301',
  },
  {
    id: '2',
    courseId: '2',
    courseName: 'Cơ sở Dữ liệu',
    day: 'Thứ 3',
    time: '09:30 - 11:30',
    room: 'P.204',
  },
  {
    id: '3',
    courseId: '3',
    courseName: 'Cấu trúc Dữ liệu và Giải thuật',
    day: 'Thứ 5',
    time: '13:30 - 15:30',
    room: 'P.402',
  },
  {
    id: '4',
    courseId: '4',
    courseName: 'Mạng Máy tính',
    day: 'Thứ 6',
    time: '07:30 - 09:30',
    room: 'P.105',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    courseId: '1',
    courseName: 'Lập trình Thiết bị Di động',
    title: 'Bài tập React Navigation',
    dueDate: '25/10/2026',
    completed: false,
    description: 'Xây dựng ứng dụng quản lý học tập sử dụng Bottom Tab và Stack Navigation.',
  },
  {
    id: '2',
    courseId: '2',
    courseName: 'Cơ sở Dữ liệu',
    title: 'Thiết kế sơ đồ ERD',
    dueDate: '28/10/2026',
    completed: false,
    description: 'Vẽ sơ đồ thực thể liên kết cho hệ thống quản lý thư viện.',
  },
  {
    id: '3',
    courseId: '3',
    courseName: 'Cấu trúc Dữ liệu và Giải thuật',
    title: 'Cài đặt cây nhị phân tìm kiếm',
    dueDate: '20/10/2026',
    completed: true,
    description: 'Viết các hàm thêm, xóa, duyệt cây nhị phân tìm kiếm.',
  },
  {
    id: '4',
    courseId: '4',
    courseName: 'Mạng Máy tính',
    title: 'Báo cáo thực hành chia Subnet',
    dueDate: '30/10/2026',
    completed: false,
    description: 'Chia địa chỉ IP cho các phòng ban trong doanh nghiệp.',
  },
];

export const INITIAL_GRADES: GradeRecord[] = [
  {
    id: '1',
    courseId: '1',
    courseName: 'Lập trình Thiết bị Di động',
    credits: 3,
    midtermScore: 8.5,
    finalScore: 9.0,
    totalScore: 8.8,
  },
  {
    id: '2',
    courseId: '2',
    courseName: 'Cơ sở Dữ liệu',
    credits: 3,
    midtermScore: 7.5,
    finalScore: 8.0,
    totalScore: 7.8,
  },
  {
    id: '3',
    courseId: '3',
    courseName: 'Cấu trúc Dữ liệu và Giải thuật',
    credits: 4,
    midtermScore: 8.0,
    finalScore: 8.5,
    totalScore: 8.3,
  },
  {
    id: '4',
    courseId: '4',
    courseName: 'Mạng Máy tính',
    credits: 3,
    midtermScore: 7.0,
    finalScore: 7.5,
    totalScore: 7.3,
  },
];
