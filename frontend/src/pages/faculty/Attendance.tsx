import { useState } from 'react';
import { mockCourses, mockStudents } from '../../data/mockData';
import { CheckCircle2, XCircle, Clock, Save } from 'lucide-react';
import toast from 'react-hot-toast';

type Status = 'present' | 'absent' | 'late';

export default function FacultyAttendance() {
  const [selectedCourse, setSelectedCourse] = useState(mockCourses[0].id);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState<Record<string, Status>>({});
  const course = mockCourses.find(c => c.id === selectedCourse)!;

  const mark = (id: string, status: Status) => setAttendance(a => ({ ...a, [id]: status }));
  const markAll = (status: Status) => {
    const all: Record<string, Status> = {};
    mockStudents.slice(0, 10).forEach(s => { all[s.id] = status; });
    setAttendance(all);
  };

  const handleSave = () => toast.success(`Attendance saved for ${date} — ${Object.keys(attendance).length} entries`);

  const counts = { present: 0, absent: 0, late: 0, unmarked: 0 };
  mockStudents.slice(0, 10).forEach(s => {
    if (attendance[s.id]) counts[attendance[s.id]]++;
    else counts.unmarked++;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="font-jakarta" style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ff' }}>Mark Attendance</h2>
        <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>Record daily attendance for your classes</p>
      </div>

      {/* Controls */}
      <div className="glass-card" style={{ padding: 22, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#a0a0c0', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Select Course</label>
          <select className="input-field" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} style={{ cursor: 'pointer' }}>
            {mockCourses.slice(0, 3).map(c => <option key={c.id} value={c.id} style={{ background: '#1e1e2e' }}>{c.code} — {c.name}</option>)}
          </select>
        </div>
        <div style={{ minWidth: 180 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#a0a0c0', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</label>
          <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" style={{ padding: '10px 16px', fontSize: 12 }} onClick={() => markAll('present')}>All Present</button>
          <button className="btn-ghost" style={{ padding: '10px 16px', fontSize: 12 }} onClick={() => markAll('absent')}>All Absent</button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {[
          { label: 'Present', count: counts.present, color: '#10b981', icon: CheckCircle2 },
          { label: 'Absent', count: counts.absent, color: '#ef4444', icon: XCircle },
          { label: 'Late', count: counts.late, color: '#f59e0b', icon: Clock },
          { label: 'Unmarked', count: counts.unmarked, color: '#8b5cf6', icon: Clock },
        ].map(({ label, count, color, icon: Icon }) => (
          <div key={label} style={{ background: `${color}10`, border: `1px solid ${color}25`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon size={20} color={color} />
            <div><div style={{ fontSize: 24, fontWeight: 800, color }}>{count}</div><div style={{ fontSize: 11, color: '#808090' }}>{label}</div></div>
          </div>
        ))}
      </div>

      {/* Student List */}
      <div className="glass-card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#d0d0f0' }}>Students — {course.name}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {mockStudents.slice(0, 10).map((s, i) => {
            const status = attendance[s.id];
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#818cf8', flexShrink: 0 }}>{i + 1}</span>
                <div className="avatar" style={{ width: 32, height: 32, fontSize: 11 }}>{s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e0e0f8' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: '#606080' }}>{s.universityId}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['present', 'absent', 'late'] as Status[]).map(st => {
                    const cfg = { present: { color: '#10b981', icon: CheckCircle2 }, absent: { color: '#ef4444', icon: XCircle }, late: { color: '#f59e0b', icon: Clock } }[st];
                    return (
                      <button key={st} onClick={() => mark(s.id, st)}
                        style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${status === st ? cfg.color : 'rgba(255,255,255,0.08)'}`, background: status === st ? `${cfg.color}20` : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                        <cfg.icon size={16} color={status === st ? cfg.color : '#606080'} />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <button className="btn-primary" style={{ width: '100%', marginTop: 20, padding: '13px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={handleSave}>
          <Save size={16} /> Save Attendance
        </button>
      </div>
    </div>
  );
}
