import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const [skills, rentals] = await Promise.all([
    prisma.skillListing.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.rentListing.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return NextResponse.json({
    skills: skills.map((s) => ({ ...s, kind: 'work' })),
    rentals: rentals.map((r) => ({ ...r, kind: 'rent' })),
  });
}
