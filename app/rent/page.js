'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import RentMessageButton from './RentMessageButton';

function PhotoPlaceholder() {
  return (
    <div style={{
      width: '100%', height: 180, borderRadius: 10, marginBottom: 10,
      background: '#EAF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" />
      </svg>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card">
      <div className="skeleton" style={{ width: '100%', height: 180, marginBottom: 10 }} />
      <div className="skeleton" style={{ width: 70, height: 20, marginBottom: 8 }} />
      <div className="skeleton" style={{ width: '80%', height: 20, marginBottom: 8 }} />
      <div className="skeleton" style={{ width: '50%', height: 14, marginBottom: 10 }} />
      <div className="skeleton" style={{ width: '40%', height: 22 }} />
    </div>
  );
}

export default function RentPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeType, setActiveType] = useState('All');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('room');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [photoUrls, setPhotoUrls] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const labelStyle = { display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 };
  const fieldWrap = { marginBottom: 16 };

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    const res = await fetch('/api/rentals');
    if (res.ok) {
      const data = await res.json();
      setListings(data);
    }
    setLoading(false);
  }

  async function handlePhotoChange(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setError('');
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });

      if (res.ok) {
        const data = await res.json();
        uploadedUrls.push(data.url);
      } else {
        setError('Failed to upload one or more photos');
      }
    }

    setPhotoUrls((prev) => (prev ? prev + ',' + uploadedUrls.join(',') : uploadedUrls.join(',')));
    setUploading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setCreating(true);

    const res = await fetch('/api/rentals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, type, price, location, photoUrls }),
    });

    setCreating(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Something went wrong');
      return;
    }

    setTitle('');
    setDescription('');
    setPrice('');
    setLocation('');
    setPhotoUrls('');
    setShowForm(false);
    loadListings();
  }

  const filtered = useMemo(() => {
    if (activeType === 'All') return listings;
    return listings.filter((l) => l.type === activeType);
  }, [listings, activeType]);

  return (
    <main className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Find a place</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ fontSize: 14, padding: '8px 14px' }}>
          {showForm ? 'Cancel' : '+ List a place'}
        </button>
      </div>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>
        Browse rooms and apartments listed by real people.
      </p>

      {showForm && (
        <form onSubmit={handleCreate} className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>List your place</h3>

          <div style={fieldWrap}>
            <label style={labelStyle}>Title</label>
            <input type="text" placeholder="e.g. Cozy single room near campus" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Description</label>
            <textarea placeholder="Describe the place — size, features, nearby amenities..." value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} />
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="room">Room (shared)</option>
                <option value="apartment">Whole apartment/house</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Price/month (GHS)</label>
              <input type="number" placeholder="e.g. 800" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Location</label>
            <input type="text" placeholder="e.g. East Legon" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Photos</label>
            <input type="file" accept="image/*" multiple onChange={handlePhotoChange} />
            {uploading && <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginTop: 6 }}>Uploading...</p>}
            {photoUrls && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                {photoUrls.split(',').map((url, i) => (
                  <img key={i} src={url} alt="preview" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
                ))}
              </div>
            )}
          </div>

          {error && <p style={{ color: 'var(--color-danger)', fontSize: 14, marginBottom: 12 }}>{error}</p>}
          <button type="submit" disabled={creating || uploading} style={{ width: '100%' }}>
            {creating ? 'Posting...' : 'Publish listing'}
          </button>
        </form>
      )}

      {!loading && listings.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['All', 'room', 'apartment'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={activeType === t ? '' : 'btn-secondary'}
              style={{ fontSize: 13, padding: '6px 14px' }}
            >
              {t === 'All' ? 'All' : t === 'room' ? 'Room' : 'Whole place'}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!loading && listings.length === 0 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: 4 }}>No listings yet</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Be the first to list a place.</p>
          </div>
        )}

        {!loading && listings.length > 0 && filtered.length === 0 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: 4 }}>No matches</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Try a different filter.</p>
          </div>
        )}

        {filtered.map((listing) => {
          const photos = listing.photoUrls ? listing.photoUrls.split(',').map((p) => p.trim()) : [];
          return (
            <div key={listing.id} className="card">
              <Link href={`/rent/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {photos[0] ? (
                  <div style={{ position: 'relative' }}>
                    <img src={photos[0]} alt={listing.title} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }} />
                    {photos.length > 1 && (
                      <span style={{
                        position: 'absolute', bottom: 18, right: 8,
                        background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 11, fontWeight: 600,
                        padding: '2px 8px', borderRadius: 999,
                      }}>
                        +{photos.length - 1} more
                      </span>
                    )}
                  </div>
                ) : (
                  <PhotoPlaceholder />
                )}

                <span className="badge badge-green" style={{ marginBottom: 6 }}>
                  {listing.type === 'room' ? 'Room' : 'Whole place'}
                </span>
                <h3 style={{ color: 'var(--color-text)', margin: '4px 0 2px' }}>{listing.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 6 }}>📍 {listing.location}</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 6 }}>{listing.description}</p>
                <p style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 17 }}>GHS {listing.price}<span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)' }}>/month</span></p>
              </Link>

              {listing.user?.id && (
                <Link href={`/profile/${listing.user.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, marginBottom: 8 }}>
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
                  </div>
                </Link>
              )}

              <RentMessageButton rentListingId={listing.id} />
            </div>
          );
        })}
      </div>
    </main>
  );
}
