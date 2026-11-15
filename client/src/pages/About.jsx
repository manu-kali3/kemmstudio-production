import SEO from '../components/SEO';

export default function About() {
  return (
    <section className="section">
      <SEO title="About" description="About Kemmstudio Production - Kuria Entertainment Music and Movie Studio." />
      <div className="container">
        <h1 className="section-title">About Kemmstudio Production</h1>
        <p className="section-sub">Kuria Entertainment Music and Movie Studio — telling authentic stories through sound and vision.</p>
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))'}}>
          <div className="card"><div className="card-body"><h3>Our Focus</h3><p className="muted">We specialize in Kuria music, entertainment, sports, and sports-centre content, blending cultural roots with modern, cinematic production values.</p></div></div>
          <div className="card"><div className="card-body"><h3>Our Craft</h3><p className="muted">From music and film production to videography and photography, our team delivers polished work designed to move audiences and elevate brands.</p></div></div>
          <div className="card"><div className="card-body"><h3>Our Promise</h3><p className="muted">Premium quality, collaborative process, and storytelling that honors community, talent, and the energy of every performance and event.</p></div></div>
        </div>
      </div>
    </section>
  );
}
