import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarDays, CircleCheck, Clock, Mail, MapPin, MessageSquare, Phone, Send, User } from 'lucide-react';
import api from '../api/client';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import Field from '../components/Field';
import Alert from '../components/Alert';
import { WhatsAppIcon } from '../components/BrandIcons';
import { SERVICE_OPTIONS, SITE, SOCIALS } from '../data/site';

const EMPTY = { name: '', email: '', phone: '', service: SERVICE_OPTIONS[0], preferredDate: '', message: '' };

function validate(form) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = 'Please tell us your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  if (form.phone && form.phone.replace(/[^\d+]/g, '').length < 7) errors.phone = 'Enter a reachable phone number.';
  if (form.message.trim().length < 10) errors.message = 'A sentence or two about the project helps us quote accurately.';
  return errors;
}

export default function Contact() {
  const [params] = useSearchParams();
  // Pre-select the service when arriving from a "Book this" link.
  const requestedService = params.get('service');
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    service: SERVICE_OPTIONS.includes(requestedService) ? requestedService : EMPTY.service,
  }));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus({ type: 'error', msg: 'Please fix the highlighted fields and try again.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', msg: '' });
    try {
      await api.post('/bookings', form);
      setSent(true);
      setStatus({ type: 'success', msg: 'Booking request sent. We will get back to you shortly.' });
      setForm(EMPTY);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to send request. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Booking & Contact"
        description="Book Kemmstudio Production for music, video, film, videography or photography."
      />

      <PageHeader
        eyebrow="Booking"
        title="Tell us about your project"
        lead="Share the idea, the dates and the deliverables you need. We usually reply within one business day."
        crumb="Booking"
      />

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <Reveal>
              {sent ? (
                <div className="card">
                  <div className="card-body" style={{ display: 'grid', gap: '.85rem', justifyItems: 'start' }}>
                    <span className="empty-icon" style={{ margin: 0 }}>
                      <CircleCheck size={24} aria-hidden="true" />
                    </span>
                    <h2 style={{ margin: 0, fontSize: 'var(--fs-h3)' }}>Request received</h2>
                    <p className="muted" style={{ margin: 0 }}>
                      Thank you — your booking request is with the studio. We will confirm availability and send a
                      quote by email. For anything urgent, message us on WhatsApp.
                    </p>
                    <div className="cluster">
                      <a className="btn btn-primary btn-sm" href={SOCIALS.whatsapp} target="_blank" rel="noreferrer">
                        <WhatsAppIcon size={16} />
                        Chat on WhatsApp
                      </a>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => { setSent(false); setStatus({ type: '', msg: '' }); }}>
                        Send another request
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form className="card" onSubmit={onSubmit} noValidate>
                  <div className="card-body form-grid">
                    {status.msg && <Alert type={status.type || 'info'}>{status.msg}</Alert>}

                    <div className="form-row">
                      <Field id="name" label="Name" required error={errors.name} icon={User}>
                        <input
                          id="name"
                          name="name"
                          value={form.name}
                          onChange={onChange}
                          placeholder="Your full name"
                          autoComplete="name"
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                          required
                        />
                      </Field>

                      <Field id="email" label="Email" required error={errors.email} icon={Mail}>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={onChange}
                          placeholder="you@example.com"
                          autoComplete="email"
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                          required
                        />
                      </Field>
                    </div>

                    <div className="form-row">
                      <Field id="phone" label="Phone" hint="Optional — fastest way to reach you" error={errors.phone} icon={Phone}>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={onChange}
                          placeholder="+254 7xx xxx xxx"
                          autoComplete="tel"
                          aria-invalid={Boolean(errors.phone)}
                        />
                      </Field>

                      <Field id="preferredDate" label="Preferred date" hint="We will confirm availability" icon={CalendarDays}>
                        <input
                          id="preferredDate"
                          name="preferredDate"
                          type="date"
                          value={form.preferredDate}
                          onChange={onChange}
                        />
                      </Field>
                    </div>

                    <Field id="service" label="Service" required>
                      <select id="service" name="service" value={form.service} onChange={onChange}>
                        {SERVICE_OPTIONS.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </Field>

                    <Field
                      id="message"
                      label="Project details"
                      required
                      error={errors.message}
                      hint="Genre, location, duration, deliverables — anything that helps us plan."
                    >
                      <textarea
                        id="message"
                        name="message"
                        rows="6"
                        value={form.message}
                        onChange={onChange}
                        placeholder="Tell us what you are creating…"
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? 'message-error' : 'message-hint'}
                        required
                      />
                    </Field>

                    <button className="btn btn-primary btn-lg" disabled={loading} type="submit">
                      {loading ? (
                        <>
                          <span className="spinner" aria-hidden="true" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send size={17} />
                          Send booking request
                        </>
                      )}
                    </button>
                    <p className="field-hint" style={{ margin: 0 }}>
                      By sending this form you agree to be contacted about your enquiry. We never share your details.
                    </p>
                  </div>
                </form>
              )}
            </Reveal>

            <Reveal delay={0.1} className="contact-aside">
              <div className="panel" style={{ display: 'grid', gap: '1.25rem' }}>
                <h2 style={{ fontSize: 'var(--fs-h3)', margin: 0 }}>Studio contact</h2>

                <div className="contact-item">
                  <span className="icon-tile">
                    <MapPin size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>Location</strong>
                    <span>{SITE.location}</span>
                  </span>
                </div>

                <div className="contact-item">
                  <span className="icon-tile">
                    <Phone size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>Phone</strong>
                    <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a>
                  </span>
                </div>

                <div className="contact-item">
                  <span className="icon-tile">
                    <Mail size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>Email</strong>
                    <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                  </span>
                </div>

                <div className="contact-item">
                  <span className="icon-tile">
                    <Clock size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>Studio hours</strong>
                    <span>{SITE.hours}</span>
                  </span>
                </div>

                <a className="btn btn-primary btn-block" href={SOCIALS.whatsapp} target="_blank" rel="noreferrer">
                  <WhatsAppIcon size={17} />
                  Message us on WhatsApp
                </a>
              </div>

              <div className="panel" style={{ display: 'grid', gap: '.6rem' }}>
                <span className="pill pill-accent pill-dot" style={{ justifySelf: 'start' }}>
                  Fast response
                </span>
                <p className="muted" style={{ margin: 0, fontSize: '.93rem', display: 'flex', gap: '.6rem' }}>
                  <MessageSquare size={17} style={{ color: 'var(--accent)', flex: 'none', marginTop: 3 }} aria-hidden="true" />
                  Most enquiries are answered within a business day. Urgent shoot? Call or message the studio
                  directly and we will find a slot.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
