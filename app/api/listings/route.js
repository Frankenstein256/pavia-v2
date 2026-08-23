import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const listings = await prisma.skillListing.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, image: true } } },
  });
  return NextResponse.json(listings);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { title, description, category, price, priceType, location } = await req.json();

  if (!title || !description || !category || !priceType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const listing = await prisma.skillListing.create({
    data: {
      userId: session.user.id,
      title,
      description,
      category,
      price: price ? parseFloat(price) : null,
      priceType,
      location,
    },
  });

  return NextResponse.json(listing);
}
