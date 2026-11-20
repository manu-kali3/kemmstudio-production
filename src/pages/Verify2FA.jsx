import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, MailCheck, RefreshCw, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import AuthShell from '../components/AuthShell';
import OtpInput from '../components/OtpInput';
import Alert from '../components/Alert';

export default function Verify2FA() {
  const { pendingToken, verify2fa, resendCode } = useAuth();
  const nav = useNavigate();
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  if (!pendingToken) return <Navigate to="/login" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);
    try {
      await verify2fa(code);
      nav('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError('');
    setMsg('');
    setResending(true);
    try {
      await resendCode();
      setMsg('A new code has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend the code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <SEO title="Verify Code" description="Verify your login code." />
      <AuthShell
        eyebrow="Two-step verification"
        title="Enter your code"
        subtitle="We sent a 6-digit code to your email. It expires in 5 minutes."
        footer={
          <Link className="link" to="/login">
            Use a different account
          </Link>
        }
      >
        <form className="form-grid" onSubmit={submit}>
          <Alert type="success">{msg}</Alert>
          <Alert type="error">{error}</Alert>

          <div className="field">
            <span className="field-label" id="code-label">
              Verification code
            </span>
            <OtpInput value={code} onChange={setCode} label="Verification code" />
            <span className="field-hint">
              <MailCheck size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} aria-hidden="true" />
              Paste the whole code and the boxes fill automatically.
            </span>
          </div>

          <button className="btn btn-primary btn-lg" disabled={loading || code.length !== 6} type="submit">
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Verifying…
              </>
            ) : (
              <>
                <ShieldCheck size={17} />
                Verify & continue
                <ArrowRight size={17} className="btn-arrow" />
              </>
            )}
          </button>

          <button type="button" className="btn btn-outline" onClick={resend} disabled={resending}>
            <RefreshCw size={16} className={resending ? 'spin' : undefined} />
            {resending ? 'Sending…' : 'Resend code'}
          </button>
        </form>
      </AuthShell>
    </>
  );
}
