import { mockCourses } from '../../data/mockData';
import { BookOpen, Clock, MapPin, User, Hash } from 'lucide-react';

export default function StudentCourses() {
  const courses = mockCourses.filter(c => c.semester === 5);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="font-jakarta" style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ff' }}>My Courses</h2>
        <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>Semester 5 — {courses.length} enrolled courses</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
        {courses.map((c, i) => {
          const colors = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b'];
          const color = colors[i % colors.length];
          return (
            <div key={c.id} className="glass-card" style={{ padding: 24, cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30` }}>
                  <BookOpen size={20} color={color} />
                </div>
                <span className="badge badge-primary" style={{ height: 'fit-content' }}>{c.credits} Credits</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f0f0ff', marginBottom: 4 }}>{c.name}</h3>
              <p style={{ fontSize: 12, color: color, fontWeight: 600, marginBottom: 12 }}>{c.code}</p>
              <p style={{ fontSize: 12, color: '#808090', marginBottom: 16, lineHeight: 1.5 }}>{c.description}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: User, text: c.facultyName },
                  { icon: Clock, text: c.schedule },
                  { icon: MapPin, text: `Room ${c.room}` },
                  { icon: Hash, text: `${c.enrolledCount} students enrolled` },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={13} color="#606080" />
                    <span style={{ fontSize: 12, color: '#a0a0c0' }}>{text}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
                <button className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: 12 }}>View Materials</button>
                <button className="btn-ghost" style={{ flex: 1, padding: '8px', fontSize: 12 }}>Assignments</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
