import { mockStudents, mockFaculty, mockDepartments, departmentEnrollmentData } from '../../data/mockData';
import { Download, TrendingUp, AlertTriangle, Users, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import toast from 'react-hot-toast';

const atRiskStudents = mockStudents.filter(s => s.attendancePercentage < 75);
const excellentStudents = mockStudents.filter(s => s.cgpa >= 9.0);

const avgCgpaByDept = [
  { dept: 'CSE', cgpa: 8.4 },
  { dept: 'ECE', cgpa: 7.9 },
  { dept: 'ME',  cgpa: 7.6 },
  { dept: 'CE',  cgpa: 7.8 },
  { dept: 'AIML',cgpa: 8.7 },
  { dept: 'IT',  cgpa: 8.1 },
  { dept: 'DS',  cgpa: 8.5 },
];

const attendanceDistribution = [
  { range: '<60%', count: 45, fill: '#ef4444' },
  { range: '60-75%', count: 120, fill: '#f59e0b' },
  { range: '75-85%', count: 380, fill: '#6366f1' },
  { range: '85-95%', count: 890, fill: '#10b981' },
  { range: '>95%', count: 525, fill: '#34d399' },
];

export default function AdminReports() {
  const handleExport = (type: string) => toast.success(`${type} report exported as PDF!`);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="font-jakarta" style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ff' }}>Analytics & Reports</h2>
          <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>Institutional insights and downloadable reports</p>
        </div>
        <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => handleExport('Full System')}>
          <Download size={14} /> Export Full Report
        </button>
      </div>

      {/* Key Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
        {[
          { label: 'At-Risk Students', value: atRiskStudents.length, color: '#ef4444', icon: AlertTriangle, sub: 'Below 75% attendance' },
          { label: 'Top Performers', value: excellentStudents.length, color: '#10b981', icon: TrendingUp, sub: 'CGPA ≥ 9.0' },
          { label: 'Avg Attendance', value: `${Math.round(mockStudents.reduce((a, s) => a + s.attendancePercentage, 0) / mockStudents.length)}%`, color: '#6366f1', icon: Users, sub: 'University-wide' },
          { label: 'Avg CGPA', value: (mockStudents.reduce((a, s) => a + s.cgpa, 0) / mockStudents.length).toFixed(2), color: '#8b5cf6', icon: BookOpen, sub: 'All students' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ borderColor: `${s.color}20` }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '50%', background: s.color, filter: 'blur(30px)', opacity: 0.15 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              <div>
                <p style={{ fontSize: 11, color: '#a0a0c0', fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
                <p style={{ fontSize: 30, fontWeight: 800, color: s.color }}>{s.value}</p>
                <p style={{ fontSize: 11, color: '#606080', marginTop: 4 }}>{s.sub}</p>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={18} color={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="chart-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#d0d0f0' }}>Avg CGPA by Department</h3>
            <button className="btn-ghost" style={{ padding: '5px 12px', fontSize: 11 }} onClick={() => handleExport('CGPA')}>Export</button>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={avgCgpaByDept} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="dept" tick={{ fill: '#606080', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#606080', fontSize: 11 }} axisLine={false} tickLine={false} domain={[7, 10]} />
              <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12 }} formatter={(v: any) => [v, 'Avg CGPA']} />
              <Bar dataKey="cgpa" radius={[6, 6, 0, 0]}>
                {avgCgpaByDept.map((_, i) => <Cell key={i} fill={['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899'][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#d0d0f0' }}>Attendance Distribution</h3>
            <button className="btn-ghost" style={{ padding: '5px 12px', fontSize: 11 }} onClick={() => handleExport('Attendance')}>Export</button>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={attendanceDistribution} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                {attendanceDistribution.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#a0a0c0' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Report Downloads */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: '#d0d0f0' }}>📋 Available Reports</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
          {[
            { name: 'Student Attendance Report', desc: 'Course-wise attendance for all students', color: '#6366f1' },
            { name: 'Academic Performance Report', desc: 'Grades and CGPA distribution', color: '#8b5cf6' },
            { name: 'Fee Collection Report', desc: 'Semester-wise fee collection status', color: '#10b981' },
            { name: 'Faculty Workload Report', desc: 'Courses and student load per faculty', color: '#f59e0b' },
            { name: 'At-Risk Students Report', desc: 'Students needing intervention', color: '#ef4444' },
            { name: 'Department Analytics', desc: 'Department-wise performance metrics', color: '#06b6d4' },
          ].map(r => (
            <div key={r.name} style={{ background: `${r.color}08`, border: `1px solid ${r.color}20`, borderRadius: 12, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#d0d0f0', marginBottom: 4 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: '#606080' }}>{r.desc}</div>
              </div>
              <button className="btn-ghost" style={{ padding: '7px 14px', fontSize: 12, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => handleExport(r.name)}>
                <Download size={12} /> PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
