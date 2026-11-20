import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, KeyRound } from 'lucide-react';
import api from '../api/client';
import SEO from '../components/SEO';
import AuthShell from '../components/AuthShell';
import Field from '../components/Field';
import Alert from '../components/Alert';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMsg(data.message || 'If an account with that email exists, a reset code has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request a password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Forgot Password" description="Reset your Kemmstudio Production account password." />
      <AuthShell
        eyebrow="Account recovery"
        title="Forgot your password?"
        subtitle="Enter your email address and we’ll send a 6-digit code to reset it."
        footer={
          <>
            <Link className="link" to="/reset-password">
              I already have a code
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </Field>

          <button className="btn btn-primary btn-lg" disabled={loading} type="submit">
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                <KeyRound size={17} />
                Send reset code
                <ArrowRight size={17} className="btn-arrow" />
              </>
            )}
          </button>
        </form>
      </AuthShell>
    </>
  );
}
