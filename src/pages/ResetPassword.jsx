import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import api from '../api/client';
import SEO from '../components/SEO';
import AuthShell from '../components/AuthShell';
import Field from '../components/Field';
import OtpInput from '../components/OtpInput';
import Alert from '../components/Alert';

export default function ResetPassword() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', code: '', newPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', {
        email: form.email,
        code: form.code,
        newPassword: form.newPassword,
      });
      setMsg(data.message || 'Password reset successful. Redirecting to login…');
      setTimeout(() => nav('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Reset Password" description="Enter your reset code and choose a new password." />
      <AuthShell
        eyebrow="Account recovery"
        title="Set a new password"
        subtitle="Enter the 6-digit code sent to your email, then choose a new password."
        footer={
          <>
            <Link className="link" to="/forgot-password">
              Resend code
            </Link>
            <Link className="muted" to="/login">
              Back to login
            </Link>
          </>
        }
      >
        <form className="form-grid" onSubmit={submit}>
          <Alert type="success">{msg}</Alert>
          <Alert type="error">{error}</Alert>

          <Field id="email" label="Email" required icon={Mail}>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </Field>

          <div className="field">
            <span className="field-label">Reset code</span>
            <OtpInput value={form.code} onChange={(code) => setForm((prev) => ({ ...prev, code }))} id="code" label="Reset code" />
          </div>

          <Field id="newPassword" label="New password" required icon={Lock} hint="Minimum 8 characters.">
            <input
              id="newPassword"
              name="newPassword"
              type={showPassword ? 'text' : 'password'}
              minLength={8}
              value={form.newPassword}
              onChange={onChange}
              placeholder="Create a new password"
              autoComplete="new-password"
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

          <button className="btn btn-primary btn-lg" disabled={loading || form.code.length !== 6} type="submit">
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Resetting…
              </>
            ) : (
              <>
                Reset password
                <ArrowRight size={17} className="btn-arrow" />
              </>
            )}
          </button>
        </form>
      </AuthShell>
    </>
  );
}
