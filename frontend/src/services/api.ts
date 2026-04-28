import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('caap_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('caap_token');
      localStorage.removeItem('caap_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
};

// ─── COURSES ──────────────────────────────────────────────────────────────────
export const coursesAPI = {
  getAll: () => api.get('/courses'),
};

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────
export const attendanceAPI = {
  getSummary: (studentId?: string) =>
    api.get('/attendance/summary', { params: studentId ? { student_id: studentId } : {} }),
  getRecords: (params?: { course_id?: string; date?: string }) =>
    api.get('/attendance', { params }),
  markAttendance: (data: { records: { student_id: string; status: string }[]; course_id: string; date: string }) =>
    api.post('/attendance', data),
};

// ─── ASSIGNMENTS ──────────────────────────────────────────────────────────────
export const assignmentsAPI = {
  getAll: () => api.get('/assignments'),
  create: (data: { title: string; description: string; course_id: string; due_date: string; max_marks: number }) =>
    api.post('/assignments', data),
};

// ─── GRADES ───────────────────────────────────────────────────────────────────
export const gradesAPI = {
  getAll: (studentId?: string) =>
    api.get('/grades', { params: studentId ? { student_id: studentId } : {} }),
};

// ─── FEES ─────────────────────────────────────────────────────────────────────
export const feesAPI = {
  getAll: (studentId?: string) =>
    api.get('/fees', { params: studentId ? { student_id: studentId } : {} }),
  pay: (feeId: string) => api.patch(`/fees/${feeId}/pay`),
};

// ─── NOTICES ─────────────────────────────────────────────────────────────────
export const noticesAPI = {
  getAll: () => api.get('/notices'),
  create: (data: { title: string; content: string; category: string; target_role: string; is_important: boolean }) =>
    api.post('/notices', data),
  delete: (id: string) => api.delete(`/notices/${id}`),
};

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  readAll: () => api.patch('/notifications/read-all'),
};

// ─── ADMIN ───────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: { role?: string; search?: string }) =>
    api.get('/admin/users', { params }),
  createUser: (data: object) => api.post('/admin/users', data),
  toggleUser: (id: string) => api.patch(`/admin/users/${id}/toggle`),
  getDepartments: () => api.get('/admin/departments'),
};

export default api;
