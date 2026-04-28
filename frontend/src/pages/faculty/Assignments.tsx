import { useState } from 'react';
import { mockAssignments, mockCourses } from '../../data/mockData';
import { Plus, FileText, Clock, CheckCircle2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FacultyAssignments() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', courseId: mockCourses[0].id, dueDate: '', maxMarks: 25, description: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Assignment created and notified to students!');
    setShowForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="font-jakarta" style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ff' }}>Assignments</h2>
          <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>Create and manage assignments for your courses</p>
        </div>
        <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setShowForm(s => !s)}>
          <Plus size={15} /> New Assignment
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="glass-card" style={{ padding: 28, animation: 'fadeInUp 0.3s ease' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: '#d0d0f0' }}>📝 Create New Assignment</h3>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', fontSize: 12, color: '#a0a0c0', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Title</label>
              <input className="input-field" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Assignment title" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#a0a0c0', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Course</label>
              <select className="input-field" value={form.courseId} onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))} style={{ cursor: 'pointer' }}>
                {mockCourses.slice(0, 3).map(c => <option key={c.id} value={c.id} style={{ background: '#1e1e2e' }}>{c.code} — {c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#a0a0c0', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Due Date</label>
              <input type="date" className="input-field" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#a0a0c0', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Max Marks</label>
              <input type="number" className="input-field" value={form.maxMarks} onChange={e => setForm(f => ({ ...f, maxMarks: +e.target.value }))} min={1} max={100} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', fontSize: 12, color: '#a0a0c0', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Description</label>
              <textarea className="input-field" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the assignment..." required style={{ resize: 'vertical' }} />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10 }}>
              <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px' }}>Create & Notify Students</button>
              <button type="button" className="btn-ghost" style={{ padding: '12px 24px' }} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Assignment List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {mockAssignments.map(a => {
          const statusColors: Record<string, string> = { pending: '#f59e0b', submitted: '#6366f1', graded: '#10b981', late: '#ef4444' };
          const submissions = Math.floor(Math.random() * 30) + 20;
          return (
            <div key={a.id} className="glass-card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={20} color="#a78bfa" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f0f0ff', marginBottom: 4 }}>{a.title}</h3>
                    <p style={{ fontSize: 12, color: '#8b5cf6', marginBottom: 6, fontWeight: 600 }}>{a.courseName}</p>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: '#a0a0c0' }}>📅 Due: <strong style={{ color: '#d0d0f0' }}>{a.dueDate}</strong></span>
                      <span style={{ fontSize: 12, color: '#a0a0c0' }}>📊 Max: <strong style={{ color: '#d0d0f0' }}>{a.maxMarks} marks</strong></span>
                      <span style={{ fontSize: 12, color: '#a0a0c0' }}>📬 Submissions: <strong style={{ color: '#34d399' }}>{submissions}</strong></span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-ghost" style={{ padding: '7px 14px', fontSize: 12 }}>Grade</button>
                  <button className="btn-ghost" style={{ padding: '7px 14px', fontSize: 12 }}>Edit</button>
                </div>
              </div>
              {/* Submission progress */}
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#808090' }}>Submission rate</span>
                  <span style={{ fontSize: 12, color: '#818cf8' }}>{submissions}/62 students</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.round(submissions / 62 * 100)}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
