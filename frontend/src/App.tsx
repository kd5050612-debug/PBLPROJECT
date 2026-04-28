import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import StudentLayout from './layouts/StudentLayout';
import FacultyLayout from './layouts/FacultyLayout';
import AdminLayout from './layouts/AdminLayout';
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import StudentAttendance from './pages/student/Attendance';
import StudentAssignments from './pages/student/Assignments';
import StudentGrades from './pages/student/Grades';
import StudentFees from './pages/student/Fees';
import StudentNotices from './pages/student/Notices';
import StudentDocuments from './pages/student/Documents';
import FacultyDashboard from './pages/faculty/Dashboard';
import FacultyCourses from './pages/faculty/Courses';
import FacultyAttendance from './pages/faculty/Attendance';
import FacultyAssignments from './pages/faculty/Assignments';
import FacultyStudents from './pages/faculty/Students';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminDepartments from './pages/admin/Departments';
import AdminNotices from './pages/admin/Notices';
import AdminReports from './pages/admin/Reports';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#2a2a3e', color: '#f0f0ff', border: '1px solid rgba(255,255,255,0.08)' },
          duration: 3500,
        }}
      />
      <Routes>
        <Route path="/login" element={
          isAuthenticated
            ? <Navigate to={`/${user?.role}`} replace />
            : <Login />
        } />

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="grades" element={<StudentGrades />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="notices" element={<StudentNotices />} />
          <Route path="documents" element={<StudentDocuments />} />
        </Route>

        {/* Faculty Routes */}
        <Route path="/faculty" element={<ProtectedRoute role="faculty"><FacultyLayout /></ProtectedRoute>}>
          <Route index element={<FacultyDashboard />} />
          <Route path="courses" element={<FacultyCourses />} />
          <Route path="attendance" element={<FacultyAttendance />} />
          <Route path="assignments" element={<FacultyAssignments />} />
          <Route path="students" element={<FacultyStudents />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="notices" element={<AdminNotices />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        <Route path="/" element={
          isAuthenticated ? <Navigate to={`/${user?.role}`} replace /> : <Navigate to="/login" replace />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
