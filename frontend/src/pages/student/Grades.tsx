import { mockGrades } from '../../data/mockData';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

const cgpa = (mockGrades.reduce((a, b) => a + b.gpa, 0) / mockGrades.length).toFixed(2);

const gradeColor = (g: string) => {
  if (g === 'A+') return '#34d399';
  if (g === 'A') return '#6366f1';
  if (g === 'A-') return '#818cf8';
  if (g === 'B+') return '#f59e0b';
  return '#ef4444';
};

const radarData = mockGrades.map(g => ({ subject: g.courseName.split(' ')[0], score: Math.round((g.total / 150) * 100) }));

export default function StudentGrades() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="font-jakarta" style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ff' }}>Academic Results</h2>
        <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>Semester-wise grades and performance overview</p>
      </div>

      {/* CGPA Hero */}
      <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.15))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, padding: '32px', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 72, fontWeight: 900, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>{cgpa}</div>
          <div style={{ fontSize: 14, color: '#a0a0c0', marginTop: 8, fontWeight: 600 }}>Cumulative GPA</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, flex: 1, minWidth: 280 }}>
          {[
            { label: 'Semester', value: '5' },
            { label: 'Credits Earned', value: '78' },
            { label: 'Rank', value: '#12' },
            { label: 'Backlogs', value: '0' },
            { label: 'Distinction', value: '3' },
            { label: 'Pass', value: '5' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ff' }}>{value}</div>
              <div style={{ fontSize: 11, color: '#808090', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Grade table */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: '#d0d0f0' }}>📋 Semester 5 Detailed Results</h3>
          <table className="data-table">
            <thead>
              <tr><th>Course</th><th>Code</th><th>Internal</th><th>External</th><th>Total</th><th>Grade</th><th>GPA</th></tr>
            </thead>
            <tbody>
              {mockGrades.map(g => (
                <tr key={g.courseId}>
                  <td style={{ color: '#c0c0e0', fontWeight: 500 }}>{g.courseName}</td>
                  <td style={{ color: '#606080' }}>CS{500 + parseInt(g.courseId.replace('C',''))}</td>
                  <td style={{ color: '#d0d0f0' }}>{g.internal}/50</td>
                  <td style={{ color: '#d0d0f0' }}>{g.external}/100</td>
                  <td style={{ color: '#d0d0f0', fontWeight: 700 }}>{g.total}/150</td>
                  <td>
                    <span style={{ fontSize: 16, fontWeight: 800, color: gradeColor(g.grade) }}>{g.grade}</span>
                  </td>
                  <td style={{ color: '#818cf8', fontWeight: 700 }}>{g.gpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 16, padding: '14px 16px', background: 'rgba(99,102,241,0.08)', borderRadius: 10, border: '1px solid rgba(99,102,241,0.2)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#a0a0c0' }}>Semester GPA</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#818cf8' }}>{cgpa}</span>
          </div>
        </div>

        {/* Radar chart */}
        <div className="chart-container">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#d0d0f0' }}>Performance Radar</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#808090', fontSize: 11 }} />
              <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
