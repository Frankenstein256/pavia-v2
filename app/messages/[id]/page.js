'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ChatPage() {
  const params = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const res = await fetch(`/api/conversations/${params.id}/messages`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
    setLoading(false);
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    setError('');

    const res = await fetch(`/api/conversations/${params.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    setSending(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to send');
      return;
    }

    setContent('');
    loadMessages();
  }

  if (loading) return <main style={{ padding: '2rem' }}>Loading...</main>;

  return (
    <main style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Chat</h1>

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', minHeight: '300px', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {messages.length === 0 && <p style={{ color: '#999' }}>No messages yet. Say hello.</p>}
        {messages.map((m) => (
          <div key={m.id} style={{ background: '#f2f2f2', borderRadius: '6px', padding: '0.5rem 0.75rem', alignSelf: 'flex-start', maxWidth: '80%' }}>
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '0.6rem' }}
        />
        <button type="submit" disabled={sending} style={{ padding: '0.6rem 1rem', cursor: 'pointer' }}>
          Send
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </main>
  );
  }
