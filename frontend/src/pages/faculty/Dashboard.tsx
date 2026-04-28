import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { coursesAPI, attendanceAPI, assignmentsAPI, adminAPI } from '../../services/api';
import { Users, BookOpen, FileText, TrendingUp, ClipboardCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FacultyDashboard() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([coursesAPI.getAll(), assignmentsAPI.getAll()])
      .then(([c, a]) => { setCourses(c.data); setAssignments(a.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalStudents = courses.reduce((s: number, c: any) => s + (parseInt(c.enrolled_count) || 0), 0);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</div>;

  const chartData = courses.map((c: any) => ({ name: c.code, students: parseInt(c.enrolled_count) || 0 }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Faculty Portal — {user?.name?.split(' ').slice(-1)[0]} 👨‍🏫
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{user?.university_id}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }}>
        {[
          { label: 'My Courses', value: courses.length, icon: BookOpen, color: '#6366f1' },
          { label: 'Total Students', value: totalStudents, icon: Users, color: '#10b981' },
          { label: 'Assignments', value: assignments.length, icon: FileText, color: '#f59e0b' },
          { label: 'Submissions', value: assignments.reduce((s: number, a: any) => s + (parseInt(a.submission_count) || 0), 0), icon: ClipboardCheck, color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="#6366f1" /> Enrollment per Course
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="students" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h2 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>My Courses</h2>
        {courses.length === 0
          ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No courses assigned yet.</p>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {courses.map((c: any) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.code} · Sem {c.semester}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, color: '#10b981' }}>{c.enrolled_count || 0} students</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.credits} credits</p>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
