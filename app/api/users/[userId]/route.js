import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
      skillListings: { select: { id: true, title: true, category: true } },
      reviewsReceived: {
        orderBy: { createdAt: 'desc' },
        include: { reviewer: { select: { name: true } } },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const ratings = user.reviewsReceived.map((r) => r.rating);
  const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;

  return NextResponse.json({
    ...user,
    avgRating,
    reviewCount: ratings.length,
  });
}
