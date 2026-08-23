import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function WorkPage() {
  const listings = await prisma.skillListing.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true } } },
  });

  return (
    <main style={{ maxWidth: 700, margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Find skilled people</h1>
        <Link href="/work/new">
          <button style={{ padding: '0.6rem 1rem', cursor: 'pointer' }}>+ List your skill</button>
        </Link>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {listings.length === 0 && <p>No listings yet. Be the first to post one.</p>}

        {listings.map((listing) => (
          <div key={listing.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ margin: 0 }}>{listing.title}</h3>
            <p style={{ color: '#666', margin: '0.3rem 0' }}>
              {listing.category} {listing.location ? `· ${listing.location}` : ''}
            </p>
            <p style={{ margin: '0.5rem 0' }}>{listing.description}</p>
            <p style={{ fontWeight: 'bold', margin: 0 }}>
              {listing.price ? `GHS ${listing.price}` : 'Price negotiable'}
              {listing.priceType === 'hourly' ? ' /hr' : ''}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
              Posted by {listing.user?.name || 'Anonymous'}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
