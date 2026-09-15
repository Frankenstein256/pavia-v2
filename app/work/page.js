import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import WorkList from './WorkList';
export const dynamic = 'force-dynamic';

export default async function WorkPage() {
  const listings = await prisma.skillListing.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  const userIds = [...new Set(listings.map((l) => l.userId))];
  const reviews = await prisma.review.findMany({
    where: { revieweeId: { in: userIds } },
    select: { revieweeId: true, rating: true },
  });

  const ratingMap = {};
  userIds.forEach((id) => {
    const userReviews = reviews.filter((r) => r.revieweeId === id);
    if (userReviews.length > 0) {
      const avg = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
      ratingMap[id] = { avgRating: avg, reviewCount: userReviews.length };
    }
  });

  const listingsWithRatings = listings.map((l) => ({
    ...l,
    userRating: ratingMap[l.userId] || null,
  }));

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

      <WorkList listings={listingsWithRatings} />
    </main>
  );
    }
