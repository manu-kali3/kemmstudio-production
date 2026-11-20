import { CircleAlert } from 'lucide-react';

/**
 * Labelled form control wrapper: visible label, optional leading icon,
 * helper text and an inline error message tied to the input via aria.
 */
export default function Field({ id, label, hint, error, required = false, icon: Icon, children }) {
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      {label && (
        <label className="field-label" htmlFor={id}>
          {label}
          {required && (
            <span className="req" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className={`input-wrap${Icon ? ' has-icon' : ''}`}>
        {Icon && <Icon size={18} className="input-icon" aria-hidden="true" />}
        {children}
      </div>
      {hint && !error && (
        <span className="field-hint" id={id ? `${id}-hint` : undefined}>
          {hint}
        </span>
      )}
      {error && (
        <span className="field-error" id={id ? `${id}-error` : undefined}>
          <CircleAlert size={13} aria-hidden="true" />
          {error}
        </span>
      )}
    </div>
  );
}
