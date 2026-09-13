'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

const linkStyle = { textDecoration: 'none', color: 'var(--color-text)', whiteSpace: 'nowrap' };

export default function Navbar() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <nav style={{
      display: 'flex',
      gap: '1.25rem',
      padding: '0.85rem 1rem',
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
      alignItems: 'center',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
    }}>
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
        <div style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'var(--color-primary)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '0.95rem',
          border: '2px solid var(--color-accent)',
        }}>
          P
        </div>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.5px' }}>
          PAVIA
        </span>
      </Link>
      <Link href="/work" style={linkStyle}>Work</Link>
      <Link href="/messages" style={linkStyle}>Messages</Link>
      <Link href="/rent" style={linkStyle}>Rent</Link>
      <Link href="/learn" style={linkStyle}>Learn</Link>
    </nav>
  );
}
