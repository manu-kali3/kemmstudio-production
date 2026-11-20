import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import SEO from '../components/SEO';

const categories = ['All', 'Music', 'Video', 'Film', 'Photography', 'Sports'];

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/portfolio').then(({ data }) => setItems(data.items || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => filter === 'All' ? items : items.filter(i => i.category === filter), [items, filter]);

  return (
    <section className="section">
      <SEO title="Portfolio" description="Explore Kemmstudio Production portfolio across music, video, film, photography, and sports." />
      <div className="container">
        <h1 className="section-title">Portfolio & Gallery</h1>
        <p className="section-sub">Filter by category to explore our work. Click any item to view in lightbox.</p>
        <div style={{display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'1.5rem'}}>
          {categories.map(c => (
            <button key={c} className={`btn ${filter===c?'btn-primary':'btn-outline'}`} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>
        {loading ? <p>Loading...</p> : (
          <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))'}}>
            {filtered.map(item => (
              <button key={item._id} className="card" style={{textAlign:'left', padding:0, cursor:'pointer'}} onClick={() => setActive(item)}>
                <img src={item.thumbnailUrl || item.mediaUrl} alt={item.title} loading="lazy" style={{height:200,width:'100%',objectFit:'cover'}} />
                <div className="card-body">
                  <span className="pill">{item.category}</span>
                  <h3 style={{margin:'.4rem 0'}}>{item.title}</h3>
                  <p className="muted" style={{marginBottom:0}}>{item.description}</p>
                </div>
              </button>
            ))}
            {!filtered.length && <p className="muted">No items in this category yet.</p>}
          </div>
        )}
      </div>

      {active && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <strong>{active.title}</strong>
              <button className="btn btn-outline" onClick={() => setActive(null)}>Close</button>
            </div>
            <div>
              {active.type === 'video' || String(active.mediaUrl).includes('youtube') || String(active.mediaUrl).includes('embed') ? (
                String(active.mediaUrl).includes('http') && !String(active.mediaUrl).match(/\.(mp4|webm)$/i) ? (
                  <iframe title={active.title} src={active.mediaUrl} style={{width:'100%', aspectRatio:'16/9', border:0}} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                ) : (
                  <video src={active.mediaUrl} controls style={{width:'100%', maxHeight:'70vh'}} />
                )
              ) : (
                <img src={active.mediaUrl} alt={active.title} style={{width:'100%', maxHeight:'70vh', objectFit:'contain'}} />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
