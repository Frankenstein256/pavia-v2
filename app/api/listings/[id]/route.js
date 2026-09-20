import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req, { params }) {
  const listing = await prisma.skillListing.findUnique({
    where: { id: params.id },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  if (!listing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(listing);
}

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const listing = await prisma.skillListing.findUnique({ where: { id: params.id } });
  if (!listing || listing.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  const { title, description, category, price, priceType, location } = await req.json();

  const updated = await prisma.skillListing.update({
    where: { id: params.id },
    data: {
      title,
      description,
      category,
      price: price ? parseFloat(price) : null,
      priceType,
      location,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const listing = await prisma.skillListing.findUnique({ where: { id: params.id } });
  if (!listing || listing.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  await prisma.skillListing.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
    }
