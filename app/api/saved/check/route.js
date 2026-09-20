import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ listingIds: [], rentListingIds: [] });
  }

  const saved = await prisma.savedListing.findMany({
    where: { userId: session.user.id },
    select: { listingId: true, rentListingId: true },
  });

  return NextResponse.json({
    listingIds: saved.filter((s) => s.listingId).map((s) => s.listingId),
    rentListingIds: saved.filter((s) => s.rentListingId).map((s) => s.rentListingId),
  });
}
