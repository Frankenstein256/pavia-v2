'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <nav style={{
      display: 'flex',
      gap: '1.5rem',
      padding: '1rem',
      borderBottom: '1px solid #E5E5E0',
      background: '#FFFFFF',
      fontFamily: 'sans-serif',
      alignItems: 'center',
    }}>
      <Link href="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#0F5132' }}>
        Pavia
      </Link>
      <Link href="/work" style={{ textDecoration: 'none', color: '#1A1A1A' }}>
        Work
      </Link>
      <Link href="/messages" style={{ textDecoration: 'none', color: '#1A1A1A' }}>
        Messages
      </Link>
    </nav>
  );
  }
