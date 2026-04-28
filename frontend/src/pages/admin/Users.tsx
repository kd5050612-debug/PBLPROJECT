import { useState } from 'react';
import { mockStudents, mockFaculty } from '../../data/mockData';
import { Search, Plus, Download, UserCheck, UserX } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [tab, setTab] = useState<'students' | 'faculty'>('students');
  const [search, setSearch] = useState('');

  const students = mockStudents.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.universityId.toLowerCase().includes(search.toLowerCase())
  );
  const faculty = mockFaculty.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.universityId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="font-jakarta" style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ff' }}>User Management</h2>
          <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>{mockStudents.length} students · {mockFaculty.length} faculty members</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" style={{ padding: '10px 18px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => toast.success('Export initiated!')}>
            <Download size={14} /> Export
          </button>
          <button className="btn-primary" style={{ padding: '10px 18px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => toast.success('Add user form opened!')}>
            <Plus size={14} /> Add User
          </button>
        </div>
      </div>

      {/* Tabs + Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 4, gap: 4, border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['students', 'faculty'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: tab === t ? 'rgba(6,182,212,0.2)' : 'transparent', color: tab === t ? '#22d3ee' : '#a0a0c0', fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#606080' }} />
          <input className="input-field" placeholder="Search users..." style={{ paddingLeft: 36, width: 260 }} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {tab === 'students' ? (
            <table className="data-table" style={{ borderSpacing: 0 }}>
              <thead><tr><th>#</th><th>Student</th><th>University ID</th><th>Department</th><th>Semester</th><th>Batch</th><th>Attendance</th><th>CGPA</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id}>
                    <td style={{ color: '#606080', fontSize: 12 }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar" style={{ width: 30, height: 30, fontSize: 10 }}>{s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#c0c0e0' }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: '#606080' }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#808090', fontSize: 12 }}>{s.universityId}</td>
                    <td style={{ color: '#a0a0c0', fontSize: 12 }}>{s.department.split(' ')[0]}</td>
                    <td style={{ color: '#a0a0c0', textAlign: 'center' }}>{s.semester}</td>
                    <td style={{ color: '#a0a0c0', fontSize: 12 }}>{s.batch}</td>
                    <td><span style={{ fontSize: 12, fontWeight: 700, color: s.attendancePercentage < 75 ? '#f87171' : '#34d399' }}>{s.attendancePercentage}%</span></td>
                    <td style={{ color: '#818cf8', fontWeight: 600 }}>{s.cgpa}</td>
                    <td><span className={`badge badge-${s.status === 'active' ? 'success' : 'danger'}`}>{s.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => toast.success(`Editing ${s.name}`)}>Edit</button>
                        <button style={{ padding: '4px 10px', fontSize: 11, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, color: '#f87171', cursor: 'pointer' }} onClick={() => toast.error(`Suspended ${s.name}`)}>Suspend</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="data-table" style={{ borderSpacing: 0 }}>
              <thead><tr><th>#</th><th>Faculty</th><th>University ID</th><th>Department</th><th>Designation</th><th>Courses</th><th>Students</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {faculty.map((f, i) => (
                  <tr key={f.id}>
                    <td style={{ color: '#606080', fontSize: 12 }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar" style={{ width: 30, height: 30, fontSize: 10, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)' }}>{f.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#c0c0e0' }}>{f.name}</div>
                          <div style={{ fontSize: 11, color: '#606080' }}>{f.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#808090', fontSize: 12 }}>{f.universityId}</td>
                    <td style={{ color: '#a0a0c0', fontSize: 12 }}>{f.department}</td>
                    <td style={{ color: '#a0a0c0', fontSize: 12 }}>{f.designation}</td>
                    <td style={{ color: '#fbbf24', fontWeight: 600, textAlign: 'center' }}>{f.coursesCount}</td>
                    <td style={{ color: '#818cf8', fontWeight: 600, textAlign: 'center' }}>{f.studentsCount}</td>
                    <td><span className={`badge badge-${f.status === 'active' ? 'success' : 'danger'}`}>{f.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => toast.success(`Editing ${f.name}`)}>Edit</button>
                        <button style={{ padding: '4px 10px', fontSize: 11, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, color: '#f87171', cursor: 'pointer' }} onClick={() => toast.error(`Deactivated ${f.name}`)}>Deactivate</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
