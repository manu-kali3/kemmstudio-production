import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { IMAGES, SITE } from '../data/site';
import Logo from './Logo';

/**
 * Split-screen frame shared by every auth screen: cinematic still on the left,
 * a focused single-column form on the right.
 */
export default function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  return (
    <section className="auth">
      <aside className="auth-aside" aria-hidden="true">
        <img src={IMAGES.hero} alt="" loading="lazy" decoding="async" />
        <div className="auth-aside-content">
          <span className="pill pill-accent pill-dot">{SITE.name}</span>
          <p style={{ fontSize: '1.3rem', lineHeight: 1.45, margin: 0, fontFamily: 'var(--font-display)' }}>
            “Every session starts with a story. We make sure it is heard and seen the way you imagined it.”
          </p>
          <p className="muted" style={{ margin: 0, fontSize: '.9rem' }}>{SITE.fullName}</p>
          <p className="faint" style={{ display: 'flex', alignItems: 'center', gap: '.45rem', margin: 0, fontSize: '.8rem' }}>
            <ShieldCheck size={15} /> Protected by two-step verification
          </p>
        </div>
      </aside>

      <div className="auth-main">
        <div className="auth-card">
          <Link to="/" className="brand" style={{ marginBottom: '.25rem' }}>
            <Logo showTagline={false} size={30} />
          </Link>

          <header className="auth-head">
            {eyebrow && (
              <p className="eyebrow" style={{ margin: 0 }}>
                <Sparkles size={13} aria-hidden="true" /> {eyebrow}
              </p>
            )}
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </header>

          {children}

          {footer && <div className="auth-foot">{footer}</div>}
        </div>
      </div>
    </section>
  );
}
