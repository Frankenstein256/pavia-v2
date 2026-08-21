'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Something went wrong');
      return;
    }

    const signInRes = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (signInRes?.ok) {
      router.push('/');
    } else {
      router.push('/login');
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: '4rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Create your Pavia account</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '0.6rem' }}
        />
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
          {loading ? 'Creating account...' : 'Sign up'}
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
        Already have an account? <a href="/login">Log in</a>
      </p>
    </main>
  );
                            }
