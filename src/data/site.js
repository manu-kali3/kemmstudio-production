/* ==========================================================================
   Site content & configuration
   Single place to edit copy, navigation, services and contact details.
   ========================================================================== */

const env = import.meta.env;

export const SITE = {
  name: env.VITE_STUDIO_NAME || 'Kemmstudio Production',
  fullName: env.VITE_STUDIO_FULL_NAME || 'Kuria Entertainment Music and Movie Studio',
  tagline: 'Cinematic music, film and photography rooted in Kuria culture.',
  url: env.VITE_SITE_URL || '',
  email: env.VITE_CONTACT_EMAIL || 'hello@kemmstudio.com',
  phone: env.VITE_CONTACT_PHONE || '+254 700 000 000',
  location: env.VITE_CONTACT_LOCATION || 'Kuria, Migori County · Kenya',
  hours: 'Mon – Sat · 8:00 – 20:00 EAT',
};

export const SOCIALS = {
  whatsapp: env.VITE_WHATSAPP_LINK || 'https://wa.me/254700000000',
  facebook: env.VITE_FACEBOOK_LINK || 'https://facebook.com/',
  instagram: env.VITE_INSTAGRAM_LINK || 'https://instagram.com/',
};

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/contact', label: 'Booking' },
];

export const STATS = [
  { value: '120+', label: 'Projects delivered' },
  { value: '8 yrs', label: 'Behind the console' },
  { value: '5', label: 'Creative disciplines' },
];

export const SERVICES = [
  {
    id: 'music',
    icon: 'music',
    title: 'Music Production',
    blurb:
      'Recording, arrangement, mixing and mastering with a signature Kuria influence — tracks built for artists, events and media with clarity and impact.',
    tags: ['Recording', 'Beat making', 'Mixing', 'Mastering'],
  },
  {
    id: 'video',
    icon: 'video',
    title: 'Video Production',
    blurb:
      'Concept-to-delivery music videos, promos and branded content crafted around a story worth watching twice.',
    tags: ['Music videos', 'Promos', 'Branded content', 'Colour grading'],
  },
  {
    id: 'film',
    icon: 'film',
    title: 'Film Production',
    blurb:
      'Narrative and documentary films that carry culture, entertainment and lived experience with cinematic direction and post-production.',
    tags: ['Short film', 'Documentary', 'Directing', 'Post-production'],
  },
  {
    id: 'videography',
    icon: 'camera',
    title: 'Videography',
    blurb:
      'On-location and studio videography for events, performances, sports and sports-centre coverage with dynamic multi-angle capture.',
    tags: ['Events', 'Live shows', 'Sports', 'Multi-cam'],
  },
  {
    id: 'photography',
    icon: 'aperture',
    title: 'Photography',
    blurb:
      'Portraits, events, sports action and campaign photography — premium editing and a fast, reliable turnaround.',
    tags: ['Portraits', 'Events', 'Sports action', 'Campaigns'],
  },
];

export const PROCESS = [
  { title: 'Discovery', text: 'We listen to the idea, the audience and the budget, then shape a plan that fits all three.' },
  { title: 'Pre-production', text: 'Treatment, scheduling, location scouting, casting and shot lists — everything locked before day one.' },
  { title: 'Production', text: 'Studio sessions or on-location capture with a crew that protects both the sound and the picture.' },
  { title: 'Delivery', text: 'Edit, mix, grade and master, delivered in every format your release actually needs.' },
];

export const TESTIMONIALS = [
  {
    name: 'A. Chacha',
    role: 'Recording artist',
    quote: 'Kemmstudio Production brought our Kuria sound to life with warmth and professionalism. The mix still gives me chills.',
  },
  {
    name: 'M. Robi',
    role: 'Sports centre manager',
    quote: 'Outstanding videography for our sports centre launch — energetic, cinematic and delivered ahead of schedule.',
  },
  {
    name: 'N. Boke',
    role: 'Producer',
    quote: 'From concept to final film the team stayed in step with us and delivered far beyond what we expected.',
  },
];

export const SERVICE_OPTIONS = [
  'Music Production',
  'Video Production',
  'Film Production',
  'Videography',
  'Photography',
  'Sports / Sports-centre Content',
];

export const PORTFOLIO_CATEGORIES = ['All', 'Music', 'Video', 'Film', 'Photography', 'Sports'];

/* --------------------------------------------------------------------------
   Sample gallery
   Shown only while the API returns no portfolio items (e.g. before the
   database is seeded) so the gallery never renders as a dead end.
   Delete this array once real work is published from the admin dashboard.
   -------------------------------------------------------------------------- */
export const SAMPLE_WORK = [
  {
    _id: 'sample-music',
    title: 'Vocal session — Kuria roots EP',
    description: 'Tracking vocals in the booth for an all-original EP blending traditional Kuria melody with modern production.',
    category: 'Music',
    type: 'image',
    mediaUrl: '/assets/portfolio/music-session.jpg',
    thumbnailUrl: '/assets/portfolio/music-session.jpg',
    featured: true,
  },
  {
    _id: 'sample-film',
    title: 'Golden hour on set',
    description: 'Principal photography for a short documentary shot across Migori County at golden hour.',
    category: 'Film',
    type: 'image',
    mediaUrl: '/assets/portfolio/film-set.jpg',
    thumbnailUrl: '/assets/portfolio/film-set.jpg',
    featured: true,
  },
  {
    _id: 'sample-sports',
    title: 'Floodlight derby',
    description: 'Sports-centre coverage of a community derby — multi-angle capture under evening floodlights.',
    category: 'Sports',
    type: 'image',
    mediaUrl: '/assets/portfolio/sports-action.jpg',
    thumbnailUrl: '/assets/portfolio/sports-action.jpg',
    featured: true,
  },
  {
    _id: 'sample-photo',
    title: 'Studio portrait campaign',
    description: 'Editorial portrait session lit for a brand campaign, retouched and delivered in 48 hours.',
    category: 'Photography',
    type: 'image',
    mediaUrl: '/assets/portfolio/photo-portrait.jpg',
    thumbnailUrl: '/assets/portfolio/photo-portrait.jpg',
    featured: true,
  },
];

export const IMAGES = {
  hero: '/assets/brand/hero-studio.jpg',
  team: '/assets/brand/studio-team.jpg',
  film: '/assets/portfolio/film-set.jpg',
  music: '/assets/portfolio/music-session.jpg',
};
