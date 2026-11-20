import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import SEO from '../components/SEO';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(''); setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMsg(data.message || 'If an account with that email exists, a reset code has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset.');
    } finally { setLoading(false); }
  };

  return (
    <section className="section">
      <SEO title="Forgot Password" description="Reset your Kemmstudio Production account password." />
      <div className="container" style={{maxWidth:520}}>
        <h1 className="section-title">Forgot Password</h1>
        <p className="section-sub">Enter your email address and we’ll send you a 6-digit code to reset your password.</p>
        {msg && <div className="alert success" style={{marginBottom:'1rem'}}>{msg}</div>}
        {error && <div className="alert error" style={{marginBottom:'1rem'}}>{error}</div>}
        <form className="card" onSubmit={submit}>
          <div className="card-body form-grid">
            <div><label htmlFor="email">Email</label><input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
            <button className="btn btn-primary" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Code'}</button>
            <div style={{display:'flex', gap:'1rem', flexWrap:'wrap'}}>
              <Link to="/reset-password" style={{color:'var(--accent)'}}>I have a reset code</Link>
              <Link to="/login" className="muted">Back to login</Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
