import { useState, useEffect } from 'react';
import { feesAPI } from '../../services/api';
import { CreditCard, CheckCircle2, Clock, AlertTriangle, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

const fmt = (n: number) => `₹${Number(n).toLocaleString('en-IN')}`;

export default function StudentFees() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);

  useEffect(() => {
    feesAPI.getAll().then(r => setFees(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handlePay = async (id: string) => {
    setPaying(id);
    try {
      const { data } = await feesAPI.pay(id);
      setFees(prev => prev.map(f => f.id === id ? data : f));
      toast.success('Payment successful! Receipt generated.');
    } catch {
      toast.error('Payment failed. Try again.');
    } finally {
      setPaying(null);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading fees...</div>;

  const total = fees.reduce((s, f) => s + parseFloat(f.amount), 0);
  const paid = fees.filter(f => f.status === 'paid').reduce((s, f) => s + parseFloat(f.amount), 0);
  const pending = fees.filter(f => f.status !== 'paid').reduce((s, f) => s + parseFloat(f.amount), 0);
  const pct = total > 0 ? Math.round((paid / total) * 100) : 0;

  const STATUS = { paid: { color: '#10b981', icon: CheckCircle2 }, pending: { color: '#f59e0b', icon: Clock }, overdue: { color: '#ef4444', icon: AlertTriangle } } as any;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Fee Management</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Fees', value: fmt(total), color: '#6366f1', icon: IndianRupee },
          { label: 'Amount Paid', value: fmt(paid), color: '#10b981', icon: CheckCircle2 },
          { label: 'Amount Due', value: fmt(pending), color: pending > 0 ? '#ef4444' : '#10b981', icon: Clock },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Payment Progress</span>
          <span style={{ color: '#10b981', fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#6366f1,#10b981)', borderRadius: 5, transition: 'width 0.6s ease' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {fees.length === 0
          ? <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No fee records found.</div>
          : fees.map((f: any) => {
            const s = STATUS[f.status] || STATUS.pending;
            return (
              <div key={f.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={20} color={s.color} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{f.fee_type}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due: {new Date(f.due_date).toLocaleDateString('en-IN')} · {f.academic_year}</p>
                    {f.receipt_no && <p style={{ fontSize: '0.7rem', color: '#10b981' }}>Receipt: {f.receipt_no}</p>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div>
                    <p style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{fmt(f.amount)}</p>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 12, fontSize: '0.7rem', fontWeight: 700, background: `${s.color}20`, color: s.color }}>{f.status}</span>
                  </div>
                  {f.status !== 'paid' && (
                    <button className="btn-primary" onClick={() => handlePay(f.id)} disabled={paying === f.id}
                      style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}>
                      {paying === f.id ? 'Processing...' : 'Pay Now'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
