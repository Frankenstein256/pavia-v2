import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { listingId, rentListingId } = await req.json();

  if (!listingId && !rentListingId) {
    return NextResponse.json({ error: 'Missing listingId or rentListingId' }, { status: 400 });
  }

  let sellerId;

  if (listingId) {
    const listing = await prisma.skillListing.findUnique({ where: { id: listingId } });
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    sellerId = listing.userId;
  } else {
    const listing = await prisma.rentListing.findUnique({ where: { id: rentListingId } });
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    sellerId = listing.userId;
  }

  if (sellerId === session.user.id) {
    return NextResponse.json({ error: "Can't message your own listing" }, { status: 400 });
  }

  const where = listingId
    ? { listingId_buyerId: { listingId, buyerId: session.user.id } }
    : { rentListingId_buyerId: { rentListingId, buyerId: session.user.id } };

  let conversation = await prisma.conversation.findUnique({ where });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        listingId: listingId || null,
        rentListingId: rentListingId || null,
        buyerId: session.user.id,
        sellerId,
      },
    });
  }

  return NextResponse.json(conversation);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }],
    },
    orderBy: { createdAt: 'desc' },
    include: {
      listing: { select: { title: true } },
      rentListing: { select: { title: true } },
      buyer: { select: { id: true, name: true, email: true } },
      seller: { select: { id: true, name: true, email: true } },
    },
  });

  const shaped = conversations.map((c) => {
    const otherPerson = c.buyerId === session.user.id ? c.seller : c.buyer;
    return {
      id: c.id,
      createdAt: c.createdAt,
      listingTitle: c.listing?.title || c.rentListing?.title || 'Listing',
      otherPersonName: otherPerson?.name || otherPerson?.email || 'Unknown',
    };
  });

  return NextResponse.json(shaped);
}
