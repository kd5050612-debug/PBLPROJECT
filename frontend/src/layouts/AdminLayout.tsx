import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { LayoutDashboard, Users, Building2, Bell, BarChart2 } from 'lucide-react';

const navItems = [
  { label: 'Dashboard',   path: '/admin',             icon: <LayoutDashboard size={18} /> },
  { label: 'Users',       path: '/admin/users',       icon: <Users size={18} /> },
  { label: 'Departments', path: '/admin/departments', icon: <Building2 size={18} /> },
  { label: 'Notices',     path: '/admin/notices',     icon: <Bell size={18} /> },
  { label: 'Reports',     path: '/admin/reports',     icon: <BarChart2 size={18} /> },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar navItems={navItems} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} accentColor="#06b6d4" />
      <div style={{ marginLeft: collapsed ? 70 : 260, flex: 1, transition: 'margin-left 0.3s', display: 'flex', flexDirection: 'column' }}>
        <Topbar title="Admin Control Panel" />
        <main style={{ flex: 1, padding: '24px', background: 'var(--surface)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
