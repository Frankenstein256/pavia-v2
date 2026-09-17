'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import RentMessageButton from '../RentMessageButton';

export default function RentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    fetch(`/api/rentals/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setListing(data.error ? null : data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Loading...</p></main>;
  if (!listing) return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Listing not found.</p></main>;

  const photos = listing.photoUrls ? listing.photoUrls.split(',').map((p) => p.trim()) : [];

  return (
    <main style={{ paddingBottom: 90 }}>
      <div style={{ position: 'relative', width: '100%', height: 260, background: '#EEE' }}>
        {photos.length > 0 ? (
          <img src={photos[activePhoto]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
            No photo available
          </div>
        )}
        <button
          onClick={() => router.push('/rent')}
          style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(255,255,255,0.9)', color: 'var(--color-text)',
            width: 36, height: 36, borderRadius: '50%', padding: 0, fontSize: 16,
          }}
        >
          ←
        </button>
      </div>

      {photos.length > 1 && (
        <div style={{ display: 'flex', gap: 8, padding: '10px 16px', overflowX: 'auto' }}>
          {photos.map((p, i) => (
            <img
              key={i}
              src={p}
              onClick={() => setActivePhoto(i)}
              style={{
                width: 56, height: 56, objectFit: 'cover', borderRadius: 8, flexShrink: 0,
                border: i === activePhoto ? '2px solid var(--color-primary)' : '2px solid transparent',
              }}
            />
          ))}
        </div>
      )}

      <div className="page-container" style={{ paddingTop: photos.length > 1 ? 4 : 20 }}>
        <span className="badge badge-green" style={{ marginBottom: 8 }}>
          {listing.type === 'room' ? 'Room' : 'Whole place'}
        </span>
        <h1 style={{ color: 'var(--color-text)', marginBottom: 4 }}>{listing.title}</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 12 }}>📍 {listing.location}</p>
        <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 16 }}>
          GHS {listing.price}<span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-muted)' }}>/month</span>
        </p>

        <h3 style={{ marginBottom: 8 }}>Description</h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>{listing.description}</p>

        {listing.user?.id && (
          <Link href={`/profile/${listing.user.id}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              {listing.user.image ? (
                <img src={listing.user.image} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'var(--color-primary)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700,
                }}>
                  {(listing.user.name || '?')[0].toUpperCase()}
                </div>
              )}
              <div>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Listed by</p>
                <p style={{ fontWeight: 700, color: 'var(--color-text)' }}>{listing.user.name || 'Anonymous'}</p>
              </div>
            </div>
          </Link>
        )}
      </div>

      <div style={{
        position: 'fixed', bottom: 64, left: 0, right: 0,
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
        padding: '12px 16px', zIndex: 40,
      }}>
        <RentMessageButton rentListingId={listing.id} />
      </div>
    </main>
  );
    }
