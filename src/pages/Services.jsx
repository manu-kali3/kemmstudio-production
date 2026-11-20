import SEO from '../components/SEO';

const sections = [
  { id: 'music', title: 'Music Production', desc: 'Recording, arrangement, mixing, and mastering with a signature Kuria influence. We produce tracks for artists, events, and media projects with clarity and impact.' },
  { id: 'video', title: 'Video Production', desc: 'Concept-to-delivery video production including music videos, promos, and branded content crafted for engagement and storytelling.' },
  { id: 'film', title: 'Film Production', desc: 'Narrative and documentary film production that highlights culture, entertainment, and lived experiences with cinematic direction and post-production.' },
  { id: 'videography', title: 'Videography', desc: 'On-location and studio videography for events, performances, sports, and sports-centre coverage with dynamic multi-angle capture.' },
  { id: 'photography', title: 'Photography', desc: 'Professional photography for portraits, events, sports action, and campaigns — delivered with premium editing and fast turnaround.' },
];

export default function Services() {
  return (
    <section className="section">
      <SEO title="Services" description="Music production, video production, film production, videography, and photography by Kemmstudio Production." />
      <div className="container">
        <h1 className="section-title">Services</h1>
        <p className="section-sub">Creative production services tailored for Kuria music, entertainment, sports, and sports-centre content.</p>
        <div className="grid" style={{gap:'1.5rem'}}>
          {sections.map((s) => (
            <article key={s.id} id={s.id} className="card"><div className="card-body"><h2 style={{marginTop:0}}>{s.title}</h2><p className="muted" style={{marginBottom:0}}>{s.desc}</p></div></article>
          ))}
        </div>
      </div>
    </section>
  );
}
