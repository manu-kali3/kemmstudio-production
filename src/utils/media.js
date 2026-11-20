/** Helpers shared by the gallery card and the lightbox. */

export const FALLBACK_THUMB = '/assets/brand/hero-studio.jpg';

export function thumbOf(item) {
  return item?.thumbnailUrl || item?.mediaUrl || FALLBACK_THUMB;
}

export function isPlayable(item) {
  const url = String(item?.mediaUrl || '');
  return item?.type === 'video' || url.includes('youtube') || url.includes('vimeo') || url.includes('embed');
}

/** 'embed' (iframe), 'video' (native player) or 'image'. */
export function mediaKind(item) {
  if (!isPlayable(item)) return 'image';
  const url = String(item?.mediaUrl || '');
  const isFile = /\.(mp4|webm|ogg|mov)$/i.test(url);
  return url.startsWith('http') && !isFile ? 'embed' : 'video';
}
