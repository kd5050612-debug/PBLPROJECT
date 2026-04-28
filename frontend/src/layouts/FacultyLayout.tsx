import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { LayoutDashboard, BookOpen, ClipboardCheck, FileText, Users } from 'lucide-react';

const navItems = [
  { label: 'Dashboard',   path: '/faculty',             icon: <LayoutDashboard size={18} /> },
  { label: 'My Courses',  path: '/faculty/courses',     icon: <BookOpen size={18} /> },
  { label: 'Attendance',  path: '/faculty/attendance',  icon: <ClipboardCheck size={18} /> },
  { label: 'Assignments', path: '/faculty/assignments', icon: <FileText size={18} /> },
  { label: 'Students',    path: '/faculty/students',    icon: <Users size={18} /> },
];

export default function FacultyLayout() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar navItems={navItems} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} accentColor="#8b5cf6" />
      <div style={{ marginLeft: collapsed ? 70 : 260, flex: 1, transition: 'margin-left 0.3s', display: 'flex', flexDirection: 'column' }}>
        <Topbar title="Faculty Portal" />
        <main style={{ flex: 1, padding: '24px', background: 'var(--surface)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
