'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function SavedPage() {
  const { data: session } = useSession();
  const [skills, setSkills] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch('/api/saved')
        .then((res) => res.json())
        .then((data) => {
          setSkills(data.skills || []);
          setRentals(data.rentals || []);
          setLoading(false);
        });
    }
  }, [session]);

  if (!session) return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Please log in.</p></main>;
  if (loading) return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Loading...</p></main>;

  const all = [...skills, ...rentals];

  return (
    <main className="page-container">
      <h1 style={{ color: 'var(--color-primary)', marginBottom: 20 }}>Saved</h1>

      {all.length === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: 4 }}>Nothing saved yet</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Tap the heart on any listing to save it here.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {all.map((item) => {
          const href = item.kind === 'work' ? '/work' : `/rent/${item.id}`;
          const photos = item.kind === 'rent' && item.photoUrls ? item.photoUrls.split(',').map((p) => p.trim()) : [];
          return (
            <Link key={`${item.kind}-${item.id}`} href={href} style={{ textDecoration: 'none' }}>
              <div className="card">
                {item.kind === 'rent' && photos[0] && (
                  <img src={photos[0]} alt={item.title} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }} />
                )}
                <span className="badge badge-green" style={{ marginBottom: 6 }}>
                  {item.kind === 'work' ? 'Work' : 'Rent'}
                </span>
                <h3 style={{ color: 'var(--color-text)', margin: '4px 0 2px' }}>{item.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 6 }}>{item.description}</p>
                <p style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                  GH₵{item.price}{item.kind === 'rent' ? '/mo' : item.priceType === 'hourly' ? '/hr' : ''}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
         }
