import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Reveal from './Reveal';

/** Shared hero band for interior pages. */
export default function PageHeader({ eyebrow, title, lead, crumb, children }) {
  return (
    <section className="page-head">
      <div className="container">
        <Reveal>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span aria-current="page">{crumb || title}</span>
          </nav>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children && <div style={{ marginTop: '1.5rem' }}>{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
