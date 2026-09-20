import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ skills: [], rentals: [], courses: [] });
  }

  const [skills, rentals, courses] = await Promise.all([
    prisma.skillListing.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      include: { user: { select: { id: true, name: true, image: true } } },
      take: 10,
    }),
    prisma.rentListing.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { location: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 10,
    }),
    prisma.course.findMany({
      where: {
        status: 'approved',
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 10,
    }),
  ]);

  return NextResponse.json({ skills, rentals, courses });
                                  }
