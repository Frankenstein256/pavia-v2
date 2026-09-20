'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MessageButton from './MessageButton';
import SaveButton from '../SaveButton';

function Stars({ rating, count }) {
  return (
    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
      <span style={{ color: 'var(--color-gold)' }}>★</span> {rating.toFixed(1)} ({count})
    </span>
  );
}

export default function WorkList({ listings }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState('All');
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    fetch('/api/saved/check')
      .then((res) => res.json())
      .then((data) => setSavedIds(data.listingIds || []));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(listings.map((l) => l.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [listings]);

  const filtered = listings.filter((l) => {
    const matchesQuery = !query || l.title.toLowerCase().includes(query.toLowerCase()) || l.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === 'All' || l.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <>
      <input
        placeholder="Search skills..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: 14 }}
      />

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 20 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={activeCategory === cat ? '' : 'btn-secondary'}
            style={{ flexShrink: 0, padding: '6px 14px', fontSize: 13 }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: 4 }}>No skills listed yet</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Be the first to offer a service in your area.</p>
          </div>
        )}

        {filtered.map((listing) => (
          <div key={listing.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div>
                {listing.category && <span className="badge badge-green" style={{ marginBottom: 6 }}>{listing.category}</span>}
                <h3 style={{ color: 'var(--color-text)', margin: '2px 0 4px' }}>{listing.title}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <p style={{ fontWeight: 700, color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>
                  {listing.price ? `GH₵${listing.price}` : 'Negotiable'}
                  {listing.priceType === 'hourly' ? '/hr' : ''}
                </p>
                <SaveButton listingId={listing.id} initiallySaved={savedIds.includes(listing.id)} />
              </div>
            </div>
            {listing.location && (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 6 }}>📍 {listing.location}</p>
            )}
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 8 }}>{listing.description}</p>

            {listing.user?.id && (
              <Link href={`/profile/${listing.user.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  {listing.user.image ? (
                    <img src={listing.user.image} alt="" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'var(--color-primary)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                    }}>
                      {(listing.user.name || '?')[0].toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: 13, color: 'var(--color-text)', fontWeight: 600 }}>
                    {listing.user.name || 'Anonymous'}
                  </span>
                  {listing.userRating && (
                    <Stars rating={listing.userRating.avgRating} count={listing.userRating.reviewCount} />
                  )}
                </div>
              </Link>
            )}

            <MessageButton listingId={listing.id} />
          </div>
        ))}
      </div>
    </>
  );
              }
