export type Role = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  universityId: string;
  department?: string;
  avatar?: string;
  phone?: string;
  joinDate?: string;
  semester?: number;
  batch?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  department: string;
  facultyId: string;
  facultyName: string;
  semester: number;
  enrolledCount: number;
  schedule: string;
  room: string;
  description?: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  maxMarks: number;
  description: string;
  status?: 'pending' | 'submitted' | 'graded' | 'late';
  submittedAt?: string;
  grade?: number;
  feedback?: string;
  attachments?: string[];
}

export interface AttendanceRecord {
  date: string;
  courseId: string;
  courseName: string;
  status: 'present' | 'absent' | 'late';
}

export interface AttendanceSummary {
  courseId: string;
  courseName: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export interface Grade {
  courseId: string;
  courseName: string;
  internal: number;
  external: number;
  total: number;
  grade: string;
  gpa: number;
  semester: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'academic' | 'exam' | 'event' | 'urgent';
  publishedBy: string;
  publishedAt: string;
  targetRoles: Role[];
  isRead?: boolean;
}

export interface FeeRecord {
  id: string;
  semester: string;
  amount: number;
  paid: number;
  due: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  items: { label: string; amount: number }[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  universityId: string;
  department: string;
  semester: number;
  batch: string;
  phone: string;
  cgpa: number;
  attendancePercentage: number;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  universityId: string;
  department: string;
  designation: string;
  phone: string;
  coursesCount: number;
  studentsCount: number;
  status: 'active' | 'inactive';
}

export interface Department {
  id: string;
  name: string;
  code: string;
  hod: string;
  studentsCount: number;
  facultyCount: number;
  coursesCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  isRead: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  category: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'certificate' | 'marksheet' | 'id_card' | 'resource' | 'other';
  uploadedAt: string;
  size: string;
  downloadUrl: string;
}
