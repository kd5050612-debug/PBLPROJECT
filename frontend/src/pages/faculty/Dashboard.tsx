import { useAuthStore } from '../../store/authStore';
import { mockCourses, mockStudents, mockAssignments, mockNotices } from '../../data/mockData';
import { Users, BookOpen, FileText, Bell, TrendingUp, ClipboardCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const myCourses = mockCourses.slice(0, 3);
const totalStudents = myCourses.reduce((a, c) => a + c.enrolledCount, 0);

const performanceData = [
  { name: 'CS501', avg: 82, pass: 95 },
  { name: 'CS502', avg: 74, pass: 88 },
  { name: 'CS505', avg: 79, pass: 91 },
];

export default function FacultyDashboard() {
  const { user } = useAuthStore();
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const stats = [
    { label: 'Assigned Courses', value: myCourses.length, icon: BookOpen, color: '#8b5cf6' },
    { label: 'Total Students', value: totalStudents, icon: Users, color: '#6366f1' },
    { label: 'Pending Grades', value: 12, icon: ClipboardCheck, color: '#f59e0b' },
    { label: 'Unread Notices', value: mockNotices.filter(n => !n.isRead && n.targetRoles.includes('faculty')).length, icon: Bell, color: '#06b6d4' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="font-jakarta" style={{ fontSize: 24, fontWeight: 800, background: 'linear-gradient(135deg,#f0f0ff,#8080c0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome, {user?.name?.split(' ').slice(0, 2).join(' ')} 👨‍🏫
          </h2>
          <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>{today} · {user?.department}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-primary">{user?.universityId}</span>
          <span className="badge" style={{ background: 'rgba(139,92,246,0.2)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)' }}>Associate Professor</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ borderColor: `${s.color}20` }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, borderRadius: '50%', background: s.color, filter: 'blur(40px)', opacity: 0.12 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
              <div>
                <p style={{ fontSize: 12, color: '#a0a0c0', fontWeight: 500, marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{s.label}</p>
                <p style={{ fontSize: 32, fontWeight: 800, color: '#f0f0ff' }}>{s.value}</p>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${s.color}30` }}>
                <s.icon size={20} color={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Course Cards */}
        <div className="glass-card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#d0d0f0' }}>📚 My Courses</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {myCourses.map((c, i) => {
              const colors = ['#8b5cf6', '#6366f1', '#06b6d4'];
              return (
                <div key={c.id} style={{ display: 'flex', gap: 14, padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${colors[i]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={18} color={colors[i]} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#e0e0f8' }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: '#606080', marginTop: 3 }}>{c.code} · {c.enrolledCount} students · {c.schedule}</div>
                  </div>
                  <span className="badge badge-primary" style={{ height: 'fit-content' }}>{c.credits}cr</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="chart-container">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: '#d0d0f0' }}>📊 Class Performance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={performanceData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#606080', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#606080', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="avg" name="Avg Score" radius={[4,4,0,0]}>
                {performanceData.map((_, i) => <Cell key={i} fill={['#8b5cf6','#6366f1','#06b6d4'][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* At-risk students */}
      <div className="glass-card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#d0d0f0' }}>⚠️ At-Risk Students</h3>
          <span className="badge badge-danger">{mockStudents.filter(s => s.attendancePercentage < 75).length} students</span>
        </div>
        <table className="data-table">
          <thead><tr><th>Student</th><th>ID</th><th>Dept</th><th>Attendance</th><th>CGPA</th><th>Action</th></tr></thead>
          <tbody>
            {mockStudents.filter(s => s.attendancePercentage < 80).slice(0, 5).map(s => (
              <tr key={s.id}>
                <td style={{ color: '#c0c0e0', fontWeight: 500 }}>{s.name}</td>
                <td style={{ color: '#606080', fontSize: 12 }}>{s.universityId}</td>
                <td style={{ color: '#a0a0c0' }}>{s.department.split(' ')[0]}</td>
                <td><span style={{ color: s.attendancePercentage < 75 ? '#f87171' : '#fbbf24', fontWeight: 700 }}>{s.attendancePercentage}%</span></td>
                <td style={{ color: '#818cf8', fontWeight: 600 }}>{s.cgpa}</td>
                <td><button className="btn-ghost" style={{ padding: '4px 12px', fontSize: 11 }}>Notify</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
