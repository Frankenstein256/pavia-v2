'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AppHeader() {
  const { data: session } = useSession();
  if (!session) return null;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src="/logo.png" alt="Pavia" style={{ height: 34, width: 'auto' }} />
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        style={{
          background: 'transparent',
          color: 'var(--color-text-muted)',
          fontSize: 13,
          fontWeight: 600,
          padding: '6px 10px',
        }}
      >
        Log out
      </button>
    </header>
  );
    }
