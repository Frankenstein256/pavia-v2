'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [otherPersonName, setOtherPersonName] = useState('');
  const [listingTitle, setListingTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    loadMessages();
    loadConversationInfo();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadConversationInfo() {
    const res = await fetch('/api/conversations');
    if (res.ok) {
      const list = await res.json();
      const convo = list.find((c) => c.id === params.id);
      if (convo) {
        setOtherPersonName(convo.otherPersonName);
        setListingTitle(convo.listingTitle);
      }
    }
  }

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

  if (loading) {
    return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Loading...</p></main>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 16px', borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}>
        <button
          onClick={() => router.push('/messages')}
          className="btn-secondary"
          style={{ padding: '6px 10px', fontSize: 13 }}
        >
          ←
        </button>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'var(--color-primary)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700,
          flexShrink: 0,
        }}>
          {(otherPersonName || '?')[0].toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-text)' }}>{otherPersonName || 'Chat'}</p>
          {listingTitle && (
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              About: {listingTitle}
            </p>
          )}
        </div>
      </div>

      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {messages.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 40 }}>
            No messages yet. Say hello 👋
          </p>
        )}
        {messages.map((m) => {
          const isMine = m.senderId === session?.user?.id;
          return (
            <div
              key={m.id}
              style={{
                background: isMine ? 'var(--color-primary)' : 'var(--color-surface)',
                color: isMine ? '#fff' : 'var(--color-text)',
                border: isMine ? 'none' : '1px solid var(--color-border)',
                borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '9px 14px',
                alignSelf: isMine ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                fontSize: 14.5,
                lineHeight: 1.4,
              }}
            >
              {m.content}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={{
        display: 'flex', gap: 8, padding: '12px 16px',
        borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)',
      }}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a message..."
          style={{ flex: 1, minWidth: 0 }}
        />
        <button type="submit" disabled={sending} style={{ flexShrink: 0 }}>
          Send
        </button>
      </form>

      {error && <p style={{ color: 'var(--color-danger)', padding: '0 16px', fontSize: 13 }}>{error}</p>}
    </div>
  );
}
