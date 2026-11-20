import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Images, Sparkles } from 'lucide-react';
import api from '../api/client';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import MediaCard from '../components/MediaCard';
import Lightbox from '../components/Lightbox';
import EmptyState from '../components/EmptyState';
import { MediaGridSkeleton } from '../components/Skeleton';
import { PORTFOLIO_CATEGORIES, SAMPLE_WORK } from '../data/site';

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [usingSamples, setUsingSamples] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    let alive = true;
    api
      .get('/portfolio')
      .then(({ data }) => {
        if (!alive) return;
        const list = data.items || [];
        setItems(list.length ? list : SAMPLE_WORK);
        setUsingSamples(list.length === 0);
      })
      .catch(() => {
        if (!alive) return;
        setItems(SAMPLE_WORK);
        setUsingSamples(true);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const counts = useMemo(() => {
    const map = { All: items.length };
    items.forEach((item) => {
      map[item.category] = (map[item.category] || 0) + 1;
    });
    return map;
  }, [items]);

  const filtered = useMemo(
    () => (filter === 'All' ? items : items.filter((item) => item.category === filter)),
    [items, filter],
  );

  const active = activeIndex >= 0 ? filtered[activeIndex] : null;

  return (
    <>
      <SEO
        title="Portfolio"
        description="Explore the Kemmstudio Production portfolio across music, video, film, photography and sports."
      />

      <PageHeader
        eyebrow="Portfolio"
        title="Work from the studio and the field"
        lead="Filter by discipline, then open any project to view it full screen. New releases are added as they go live."
        crumb="Portfolio"
      />

      <section className="section">
        <div className="container">
          <div className="filter-bar">
            <div className="filter-chips" role="group" aria-label="Filter work by category">
              {PORTFOLIO_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className="chip"
                  aria-pressed={filter === category}
                  onClick={() => {
                    setFilter(category);
                    setActiveIndex(-1);
                  }}
                >
                  {category}
                  {counts[category] ? <span className="faint">({counts[category]})</span> : null}
                </button>
              ))}
            </div>
            {!loading && (
              <p className="result-count" role="status">
                {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
                {filter !== 'All' ? ` in ${filter}` : ''}
              </p>
            )}
          </div>

          {usingSamples && !loading && (
            <p className="notice-inline">
              <Sparkles size={13} aria-hidden="true" />
              Showing a sample gallery while the studio uploads its latest releases.
            </p>
          )}

          {loading ? (
            <MediaGridSkeleton count={6} />
          ) : filtered.length ? (
            <div className="grid grid-auto">
              {filtered.map((item, i) => (
                <Reveal key={item._id} delay={Math.min(i, 5) * 0.05}>
                  <MediaCard item={item} onOpen={() => setActiveIndex(i)} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Images}
              title={`Nothing in ${filter} yet`}
              message="This category is still being filled. Try another discipline or get in touch about a commission."
              action={
                <div className="cluster" style={{ justifyContent: 'center' }}>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setFilter('All')}>
                    Show all work
                  </button>
                  <Link className="btn btn-primary btn-sm" to="/contact">
                    Commission a project
                    <ArrowRight size={15} className="btn-arrow" />
                  </Link>
                </div>
              }
            />
          )}
        </div>
      </section>

      <Lightbox
        item={active}
        index={activeIndex}
        total={filtered.length}
        onClose={() => setActiveIndex(-1)}
        onPrev={() => setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length)}
        onNext={() => setActiveIndex((i) => (i + 1) % filtered.length)}
      />
    </>
  );
}
