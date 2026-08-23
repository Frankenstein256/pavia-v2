'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <main style={{ maxWidth: 500, margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>List your skill</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
        <input
          type="text"
          placeholder="Title (e.g. Graphic Design, Hair Braiding)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '0.6rem' }}
        />
        <textarea
          placeholder="Describe what you offer"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          style={{ padding: '0.6rem' }}
        />
        <input
          type="text"
          placeholder="Category (e.g. Design, Tech, Beauty)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={{ padding: '0.6rem' }}
        />
        <select
          value={priceType}
          onChange={(e) => setPriceType(e.target.value)}
          style={{ padding: '0.6rem' }}
        >
          <option value="fixed">Fixed price</option>
          <option value="hourly">Hourly rate</option>
          <option value="negotiable">Negotiable</option>
        </select>
        <input
          type="number"
          placeholder="Price (GHS) — optional"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ padding: '0.6rem' }}
        />
        <input
          type="text"
          placeholder="Location (e.g. Accra)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ padding: '0.6rem' }}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ padding: '0.7rem', cursor: 'pointer' }}>
          {loading ? 'Posting...' : 'Post listing'}
        </button>
      </form>
    </main>
  );
                            }
