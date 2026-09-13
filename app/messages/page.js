'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InboxPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/conversations')
      .then((res) => res.json())
      .then((data) => {
        setConversations(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  if (loading) return <main style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading...</main>;

  return (
    <main style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ color: 'var(--color-primary)' }}>Messages</h1>
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {conversations.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>No conversations yet.</p>}
        {conversations.map((c) => (
          <Link key={c.id} href={`/messages/${c.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              padding: '1rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: 'var(--color-text)' }}>{c.otherPersonName}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p style={{ margin: '0.3rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                About: {c.listingTitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
  }
