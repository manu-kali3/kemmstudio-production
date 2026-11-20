import { useState } from 'react';
import { Play, Images } from 'lucide-react';
import { FALLBACK_THUMB, isPlayable, thumbOf } from '../utils/media';

/**
 * Portfolio tile. The title is the single focusable control and its
 * stretched hit area covers the whole card, so semantics stay valid
 * (no headings inside a button) while the card remains fully clickable.
 */
export default function MediaCard({ item, onOpen }) {
  const [src, setSrc] = useState(thumbOf(item));
  const playable = isPlayable(item);

  return (
    <article className="media-card">
      <div className="media-thumb">
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => src !== FALLBACK_THUMB && setSrc(FALLBACK_THUMB)}
        />
        <span className="media-scrim" aria-hidden="true" />
        <span className="media-play" aria-hidden="true">
          <span>{playable ? <Play size={22} fill="currentColor" /> : <Images size={22} />}</span>
        </span>
        {item.category && <span className="pill pill-accent media-tag">{item.category}</span>}
      </div>

      <div className="media-body">
        <h3>
          <button
            type="button"
            className="media-trigger"
            onClick={() => onOpen(item)}
            aria-label={`Open ${item.title}${item.category ? ` — ${item.category}` : ''}`}
          >
            {item.title}
          </button>
        </h3>
        {item.description && <p>{item.description}</p>}
      </div>
    </article>
  );
}
