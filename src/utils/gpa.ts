import { Course, GradeRecord } from '../types/study';

export function toScale4(score10: number): number {
  const s = Number(score10) || 0;
  if (s >= 8.5) {
    return 4.0;
  }
  if (s >= 8.0) {
    return 3.5;
  }
  if (s >= 7.0) {
    return 3.0;
  }
  if (s >= 6.5) {
    return 2.5;
  }
  if (s >= 5.5) {
    return 2.0;
  }
  if (s >= 5.0) {
    return 1.5;
  }
  if (s >= 4.0) {
    return 1.0;
  }
  return 0;
}

export function toLetter(score10: number): string {
  const s = Number(score10) || 0;
  if (s >= 8.5) {
    return 'A';
  }
  if (s >= 8.0) {
    return 'B+';
  }
  if (s >= 7.0) {
    return 'B';
  }
  if (s >= 6.5) {
    return 'C+';
  }
  if (s >= 5.5) {
    return 'C';
  }
  if (s >= 5.0) {
    return 'D+';
  }
  if (s >= 4.0) {
    return 'D';
  }
  return 'F';
}

export function calcGpa(
  grades: GradeRecord[] = [],
  courses: Course[] = [],
): { gpa: number; totalCredits: number } {
  if (!grades || grades.length === 0) {
    return { gpa: 0, totalCredits: 0 };
  }
  let sumPoints = 0;
  let sumCredits = 0;
  let earnedCredits = 0;

  for (let i = 0; i < grades.length; i++) {
    const g = grades[i];
    let c = g.course;
    if (!c && courses && courses.length > 0) {
      c = courses.find(item => Number(item.id) === Number(g.courseId));
    }
    const cr = Number(c?.credits || 3);
    const s4 = toScale4(g.total);
    sumPoints += s4 * cr;
    sumCredits += cr;
    if (s4 > 0 && g.letter !== 'F') {
      earnedCredits += cr;
    }
  }

  const gpa = sumCredits > 0 ? Number((sumPoints / sumCredits).toFixed(2)) : 0;
  return {
    gpa,
    totalCredits: earnedCredits,
  };
}

export default {
  toScale4,
  toLetter,
  calcGpa,
};

