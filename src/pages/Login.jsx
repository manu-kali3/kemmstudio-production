import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      nav('/verify-2fa');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <section className="section">
      <SEO title="Login" description="Login to Kemmstudio Production." />
      <div className="container" style={{maxWidth:520}}>
        <h1 className="section-title">Login</h1>
        <p className="section-sub">Sign in to continue. A 6-digit verification code will be sent to your email.</p>
        {error && <div className="alert error" style={{marginBottom:'1rem'}}>{error}</div>}
        <form className="card" onSubmit={submit}>
          <div className="card-body form-grid">
            <div><label htmlFor="email">Email</label><input id="email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
            <div><label htmlFor="password">Password</label><input id="password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required /></div>
            <button className="btn btn-primary" disabled={loading}>{loading ? 'Continuing...' : 'Continue'}</button>
            <div style={{display:'flex', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap'}}>
              <p className="muted" style={{margin:0}}>No account? <Link to="/register" style={{color:'var(--accent)'}}>Register</Link></p>
              <Link to="/forgot-password" style={{color:'var(--accent)'}}>Forgot password?</Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
