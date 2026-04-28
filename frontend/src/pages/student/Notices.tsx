import { useState } from 'react';
import { mockNotices } from '../../data/mockData';
import { Bell, BookOpen, Calendar, AlertTriangle, Trophy, GraduationCap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const catConfig: Record<string, { icon: any; color: string; label: string }> = {
  exam:     { icon: GraduationCap, color: '#6366f1', label: 'Exam' },
  general:  { icon: Bell,          color: '#06b6d4', label: 'General' },
  urgent:   { icon: AlertTriangle, color: '#ef4444', label: 'Urgent' },
  event:    { icon: Trophy,        color: '#f59e0b', label: 'Event' },
  academic: { icon: BookOpen,      color: '#10b981', label: 'Academic' },
};

export default function StudentNotices() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? mockNotices : mockNotices.filter(n => n.category === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="font-jakarta" style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ff' }}>Notice Board</h2>
          <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>{mockNotices.filter(n => !n.isRead).length} unread notices</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['all', 'exam', 'general', 'urgent', 'event', 'academic'].map(f => {
            const cfg = catConfig[f as keyof typeof catConfig];
            return (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${filter === f ? (cfg?.color || '#6366f1') : 'rgba(255,255,255,0.08)'}`, background: filter === f ? `${cfg?.color || '#6366f1'}20` : 'rgba(255,255,255,0.03)', color: filter === f ? (cfg?.color || '#818cf8') : '#a0a0c0', fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}>
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(notice => {
          const cfg = catConfig[notice.category] || catConfig.general;
          const Icon = cfg.icon;
          const isSelected = selected === notice.id;
          return (
            <div key={notice.id} onClick={() => setSelected(isSelected ? null : notice.id)}
              style={{ background: notice.isRead ? 'rgba(42,42,62,0.4)' : 'rgba(99,102,241,0.06)', border: `1px solid ${notice.isRead ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.2)'}`, borderRadius: 14, padding: '18px 22px', cursor: 'pointer', transition: 'all 0.25s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = cfg.color + '40'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = notice.isRead ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.2)'; }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${cfg.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${cfg.color}30` }}>
                  <Icon size={18} color={cfg.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {!notice.isRead && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />}
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f0f0ff' }}>{notice.title}</h3>
                    </div>
                    <span className={`badge badge-${notice.category === 'urgent' ? 'danger' : notice.category === 'exam' ? 'primary' : notice.category === 'event' ? 'warning' : 'success'}`}>{cfg.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                    <span style={{ fontSize: 12, color: '#606080' }}>By {notice.publishedBy}</span>
                    <span style={{ fontSize: 12, color: '#606080' }}>{formatDistanceToNow(new Date(notice.publishedAt), { addSuffix: true })}</span>
                  </div>
                  {isSelected && (
                    <div style={{ marginTop: 14, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, fontSize: 13, color: '#c0c0d8', lineHeight: 1.7, animation: 'fadeInUp 0.2s ease' }}>
                      {notice.content}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
