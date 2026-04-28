import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GraduationCap, Eye, EyeOff, Shield, BookOpen, Users } from 'lucide-react';

const DEMO_CREDS = [
  { role: 'Student', email: 'student@mitadt.edu.in', password: 'student123', icon: BookOpen, color: '#6366f1' },
  { role: 'Faculty', email: 'faculty@mitadt.edu.in', password: 'faculty123', icon: Shield, color: '#8b5cf6' },
  { role: 'Admin',   email: 'admin@mitadt.edu.in',   password: 'admin123',   icon: Users,  color: '#06b6d4' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      const role = useAuthStore.getState().user?.role;
      toast.success(`Welcome back! Redirecting to ${role} portal...`);
      navigate(`/${role}`);
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (e: string, p: string) => { setEmail(e); setPassword(p); };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f0f1e 0%,#1a1a2e 50%,#12121f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', right: '20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 40px rgba(99,102,241,0.4)', marginBottom: 16 }}>
            <GraduationCap size={36} color="white" />
          </div>
          <h1 className="font-jakarta" style={{ fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg,#f0f0ff,#a0a0c0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>
            MIT ADT University
          </h1>
          <p style={{ color: '#a0a0c0', fontSize: 14 }}>Centralized Academic Access Portal</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
            {['CAAP', '2.0', '•', 'Academic', 'Year', '2026'].map((t, i) => (
              <span key={i} style={{ fontSize: 11, color: i === 2 ? '#6366f1' : '#606080', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(30,30,46,0.8)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '36px', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Sign In</h2>
          <p style={{ color: '#a0a0c0', fontSize: 13, marginBottom: 28 }}>Enter your credentials to access the portal</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#a0a0c0', marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Email Address</label>
              <input
                className="input-field"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your.email@mitadt.edu.in"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#a0a0c0', marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-field"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{ paddingRight: 44 }}
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a0a0c0', display: 'flex', alignItems: 'center' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <a href="#" style={{ fontSize: 12, color: '#6366f1', textDecoration: 'none' }}>Forgot password?</a>
            </div>

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{ padding: '14px', fontSize: 15, fontWeight: 700, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  Signing in...
                </span>
              ) : 'Sign In to Portal'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: 11, color: '#606080', fontWeight: 500, whiteSpace: 'nowrap' }}>DEMO CREDENTIALS</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DEMO_CREDS.map(({ role, email: e, password: p, icon: Icon, color }) => (
                <button
                  key={role}
                  onClick={() => fillDemo(e, p)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '10px 14px', cursor: 'pointer', transition: 'all 0.2s', color: 'inherit', textAlign: 'left', width: '100%' }}
                  onMouseEnter={el => { (el.currentTarget as HTMLButtonElement).style.borderColor = color + '40'; (el.currentTarget as HTMLButtonElement).style.background = color + '10'; }}
                  onMouseLeave={el => { (el.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)'; (el.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={15} color={color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#c0c0e0' }}>{role} Portal</div>
                    <div style={{ fontSize: 11, color: '#606080' }}>{e} · {p}</div>
                  </div>
                  <span style={{ fontSize: 10, color: color, fontWeight: 600, background: color + '15', padding: '2px 8px', borderRadius: 10 }}>Click to fill</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, color: '#404060', fontSize: 12 }}>
          © 2026 MIT Art, Design and Technology University · All rights reserved
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
