import { useState } from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { mockNotifications } from '../data/mockData';

interface TopbarProps { title: string; }

export default function Topbar({ title }: TopbarProps) {
  const { user } = useAuthStore();
  const [dark] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const unread = mockNotifications.filter(n => !n.isRead).length;
  const roleColors: Record<string, string> = { student: '#6366f1', faculty: '#8b5cf6', admin: '#06b6d4' };
  const color = roleColors[user?.role || 'student'];

  return (
    <div style={{ height: 64, background: 'rgba(18,18,31,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 16, fontWeight: 700, color: '#f0f0ff' }}>{title}</h1>
        <p style={{ fontSize: 11, color: '#606080' }}>Welcome back, {user?.name?.split(' ')[0]}</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Search size={14} style={{ position: 'absolute', left: 10, color: '#606080' }} />
        <input placeholder="Search..." style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '7px 12px 7px 30px', color: '#f0f0ff', fontSize: 13, outline: 'none', width: 200 }} />
      </div>

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowNotif(s => !s)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
        >
          <Bell size={16} color="#a0a0c0" />
          {unread > 0 && (
            <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', border: '1.5px solid #12121f' }} />
          )}
        </button>

        {showNotif && (
          <div style={{ position: 'absolute', right: 0, top: 46, width: 320, background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 200, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Notifications</span>
              <span style={{ fontSize: 11, color: color }}>{unread} unread</span>
            </div>
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {mockNotifications.map(n => (
                <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: n.isRead ? 'transparent' : 'rgba(99,102,241,0.04)' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.isRead ? '#606080' : '#6366f1', marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#d0d0f0', marginBottom: 2 }}>{n.title}</div>
                      <div style={{ fontSize: 11, color: '#606080', lineHeight: 1.4 }}>{n.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Role badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
        <span style={{ fontSize: 12, fontWeight: 600, color, textTransform: 'capitalize' }}>{user?.role}</span>
      </div>
    </div>
  );
}
