'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function MyListingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [skills, setSkills] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  function load() {
    fetch('/api/my-listings')
      .then((res) => res.json())
      .then((data) => {
        setSkills(data.skills || []);
        setRentals(data.rentals || []);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (session) load();
  }, [session]);

  async function handleDelete(kind, id) {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    setDeletingId(id);
    const url = kind === 'work' ? `/api/listings/${id}` : `/api/rentals/${id}`;
    await fetch(url, { method: 'DELETE' });
    setDeletingId(null);
    load();
  }

  if (!session) return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Please log in.</p></main>;
  if (loading) return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Loading...</p></main>;

  const all = [...skills, ...rentals];

  return (
    <main className="page-container">
      <h1 style={{ color: 'var(--color-primary)', marginBottom: 20 }}>My Listings</h1>

      {all.length === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: 4 }}>No listings yet</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Post a skill or a place to see it here.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {all.map((item) => (
          <div key={`${item.kind}-${item.id}`} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div>
                <span className="badge badge-green" style={{ marginBottom: 6 }}>
                  {item.kind === 'work' ? 'Work' : 'Rent'}
                </span>
                <h3 style={{ margin: '4px 0 2px' }}>{item.title}</h3>
              </div>
              <p style={{ fontWeight: 700, color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>
                GH₵{item.price}{item.priceType === 'hourly' ? '/hr' : item.kind === 'rent' ? '/mo' : ''}
              </p>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 12 }}>{item.description}</p>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => router.push(`/profile/my-listings/edit/${item.kind}/${item.id}`)}
                className="btn-secondary"
                style={{ fontSize: 13, padding: '6px 14px' }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.kind, item.id)}
                disabled={deletingId === item.id}
                style={{ fontSize: 13, padding: '6px 14px', background: 'var(--color-danger)' }}
              >
                {deletingId === item.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
