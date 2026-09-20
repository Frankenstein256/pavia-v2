'use client';
import { useState } from 'react';

export default function SaveButton({ listingId, rentListingId, initiallySaved = false }) {
  const [saved, setSaved] = useState(initiallySaved);
  const [loading, setLoading] = useState(false);

  async function toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);

    const body = listingId ? { listingId } : { rentListingId };
    const method = saved ? 'DELETE' : 'POST';

    const res = await fetch('/api/saved', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) setSaved(!saved);
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: '50%',
        width: 34,
        height: 34,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill={saved ? 'var(--color-danger)' : 'none'} stroke={saved ? 'var(--color-danger)' : 'var(--color-text-muted)'} strokeWidth="2">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
    </button>
  );
        }
