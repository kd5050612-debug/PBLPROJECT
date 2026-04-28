import { useState, useEffect } from 'react';
import { noticesAPI } from '../../services/api';
import { Bell, BookOpen, Calendar, AlertTriangle, Trophy, GraduationCap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CAT_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  exam:     { icon: BookOpen,      color: '#ef4444', label: 'Exam' },
  event:    { icon: Calendar,      color: '#6366f1', label: 'Event' },
  academic: { icon: GraduationCap, color: '#10b981', label: 'Academic' },
  holiday:  { icon: Trophy,        color: '#f59e0b', label: 'Holiday' },
  result:   { icon: Trophy,        color: '#8b5cf6', label: 'Result' },
  general:  { icon: Bell,          color: '#94a3b8', label: 'General' },
};

export default function StudentNotices() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    noticesAPI.getAll().then(r => setNotices(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? notices : notices.filter(n => n.category === filter);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading notices...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Notice Board</h1>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} style={{ padding: '0.4rem 1rem', borderRadius: 20, border: filter === 'all' ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)', background: filter === 'all' ? 'rgba(99,102,241,0.15)' : 'transparent', color: filter === 'all' ? '#6366f1' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>All</button>
        {Object.entries(CAT_CONFIG).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilter(filter === key ? 'all' : key)}
            style={{ padding: '0.4rem 1rem', borderRadius: 20, border: filter === key ? `1px solid ${cfg.color}` : '1px solid rgba(255,255,255,0.1)', background: filter === key ? `${cfg.color}15` : 'transparent', color: filter === key ? cfg.color : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
            {cfg.label}
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No notices found.</div>
        : filtered.map((n: any) => {
          const cfg = CAT_CONFIG[n.category] || CAT_CONFIG.general;
          return (
            <div key={n.id} className="card" style={{ cursor: 'pointer', border: n.is_important ? '1px solid rgba(239,68,68,0.4)' : undefined }}
              onClick={() => setExpanded(expanded === n.id ? null : n.id)}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${cfg.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <cfg.icon size={18} color={cfg.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{n.title}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      {n.is_important && <span style={{ padding: '0.15rem 0.5rem', background: 'rgba(239,68,68,0.15)', color: '#ef4444', borderRadius: 10, fontSize: '0.65rem', fontWeight: 700 }}>IMPORTANT</span>}
                      <span style={{ padding: '0.15rem 0.5rem', background: `${cfg.color}15`, color: cfg.color, borderRadius: 10, fontSize: '0.65rem', fontWeight: 700 }}>{cfg.label.toUpperCase()}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {n.created_by_name} · {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </p>
                  {expanded === n.id && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.75rem', lineHeight: 1.6 }}>{n.content}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
