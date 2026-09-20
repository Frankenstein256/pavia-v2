'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const workCategories = ['Design', 'Photography', 'Writing', 'Tech', 'Repairs', 'Beauty', 'Catering', 'Tutoring', 'Other'];

export default function EditListingPage() {
  const { kind, id } = useParams();
  const router = useRouter();
  const isWork = kind === 'work';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const [category, setCategory] = useState('');
  const [priceType, setPriceType] = useState('fixed');
  const [location, setLocation] = useState('');

  const [type, setType] = useState('room');
  const [rentLocation, setRentLocation] = useState('');

  const labelStyle = { display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 };
  const fieldWrap = { marginBottom: 16 };

  useEffect(() => {
    const url = isWork ? `/api/listings/${id}` : `/api/rentals/${id}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title || '');
        setDescription(data.description || '');
        setPrice(data.price || '');
        if (isWork) {
          setCategory(data.category || '');
          setPriceType(data.priceType || 'fixed');
          setLocation(data.location || '');
        } else {
          setType(data.type || 'room');
          setRentLocation(data.location || '');
        }
        setLoading(false);
      });
  }, [id, isWork]);

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const url = isWork ? `/api/listings/${id}` : `/api/rentals/${id}`;
    const body = isWork
      ? { title, description, category, price, priceType, location }
      : { title, description, type, price, location: rentLocation, photoUrls: undefined };

    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (res.ok) {
      router.push('/profile/my-listings');
    } else {
      setError('Failed to save changes.');
    }
  }

  if (loading) return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Loading...</p></main>;

  return (
    <main className="page-container" style={{ maxWidth: 500 }}>
      <h1 style={{ color: 'var(--color-primary)', marginBottom: 20 }}>Edit Listing</h1>

      <form onSubmit={handleSave} className="card">
        <div style={fieldWrap}>
          <label style={labelStyle}>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} />
        </div>

        {isWork ? (
          <>
            <div style={fieldWrap}>
              <label style={labelStyle}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                {workCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Pricing</label>
                <select value={priceType} onChange={(e) => setPriceType(e.target.value)}>
                  <option value="fixed">Fixed price</option>
                  <option value="hourly">Hourly rate</option>
                  <option value="negotiable">Negotiable</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Price (GHS)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </>
        ) : (
          <>
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
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Location</label>
              <input type="text" value={rentLocation} onChange={(e) => setRentLocation(e.target.value)} required />
            </div>
          </>
        )}

        {error && <p style={{ color: 'var(--color-danger)', fontSize: 14, marginBottom: 12 }}>{error}</p>}
        <button type="submit" disabled={saving} style={{ width: '100%' }}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </main>
  );
      }
