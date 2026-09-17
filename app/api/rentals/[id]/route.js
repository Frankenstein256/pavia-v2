import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
  const listing = await prisma.rentListing.findUnique({
    where: { id: params.id },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  if (!listing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(listing);
}
