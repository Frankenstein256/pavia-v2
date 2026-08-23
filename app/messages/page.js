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

  if (loading) return <main style={{ padding: '2rem' }}>Loading...</main>;

  return (
    <main style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Messages</h1>
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {conversations.length === 0 && <p>No conversations yet.</p>}
        {conversations.map((c) => (
          <Link key={c.id} href={`/messages/${c.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
              Conversation from {new Date(c.createdAt).toLocaleDateString()}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
    }
