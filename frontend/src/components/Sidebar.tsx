import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { GraduationCap, LogOut, ChevronLeft, Bell } from 'lucide-react';
import { clsx } from 'clsx';

interface NavItem { label: string; path: string; icon: React.ReactNode; }

interface SidebarProps {
  navItems: NavItem[];
  collapsed: boolean;
  onToggle: () => void;
  accentColor?: string;
}

export default function Sidebar({ navItems, collapsed, onToggle, accentColor = '#6366f1' }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="sidebar" style={{ width: collapsed ? 70 : 260 }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '20px 16px' : '20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12, minHeight: 72 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${accentColor},#8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 16px ${accentColor}40` }}>
          <GraduationCap size={20} color="white" />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div className="font-jakarta" style={{ fontSize: 13, fontWeight: 800, color: '#f0f0ff', whiteSpace: 'nowrap' }}>MIT ADT</div>
            <div style={{ fontSize: 10, color: '#606080', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>CAAP 2.0 Portal</div>
          </div>
        )}
        <button
          onClick={onToggle}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#606080', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 6, transition: 'color 0.2s', flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f0f0ff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#606080')}
        >
          <ChevronLeft size={16} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="avatar" style={{ background: `linear-gradient(135deg,${accentColor},#8b5cf6)` }}>{initials}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e0e0f8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: '#606080' }}>{user?.universityId}</div>
            </div>
          </div>
        </div>
      )}
      {collapsed && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'center' }}>
          <div className="avatar" style={{ width: 36, height: 36, fontSize: 12, background: `linear-gradient(135deg,${accentColor},#8b5cf6)` }}>{initials}</div>
        </div>
      )}

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path.split('/').length === 2}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
            title={collapsed ? item.label : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={handleLogout}
          className="nav-item"
          style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'none', justifyContent: collapsed ? 'center' : 'flex-start' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; (e.currentTarget as HTMLElement).style.color = '#f87171'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.color = ''; }}
        >
          <LogOut size={18} className="nav-icon" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
