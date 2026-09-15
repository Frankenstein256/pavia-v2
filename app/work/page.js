import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import WorkList from './WorkList';
export const dynamic = 'force-dynamic';

export default async function WorkPage() {
  const listings = await prisma.skillListing.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return (
    <main className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Find skilled people</h1>
        <Link href="/work/new">
          <button style={{ fontSize: 14, padding: '8px 14px' }}>+ List</button>
        </Link>
      </div>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 20 }}>
        Discover people who can get the job done.
      </p>

      <WorkList listings={listings} />
    </main>
  );
}
