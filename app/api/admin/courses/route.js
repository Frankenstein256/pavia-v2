import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

function isAdmin(session) {
  return session?.user?.email === process.env.ADMIN_EMAIL;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const courses = await prisma.course.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'asc' },
    include: { questions: true },
  });

  return NextResponse.json(courses);
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { courseId, status } = await req.json();

  if (!courseId || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const course = await prisma.course.update({
    where: { id: courseId },
    data: { status },
  });

  return NextResponse.json(course);
    }
