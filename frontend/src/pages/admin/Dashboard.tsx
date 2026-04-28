import { mockStudents, mockFaculty, mockDepartments, mockCourses, adminStatsTimeline, departmentEnrollmentData } from '../../data/mockData';
import { Users, GraduationCap, Building2, BookOpen, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const stats = [
  { label: 'Total Students', value: '1,960', change: '+40', icon: GraduationCap, color: '#6366f1' },
  { label: 'Faculty Members', value: '76', change: '+2', icon: Users, color: '#8b5cf6' },
  { label: 'Departments', value: mockDepartments.length, change: '', icon: Building2, color: '#06b6d4' },
  { label: 'Active Courses', value: '192', change: '+4', icon: BookOpen, color: '#10b981' },
];

export default function AdminDashboard() {
  const atRisk = mockStudents.filter(s => s.attendancePercentage < 75).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="font-jakarta" style={{ fontSize: 24, fontWeight: 800, background: 'linear-gradient(135deg,#f0f0ff,#8080c0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Admin Control Panel 🏛️
        </h2>
        <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>MIT ADT University — System Overview · Academic Year 2025-26</p>
      </div>

      {/* Alert Banner */}
      {atRisk > 0 && (
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <AlertTriangle size={18} color="#fbbf24" />
          <span style={{ fontSize: 13, color: '#d0d0b0' }}><strong style={{ color: '#fbbf24' }}>{atRisk} students</strong> have attendance below 75% and may be debarred from exams. Review required.</span>
          <button className="btn-ghost" style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: 12, flexShrink: 0 }}>View Report</button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ borderColor: `${s.color}20` }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, borderRadius: '50%', background: s.color, filter: 'blur(40px)', opacity: 0.12 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
              <div>
                <p style={{ fontSize: 12, color: '#a0a0c0', fontWeight: 500, marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{s.label}</p>
                <p style={{ fontSize: 32, fontWeight: 800, color: '#f0f0ff' }}>{s.value}</p>
                {s.change && <p style={{ fontSize: 12, color: '#34d399', marginTop: 6 }}>↑ {s.change} this month</p>}
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${s.color}30` }}>
                <s.icon size={20} color={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="chart-container">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: '#d0d0f0' }}>📈 Enrollment Trends (Sep–Apr)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={adminStatsTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#606080', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#606080', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#a0a0c0' }} />
              <Line type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={2} dot={false} name="Students" />
              <Line type="monotone" dataKey="faculty" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Faculty" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#d0d0f0' }}>🏫 Dept Enrollment</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={departmentEnrollmentData} dataKey="students" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={50}>
                {departmentEnrollmentData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 10, color: '#a0a0c0' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Table */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#d0d0f0' }}>🏢 Department Overview</h3>
        <table className="data-table">
          <thead><tr><th>Department</th><th>Code</th><th>HOD</th><th>Students</th><th>Faculty</th><th>Courses</th><th>Status</th></tr></thead>
          <tbody>
            {mockDepartments.map(d => (
              <tr key={d.id}>
                <td style={{ color: '#c0c0e0', fontWeight: 500 }}>{d.name}</td>
                <td><span className="badge badge-primary">{d.code}</span></td>
                <td style={{ color: '#a0a0c0' }}>{d.hod}</td>
                <td style={{ color: '#818cf8', fontWeight: 600 }}>{d.studentsCount}</td>
                <td style={{ color: '#34d399', fontWeight: 600 }}>{d.facultyCount}</td>
                <td style={{ color: '#fbbf24', fontWeight: 600 }}>{d.coursesCount}</td>
                <td><span className="badge badge-success">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
