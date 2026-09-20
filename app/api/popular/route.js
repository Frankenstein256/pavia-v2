import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const [skills, rentals] = await Promise.all([
    prisma.skillListing.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { id: true, title: true, category: true, price: true, priceType: true },
    }),
    prisma.rentListing.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { id: true, title: true, type: true, price: true, photoUrls: true },
    }),
  ]);

  const items = [
    ...skills.map((s) => ({
      id: s.id, kind: 'work', title: s.title, subtitle: s.category,
      price: s.price ? `GH₵${s.price}${s.priceType === 'hourly' ? '/hr' : ''}` : 'Negotiable',
      href: `/work`,
    })),
    ...rentals.map((r) => ({
      id: r.id, kind: 'rent', title: r.title, subtitle: r.type === 'room' ? 'Room' : 'Whole place',
      price: `GH₵${r.price}/mo`,
      photo: r.photoUrls ? r.photoUrls.split(',')[0].trim() : null,
      href: `/rent/${r.id}`,
    })),
  ];

  return NextResponse.json(items);
      }
