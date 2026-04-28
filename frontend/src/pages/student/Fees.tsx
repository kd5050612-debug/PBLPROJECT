import { mockFeeRecords } from '../../data/mockData';
import { CreditCard, CheckCircle2, Clock, AlertTriangle, Download, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function StudentFees() {
  const handlePay = () => toast.success('Redirecting to payment gateway...');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="font-jakarta" style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ff' }}>Fee Payment</h2>
        <p style={{ color: '#606080', fontSize: 13, marginTop: 4 }}>Manage your semester fees and payment history</p>
      </div>

      {mockFeeRecords.map(fee => (
        <div key={fee.id} className="glass-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f0f0ff', marginBottom: 4 }}>{fee.semester}</h3>
              <p style={{ fontSize: 12, color: '#606080' }}>Due Date: {fee.dueDate}</p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span className={`badge badge-${fee.status === 'paid' ? 'success' : fee.status === 'partial' ? 'warning' : 'danger'}`}>
                {fee.status === 'paid' ? <CheckCircle2 size={10} /> : fee.status === 'partial' ? <Clock size={10} /> : <AlertTriangle size={10} />}
                {fee.status}
              </span>
              <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Download size={13} /> Receipt
              </button>
            </div>
          </div>

          {/* Fee breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 10, marginBottom: 24 }}>
            {fee.items.map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 13, color: '#a0a0c0' }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#d0d0f0' }}>{fmt(item.amount)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 14, padding: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {[
                { label: 'Total Amount', value: fmt(fee.amount), color: '#f0f0ff' },
                { label: 'Amount Paid',  value: fmt(fee.paid),   color: '#34d399' },
                { label: 'Amount Due',   value: fmt(fee.due),    color: fee.due > 0 ? '#f87171' : '#34d399' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#808090', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#808090' }}>Payment Progress</span>
                <span style={{ fontSize: 12, color: '#818cf8' }}>{Math.round((fee.paid / fee.amount) * 100)}%</span>
              </div>
              <div className="progress-bar" style={{ height: 8 }}>
                <div className="progress-fill" style={{ width: `${(fee.paid / fee.amount) * 100}%`, background: fee.status === 'paid' ? 'linear-gradient(90deg,#10b981,#34d399)' : 'linear-gradient(90deg,#f59e0b,#fbbf24)' }} />
              </div>
            </div>
            {fee.due > 0 && (
              <button className="btn-primary" style={{ width: '100%', marginTop: 20, padding: '14px', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={handlePay}>
                <CreditCard size={16} /> Pay {fmt(fee.due)} Now
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
