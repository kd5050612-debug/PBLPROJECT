import { useState } from 'react';
import { mockNotices } from '../../data/mockData';
import { Plus, Bell, AlertTriangle, GraduationCap, Trophy, BookOpen, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const catConfig: Record<string, { icon: any; color: string }> = {
  exam:     { icon: GraduationCap, color: '#6366f1' },
  general:  { icon: Bell,          color: '#06b6d4' },
  urgent:   { icon: AlertTriangle, color: '#ef4444' },
  event:    { icon: Trophy,        color: '#f59e0b' },
  academic: { icon: BookOpen,      color: '#10b981' },
};

export default function AdminNotices() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'general', content: '', targetRoles: ['student', 'faculty', 'admin'] });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Notice published successfully to all target users!');
    setShowForm(false);
    setForm({ title: '', category: 'general', content: '', targetRoles: ['student', 'faculty', 'admin'] });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="font-jakarta" style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ff' }}>Notice Board Management</h2>
          <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>Publish and manage university-wide notices</p>
        </div>
        <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setShowForm(s => !s)}>
          <Megaphone size={14} /> Publish Notice
        </button>
      </div>

      {/* Publish Form */}
      {showForm && (
        <div className="glass-card" style={{ padding: 28, animation: 'fadeInUp 0.3s ease' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: '#d0d0f0' }}>📢 New Notice</h3>
          <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#a0a0c0', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Title</label>
                <input className="input-field" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Notice title..." required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#a0a0c0', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Category</label>
                <select className="input-field" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ cursor: 'pointer' }}>
                  {Object.keys(catConfig).map(c => <option key={c} value={c} style={{ background: '#1e1e2e', textTransform: 'capitalize' }}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#a0a0c0', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Target Audience</label>
              <div style={{ display: 'flex', gap: 12 }}>
                {(['student', 'faculty', 'admin'] as const).map(role => (
                  <label key={role} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.targetRoles.includes(role)}
                      onChange={e => setForm(f => ({ ...f, targetRoles: e.target.checked ? [...f.targetRoles, role] : f.targetRoles.filter(r => r !== role) }))}
                      style={{ accentColor: '#6366f1', width: 16, height: 16 }} />
                    <span style={{ fontSize: 13, color: '#c0c0e0', textTransform: 'capitalize' }}>{role}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#a0a0c0', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Content</label>
              <textarea className="input-field" rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write the full notice content here..." required style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px' }}>Publish Notice</button>
              <button type="button" className="btn-ghost" style={{ padding: '12px 24px' }} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Notice List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mockNotices.map(notice => {
          const cfg = catConfig[notice.category] || catConfig.general;
          const Icon = cfg.icon;
          return (
            <div key={notice.id} className="glass-card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${cfg.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${cfg.color}30`, flexShrink: 0 }}>
                  <Icon size={18} color={cfg.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f0f0ff' }}>{notice.title}</h3>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span className={`badge badge-${notice.category === 'urgent' ? 'danger' : notice.category === 'exam' ? 'primary' : notice.category === 'event' ? 'warning' : 'success'}`} style={{ textTransform: 'capitalize' }}>{notice.category}</span>
                      <button className="btn-ghost" style={{ padding: '4px 12px', fontSize: 11 }} onClick={() => toast.success('Notice edited!')}>Edit</button>
                      <button style={{ padding: '4px 12px', fontSize: 11, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, color: '#f87171', cursor: 'pointer' }} onClick={() => toast.error('Notice removed!')}>Remove</button>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#a0a0b0', lineHeight: 1.6, marginBottom: 10 }}>{notice.content}</p>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: '#606080' }}>By {notice.publishedBy}</span>
                    <span style={{ fontSize: 11, color: '#606080' }}>{formatDistanceToNow(new Date(notice.publishedAt), { addSuffix: true })}</span>
                    <span style={{ fontSize: 11, color: '#606080' }}>To: {notice.targetRoles.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
