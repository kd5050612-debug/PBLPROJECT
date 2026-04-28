import { useState, useEffect } from 'react';
import { gradesAPI } from '../../services/api';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

const gradeColor = (g: string) => ({ A: '#10b981', B: '#6366f1', C: '#f59e0b', D: '#f97316', F: '#ef4444' }[g?.[0]] || '#94a3b8');

export default function StudentGrades() {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gradesAPI.getAll().then(r => setGrades(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading grades...</div>;

  const cgpa = grades.length
    ? (grades.reduce((s, g) => s + (parseFloat(g.grade_points) || 0), 0) / grades.length).toFixed(2)
    : '—';

  const radarData = grades.map(g => ({ subject: g.course_code, score: parseFloat(g.marks_obtained) || 0 }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Academic Results</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem' }}>
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <p style={{ fontSize: '3rem', fontWeight: 900, color: '#6366f1' }}>{cgpa}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>CGPA</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{grades.filter(g => g.grade?.startsWith('A')).length}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>A Grades</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#6366f1' }}>{grades.length}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Courses</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>
            {grades.length ? Math.round(grades.reduce((s, g) => s + (parseFloat(g.marks_obtained) || 0), 0) / grades.length) : '—'}%
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Avg Marks</p>
        </div>
      </div>

      {radarData.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Performance Radar</h2>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Marks per Course</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={radarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {radarData.map((_, i) => <Cell key={i} fill="#6366f1" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="card">
        <h2 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Detailed Results</h2>
        {grades.length === 0
          ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No grades published yet.</p>
          : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  {['Course','Code','Sem','Marks','Grade','Points'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grades.map((g: any) => (
                  <tr key={g.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem', color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600 }}>{g.course_name}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{g.course_code}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{g.semester}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-primary)', fontSize: '0.875rem' }}>{g.marks_obtained}/{g.max_marks}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: 12, fontSize: '0.8rem', fontWeight: 700, background: `${gradeColor(g.grade)}20`, color: gradeColor(g.grade) }}>{g.grade || '—'}</span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#6366f1', fontWeight: 700 }}>{g.grade_points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
