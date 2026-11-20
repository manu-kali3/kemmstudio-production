import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { mediaKind } from '../utils/media';

/**
 * Accessible media dialog: Escape to close, arrow keys to browse,
 * focus moved into the dialog and returned to the trigger on close.
 */
export default function Lightbox({ item, index = 0, total = 0, onClose, onPrev, onNext }) {
  const closeRef = useRef(null);
  const lastFocused = useRef(null);

  useEffect(() => {
    if (!item) return undefined;
    lastFocused.current = document.activeElement;
    document.body.classList.add('is-locked');
    closeRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('is-locked');
      if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus();
    };
  }, [item, onClose, onPrev, onNext]);

  const kind = item ? mediaKind(item) : 'image';

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="lb-backdrop"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="lb-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={item.title}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="lb-header">
              <span className="lb-title">
                <strong>{item.title}</strong>
                {item.category && <span className="faint" style={{ fontSize: '.78rem' }}>{item.category}</span>}
              </span>
              <button ref={closeRef} type="button" className="icon-btn" onClick={onClose} aria-label="Close preview">
                <X size={18} />
              </button>
            </header>

            <div className="lb-media">
              {kind === 'embed' && (
                <iframe
                  title={item.title}
                  src={item.mediaUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              {kind === 'video' && <video src={item.mediaUrl} controls playsInline />}
              {kind === 'image' && <img src={item.mediaUrl} alt={item.title} />}
            </div>

            <footer className="lb-footer">
              <span className="cell-clamp" style={{ maxWidth: '52ch' }}>
                {item.description || `${item.category || 'Project'} · Kemmstudio Production`}
              </span>
              {total > 1 && (
                <span className="lb-arrows">
                  <span className="faint" style={{ alignSelf: 'center', marginRight: '.35rem', fontSize: '.8rem' }}>
                    {index + 1} / {total}
                  </span>
                  <button type="button" className="icon-btn" onClick={onPrev} aria-label="Previous item">
                    <ChevronLeft size={18} />
                  </button>
                  <button type="button" className="icon-btn" onClick={onNext} aria-label="Next item">
                    <ChevronRight size={18} />
                  </button>
                </span>
              )}
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
