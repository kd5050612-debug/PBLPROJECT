import { useState } from 'react';
import { mockAssignments } from '../../data/mockData';
import { Assignment } from '../../types';
import { Upload, Clock, CheckCircle2, XCircle, FileText, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const statusConfig: Record<string, { label: string; badgeClass: string; icon: any }> = {
  pending:   { label: 'Pending',   badgeClass: 'badge-warning', icon: Clock },
  submitted: { label: 'Submitted', badgeClass: 'badge-primary', icon: CheckCircle2 },
  graded:    { label: 'Graded',    badgeClass: 'badge-success', icon: Star },
  late:      { label: 'Late',      badgeClass: 'badge-danger',  icon: XCircle },
};

export default function StudentAssignments() {
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? mockAssignments : mockAssignments.filter(a => a.status === filter);

  const handleSubmit = (id: string) => {
    toast.success('Assignment submitted successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="font-jakarta" style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ff' }}>Assignments</h2>
          <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>{mockAssignments.length} assignments across all courses</p>
        </div>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'pending', 'submitted', 'graded', 'late'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${filter === f ? '#6366f1' : 'rgba(255,255,255,0.08)'}`, background: filter === f ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)', color: filter === f ? '#818cf8' : '#a0a0c0', fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {(['pending','submitted','graded','late'] as const).map(s => {
          const count = mockAssignments.filter(a => a.status === s).length;
          const { label, icon: Icon } = statusConfig[s];
          const colors: Record<string, string> = { pending: '#f59e0b', submitted: '#6366f1', graded: '#10b981', late: '#ef4444' };
          return (
            <div key={s} style={{ background: `${colors[s]}10`, border: `1px solid ${colors[s]}25`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon size={20} color={colors[s]} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: colors[s] }}>{count}</div>
                <div style={{ fontSize: 11, color: '#808090' }}>{label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assignment Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map(a => {
          const { label, badgeClass, icon: Icon } = statusConfig[a.status || 'pending'];
          const daysLeft = Math.ceil((new Date(a.dueDate).getTime() - Date.now()) / 86400000);
          return (
            <div key={a.id} className="glass-card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 14, flex: 1 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={20} color="#818cf8" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0f0ff', marginBottom: 4 }}>{a.title}</h3>
                    <p style={{ fontSize: 12, color: '#8b5cf6', marginBottom: 8, fontWeight: 600 }}>{a.courseName}</p>
                    <p style={{ fontSize: 12, color: '#808090', lineHeight: 1.5, marginBottom: 12 }}>{a.description}</p>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: '#a0a0c0' }}>📅 Due: <strong style={{ color: daysLeft < 2 ? '#f87171' : '#d0d0f0' }}>{a.dueDate}</strong></span>
                      <span style={{ fontSize: 12, color: '#a0a0c0' }}>📊 Max Marks: <strong style={{ color: '#d0d0f0' }}>{a.maxMarks}</strong></span>
                      {a.grade !== undefined && <span style={{ fontSize: 12, color: '#a0a0c0' }}>✅ Score: <strong style={{ color: '#34d399' }}>{a.grade}/{a.maxMarks}</strong></span>}
                    </div>
                    {a.feedback && (
                      <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10 }}>
                        <span style={{ fontSize: 12, color: '#6ee7b7' }}>💬 Feedback: {a.feedback}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                  <span className={`badge ${badgeClass}`}><Icon size={10} /> {label}</span>
                  {daysLeft > 0 && a.status === 'pending' && (
                    <span style={{ fontSize: 11, color: daysLeft < 3 ? '#f87171' : '#808090' }}>{daysLeft}d left</span>
                  )}
                  {a.status === 'pending' && (
                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => handleSubmit(a.id)}>
                      <Upload size={13} /> Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: '#606080' }}>
            <FileText size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p>No {filter} assignments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
