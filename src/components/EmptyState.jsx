/** Friendly placeholder for empty collections and failed loads. */
export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="empty">
      {Icon && (
        <span className="empty-icon">
          <Icon size={24} aria-hidden="true" />
        </span>
      )}
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action && <div style={{ marginTop: '.6rem' }}>{action}</div>}
    </div>
  );
}
