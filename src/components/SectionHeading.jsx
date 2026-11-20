import Reveal from './Reveal';

/** Eyebrow + title + supporting line, used by every marketing section. */
export default function SectionHeading({ eyebrow, title, sub, center = false, as: Tag = 'h2', id }) {
  return (
    <Reveal className={center ? 'text-center' : undefined}>
      {eyebrow && (
        <p className={`eyebrow${center ? ' eyebrow-center' : ''}`}>{eyebrow}</p>
      )}
      <Tag id={id} className="section-title" style={center ? { marginInline: 'auto' } : undefined}>
        {title}
      </Tag>
      {sub && (
        <p className="section-sub" style={center ? { marginInline: 'auto' } : undefined}>
          {sub}
        </p>
      )}
    </Reveal>
  );
}
