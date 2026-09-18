'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = ['Design', 'Photography', 'Writing', 'Tech', 'Repairs', 'Beauty', 'Catering', 'Tutoring', 'Other'];

export default function NewListingPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState('fixed');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const labelStyle = { display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 };
  const fieldWrap = { marginBottom: 16 };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, category, price, priceType, location }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Something went wrong');
      return;
    }

    router.push('/work');
  }

  return (
    <main className="page-container" style={{ maxWidth: 500 }}>
      <h1 style={{ color: 'var(--color-primary)', marginBottom: 6 }}>List your skill</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 20 }}>
        Let people know what you can help with.
      </p>

      <form onSubmit={handleSubmit} className="card">
        <div style={fieldWrap}>
          <label style={labelStyle}>Title</label>
          <input
            type="text"
            placeholder="e.g. Graphic Design, Hair Braiding"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>Description</label>
          <textarea
            placeholder="Describe what you offer"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
          />
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="" disabled>Select a category</option>
            {categories.map((c) => (
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
            <input
              type="number"
              placeholder="Optional"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>Location</label>
          <input
            type="text"
            placeholder="e.g. Accra"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {error && <p style={{ color: 'var(--color-danger)', fontSize: 14, marginBottom: 12 }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Posting...' : 'Publish skill'}
        </button>
      </form>
    </main>
  );
              }
