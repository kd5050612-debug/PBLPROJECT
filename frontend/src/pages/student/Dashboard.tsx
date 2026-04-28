import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { coursesAPI, attendanceAPI, assignmentsAPI, notificationsAPI } from '../../services/api';
import { BookOpen, ClipboardCheck, FileText, TrendingUp, AlertTriangle, Bell } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [c, a, asgn, notifs] = await Promise.all([
          coursesAPI.getAll(),
          attendanceAPI.getSummary(),
          assignmentsAPI.getAll(),
          notificationsAPI.getAll(),
        ]);
        setCourses(c.data);
        setAttendance(a.data);
        setAssignments(asgn.data);
        setNotifications(notifs.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const avgAttendance = attendance.length
    ? Math.round(attendance.reduce((s: number, a: any) => s + parseFloat(a.attendance_percentage || 0), 0) / attendance.length)
    : 0;
  const pendingAssignments = assignments.filter((a: any) => !a.submission_status || a.submission_status === 'pending').length;
  const atRisk = attendance.filter((a: any) => parseFloat(a.attendance_percentage) < 75).length;
  const unread = notifications.filter((n: any) => !n.is_read).length;

  const attendanceChartData = attendance.map((a: any) => ({
    name: a.course_code,
    percentage: parseFloat(a.attendance_percentage),
    present: parseInt(a.present_count),
    total: parseInt(a.total_classes),
  }));

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div className="spinner" style={{ width: 48, height: 48, border: '4px solid rgba(99,102,241,0.2)', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          {user?.university_id} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Enrolled Courses', value: courses.length, icon: BookOpen, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
          { label: 'Avg Attendance', value: `${avgAttendance}%`, icon: ClipboardCheck, color: avgAttendance >= 75 ? '#10b981' : '#f59e0b', bg: avgAttendance >= 75 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)' },
          { label: 'Pending Tasks', value: pendingAssignments, icon: FileText, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
          { label: 'At-Risk Courses', value: atRisk, icon: AlertTriangle, color: atRisk > 0 ? '#ef4444' : '#10b981', bg: atRisk > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)' },
          { label: 'Notifications', value: unread, icon: Bell, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {atRisk > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <AlertTriangle size={20} color="#ef4444" />
          <p style={{ color: '#ef4444', fontWeight: 600 }}>
            ⚠️ You have {atRisk} course(s) below 75% attendance. Risk of detention!
          </p>
        </div>
      )}

      {/* Attendance Chart */}
      {attendanceChartData.length > 0 && (
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="#6366f1" /> Attendance Overview
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={attendanceChartData}>
              <defs>
                <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} formatter={(v: any) => [`${v}%`, 'Attendance']} />
              <Area type="monotone" dataKey="percentage" stroke="#6366f1" fill="url(#attGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Upcoming Assignments */}
      {assignments.length > 0 && (
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>📋 Pending Assignments</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {assignments.filter((a: any) => !a.submission_status || a.submission_status === 'pending').slice(0, 5).map((a: any) => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{a.title}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{a.course_name} · {a.course_code}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: new Date(a.due_date) < new Date() ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>
                    Due {new Date(a.due_date).toLocaleDateString('en-IN')}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{a.max_marks} marks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
