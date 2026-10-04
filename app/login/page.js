'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      window.location.href = '/';
    }
  }, [status]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      window.location.href = '/';
    } else {
      setError('Invalid email or password');
    }
  }

  if (status === 'loading' || status === 'authenticated') {
    return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Loading...</p></main>;
  }

  return (
    <main className="page-container" style={{ maxWidth: 400, marginTop: '4rem' }}>
      <h1 style={{ color: 'var(--color-primary)', marginBottom: 20 }}>Log in to Pavia</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <div style={{ margin: '1.5rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>or</div>

      <button
        onClick={() => signIn('google', { callbackUrl: '/' })}
        className="btn-secondary"
        style={{ width: '100%' }}
      >
        Continue with Google
      </button>

      <p style={{ marginTop: '1.5rem', color: 'var(--color-text-muted)' }}>
        Don't have an account? <a href="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign up</a>
      </p>
    </main>
  );
            }
