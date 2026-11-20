import { useId } from 'react';

/** Amber monogram mark used in the navbar, footer and favicon. */
export function LogoMark({ size = 34, className = '' }) {
  const id = useId();
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffc46b" />
          <stop offset="48%" stopColor="#ff9f1c" />
          <stop offset="100%" stopColor="#ff5f3d" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill={`url(#g-${id})`} />
      <g fill="#1b1105">
        <rect x="15" y="15" width="7.5" height="34" rx="2" />
        <path d="M27 32 41.5 15h9.5L36.5 32z" />
        <path d="M27 32 41.5 49h9.5L36.5 32z" />
      </g>
    </svg>
  );
}

/** Full lockup: mark + wordmark. */
export default function Logo({ size = 34, showTagline = true }) {
  return (
    <>
      <LogoMark size={size} className="brand-mark" />
      <span className="brand-text">
        Kemmstudio <span className="accent">Production</span>
        {showTagline && <small>Kuria Entertainment Studio</small>}
      </span>
    </>
  );
}
