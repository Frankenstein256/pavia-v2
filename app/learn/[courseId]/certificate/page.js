'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CertificatePage() {
  const { courseId } = useParams();
  const { data: session } = useSession();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/courses/${courseId}`)
      .then(res => res.json())
      .then(setCourse);
  }, [courseId]);

  useEffect(() => {
    if (session) {
      fetch(`/api/enrollments/${courseId}`)
        .then(res => res.json())
        .then(data => {
          setEnrollment(data);
          setLoading(false);
        });
    }
  }, [session, courseId]);

  if (loading || !course) return <p style={{ padding: 24 }}>Loading...</p>;
  if (!enrollment?.completedAt) return <p style={{ padding: 24 }}>You haven't completed this course yet.</p>;

  return (
    <div style={{ maxWidth: 700, margin: '60px auto', padding: 16 }}>
      <div style={{ border: '8px double #1a5c38', padding: 40, textAlign: 'center' }}>
        <h2 style={{ color: '#1a5c38', letterSpacing: 2 }}>CERTIFICATE OF COMPLETION</h2>
        <p style={{ margin: '24px 0 4px 0' }}>This certifies that</p>
        <h1 style={{ margin: '0 0 24px 0' }}>{session.user.name || session.user.email}</h1>
        <p style={{ margin: '0 0 4px 0' }}>has successfully completed</p>
        <h2 style={{ margin: '0 0 24px 0' }}>{course.title}</h2>
        <p>Score: {enrollment.testScore}%</p>
        <p>Completed on: {new Date(enrollment.completedAt).toLocaleDateString()}</p>
        <p style={{ marginTop: 32, fontWeight: 'bold', color: '#1a5c38' }}>PAVIA</p>
      </div>
    </div>
  );
            }
