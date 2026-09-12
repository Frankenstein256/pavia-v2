import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: params.courseId } },
  });

  return NextResponse.json(enrollment);
}

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { videoWatched, answers } = await req.json();

  const data = {};

  if (videoWatched) {
    data.videoWatched = true;
  }

  if (answers) {
    const questions = await prisma.question.findMany({
      where: { courseId: params.courseId },
      orderBy: { order: 'asc' },
    });

    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });

    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 100;
    data.testScore = score;
    if (score >= 70) {
      data.completedAt = new Date();
    }
  }

  const enrollment = await prisma.enrollment.update({
    where: { userId_courseId: { userId: session.user.id, courseId: params.courseId } },
    data,
  });

  return NextResponse.json(enrollment);
}
