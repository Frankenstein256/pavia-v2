'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState({ skills: [], rentals: [], courses: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runSearch(initialQ);
  }, [initialQ]);

  async function runSearch(q) {
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  const totalResults = results.skills.length + results.rentals.length + results.courses.length;

  return (
    <main className="page-container">
      <h1 style={{ color: 'var(--color-primary)', marginBottom: 16 }}>Search</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          placeholder="Search skills, places, courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, minWidth: 0 }}
        />
        <button type="submit" style={{ flexShrink: 0 }}>Search</button>
      </form>

      {loading && <p style={{ color: 'var(--color-text-muted)' }}>Searching...</p>}

      {!loading && totalResults === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: 4 }}>No results</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Try a different search term.</p>
        </div>
      )}

      {!loading && results.skills.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ marginBottom: 10 }}>Work ({results.skills.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {results.skills.map((s) => (
              <Link key={s.id} href="/work" style={{ textDecoration: 'none' }}>
                <div className="card">
                  <span className="badge badge-green" style={{ marginBottom: 4 }}>{s.category}</span>
                  <h3 style={{ margin: '4px 0 2px' }}>{s.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{s.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!loading && results.rentals.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ marginBottom: 10 }}>Rent ({results.rentals.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {results.rentals.map((r) => (
              <Link key={r.id} href={`/rent/${r.id}`} style={{ textDecoration: 'none' }}>
                <div className="card">
                  <span className="badge badge-green" style={{ marginBottom: 4 }}>
                    {r.type === 'room' ? 'Room' : 'Whole place'}
                  </span>
                  <h3 style={{ margin: '4px 0 2px' }}>{r.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>📍 {r.location} · GHS {r.price}/mo</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!loading && results.courses.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ marginBottom: 10 }}>Learn ({results.courses.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {results.courses.map((c) => (
              <Link key={c.id} href={`/learn/${c.id}`} style={{ textDecoration: 'none' }}>
                <div className="card">
                  {c.category && <span className="badge badge-gold" style={{ marginBottom: 4 }}>{c.category}</span>}
                  <h3 style={{ margin: '4px 0 2px' }}>{c.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{c.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
  }
