import { useState } from 'react';
import { mockStudents } from '../../data/mockData';
import { Search, Download, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FacultyStudents() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = mockStudents.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.universityId.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'atrisk' && s.attendancePercentage < 80) || (filter === 'active' && s.status === 'active');
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="font-jakarta" style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ff' }}>My Students</h2>
          <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>{mockStudents.length} students across assigned courses</p>
        </div>
        <button className="btn-ghost" style={{ padding: '10px 18px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => toast.success('Report downloaded!')}>
          <Download size={14} /> Export Report
        </button>
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#606080' }} />
          <input className="input-field" placeholder="Search by name or ID..." style={{ paddingLeft: 36 }} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['all', 'active', 'atrisk'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '10px 18px', borderRadius: 8, border: `1px solid ${filter === f ? '#8b5cf6' : 'rgba(255,255,255,0.08)'}`, background: filter === f ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)', color: filter === f ? '#c084fc' : '#a0a0c0', fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
            {f === 'atrisk' ? '⚠️ At Risk' : f === 'all' ? 'All Students' : 'Active'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ borderSpacing: 0 }}>
            <thead>
              <tr><th>#</th><th>Student</th><th>University ID</th><th>Department</th><th>Semester</th><th>Attendance</th><th>CGPA</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id}>
                  <td style={{ color: '#606080', fontSize: 12 }}>{i + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                      <span style={{ color: '#c0c0e0', fontWeight: 500 }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#808090', fontSize: 12 }}>{s.universityId}</td>
                  <td style={{ color: '#a0a0c0' }}>{s.department.split(' ')[0]}</td>
                  <td style={{ color: '#a0a0c0', textAlign: 'center' }}>{s.semester}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ width: 60 }}>
                        <div className="progress-fill" style={{ width: `${s.attendancePercentage}%`, background: s.attendancePercentage < 75 ? 'linear-gradient(90deg,#ef4444,#f87171)' : s.attendancePercentage < 85 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#10b981,#34d399)' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: s.attendancePercentage < 75 ? '#f87171' : s.attendancePercentage < 85 ? '#fbbf24' : '#34d399' }}>{s.attendancePercentage}%</span>
                      {s.attendancePercentage < 80 && <AlertTriangle size={13} color="#fbbf24" />}
                    </div>
                  </td>
                  <td style={{ color: '#818cf8', fontWeight: 700 }}>{s.cgpa}</td>
                  <td><span className={`badge badge-${s.status === 'active' ? 'success' : 'danger'}`}>{s.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => toast.success(`Profile opened: ${s.name}`)}>View</button>
                      <button className="btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => toast.success(`Alert sent to ${s.name}`)}>Alert</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#606080' }}>No students found matching your search.</div>
        )}
      </div>
    </div>
  );
}
