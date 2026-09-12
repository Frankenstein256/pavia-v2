import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const courses = await prisma.course.findMany({
    where: { status: 'approved' },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(courses);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { title, description, category, thumbnail, videoUrl, questions } = await req.json();

  if (!title || !description || !videoUrl) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const course = await prisma.course.create({
    data: {
      userId: session.user.id,
      title,
      description,
      category: category || null,
      thumbnail: thumbnail || null,
      videoUrl,
      status: 'pending',
      questions: {
        create: (questions || []).map((q, i) => ({
          text: q.text,
          options: JSON.stringify(q.options),
          correctIndex: q.correctIndex,
          order: i,
        })),
      },
    },
  });

  return NextResponse.json(course);
            }
