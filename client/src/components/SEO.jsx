import { useEffect } from 'react';

export default function SEO({ title, description }) {
  useEffect(() => {
    const site = import.meta.env.VITE_STUDIO_NAME || 'Kemmstudio Production';
    document.title = title ? `${title} | ${site}` : site;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description || 'Kemmstudio Production - Kuria Entertainment Music and Movie Studio. Music, video, film, videography, and photography.');
  }, [title, description]);
  return null;
}
