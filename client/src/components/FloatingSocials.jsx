const Icon = ({ children, label }) => (
  <span aria-hidden="true" style={{display:'inline-grid',placeItems:'center'}}>{children}</span>
);

export default function FloatingSocials() {
  const wa = import.meta.env.VITE_WHATSAPP_LINK || 'https://wa.me/254700000000';
  const fb = import.meta.env.VITE_FACEBOOK_LINK || 'https://facebook.com/';
  const ig = import.meta.env.VITE_INSTAGRAM_LINK || 'https://instagram.com/';
  return (
    <div className="floating-socials" aria-label="Social links">
      <a className="fab" href={wa} target="_blank" rel="noreferrer" aria-label="WhatsApp chat" title="WhatsApp">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 11.5a8.5 8.5 0 0 1-12.6 7.4L4 20l1.2-3.3A8.5 8.5 0 1 1 20 11.5Z"/><path d="M8.5 9.5c.2 2 2 4 4 4 .5 0 1-.2 1.3-.6l.5-.7c.2-.3.2-.7 0-1l-.7-.8c-.2-.2-.6-.3-.9-.1l-.4.3c-.6-.3-1.2-.9-1.5-1.5l.3-.4c.2-.3.1-.7-.1-.9l-.8-.7c-.3-.2-.7-.2-1 0l-.7.5c-.4.3-.6.8-.6 1.3Z"/></svg>
      </a>
      <a className="fab" href={fb} target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h3l1-4h-4V7.5c0-1.1.3-1.8 1.9-1.8H17V2.2c-.3 0-1.4-.2-2.7-.2C11.6 2 10 3.7 10 6.8V10H7v4h3v8h3Z"/></svg>
      </a>
      <a className="fab" href={ig} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
      </a>
    </div>
  );
}
