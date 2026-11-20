import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import AuthShell from '../components/AuthShell';
import Field from '../components/Field';
import Alert from '../components/Alert';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      nav('/verify-2fa');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Login" description="Log in to the Kemmstudio Production studio dashboard." />
      <AuthShell
        eyebrow="Studio access"
        title="Welcome back"
        subtitle="Sign in to continue. A 6-digit verification code will be sent to your email."
        footer={
          <>
            <span>
              No account?{' '}
              <Link className="link" to="/register">
                Create one
              </Link>
            </span>
            <Link className="link" to="/forgot-password">
              Forgot password?
            </Link>
          </>
        }
      >
        <form className="form-grid" onSubmit={submit}>
          <Alert type="error">{error}</Alert>

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

          <Field id="password" label="Password" required icon={Lock}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              autoComplete="current-password"
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

          <button className="btn btn-primary btn-lg" disabled={loading} type="submit">
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Continuing…
              </>
            ) : (
              <>
                Continue
                <ArrowRight size={17} className="btn-arrow" />
              </>
            )}
          </button>
        </form>
      </AuthShell>
    </>
  );
}
