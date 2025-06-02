
export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  headProfessorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  name: string;
  code: string;
  description?: string;
  departmentId: string;
  credits: number;
  semester: number;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  moduleId: string;
  professorId: string;
  academicYear: string;
  semester: number;
  maxStudents: number;
  enrolledStudents: number;
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  grade: number;
  letterGrade: string;
  examType: 'midterm' | 'final' | 'assignment' | 'quiz' | 'project';
  examDate: string;
  professorId: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'dropped';
}
