import { mockAttendance, attendanceTrendData } from '../../data/mockData';
import { AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function StudentAttendance() {
  const overall = Math.round(mockAttendance.reduce((a, b) => a + b.percentage, 0) / mockAttendance.length);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="font-jakarta" style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ff' }}>Attendance Tracker</h2>
        <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>Track your attendance across all enrolled courses</p>
      </div>

      {/* Overall Card */}
      <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, padding: 28, display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: overall >= 85 ? '#34d399' : overall >= 75 ? '#fbbf24' : '#f87171', lineHeight: 1 }}>{overall}%</div>
          <div style={{ fontSize: 13, color: '#a0a0c0', marginTop: 6 }}>Overall Attendance</div>
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, minWidth: 280 }}>
          {[
            { icon: CheckCircle2, label: 'Total Present', value: mockAttendance.reduce((a,b) => a+b.present, 0), color: '#10b981' },
            { icon: XCircle,      label: 'Total Absent',  value: mockAttendance.reduce((a,b) => a+b.absent, 0),  color: '#ef4444' },
            { icon: Clock,        label: 'Late Entries',  value: mockAttendance.reduce((a,b) => a+b.late, 0),    color: '#f59e0b' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} style={{ background: `${color}10`, border: `1px solid ${color}25`, borderRadius: 14, padding: '16px', textAlign: 'center' }}>
              <Icon size={22} color={color} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 11, color: '#808090', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Low attendance warning */}
      {mockAttendance.some(a => a.percentage < 80) && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <AlertTriangle size={18} color="#f87171" />
          <span style={{ fontSize: 13, color: '#fca5a5' }}>
            <strong>Warning:</strong> Your attendance in <strong>{mockAttendance.filter(a => a.percentage < 80).map(a => a.courseName).join(', ')}</strong> is below 80%. Risk of exam debarment.
          </span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Bar chart */}
        <div className="chart-container">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: '#d0d0f0' }}>Attendance by Course</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockAttendance} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="courseName" tick={{ fill: '#606080', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v.split(' ')[0]} />
              <YAxis tick={{ fill: '#606080', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12 }} formatter={(v: any) => [`${v}%`, 'Attendance']} />
              <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                {mockAttendance.map(a => <Cell key={a.courseId} fill={a.percentage < 75 ? '#ef4444' : a.percentage < 85 ? '#f59e0b' : '#6366f1'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detail table */}
        <div className="chart-container">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#d0d0f0' }}>Course-wise Breakdown</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Course</th><th>Present</th><th>Absent</th><th>%</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockAttendance.map(a => (
                <tr key={a.courseId}>
                  <td style={{ color: '#c0c0e0', fontWeight: 500 }}>{a.courseName.split(' ')[0]}</td>
                  <td style={{ color: '#34d399' }}>{a.present}</td>
                  <td style={{ color: '#f87171' }}>{a.absent}</td>
                  <td style={{ fontWeight: 700, color: a.percentage < 75 ? '#f87171' : a.percentage < 85 ? '#fbbf24' : '#34d399' }}>{a.percentage}%</td>
                  <td>
                    <span className={`badge badge-${a.percentage >= 85 ? 'success' : a.percentage >= 75 ? 'warning' : 'danger'}`}>
                      {a.percentage >= 85 ? 'Good' : a.percentage >= 75 ? 'Average' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
