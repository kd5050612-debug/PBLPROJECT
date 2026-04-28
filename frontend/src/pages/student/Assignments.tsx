import { useState, useEffect } from 'react';
import { assignmentsAPI } from '../../services/api';
import { Clock, CheckCircle2, XCircle, FileText, Star, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending:   { label: 'Pending',   color: '#f59e0b', icon: Clock },
  submitted: { label: 'Submitted', color: '#6366f1', icon: CheckCircle2 },
  graded:    { label: 'Graded',    color: '#10b981', icon: Star },
  late:      { label: 'Late',      color: '#ef4444', icon: XCircle },
};

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    assignmentsAPI.getAll().then(r => setAssignments(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? assignments : assignments.filter(a => (a.submission_status || 'pending') === filter);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading assignments...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Assignments</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className="card" style={{ textAlign: 'center', cursor: 'pointer', border: filter === key ? `1px solid ${cfg.color}` : undefined }}
            onClick={() => setFilter(filter === key ? 'all' : key)}>
            <cfg.icon size={24} color={cfg.color} style={{ marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: cfg.color }}>
              {assignments.filter(a => (a.submission_status || 'pending') === key).length}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cfg.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.length === 0
          ? <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No assignments found.</div>
          : filtered.map((a: any) => {
            const status = a.submission_status || 'pending';
            const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
            const isPastDue = new Date(a.due_date) < new Date();
            return (
              <div key={a.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={18} color="#6366f1" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{a.title}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.course_name} · {a.course_code}</p>
                      <p style={{ fontSize: '0.75rem', color: isPastDue && status === 'pending' ? '#ef4444' : 'var(--text-muted)', marginTop: 4 }}>
                        Due: {new Date(a.due_date).toLocaleDateString('en-IN')}
                        {isPastDue && status === 'pending' && ' · OVERDUE'}
                      </p>
                    </div>
                  </div>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: `${cfg.color}20`, color: cfg.color }}>{cfg.label}</span>
                </div>
                {expanded === a.id && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    {a.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>{a.description}</p>}
                    {status === 'pending' && (
                      <button className="btn-primary" onClick={(e) => { e.stopPropagation(); toast.success('File upload coming soon!'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <Upload size={16} /> Submit Assignment
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
