import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setOk(''); setLoading(true);
    try {
      await register(form);
      setOk('Registration successful. You can now log in.');
      setTimeout(() => nav('/login'), 1200);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <section className="section">
      <SEO title="Register" description="Create a Kemmstudio Production account." />
      <div className="container" style={{maxWidth:520}}>
        <h1 className="section-title">Register</h1>
        {ok && <div className="alert success" style={{marginBottom:'1rem'}}>{ok}</div>}
        {error && <div className="alert error" style={{marginBottom:'1rem'}}>{error}</div>}
        <form className="card" onSubmit={submit}>
          <div className="card-body form-grid">
            <div><label htmlFor="name">Name</label><input id="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required minLength={2} /></div>
            <div><label htmlFor="email">Email</label><input id="email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
            <div><label htmlFor="password">Password</label><input id="password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required minLength={8} /></div>
            <button className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
            <p className="muted" style={{margin:0}}>Already have an account? <Link to="/login" style={{color:'var(--accent)'}}>Login</Link></p>
          </div>
        </form>
      </div>
    </section>
  );
}
