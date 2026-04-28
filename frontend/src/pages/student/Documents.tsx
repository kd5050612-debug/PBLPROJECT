import { mockDocuments } from '../../data/mockData';
import { FileText, Download, Award, CreditCard, BookOpen, File } from 'lucide-react';
import toast from 'react-hot-toast';

const typeConfig: Record<string, { icon: any; color: string; label: string }> = {
  marksheet:   { icon: FileText, color: '#6366f1', label: 'Marksheet' },
  certificate: { icon: Award,    color: '#10b981', label: 'Certificate' },
  id_card:     { icon: CreditCard, color: '#06b6d4', label: 'ID Card' },
  resource:    { icon: BookOpen, color: '#f59e0b', label: 'Resource' },
  other:       { icon: File,     color: '#8b5cf6', label: 'Document' },
};

export default function StudentDocuments() {
  const handleDownload = (name: string) => toast.success(`Downloading ${name}...`);
  const handleRequest = () => toast.success('Document request submitted! You will be notified via email.');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="font-jakarta" style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ff' }}>Document Vault</h2>
          <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>Access and download your academic documents</p>
        </div>
        <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }} onClick={handleRequest}>
          + Request Document
        </button>
      </div>

      {/* Quick Request Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14 }}>
        {['Bonafide Certificate', 'Transcript Request', 'No Dues Certificate', 'Migration Certificate'].map((doc, i) => {
          const colors = ['#6366f1', '#8b5cf6', '#10b981', '#06b6d4'];
          return (
            <button key={doc} onClick={handleRequest}
              style={{ background: `${colors[i]}10`, border: `1px solid ${colors[i]}25`, borderRadius: 14, padding: '18px 16px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.25s', color: 'inherit' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${colors[i]}20`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${colors[i]}10`; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
              <Award size={22} color={colors[i]} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 12, fontWeight: 600, color: '#c0c0e0' }}>{doc}</div>
              <div style={{ fontSize: 11, color: '#606080', marginTop: 4 }}>Click to request</div>
            </button>
          );
        })}
      </div>

      {/* Documents List */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: '#d0d0f0' }}>📁 My Documents</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mockDocuments.map(doc => {
            const cfg = typeConfig[doc.type] || typeConfig.other;
            const Icon = cfg.icon;
            return (
              <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)'; }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: `${cfg.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={cfg.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e0e0f8' }}>{doc.name}</div>
                  <div style={{ fontSize: 11, color: '#606080', marginTop: 2 }}>Uploaded {doc.uploadedAt} · {doc.size}</div>
                </div>
                <span className={`badge badge-${doc.type === 'marksheet' ? 'primary' : doc.type === 'certificate' ? 'success' : doc.type === 'id_card' ? 'cyan' : 'warning'}`}>{cfg.label}</span>
                <button className="btn-ghost" style={{ padding: '8px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }} onClick={() => handleDownload(doc.name)}>
                  <Download size={13} /> Download
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
