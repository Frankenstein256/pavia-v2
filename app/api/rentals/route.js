import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const listings = await prisma.rentListing.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true } } },
  });
  return NextResponse.json(listings);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { title, description, type, price, location, photoUrls } = await req.json();

  if (!title || !description || !type || !price || !location) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const listing = await prisma.rentListing.create({
    data: {
      userId: session.user.id,
      title,
      description,
      type,
      price: parseFloat(price),
      location,
      photoUrls: photoUrls || '',
    },
  });

  return NextResponse.json(listing);
      }
