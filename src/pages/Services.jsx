import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { SERVICE_ICONS } from '../components/serviceIcons';
import { PROCESS, SERVICES } from '../data/site';

export default function Services() {
  return (
    <>
      <SEO
        title="Services"
        description="Music production, video production, film production, videography and photography by Kemmstudio Production."
      />

      <PageHeader
        eyebrow="Services"
        title="Production services, start to finish"
        lead="Creative production tailored for Kuria music, entertainment, sport and sports-centre content — booked individually or as a full campaign."
      >
        <div className="cluster">
          <Link className="btn btn-primary" to="/contact">
            Request a quote
            <ArrowRight size={16} className="btn-arrow" />
          </Link>
          <Link className="btn btn-outline" to="/portfolio">
            See recent work
          </Link>
        </div>
      </PageHeader>

      <section className="section">
        <div className="container">
          <div className="stack" style={{ gap: '1.1rem' }}>
            {SERVICES.map((service, i) => {
              const Icon = SERVICE_ICONS[service.icon];
              return (
                <Reveal key={service.id} delay={i * 0.05}>
                  <article className="service-row" id={service.id}>
                    <div style={{ display: 'grid', gap: '.75rem', justifyItems: 'start' }}>
                      <span className="icon-tile" style={{ margin: 0 }}>
                        {Icon && <Icon size={22} aria-hidden="true" />}
                      </span>
                      <span className="service-index">{String(i + 1).padStart(2, '0')}</span>
                    </div>

                    <div>
                      <h2 style={{ fontSize: 'var(--fs-h3)', marginBottom: '.5rem' }}>{service.title}</h2>
                      <p className="muted" style={{ margin: 0, maxWidth: '62ch' }}>
                        {service.blurb}
                      </p>
                      <div className="service-tags">
                        {service.tags.map((tag) => (
                          <span className="pill" key={tag}>
                            <Check size={12} aria-hidden="true" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      className="btn btn-outline btn-sm"
                      to={`/contact?service=${encodeURIComponent(service.title)}`}
                      aria-label={`Book ${service.title}`}
                    >
                      Book this
                      <ArrowRight size={15} className="btn-arrow" />
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <SectionHeading
            eyebrow="Every booking includes"
            title="The same process on every project"
            sub="Whether it is a single track or a multi-day shoot, the production runs through four clear stages."
          />
          <div className="steps">
            {PROCESS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.07} className="step">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="cta-band" style={{ marginTop: 'clamp(2.5rem, 6vw, 3.5rem)' }}>
            <h2>Not sure which service you need?</h2>
            <p>Send us the brief. We will recommend the right mix of studio time, crew and post-production.</p>
            <Link className="btn btn-primary btn-lg" to="/contact">
              Talk to the studio
              <ArrowRight size={18} className="btn-arrow" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
