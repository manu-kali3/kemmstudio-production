import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import AuthShell from '../components/AuthShell';
import Field from '../components/Field';
import Alert from '../components/Alert';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = Math.min(4, Math.floor(form.password.length / 4) + (/[^A-Za-z]/.test(form.password) ? 1 : 0));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setOk('');
    setLoading(true);
    try {
      await register(form);
      setOk('Registration successful. Taking you to the login page…');
      setTimeout(() => nav('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Register" description="Create a Kemmstudio Production account." />
      <AuthShell
        eyebrow="Create account"
        title="Join the studio"
        subtitle="Set up an account to manage bookings and studio content."
        footer={
          <span>
            Already registered?{' '}
            <Link className="link" to="/login">
              Log in
            </Link>
          </span>
        }
      >
        <form className="form-grid" onSubmit={submit}>
          <Alert type="success">{ok}</Alert>
          <Alert type="error">{error}</Alert>

          <Field id="name" label="Name" required icon={User}>
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
              autoComplete="name"
              minLength={2}
              required
            />
          </Field>

          <Field id="email" label="Email" required icon={Mail}>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </Field>

          <Field id="password" label="Password" required icon={Lock} hint="At least 8 characters — mix in a number or symbol.">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={8}
              style={{ paddingRight: '3rem' }}
              required
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{ position: 'absolute', right: '.3rem', minHeight: 38, padding: '0 .55rem' }}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </Field>

          {form.password && (
            <div aria-hidden="true" style={{ display: 'flex', gap: 6, marginTop: '-.5rem' }}>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  style={{
                    height: 4,
                    flex: 1,
                    borderRadius: 999,
                    background: i < strength ? 'var(--accent)' : 'rgba(255,255,255,.1)',
                    transition: 'background .25s ease',
                  }}
                />
              ))}
            </div>
          )}

          <button className="btn btn-primary btn-lg" disabled={loading} type="submit">
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Creating account…
              </>
            ) : (
              <>
                Create account
                <ArrowRight size={17} className="btn-arrow" />
              </>
            )}
          </button>
        </form>
      </AuthShell>
    </>
  );
}
