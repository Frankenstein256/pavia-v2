'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MessageButton({ listingId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    setLoading(true);
    setError('');

    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      setError(data.error || 'Something went wrong');
      return;
    }

    const conversation = await res.json();
    router.push(`/messages/${conversation.id}`);
  }

  return (
    <div style={{ marginTop: '0.75rem' }}>
      <button onClick={handleClick} disabled={loading} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
        {loading ? 'Starting chat...' : 'Message'}
      </button>
      {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}
    </div>
  );
    }
