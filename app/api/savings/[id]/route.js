import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const goal = await prisma.savingsGoal.findUnique({ where: { id: params.id } });
  if (!goal || goal.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { amount } = await req.json();
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  const updated = await prisma.savingsGoal.update({
    where: { id: params.id },
    data: { savedAmount: goal.savedAmount + parseFloat(amount) },
  });

  return NextResponse.json(updated);
    }
