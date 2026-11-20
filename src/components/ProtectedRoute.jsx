import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, admin = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="section">
        <div className="container" style={{ display: 'grid', placeItems: 'center', gap: '1rem', minHeight: '40vh' }}>
          <span className="spinner" style={{ width: 26, height: 26, color: 'var(--accent)' }} aria-hidden="true" />
          <p className="muted" role="status" style={{ margin: 0 }}>
            Checking your session…
          </p>
        </div>
      </section>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
