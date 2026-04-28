import { useState, useEffect } from 'react';
import { attendanceAPI } from '../../services/api';
import { AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function StudentAttendance() {
  const [summary, setSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceAPI.getSummary().then(r => setSummary(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading attendance...</div>;

  const overall = summary.length
    ? Math.round(summary.reduce((s, a) => s + parseFloat(a.attendance_percentage), 0) / summary.length)
    : 0;
  const totalPresent = summary.reduce((s, a) => s + parseInt(a.present_count), 0);
  const totalAbsent = summary.reduce((s, a) => s + parseInt(a.absent_count), 0);
  const totalLate = summary.reduce((s, a) => s + parseInt(a.late_count), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Attendance Tracker</h1>

      {overall < 75 && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <AlertTriangle size={20} color="#ef4444" />
          <p style={{ color: '#ef4444', fontWeight: 600 }}>⚠️ Overall attendance {overall}% — below 75% threshold. Risk of detention!</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Overall', value: `${overall}%`, icon: overall >= 75 ? CheckCircle2 : AlertTriangle, color: overall >= 75 ? '#10b981' : '#ef4444' },
          { label: 'Total Present', value: totalPresent, icon: CheckCircle2, color: '#10b981' },
          { label: 'Total Absent', value: totalAbsent, icon: XCircle, color: '#ef4444' },
          { label: 'Total Late', value: totalLate, icon: Clock, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <s.icon size={28} color={s.color} style={{ marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {summary.length > 0 && (
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Course-wise Attendance</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={summary.map(a => ({ name: a.course_code, pct: parseFloat(a.attendance_percentage) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} formatter={(v: any) => [`${v}%`, 'Attendance']} />
              <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                {summary.map((a, i) => <Cell key={i} fill={parseFloat(a.attendance_percentage) >= 75 ? '#10b981' : '#ef4444'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h2 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Detailed Breakdown</h2>
        {summary.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No attendance data yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {summary.map((a: any) => (
              <div key={a.course_id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{a.course_name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.course_code} · {a.total_classes} classes</p>
                  </div>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, background: parseFloat(a.attendance_percentage) >= 75 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: parseFloat(a.attendance_percentage) >= 75 ? '#10b981' : '#ef4444' }}>
                    {a.attendance_percentage}%
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>✅ Present: {a.present_count}</span>
                  <span>❌ Absent: {a.absent_count}</span>
                  <span>⏰ Late: {a.late_count}</span>
                </div>
                <div style={{ marginTop: '0.5rem', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${a.attendance_percentage}%`, background: parseFloat(a.attendance_percentage) >= 75 ? '#10b981' : '#ef4444', borderRadius: 3, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
