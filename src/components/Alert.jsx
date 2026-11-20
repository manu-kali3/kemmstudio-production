import { CircleAlert, CircleCheck, Info } from 'lucide-react';

const ICONS = {
  success: CircleCheck,
  error: CircleAlert,
  info: Info,
};

/** Inline status message. Errors/success are announced to screen readers. */
export default function Alert({ type = 'info', children, style }) {
  if (!children) return null;
  const Icon = ICONS[type] || Info;
  return (
    <div
      className={`alert${type !== 'info' ? ` alert-${type}` : ''}`}
      role={type === 'error' ? 'alert' : 'status'}
      style={style}
    >
      <Icon size={18} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
