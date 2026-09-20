import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: { questions: { orderBy: { order: 'asc' } } },
  });

  if (!course) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(course);
}
