import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const saved = await prisma.savedListing.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  const skillIds = saved.filter((s) => s.listingId).map((s) => s.listingId);
  const rentIds = saved.filter((s) => s.rentListingId).map((s) => s.rentListingId);

  const [skills, rentals] = await Promise.all([
    prisma.skillListing.findMany({ where: { id: { in: skillIds } } }),
    prisma.rentListing.findMany({ where: { id: { in: rentIds } } }),
  ]);

  return NextResponse.json({
    skills: skills.map((s) => ({ ...s, kind: 'work' })),
    rentals: rentals.map((r) => ({ ...r, kind: 'rent' })),
  });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { listingId, rentListingId } = await req.json();
  if (!listingId && !rentListingId) {
    return NextResponse.json({ error: 'Missing listingId or rentListingId' }, { status: 400 });
  }

  const saved = await prisma.savedListing.create({
    data: {
      userId: session.user.id,
      listingId: listingId || null,
      rentListingId: rentListingId || null,
    },
  });

  return NextResponse.json(saved);
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { listingId, rentListingId } = await req.json();

  await prisma.savedListing.deleteMany({
    where: {
      userId: session.user.id,
      ...(listingId ? { listingId } : { rentListingId }),
    },
  });

  return NextResponse.json({ success: true });
}
