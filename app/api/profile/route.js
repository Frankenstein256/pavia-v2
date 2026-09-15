import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { image } = await req.json();
  if (!image) {
    return NextResponse.json({ error: 'Missing image' }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { image },
  });

  return NextResponse.json({ image: user.image });
}
