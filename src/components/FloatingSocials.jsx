import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from './BrandIcons';
import { SOCIALS } from '../data/site';

const LINKS = [
  { key: 'whatsapp', href: SOCIALS.whatsapp, label: 'WhatsApp', Icon: WhatsAppIcon },
  { key: 'instagram', href: SOCIALS.instagram, label: 'Instagram', Icon: InstagramIcon },
  { key: 'facebook', href: SOCIALS.facebook, label: 'Facebook', Icon: FacebookIcon },
];

/** Floating contact dock with a back-to-top button that appears on scroll. */
export default function FloatingSocials() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="dock" aria-label="Contact and page shortcuts">
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            className="dock-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowUp size={19} />
            <span className="dock-tip">Back to top</span>
          </motion.button>
        )}
      </AnimatePresence>

      {LINKS.map(({ key, href, label, Icon }) => (
        <a
          key={key}
          className="dock-btn"
          data-brand={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${label} — opens in a new tab`}
        >
          <Icon size={20} />
          <span className="dock-tip">{label}</span>
        </a>
      ))}
    </div>
  );
}
