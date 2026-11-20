/** Loading placeholders that reserve the final layout (keeps CLS at zero). */

export function Skeleton({ height = 16, width = '100%', radius = 8, style }) {
  return <span className="skeleton" style={{ display: 'block', height, width, borderRadius: radius, ...style }} />;
}

export function MediaCardSkeleton() {
  return (
    <div className="card" aria-hidden="true">
      <Skeleton height={0} style={{ aspectRatio: '4 / 3', borderRadius: 0 }} />
      <div className="card-body" style={{ display: 'grid', gap: '.6rem' }}>
        <Skeleton height={14} width="38%" radius={999} />
        <Skeleton height={18} width="72%" />
        <Skeleton height={12} width="100%" />
        <Skeleton height={12} width="84%" />
      </div>
    </div>
  );
}

export function MediaGridSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-auto" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading work…</span>
      {Array.from({ length: count }).map((_, i) => (
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function RowsSkeleton({ rows = 4 }) {
  return (
    <div style={{ display: 'grid', gap: '.75rem' }} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={46} radius={12} />
      ))}
    </div>
  );
}
