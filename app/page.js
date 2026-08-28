'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <main style={{ padding: '2rem' }}>Loading...</main>;
  }

  if (!session) {
    return (
      <main style={{ maxWidth: 500, margin: '4rem auto', padding: '1rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>Welcome to Pavia</h1>
        <p style={{ color: '#666' }}>Save, work, rent, and learn — all in one place.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Link href="/login"><button style={{ padding: '0.7rem 1.5rem', cursor: 'pointer' }}>Log in</button></Link>
          <Link href="/register"><button style={{ padding: '0.7rem 1.5rem', cursor: 'pointer' }}>Sign up</button></Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Hi, {session.user.name || 'there'}</h1>
        <button onClick={() => signOut({ callbackUrl: '/' })} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Log out
        </button>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Link href="/work" style={{ textDecoration: 'none' }}>
          <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '1.2rem' }}>
            <h3 style={{ margin: 0 }}>Work</h3>
            <p style={{ margin: '0.3rem 0 0', color: '#666' }}>Find skilled people or list your own skill</p>
          </div>
        </Link>

        <Link href="/messages" style={{ textDecoration: 'none' }}>
          <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '1.2rem' }}>
            <h3 style={{ margin: 0 }}>Messages</h3>
            <p style={{ margin: '0.3rem 0 0', color: '#666' }}>Your conversations</p>
          </div>
        </Link>

        <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '1.2rem', opacity: 0.5 }}>
          <h3 style={{ margin: 0 }}>Save</h3>
          <p style={{ margin: '0.3rem 0 0', color: '#666' }}>Coming soon</p>
        </div>
      </div>
    </main>
  );
    }
