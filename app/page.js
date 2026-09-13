'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const cardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius)',
  padding: '1.2rem',
};

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <main style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading...</main>;
  }

  if (!session) {
    return (
      <main style={{ maxWidth: 500, margin: '4rem auto', padding: '1rem', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Welcome to Pavia</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Work, rent, and learn — all in one place.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Link href="/login"><button style={{ padding: '0.7rem 1.5rem' }}>Log in</button></Link>
          <Link href="/register">
            <button style={{
              background: 'var(--color-surface)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              padding: '0.7rem 1.5rem',
            }}>
              Sign up
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--color-text)' }}>Hi, {session.user.name || 'there'}</h1>
        <button onClick={() => signOut({ callbackUrl: '/' })} style={{ padding: '0.5rem 1rem' }}>
          Log out
        </button>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Link href="/work" style={{ textDecoration: 'none' }}>
          <div style={cardStyle}>
            <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Work</h3>
            <p style={{ margin: '0.3rem 0 0', color: 'var(--color-text-muted)' }}>Find skilled people or list your own skill</p>
          </div>
        </Link>

        <Link href="/rent" style={{ textDecoration: 'none' }}>
          <div style={cardStyle}>
            <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Rent</h3>
            <p style={{ margin: '0.3rem 0 0', color: 'var(--color-text-muted)' }}>Find a place or list one for rent</p>
          </div>
        </Link>

        <Link href="/learn" style={{ textDecoration: 'none' }}>
          <div style={cardStyle}>
            <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Learn</h3>
            <p style={{ margin: '0.3rem 0 0', color: 'var(--color-text-muted)' }}>Watch courses and earn certificates</p>
          </div>
        </Link>

        <Link href="/messages" style={{ textDecoration: 'none' }}>
          <div style={cardStyle}>
            <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Messages</h3>
            <p style={{ margin: '0.3rem 0 0', color: 'var(--color-text-muted)' }}>Your conversations</p>
          </div>
        </Link>
      </div>
    </main>
  );
    }
