import { mockCourses } from '../../data/mockData';
import { BookOpen, Users, Clock, MapPin, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FacultyCourses() {
  const courses = mockCourses.slice(0, 3);
  const handleUpload = (name: string) => toast.success(`Upload portal opened for ${name}`);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="font-jakarta" style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ff' }}>My Courses</h2>
        <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>Manage materials, assignments, and student progress</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {courses.map((c, i) => {
          const colors = ['#8b5cf6', '#6366f1', '#06b6d4'];
          const color = colors[i % colors.length];
          return (
            <div key={c.id} className="glass-card" style={{ padding: 26 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 18 }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30` }}>
                    <BookOpen size={24} color={color} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f0f0ff' }}>{c.name}</h3>
                    <p style={{ fontSize: 13, color, fontWeight: 600, marginTop: 2 }}>{c.code}</p>
                    <p style={{ fontSize: 12, color: '#808090', marginTop: 4 }}>{c.description}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge badge-primary">{c.credits} Credits</span>
                  <span className="badge badge-cyan">Sem {c.semester}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 18 }}>
                {[
                  { icon: Users, label: 'Students', value: c.enrolledCount, color: '#6366f1' },
                  { icon: Clock, label: 'Schedule', value: c.schedule, color: '#8b5cf6' },
                  { icon: MapPin, label: 'Room', value: c.room, color: '#06b6d4' },
                ].map(({ icon: Icon, label, value, color: c2 }) => (
                  <div key={label} style={{ background: `${c2}08`, border: `1px solid ${c2}20`, borderRadius: 12, padding: '14px', textAlign: 'center' }}>
                    <Icon size={18} color={c2} style={{ marginBottom: 6 }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e0e0f8' }}>{value}</div>
                    <div style={{ fontSize: 11, color: '#606080', marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn-primary" style={{ padding: '9px 18px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => handleUpload(c.name)}>
                  <Upload size={14} /> Upload Material
                </button>
                <button className="btn-ghost" style={{ padding: '9px 18px', fontSize: 13 }}>Mark Attendance</button>
                <button className="btn-ghost" style={{ padding: '9px 18px', fontSize: 13 }}>Create Assignment</button>
                <button className="btn-ghost" style={{ padding: '9px 18px', fontSize: 13 }}>View Students</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
