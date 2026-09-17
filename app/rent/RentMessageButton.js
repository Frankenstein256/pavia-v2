'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RentMessageButton({ rentListingId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    setLoading(true);
    setError('');

    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rentListingId }),
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
    <div style={{ marginTop: 10 }}>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Starting chat...' : 'Message'}
      </button>
      {error && <p style={{ color: 'var(--color-danger)', fontSize: 13, marginTop: 4 }}>{error}</p>}
    </div>
  );
      }
