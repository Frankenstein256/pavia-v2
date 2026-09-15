'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session === null) router.push('/login');
  }, [session, router]);

  async function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });

    if (res.ok) {
      const data = await res.json();
      const saveRes = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: data.url }),
      });
      if (saveRes.ok) {
        await update();
      } else {
        setError('Failed to save photo.');
      }
    } else {
      setError('Failed to upload photo.');
    }

    setUploading(false);
  }

  if (!session) return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Loading...</p></main>;

  return (
    <main className="page-container">
      <h1 style={{ color: 'var(--color-primary)', marginBottom: 24 }}>Profile</h1>

      <div className="card" style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 12px' }}>
          {session.user.image ? (
            <img
              src={session.user.image}
              alt="Profile"
              style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: 90, height: 90, borderRadius: '50%',
              background: 'var(--color-primary)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 700,
            }}>
              {(session.user.name || session.user.email || '?')[0].toUpperCase()}
            </div>
          )}
        </div>

        <h2 style={{ marginBottom: 4 }}>{session.user.name || 'No name set'}</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 16 }}>{session.user.email}</p>

        <label className="btn-secondary" style={{
          display: 'inline-block', padding: '8px 16px', fontSize: 14, cursor: 'pointer', fontWeight: 600, borderRadius: 10,
        }}>
          {uploading ? 'Uploading...' : 'Change photo'}
          <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} disabled={uploading} />
        </label>
        {error && <p style={{ color: 'var(--color-danger)', fontSize: 13, marginTop: 8 }}>{error}</p>}
      </div>

      <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-secondary" style={{ width: '100%' }}>
        Log out
      </button>
    </main>
  );
    }
