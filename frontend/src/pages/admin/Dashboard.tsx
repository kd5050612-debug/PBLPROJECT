import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users, GraduationCap, Building2, BookOpen, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.getStats(), adminAPI.getDepartments()])
      .then(([s, d]) => { setStats(s.data); setDepartments(d.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading dashboard...</div>;

  const pieData = departments.slice(0, 5).map(d => ({ name: d.code, value: parseInt(d.student_count) || 0 }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Admin Dashboard 🎛️</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Students', value: stats?.total_students ?? 0, icon: GraduationCap, color: '#6366f1' },
          { label: 'Total Faculty', value: stats?.total_faculty ?? 0, icon: Users, color: '#10b981' },
          { label: 'Total Courses', value: stats?.total_courses ?? 0, icon: BookOpen, color: '#f59e0b' },
          { label: 'Departments', value: stats?.total_departments ?? 0, icon: Building2, color: '#8b5cf6' },
          { label: 'Pending Fees', value: `₹${Number(stats?.pending_fees ?? 0).toLocaleString('en-IN')}`, icon: TrendingUp, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              <p style={{ fontSize: s.label === 'Pending Fees' ? '1rem' : '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {pieData.length > 0 && (
          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Dept. Enrollment</h2>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Departments Overview</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {departments.slice(0, 5).map((d: any, i: number) => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>{d.code}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span style={{ color: '#6366f1' }}>{d.student_count || 0} students</span>
                  <span style={{ color: '#10b981' }}>{d.faculty_count || 0} faculty</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
