import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Search, Plus, UserCheck, UserX, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'student' | 'faculty'>('student');
  const [search, setSearch] = useState('');
  const [toggling, setToggling] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers({ role: tab, search: search || undefined });
      setUsers(data);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [tab, search]);

  const toggleUser = async (id: string, name: string) => {
    setToggling(id);
    try {
      const { data } = await adminAPI.toggleUser(id);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: data.is_active } : u));
      toast.success(`${name} ${data.is_active ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Failed to update user'); }
    finally { setToggling(null); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>User Management</h1>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => toast.success('Add user form coming soon!')}>
          <Plus size={18} /> Add User
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['student', 'faculty'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '0.5rem 1.25rem', borderRadius: 8, border: tab === t ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)', background: tab === t ? 'rgba(99,102,241,0.15)' : 'transparent', color: tab === t ? '#6366f1' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize' }}>
              {t}s
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${tab}s...`}
            style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem' }} />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</p>
        ) : users.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No users found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['Name', 'ID', 'Email', 'Department', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.85rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>
                          {u.name[0]}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{u.university_id}</td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{u.email}</td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{u.department_name || '—'}</td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: 12, fontSize: '0.7rem', fontWeight: 700, background: u.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: u.is_active ? '#10b981' : '#ef4444' }}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <button onClick={() => toggleUser(u.id, u.name)} disabled={toggling === u.id}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', borderRadius: 6, border: `1px solid ${u.is_active ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`, background: 'transparent', color: u.is_active ? '#ef4444' : '#10b981', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                        {u.is_active ? <><UserX size={14} />Deactivate</> : <><UserCheck size={14} />Activate</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
