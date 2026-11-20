import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Aperture,
  Camera,
  CirclePlay,
  Film,
  Headphones,
  Music4,
  Quote,
  Sparkles,
  Star,
  Video,
} from 'lucide-react';
import api from '../api/client';
import SEO from '../components/SEO';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import MediaCard from '../components/MediaCard';
import Lightbox from '../components/Lightbox';
import EmptyState from '../components/EmptyState';
import { MediaGridSkeleton } from '../components/Skeleton';
import { SERVICE_ICONS } from '../components/serviceIcons';
import { IMAGES, PROCESS, SAMPLE_WORK, SERVICES, SITE, STATS, TESTIMONIALS } from '../data/site';

const MARQUEE = [
  { label: 'Music Production', Icon: Music4 },
  { label: 'Video Production', Icon: Video },
  { label: 'Film Production', Icon: Film },
  { label: 'Videography', Icon: Camera },
  { label: 'Photography', Icon: Aperture },
  { label: 'Sports Coverage', Icon: CirclePlay },
  { label: 'Mixing & Mastering', Icon: Headphones },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingSamples, setUsingSamples] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let alive = true;
    api
      .get('/portfolio?featured=true')
      .then(({ data }) => {
        if (!alive) return;
        const items = data.items || [];
        setFeatured(items.length ? items : SAMPLE_WORK);
        setUsingSamples(items.length === 0);
      })
      .catch(() => {
        if (!alive) return;
        setFeatured(SAMPLE_WORK);
        setUsingSamples(true);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const shown = useMemo(() => featured.slice(0, 6), [featured]);
  const active = activeIndex >= 0 ? shown[activeIndex] : null;

  return (
    <>
      <SEO
        title="Home"
        description="Kemmstudio Production — Kuria Entertainment Music and Movie Studio. Music, video, film, videography and photography."
      />

      {/* ---------------------------------------------------------------- Hero */}
      <section className="hero">
        <div className="hero-media">
          <img src={IMAGES.hero} alt="" fetchPriority="high" decoding="async" />
        </div>
        <div className="hero-scrim" aria-hidden="true" />

        <div className="container">
          <div className="hero-inner">
            <motion.span
              className="pill pill-accent pill-dot"
              style={{ justifySelf: 'start' }}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {SITE.fullName}
            </motion.span>

            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="line">Cinematic stories</span>
              <span className="line text-gradient">rooted in Kuria culture</span>
            </motion.h1>

            <motion.p
              className="hero-copy"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.14 }}
            >
              We produce music, video, film, videography and photography for artists, brands and
              sports-centre stories — recorded, shot and finished to a standard that travels.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link className="btn btn-primary btn-lg" to="/contact">
                Book a session
                <ArrowRight size={18} className="btn-arrow" />
              </Link>
              <Link className="btn btn-outline btn-lg" to="/portfolio">
                <CirclePlay size={18} />
                Watch our work
              </Link>
            </motion.div>

            <motion.div
              className="hero-stats"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span className="rail" />
          Scroll
        </div>
      </section>

      {/* ------------------------------------------------------------ Marquee */}
      <div className="marquee" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div className="marquee-track" key={copy}>
            {MARQUEE.map(({ label, Icon }) => (
              <span className="marquee-item" key={`${copy}-${label}`}>
                <Icon size={16} />
                {label}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* ----------------------------------------------------------- Services */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="What we do"
            title="End-to-end creative production"
            sub="Five disciplines under one roof, so your sound, picture and story stay consistent from the first session to final delivery."
          />

          <div className="grid grid-auto">
            {SERVICES.map((service, i) => {
              const Icon = SERVICE_ICONS[service.icon] || Sparkles;
              return (
                <Reveal key={service.id} delay={i * 0.06}>
                  <article className="card card-hover feature-card">
                    <div className="card-body">
                      <span className="icon-tile">
                        <Icon size={22} aria-hidden="true" />
                      </span>
                      <h3>{service.title}</h3>
                      <p className="muted" style={{ marginBottom: 0, fontSize: '.95rem' }}>
                        {service.blurb}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}

            <Reveal delay={0.3}>
              <Link to="/services" className="card card-hover feature-card" style={{ display: 'block', height: '100%' }}>
                <div className="card-body" style={{ display: 'grid', gap: '.6rem', alignContent: 'center', height: '100%' }}>
                  <span className="icon-tile">
                    <ArrowRight size={22} aria-hidden="true" />
                  </span>
                  <h3 style={{ margin: 0 }}>See all services</h3>
                  <p className="muted" style={{ margin: 0, fontSize: '.95rem' }}>
                    Packages, inclusions and how each production runs.
                  </p>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- Split */}
      <section className="section section-alt">
        <div className="container">
          <div className="split">
            <Reveal className="split-media">
              <img src={IMAGES.team} alt="Kemmstudio engineers tracking a live session in the studio" loading="lazy" decoding="async" />
              <div className="split-badge">
                <span className="stat-value" style={{ fontSize: '1.4rem' }}>24 / 7</span>
                <span className="stat-label">Studio availability</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="eyebrow">Inside the studio</p>
              <h2 className="section-title">Built for artists who care how it sounds and looks</h2>
              <p className="muted">
                Treated rooms, trusted microphones, cinema glass and a team that has spent years capturing
                Kuria music, entertainment and sport. You get a crew that plans the detail and still keeps the
                session relaxed.
              </p>
              <ul className="stack" style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0 2rem', gap: '.85rem' }}>
                {[
                  'Acoustically treated recording and mixing rooms',
                  'Cinema-grade cameras, lighting and audio capture',
                  'Culture-first direction, modern finishing standards',
                  'Clear timelines and delivery in every format you need',
                ].map((line) => (
                  <li key={line} style={{ display: 'flex', gap: '.7rem', alignItems: 'flex-start' }}>
                    <Sparkles size={17} style={{ color: 'var(--accent)', flex: 'none', marginTop: 4 }} aria-hidden="true" />
                    <span className="muted">{line}</span>
                  </li>
                ))}
              </ul>
              <Link className="btn btn-outline" to="/about">
                More about the studio
                <ArrowRight size={16} className="btn-arrow" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Featured work */}
      <section className="section">
        <div className="container">
          <div className="filter-bar" style={{ alignItems: 'flex-end' }}>
            <div>
              <SectionHeading
                eyebrow="Selected work"
                title="Recent productions"
                sub="A snapshot across music, film, video, photography and sport."
              />
            </div>
            <Reveal>
              <Link className="btn btn-outline btn-sm" to="/portfolio">
                View full portfolio
                <ArrowRight size={15} className="btn-arrow" />
              </Link>
            </Reveal>
          </div>

          {loading ? (
            <MediaGridSkeleton count={3} />
          ) : shown.length ? (
            <>
              <div className="grid grid-auto">
                {shown.map((item, i) => (
                  <Reveal key={item._id} delay={i * 0.05}>
                    <MediaCard item={item} onOpen={() => setActiveIndex(i)} />
                  </Reveal>
                ))}
              </div>
              {usingSamples && (
                <p className="notice-inline" style={{ marginTop: '1rem', marginBottom: 0 }}>
                  <Sparkles size={13} aria-hidden="true" />
                  Sample gallery — published projects appear here automatically.
                </p>
              )}
            </>
          ) : (
            <EmptyState
              icon={Film}
              title="Featured work is on the way"
              message="New projects are added from the studio dashboard as they are released."
              action={
                <Link className="btn btn-primary btn-sm" to="/contact">
                  Start your project
                </Link>
              }
            />
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ Process */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeading
            eyebrow="How we work"
            title="A process that protects your idea"
            sub="Four stages, no guesswork — you always know what happens next and who is doing it."
          />
          <div className="steps">
            {PROCESS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.07} className="step">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Testimonials */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Kind words" title="Trusted by artists, brands and clubs" />
          <div className="grid grid-auto">
            {TESTIMONIALS.map((item, i) => (
              <Reveal key={item.name} delay={i * 0.07}>
                <figure className="card card-hover" style={{ height: '100%', margin: 0 }}>
                  <div className="card-body quote-card">
                    <Quote size={26} className="quote-mark" aria-hidden="true" />
                    <blockquote>{item.quote}</blockquote>
                    <div className="stars" aria-label="Rated 5 out of 5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} size={14} fill="currentColor" aria-hidden="true" />
                      ))}
                    </div>
                    <figcaption className="quote-author">
                      <span className="avatar" aria-hidden="true">
                        {item.name.charAt(0)}
                      </span>
                      <span>
                        <strong>{item.name}</strong>
                        <span>{item.role}</span>
                      </span>
                    </figcaption>
                  </div>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CTA */}
      <section className="section-sm" style={{ paddingBottom: 'clamp(3.5rem, 8vw, 6rem)' }}>
        <div className="container">
          <Reveal className="cta-band">
            <p className="eyebrow eyebrow-center" style={{ margin: 0 }}>
              Ready when you are
            </p>
            <h2>Let’s make something worth replaying</h2>
            <p>
              Tell us about the track, the film or the match day. We’ll come back with a plan, a timeline and a
              quote — usually within one business day.
            </p>
            <div className="cluster" style={{ justifyContent: 'center' }}>
              <Link className="btn btn-primary btn-lg" to="/contact">
                Book a session
                <ArrowRight size={18} className="btn-arrow" />
              </Link>
              <Link className="btn btn-outline btn-lg" to="/services">
                Explore services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Lightbox
        item={active}
        index={activeIndex}
        total={shown.length}
        onClose={() => setActiveIndex(-1)}
        onPrev={() => setActiveIndex((i) => (i - 1 + shown.length) % shown.length)}
        onNext={() => setActiveIndex((i) => (i + 1) % shown.length)}
      />
    </>
  );
}
