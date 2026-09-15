'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import RentMessageButton from './RentMessageButton';

export default function RentPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('room');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [photoUrls, setPhotoUrls] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

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

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

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

  if (loading) return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Loading...</p></main>;

  return (
    <main className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Find a place</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ fontSize: 14, padding: '8px 14px' }}>
          {showForm ? 'Cancel' : '+ List a place'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="room">Room (shared)</option>
            <option value="apartment">Whole apartment/house</option>
          </select>
          <input type="number" placeholder="Price per month (GHS)" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <input type="text" placeholder="Location (e.g. East Legon)" value={location} onChange={(e) => setLocation(e.target.value)} required />

          <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Photos</label>
          <input type="file" accept="image/*" multiple onChange={handlePhotoChange} />
          {uploading && <p style={{ color: 'var(--color-text-muted)' }}>Uploading...</p>}
          {photoUrls && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {photoUrls.split(',').map((url, i) => (
                <img key={i} src={url} alt="preview" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
              ))}
            </div>
          )}

          {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}
          <button type="submit" disabled={creating || uploading}>
            {creating ? 'Posting...' : 'Post listing'}
          </button>
        </form>
      )}

      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {listings.length === 0 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: 4 }}>No listings yet</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Be the first to list a place.</p>
          </div>
        )}

        {listings.map((listing) => {
          const photos = listing.photoUrls ? listing.photoUrls.split(',').map((p) => p.trim()) : [];
          return (
            <div key={listing.id} className="card">
              {photos[0] && (
                <img src={photos[0]} alt={listing.title} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '10px', marginBottom: '0.6rem' }} />
              )}
              <h3 style={{ color: 'var(--color-text)', margin: 0 }}>{listing.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13, margin: '0.3rem 0' }}>
                {listing.type === 'room' ? 'Room' : 'Whole place'} · {listing.location}
              </p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: '0.5rem 0' }}>{listing.description}</p>
              <p style={{ fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>GHS {listing.price}/month</p>

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
