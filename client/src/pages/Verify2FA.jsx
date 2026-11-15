import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function Verify2FA() {
  const { pendingToken, verify2fa, resendCode } = useAuth();
  const nav = useNavigate();
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!pendingToken) return <Navigate to="/login" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setMsg(''); setLoading(true);
    try {
      await verify2fa(code);
      nav('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally { setLoading(false); }
  };

  const resend = async () => {
    setError(''); setMsg('');
    try { await resendCode(); setMsg('A new code has been sent.'); } catch (err) { setError(err.response?.data?.message || 'Could not resend code'); }
  };

  return (
    <section className="section">
      <SEO title="Verify Code" description="Verify your login code." />
      <div className="container" style={{maxWidth:520}}>
        <h1 className="section-title">Two-Step Verification</h1>
        <p className="section-sub">Enter the 6-digit code sent to your email. It expires in 5 minutes.</p>
        {msg && <div className="alert success" style={{marginBottom:'1rem'}}>{msg}</div>}
        {error && <div className="alert error" style={{marginBottom:'1rem'}}>{error}</div>}
        <form className="card" onSubmit={submit}>
          <div className="card-body form-grid">
            <div><label htmlFor="code">Verification Code</label><input id="code" inputMode="numeric" pattern="\d{6}" maxLength={6} value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,''))} required /></div>
            <button className="btn btn-primary" disabled={loading || code.length!==6}>{loading ? 'Verifying...' : 'Verify & Login'}</button>
            <button type="button" className="btn btn-outline" onClick={resend}>Resend Code</button>
          </div>
        </form>
      </div>
    </section>
  );
}
