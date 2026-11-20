import { Link } from 'react-router-dom';
import { ArrowRight, Clapperboard, Compass, HeartHandshake, Sparkles, Trophy, Users } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { IMAGES, SITE, STATS } from '../data/site';

const VALUES = [
  {
    icon: Compass,
    title: 'Our focus',
    text: 'Kuria music, entertainment, sport and sports-centre content — cultural roots carried by modern, cinematic production values.',
  },
  {
    icon: Clapperboard,
    title: 'Our craft',
    text: 'From music and film production to videography and photography, every deliverable is finished to a standard built for release.',
  },
  {
    icon: HeartHandshake,
    title: 'Our promise',
    text: 'Premium quality, a collaborative process and storytelling that honours community, talent and the energy of every performance.',
  },
];

const PILLARS = [
  { icon: Users, title: 'Community first', text: 'We hire, train and collaborate locally, keeping the value of each production in the region.' },
  { icon: Trophy, title: 'Release-ready', text: 'Masters, grades and exports prepared for streaming, broadcast and social from day one.' },
  { icon: Sparkles, title: 'Detail obsessed', text: 'From mic placement to the final colour pass, the small decisions are where the quality lives.' },
];

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description="About Kemmstudio Production — Kuria Entertainment Music and Movie Studio, telling authentic stories through sound and vision."
      />

      <PageHeader
        eyebrow="Who we are"
        title="A studio built around Kuria storytelling"
        lead={`${SITE.fullName} — telling authentic stories through sound and vision, for artists, brands and communities across Kenya.`}
      />

      <section className="section">
        <div className="container">
          <div className="split split-reverse">
            <Reveal className="split-media">
              <img src={IMAGES.team} alt="Engineers setting up a live tracking session at Kemmstudio" loading="lazy" decoding="async" />
            </Reveal>
            <Reveal delay={0.08}>
              <p className="eyebrow">Our story</p>
              <h2 className="section-title">Sound and picture, made in the same room</h2>
              <p className="muted">
                Kemmstudio Production started with one tracking room, a borrowed camera and a simple belief:
                stories from Kuria deserve the same finish as anything released anywhere else in the world.
              </p>
              <p className="muted">
                Today the studio runs full music, video, film, videography and photography productions in-house.
                Keeping every discipline together means the beat, the frame and the final grade all serve the
                same idea — and nothing gets lost between vendors.
              </p>
              <div className="hero-stats" style={{ marginTop: '1.75rem', paddingTop: '1.5rem' }}>
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <SectionHeading eyebrow="What drives us" title="Three things we never compromise" />
          <div className="grid grid-auto">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.07}>
                <article className="card card-hover feature-card">
                  <div className="card-body">
                    <span className="icon-tile">
                      <value.icon size={22} aria-hidden="true" />
                    </span>
                    <h3>{value.title}</h3>
                    <p className="muted" style={{ marginBottom: 0, fontSize: '.95rem' }}>
                      {value.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-auto">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.07}>
                <div className="panel" style={{ height: '100%' }}>
                  <span className="icon-tile">
                    <pillar.icon size={20} aria-hidden="true" />
                  </span>
                  <h3>{pillar.title}</h3>
                  <p className="muted" style={{ margin: 0, fontSize: '.95rem' }}>
                    {pillar.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="cta-band" style={{ marginTop: 'clamp(2.5rem, 6vw, 4rem)' }}>
            <h2>Have a project in mind?</h2>
            <p>Bring us the rough idea — we will shape it into a plan, a schedule and a finished release.</p>
            <div className="cluster" style={{ justifyContent: 'center' }}>
              <Link className="btn btn-primary btn-lg" to="/contact">
                Book a session
                <ArrowRight size={18} className="btn-arrow" />
              </Link>
              <Link className="btn btn-outline btn-lg" to="/portfolio">
                See the work
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
