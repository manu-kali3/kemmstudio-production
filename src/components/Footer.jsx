import { Link } from 'react-router-dom';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import Logo from './Logo';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from './BrandIcons';
import { NAV_LINKS, SERVICES, SITE, SOCIALS } from '../data/site';

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <span className="brand" style={{ marginBottom: '1rem' }}>
              <Logo />
            </span>
            <p className="muted" style={{ maxWidth: '34ch', fontSize: '.92rem', marginTop: '1rem' }}>
              {SITE.fullName}. Music, video, film, videography and photography for artists, brands and
              sports-centre stories.
            </p>
            <div className="social-row" style={{ marginTop: '1.25rem' }}>
              <a className="social-btn" href={SOCIALS.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
                <WhatsAppIcon size={19} />
              </a>
              <a className="social-btn" href={SOCIALS.instagram} target="_blank" rel="noreferrer" aria-label="Instagram profile">
                <InstagramIcon size={19} />
              </a>
              <a className="social-btn" href={SOCIALS.facebook} target="_blank" rel="noreferrer" aria-label="Facebook page">
                <FacebookIcon size={19} />
              </a>
            </div>
          </div>

          <div>
            <h4>Explore</h4>
            <ul className="footer-list">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Services</h4>
            <ul className="footer-list">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <Link to={`/services#${service.id}`}>{service.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Studio</h4>
            <ul className="footer-contact footer-list">
              <li>
                <MapPin size={16} />
                <span>{SITE.location}</span>
              </li>
              <li>
                <Phone size={16} />
                <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a>
              </li>
              <li>
                <Mail size={16} />
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
              <li>
                <Clock size={16} />
                <span>{SITE.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {YEAR} {SITE.name}. All rights reserved.</span>
          <span>Music production · Video production · Film production · Videography · Photography</span>
        </div>
      </div>
    </footer>
  );
}
