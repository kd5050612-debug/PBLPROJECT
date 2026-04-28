import { useAuthStore } from '../../store/authStore';
import { mockCourses, mockAttendance, mockAssignments, mockNotifications, mockGrades, attendanceTrendData } from '../../data/mockData';
import { BookOpen, ClipboardCheck, FileText, TrendingUp, AlertTriangle, CheckCircle2, Clock, Award } from 'lucide-react';
import { RadialBarChart, RadialBar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const avgAttendance = Math.round(mockAttendance.reduce((a, b) => a + b.percentage, 0) / mockAttendance.length);
const cgpa = 8.86;
const pendingAssignments = mockAssignments.filter(a => a.status === 'pending').length;
const unreadNotifs = mockNotifications.filter(n => !n.isRead).length;

const radialData = [{ name: 'Attendance', value: avgAttendance, fill: '#6366f1' }];

const StatCard = ({ icon: Icon, label, value, sub, color, glow }: any) => (
  <div className="stat-card" style={{ borderColor: `${color}20` }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, borderRadius: '50%', background: color, filter: 'blur(40px)', opacity: 0.12 }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
      <div>
        <p style={{ fontSize: 12, color: '#a0a0c0', fontWeight: 500, marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</p>
        <p style={{ fontSize: 32, fontWeight: 800, color: '#f0f0ff', lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ fontSize: 12, color: '#606080', marginTop: 6 }}>{sub}</p>}
      </div>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30` }}>
        <Icon size={20} color={color} />
      </div>
    </div>
  </div>
);

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeInUp 0.5s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="font-jakarta" style={{ fontSize: 24, fontWeight: 800, background: 'linear-gradient(135deg,#f0f0ff,#8080c0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Good morning, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>{today} · {user?.department} · Sem {user?.semester}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-primary">Batch {user?.batch}</span>
          <span className="badge badge-cyan">{user?.universityId}</span>
        </div>
      </div>

      {/* Alert Banner */}
      {unreadNotifs > 0 && (
        <div style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.1),rgba(239,68,68,0.05))', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertTriangle size={18} color="#fbbf24" />
          <span style={{ fontSize: 13, color: '#d0d0b0' }}>You have <strong style={{ color: '#fbbf24' }}>{unreadNotifs} unread notifications</strong> and <strong style={{ color: '#f87171' }}>{pendingAssignments} pending assignments</strong>. Check them now.</span>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
        <StatCard icon={TrendingUp}     label="CGPA"              value={cgpa}          sub="Current semester"    color="#6366f1" />
        <StatCard icon={ClipboardCheck} label="Avg Attendance"    value={`${avgAttendance}%`} sub="Across 5 courses"  color="#10b981" />
        <StatCard icon={BookOpen}       label="Enrolled Courses"  value={mockCourses.filter(c=>c.semester===5).length} sub="Semester 5"       color="#8b5cf6" />
        <StatCard icon={FileText}       label="Pending Assignments" value={pendingAssignments} sub="Due this week"  color="#f59e0b" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Attendance Trend */}
        <div className="chart-container">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: '#d0d0f0' }}>📈 Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={attendanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#606080', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#606080', fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 100]} />
              <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#f0f0ff', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#a0a0c0' }} />
              <Line type="monotone" dataKey="ML" stroke="#6366f1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="CC" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="SE" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="CN" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Course-wise Attendance */}
        <div className="chart-container">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#d0d0f0' }}>📊 Course Attendance</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mockAttendance.map(a => (
              <div key={a.courseId}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: '#c0c0e0', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.courseName}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: a.percentage < 75 ? '#f87171' : a.percentage < 85 ? '#fbbf24' : '#34d399' }}>{a.percentage}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${a.percentage}%`, background: a.percentage < 75 ? 'linear-gradient(90deg,#ef4444,#f87171)' : a.percentage < 85 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#10b981,#34d399)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent Assignments */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#d0d0f0' }}>📝 Recent Assignments</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mockAssignments.slice(0, 4).map(a => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#d0d0f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: '#606080', marginTop: 2 }}>{a.courseName} · Due {a.dueDate}</div>
                </div>
                <span className={`badge badge-${a.status === 'graded' ? 'success' : a.status === 'submitted' ? 'primary' : a.status === 'late' ? 'danger' : 'warning'}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Summary */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#d0d0f0' }}>🏆 Grade Summary — Sem 5</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mockGrades.map(g => (
              <div key={g.courseId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#d0d0f0' }}>{g.courseName}</div>
                  <div style={{ fontSize: 11, color: '#606080', marginTop: 2 }}>Internal: {g.internal} | External: {g.external}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: g.grade.includes('+') ? '#34d399' : '#818cf8' }}>{g.grade}</div>
                  <div style={{ fontSize: 11, color: '#606080' }}>GPA {g.gpa}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
