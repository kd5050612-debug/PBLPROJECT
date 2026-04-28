import { useState, useEffect } from 'react';
import { noticesAPI } from '../../services/api';
import { Plus, Bell, Trash2, AlertTriangle, GraduationCap, Trophy, BookOpen, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const CAT_ICONS: Record<string, any> = { exam: BookOpen, event: Calendar, academic: GraduationCap, holiday: Trophy, result: Trophy, general: Bell };
const CAT_COLORS: Record<string, string> = { exam: '#ef4444', event: '#6366f1', academic: '#10b981', holiday: '#f59e0b', result: '#8b5cf6', general: '#94a3b8' };

export default function AdminNotices() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'general', target_role: 'all', is_important: false });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    noticesAPI.getAll().then(r => setNotices(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return toast.error('Title and content required');
    setSubmitting(true);
    try {
      const { data } = await noticesAPI.create(form);
      setNotices(prev => [data, ...prev]);
      setShowForm(false);
      setForm({ title: '', content: '', category: 'general', target_role: 'all', is_important: false });
      toast.success('Notice published!');
    } catch { toast.error('Failed to publish notice'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await noticesAPI.delete(id);
      setNotices(prev => prev.filter(n => n.id !== id));
      toast.success('Notice deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading notices...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Notice Management</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} />{showForm ? 'Cancel' : 'New Notice'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Publish Notice</h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Title *</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Notice title"
                style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                  {['general','exam','event','academic','holiday','result'].map(c => <option key={c} value={c} style={{ background: '#1e293b', textTransform: 'capitalize' }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Target Audience</label>
                <select value={form.target_role} onChange={e => setForm(p => ({ ...p, target_role: e.target.value }))}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                  {['all','student','faculty','admin'].map(r => <option key={r} value={r} style={{ background: '#1e293b', textTransform: 'capitalize' }}>{r}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Content *</label>
              <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={4} placeholder="Notice details..."
                style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem', resize: 'vertical' }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.is_important} onChange={e => setForm(p => ({ ...p, is_important: e.target.checked }))} />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Mark as Important</span>
            </label>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ alignSelf: 'flex-start' }}>
              {submitting ? 'Publishing...' : 'Publish Notice'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notices.length === 0
          ? <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No notices published yet.</div>
          : notices.map((n: any) => {
            const Icon = CAT_ICONS[n.category] || Bell;
            const color = CAT_COLORS[n.category] || '#94a3b8';
            return (
              <div key={n.id} className="card" style={{ border: n.is_important ? '1px solid rgba(239,68,68,0.35)' : undefined }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} color={color} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{n.title}</p>
                        {n.is_important && <AlertTriangle size={14} color="#ef4444" />}
                        <span style={{ padding: '0.1rem 0.5rem', borderRadius: 8, fontSize: '0.65rem', fontWeight: 700, background: `${color}15`, color }}>{n.category}</span>
                        <span style={{ padding: '0.1rem 0.5rem', borderRadius: 8, fontSize: '0.65rem', background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>→ {n.target_role}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{n.content}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        By {n.created_by_name || 'Admin'} · {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(n.id)}
                    style={{ padding: '0.4rem', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, background: 'transparent', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
