import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { LayoutDashboard, BookOpen, ClipboardCheck, FileText, BarChart2, CreditCard, Bell, FileDown } from 'lucide-react';

const navItems = [
  { label: 'Dashboard',   path: '/student',             icon: <LayoutDashboard size={18} /> },
  { label: 'My Courses',  path: '/student/courses',     icon: <BookOpen size={18} /> },
  { label: 'Attendance',  path: '/student/attendance',  icon: <ClipboardCheck size={18} /> },
  { label: 'Assignments', path: '/student/assignments', icon: <FileText size={18} /> },
  { label: 'Grades',      path: '/student/grades',      icon: <BarChart2 size={18} /> },
  { label: 'Fee Payment', path: '/student/fees',        icon: <CreditCard size={18} /> },
  { label: 'Notices',     path: '/student/notices',     icon: <Bell size={18} /> },
  { label: 'Documents',   path: '/student/documents',   icon: <FileDown size={18} /> },
];

export default function StudentLayout() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar navItems={navItems} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} accentColor="#6366f1" />
      <div style={{ marginLeft: collapsed ? 70 : 260, flex: 1, transition: 'margin-left 0.3s', display: 'flex', flexDirection: 'column' }}>
        <Topbar title="Student Portal" />
        <main style={{ flex: 1, padding: '24px', background: 'var(--surface)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
