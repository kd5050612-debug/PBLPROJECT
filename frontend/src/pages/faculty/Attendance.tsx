import { useState, useEffect } from 'react';
import { coursesAPI, attendanceAPI } from '../../services/api';
import { CheckCircle2, XCircle, Clock, Save } from 'lucide-react';
import toast from 'react-hot-toast';

type Status = 'present' | 'absent' | 'late';

export default function FacultyAttendance() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, Status>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesAPI.getAll().then(r => { setCourses(r.data); if (r.data[0]) setSelectedCourse(r.data[0].id); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    // Load existing attendance for selected course+date and enrolled students
    attendanceAPI.getRecords({ course_id: selectedCourse, date }).then(r => {
      const existing: Record<string, Status> = {};
      r.data.forEach((rec: any) => { existing[rec.student_id] = rec.status; });
      setAttendance(existing);
    });
  }, [selectedCourse, date]);

  const mark = (studentId: string, status: Status) => setAttendance(prev => ({ ...prev, [studentId]: status }));

  const save = async () => {
    if (!selectedCourse || students.length === 0) return toast.error('Select a course with students first');
    setSaving(true);
    try {
      const records = students.map(s => ({ student_id: s.id, status: attendance[s.id] || 'present' }));
      await attendanceAPI.markAttendance({ records, course_id: selectedCourse, date });
      toast.success(`Attendance saved for ${records.length} students!`);
    } catch { toast.error('Failed to save attendance'); }
    finally { setSaving(false); }
  };

  const stats = { present: Object.values(attendance).filter(s => s === 'present').length, absent: Object.values(attendance).filter(s => s === 'absent').length, late: Object.values(attendance).filter(s => s === 'late').length };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Mark Attendance</h1>

      <div className="card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Course</label>
          <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
            {courses.map(c => <option key={c.id} value={c.id} style={{ background: '#1e293b' }}>{c.name} ({c.code})</option>)}
          </select>
        </div>
        <div style={{ minWidth: 160 }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem' }} />
        </div>
        <button className="btn-primary" onClick={save} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Save size={16} />{saving ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        {[{ label: 'Present', value: stats.present, color: '#10b981' }, { label: 'Absent', value: stats.absent, color: '#ef4444' }, { label: 'Late', value: stats.late, color: '#f59e0b' }].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
          📋 Student list will appear here once course enrollments are set up in the database. Use the Save button to submit attendance for enrolled students.
        </p>
      </div>
    </div>
  );
}
