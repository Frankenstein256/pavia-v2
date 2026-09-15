import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { revieweeId, rating, comment } = await req.json();

  if (!revieweeId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid review data' }, { status: 400 });
  }

  if (revieweeId === session.user.id) {
    return NextResponse.json({ error: "Can't review yourself" }, { status: 400 });
  }

  const review = await prisma.review.upsert({
    where: { reviewerId_revieweeId: { reviewerId: session.user.id, revieweeId } },
    update: { rating, comment: comment || null },
    create: { reviewerId: session.user.id, revieweeId, rating, comment: comment || null },
  });

  return NextResponse.json(review);
}
