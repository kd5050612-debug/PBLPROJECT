import { useState, useEffect } from 'react';
import { assignmentsAPI, coursesAPI } from '../../services/api';
import { Plus, FileText, Clock, CheckCircle2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FacultyAssignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', course_id: '', due_date: '', max_marks: 100 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([assignmentsAPI.getAll(), coursesAPI.getAll()])
      .then(([a, c]) => { setAssignments(a.data); setCourses(c.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.course_id || !form.due_date) return toast.error('Fill all required fields');
    setSubmitting(true);
    try {
      const { data } = await assignmentsAPI.create(form);
      setAssignments(prev => [data, ...prev]);
      setShowForm(false);
      setForm({ title: '', description: '', course_id: '', due_date: '', max_marks: 100 });
      toast.success('Assignment created!');
    } catch { toast.error('Failed to create assignment'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Assignments</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} />{showForm ? 'Cancel' : 'New Assignment'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Create Assignment</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Assignment title"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Course *</label>
                <select value={form.course_id} onChange={e => setForm(p => ({ ...p, course_id: e.target.value }))}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                  <option value="" style={{ background: '#1e293b' }}>Select course</option>
                  {courses.map(c => <option key={c.id} value={c.id} style={{ background: '#1e293b' }}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Due Date *</label>
                <input type="datetime-local" value={form.due_date} onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Max Marks</label>
                <input type="number" value={form.max_marks} onChange={e => setForm(p => ({ ...p, max_marks: parseInt(e.target.value) }))}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
                style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem', resize: 'vertical' }} />
            </div>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ alignSelf: 'flex-start' }}>
              {submitting ? 'Creating...' : 'Create Assignment'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {assignments.length === 0
          ? <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No assignments created yet.</div>
          : assignments.map((a: any) => (
            <div key={a.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={18} color="#6366f1" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{a.title}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.course_name} · {a.course_code}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Due: {new Date(a.due_date).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: '#10b981' }}>{a.submission_count || 0} submissions</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.max_marks} marks</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
