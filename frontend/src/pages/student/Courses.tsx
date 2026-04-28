import { useState, useEffect } from 'react';
import { coursesAPI } from '../../services/api';
import { BookOpen, Clock, MapPin, User, Hash } from 'lucide-react';

export default function StudentCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesAPI.getAll().then(r => setCourses(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading courses...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>My Courses</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '-1rem' }}>Enrolled in {courses.length} courses this semester</p>
      {courses.length === 0
        ? <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No courses enrolled yet.</div>
        : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {courses.map((c: any) => (
              <div key={c.id} className="card card-hover" style={{ borderTop: '3px solid #6366f1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={20} color="#6366f1" />
                  </div>
                  <span style={{ padding: '0.2rem 0.75rem', background: 'rgba(99,102,241,0.15)', color: '#6366f1', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700 }}>
                    {c.credits} Credits
                  </span>
                </div>
                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{c.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>{c.department_name}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {[
                    { icon: Hash, label: c.code },
                    { icon: User, label: c.faculty_name || 'TBA' },
                    { icon: Clock, label: c.schedule || 'TBA' },
                    { icon: MapPin, label: c.room || 'TBA' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <item.icon size={14} color="#94a3b8" />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
