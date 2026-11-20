import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import SEO from '../components/SEO';

export default function ResetPassword() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', code: '', newPassword: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg(''); setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', {
        email: form.email,
        code: form.code,
        newPassword: form.newPassword,
      });
      setMsg(data.message || 'Password reset successful. Redirecting to login...');
      setTimeout(() => nav('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally { setLoading(false); }
  };

  return (
    <section className="section">
      <SEO title="Reset Password" description="Enter your reset code and new password." />
      <div className="container" style={{maxWidth:520}}>
        <h1 className="section-title">Reset Password</h1>
        <p className="section-sub">Enter the 6-digit code sent to your email and choose a new password.</p>
        {msg && <div className="alert success" style={{marginBottom:'1rem'}}>{msg}</div>}
        {error && <div className="alert error" style={{marginBottom:'1rem'}}>{error}</div>}
        <form className="card" onSubmit={submit}>
          <div className="card-body form-grid">
            <div><label htmlFor="email">Email</label><input id="email" name="email" type="email" value={form.email} onChange={onChange} required /></div>
            <div><label htmlFor="code">Reset Code</label><input id="code" name="code" inputMode="numeric" pattern="\d{6}" maxLength={6} value={form.code} onChange={e=>setForm({...form, code:e.target.value.replace(/\D/g,'')})} required /></div>
            <div><label htmlFor="newPassword">New Password</label><input id="newPassword" name="newPassword" type="password" minLength={8} value={form.newPassword} onChange={onChange} required /></div>
            <button className="btn btn-primary" disabled={loading || form.code.length!==6}>{loading ? 'Resetting...' : 'Reset Password'}</button>
            <div style={{display:'flex', gap:'1rem', flexWrap:'wrap'}}>
              <Link to="/forgot-password" style={{color:'var(--accent)'}}>Resend code</Link>
              <Link to="/login" className="muted">Back to login</Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
