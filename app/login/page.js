'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      router.push('/');
    } else {
      setError('Invalid email or password');
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: '4rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Log in to Pavia</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '0.6rem' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '0.6rem' }}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ padding: '0.7rem', cursor: 'pointer' }}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>or</div>

      <button
        onClick={() => signIn('google', { callbackUrl: '/' })}
        style={{ width: '100%', padding: '0.7rem', cursor: 'pointer' }}
      >
        Continue with Google
      </button>

      <p style={{ marginTop: '1.5rem' }}>
        Don't have an account? <a href="/register">Sign up</a>
      </p>
    </main>
  );
}
