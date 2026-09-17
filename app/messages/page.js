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

  if (loading) return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Loading...</p></main>;

  return (
    <main className="page-container">
      <h1 style={{ color: 'var(--color-primary)', marginBottom: 18 }}>Messages</h1>

      {conversations.length === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: 4 }}>No conversations yet</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Explore Work or Rent and start connecting.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {conversations.map((c) => (
          <Link key={c.id} href={`/messages/${c.id}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                background: 'var(--color-primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, fontWeight: 700,
              }}>
                {(c.otherPersonName || '?')[0].toUpperCase()}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <strong style={{ color: 'var(--color-text)', fontSize: 15 }}>{c.otherPersonName}</strong>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0 }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{
                  margin: '2px 0 0', color: 'var(--color-text-muted)', fontSize: 13,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  About: {c.listingTitle}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
    }
