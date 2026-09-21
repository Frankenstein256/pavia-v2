'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const categories = [
  { href: '/work', title: 'Work', desc: 'Find skilled people', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B5D3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ) },
  { href: '/rent', title: 'Rent', desc: 'Find a place', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B5D3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  ) },
  { href: '/learn', title: 'Learn', desc: 'Build your skills', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B5D3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 2 8l10 5 10-5-10-5Z" /><path d="M6 10.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-5.5" />
    </svg>
  ) },
  { href: '/messages', title: 'Messages', desc: 'Your conversations', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B5D3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 9 9 0 0 1-3.6-.7L3 21l1.8-5.4A8.4 8.4 0 1 1 21 11.5Z" />
    </svg>
  ) },
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [popular, setPopular] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);

  useEffect(() => {
    if (session) {
      fetch('/api/popular')
        .then((res) => res.json())
        .then((data) => {
          setPopular(Array.isArray(data) ? data : []);
          setLoadingPopular(false);
        });
    }
  }, [session]);

  function handleSearch(e) {
    e.preventDefault();
    router.push(`/search${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  }

  if (status === 'loading') {
    return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Loading...</p></main>;
  }

  if (!session) {
    return (
      <main style={{ maxWidth: 420, margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
        <img src="/logo.png" alt="Pavia" style={{ height: 60, marginBottom: 24 }} />
        <h1 style={{ color: 'var(--color-primary)', marginBottom: 8 }}>Welcome to Pavia</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Work, rent, and learn — all in one place.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
          <Link href="/login"><button>Log in</button></Link>
          <Link href="/register"><button className="btn-secondary">Sign up</button></Link>
        </div>
      </main>
    );
  }

  const firstName = (session.user.name || 'there').split(' ')[0];

  return (
    <main className="page-container">
      <h1 style={{ color: 'var(--color-text)', marginBottom: 4 }}>Hi, {firstName} 👋</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 20 }}>What are you looking for today?</p>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        <input
          placeholder="Search skills, places, courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, minWidth: 0 }}
        />
        <button type="submit" style={{ flexShrink: 0 }}>Search</button>
      </form>

      <h2 style={{ color: 'var(--color-text)', marginBottom: 14 }}>Explore Pavia</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
        {categories.map((c) => (
          <Link key={c.href} href={c.href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: '#EAF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {c.icon}
              </div>
              <div>
                <h3 style={{ color: 'var(--color-text)' }}>{c.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{c.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!loadingPopular && popular.length > 0 && (
        <>
          <h2 style={{ color: 'var(--color-text)', marginBottom: 14 }}>Popular near you</h2>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, marginBottom: 8 }}>
            {popular.map((item) => (
              <Link key={`${item.kind}-${item.id}`} href={item.href} style={{ textDecoration: 'none', flexShrink: 0, width: 160 }}>
                <div className="card" style={{ padding: 10 }}>
                  {item.photo ? (
                    <img src={item.photo} alt={item.title} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
                  ) : (
                    <div style={{
                      width: '100%', height: 90, borderRadius: 8, marginBottom: 8,
                      background: '#EAF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        {item.kind === 'work' ? (
                          <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>
                        ) : (
                          <><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></>
                        )}
                      </svg>
                    </div>
                  )}
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>{item.subtitle}</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)' }}>{item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
    }
