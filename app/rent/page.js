'use client';

import { useState, useEffect } from 'react';

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

  if (loading) return <main style={{ padding: '2rem' }}>Loading...</main>;

  return (
    <main style={{ maxWidth: 700, margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Find a place</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.6rem 1rem', cursor: 'pointer' }}>
          {showForm ? 'Cancel' : '+ List a place'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem', border: '1px solid #ddd', borderRadius: '10px', padding: '1rem' }}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '0.6rem' }} />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} style={{ padding: '0.6rem' }} />
          <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: '0.6rem' }}>
            <option value="room">Room (shared)</option>
            <option value="apartment">Whole apartment/house</option>
          </select>
          <input type="number" placeholder="Price per month (GHS)" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ padding: '0.6rem' }} />
          <input type="text" placeholder="Location (e.g. East Legon)" value={location} onChange={(e) => setLocation(e.target.value)} required style={{ padding: '0.6rem' }} />
          <input type="text" placeholder="Photo URL(s), comma separated" value={photoUrls} onChange={(e) => setPhotoUrls(e.target.value)} style={{ padding: '0.6rem' }} />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" disabled={creating} style={{ padding: '0.7rem', cursor: 'pointer' }}>
            {creating ? 'Posting...' : 'Post listing'}
          </button>
        </form>
      )}

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {listings.length === 0 && <p>No listings yet.</p>}

        {listings.map((listing) => {
          const photos = listing.photoUrls ? listing.photoUrls.split(',').map((p) => p.trim()) : [];
          return (
            <div key={listing.id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '1rem' }}>
              {photos[0] && (
                <img src={photos[0]} alt={listing.title} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} />
              )}
              <h3 style={{ margin: 0 }}>{listing.title}</h3>
              <p style={{ color: '#666', margin: '0.3rem 0' }}>
                {listing.type === 'room' ? 'Room' : 'Whole place'} · {listing.location}
              </p>
              <p style={{ margin: '0.5rem 0' }}>{listing.description}</p>
              <p style={{ fontWeight: 'bold', margin: 0 }}>GHS {listing.price}/month</p>
              <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
                Posted by {listing.user?.name || 'Anonymous'}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
    }
