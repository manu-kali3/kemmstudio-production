import { motion, useReducedMotion } from 'framer-motion';

/**
 * Scroll-triggered fade/rise. Falls back to a plain element when the visitor
 * prefers reduced motion, so nothing ever animates against their settings.
 */
export default function Reveal({ children, delay = 0, y = 20, className = '', as = 'div', ...rest }) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as] || motion.div;

  if (reduceMotion) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
