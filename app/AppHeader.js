'use client';
import { useSession } from 'next-auth/react';
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

      <Link href="/profile" style={{ textDecoration: 'none' }}>
        {session.user.image ? (
          <img
            src={session.user.image}
            alt="Profile"
            style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'var(--color-primary)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700,
          }}>
            {(session.user.name || session.user.email || '?')[0].toUpperCase()}
          </div>
        )}
      </Link>
    </header>
  );
        }
