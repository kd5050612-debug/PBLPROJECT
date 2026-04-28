import { mockDepartments } from '../../data/mockData';
import { Building2, Users, BookOpen, GraduationCap, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDepartments() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="font-jakarta" style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ff' }}>Departments</h2>
          <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>{mockDepartments.length} departments across MIT ADT University</p>
        </div>
        <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => toast.success('Add department dialog opened!')}>
          <Plus size={14} /> Add Department
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20 }}>
        {mockDepartments.map((dept, i) => {
          const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];
          const color = colors[i % colors.length];
          const pct = Math.round((dept.studentsCount / 2000) * 100);
          return (
            <div key={dept.id} className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30`, flexShrink: 0 }}>
                    <Building2 size={22} color={color} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f0f0ff', lineHeight: 1.3 }}>{dept.name}</h3>
                    <span className="badge badge-primary" style={{ marginTop: 6, display: 'inline-block' }}>{dept.code}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-ghost" style={{ padding: '5px 12px', fontSize: 11 }} onClick={() => toast.success(`Editing ${dept.name}`)}>Edit</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 18 }}>
                {[
                  { icon: GraduationCap, label: 'Students', value: dept.studentsCount, color: '#6366f1' },
                  { icon: Users,         label: 'Faculty',  value: dept.facultyCount,  color: '#8b5cf6' },
                  { icon: BookOpen,      label: 'Courses',  value: dept.coursesCount,  color: color },
                ].map(({ icon: Icon, label, value, color: c }) => (
                  <div key={label} style={{ background: `${c}08`, border: `1px solid ${c}20`, borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                    <Icon size={16} color={c} style={{ marginBottom: 4 }} />
                    <div style={{ fontSize: 18, fontWeight: 800, color: c }}>{value}</div>
                    <div style={{ fontSize: 10, color: '#606080', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: '#606080', marginBottom: 4 }}>HOD</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#c0c0e0' }}>{dept.hod}</div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: '#808090' }}>University share</span>
                  <span style={{ fontSize: 11, color: color }}>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}aa)` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
