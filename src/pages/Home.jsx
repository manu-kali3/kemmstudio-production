import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/client';
import SEO from '../components/SEO';

const services = [
  { title: 'Music Production', text: 'Kuria-inspired music production, recording, mixing, and mastering for artists and brands.' },
  { title: 'Video Production', text: 'Compelling music videos and promotional content with cinematic storytelling.' },
  { title: 'Film Production', text: 'Short films and narrative projects celebrating culture, entertainment, and community.' },
  { title: 'Videography', text: 'Event, sports-centre, and documentary videography with dynamic coverage.' },
  { title: 'Photography', text: 'Portrait, event, and sports photography with premium editing and delivery.' },
];

const testimonials = [
  { name: 'A. Chacha', quote: 'Kemmstudio Production brought our Kuria sound to life with warmth and professionalism.' },
  { name: 'M. Robi', quote: 'Outstanding videography for our sports centre launch — energetic and cinematic.' },
  { name: 'N. Boke', quote: 'From concept to final film, the team delivered beyond expectations.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  useEffect(() => {
    api.get('/portfolio?featured=true').then(({ data }) => setFeatured(data.items || [])).catch(() => {});
  }, []);

  return (
    <>
      <SEO title="Home" description="Kemmstudio Production - Kuria Entertainment Music and Movie Studio. Music, video, film, videography, and photography." />
      <section className="hero">
        <div className="hero-bg" aria-hidden="true"></div>
        <div className="container hero-content">
          <motion.p className="pill" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>Kuria Entertainment Music and Movie Studio</motion.p>
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.05}}>Cinematic stories rooted in Kuria culture</motion.h1>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.1}}>
            Kemmstudio Production crafts music, video, film, videography, and photography for entertainment, sports, and sports-centre content.
          </motion.p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/contact">Book a Session</Link>
            <Link className="btn btn-outline" to="/portfolio">View Portfolio</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <p className="section-sub">End-to-end creative production with a premium, cinematic finish.</p>
          <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
            {services.map((s) => (
              <motion.div key={s.title} className="card" whileHover={{y:-4}}>
                <div className="card-body">
                  <h3 style={{marginTop:0}}>{s.title}</h3>
                  <p className="muted">{s.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{background:'var(--bg-soft)'}}>
        <div className="container">
          <h2 className="section-title">Featured Work</h2>
          <p className="section-sub">Selected projects across music, film, video, photography, and sports.</p>
          <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))'}}>
            {featured.length ? featured.map((item) => (
              <div key={item._id} className="card">
                <img src={item.thumbnailUrl || item.mediaUrl} alt={item.title} loading="lazy" style={{height:180,width:'100%',objectFit:'cover'}} />
                <div className="card-body">
                  <span className="pill">{item.category}</span>
                  <h3 style={{marginBottom:'.25rem'}}>{item.title}</h3>
                  <p className="muted">{item.description}</p>
                </div>
              </div>
            )) : <p className="muted">Featured projects will appear here once seeded.</p>}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Testimonials</h2>
          <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))'}}>
            {testimonials.map((t) => (
              <div key={t.name} className="card"><div className="card-body"><p>“{t.quote}”</p><p className="muted" style={{marginBottom:0}}>— {t.name}</p></div></div>
            ))}
          </div>
          <div style={{marginTop:'2rem'}}>
            <Link className="btn btn-primary" to="/contact">Start Your Project</Link>
          </div>
        </div>
      </section>
    </>
  );
}
