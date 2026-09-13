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

  if (loading || !course) {
    return <p style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading...</p>;
  }
  if (!enrollment?.completedAt) {
    return <p style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>You haven't completed this course yet.</p>;
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2.5rem 1rem' }}>
      <div style={{
        background: 'var(--color-surface)',
        border: '3px solid var(--color-primary)',
        borderRadius: 'var(--radius)',
        padding: '3rem 2rem',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 12, left: 12, right: 12, bottom: 12,
          border: '1px solid var(--color-accent)',
          borderRadius: '6px',
          pointerEvents: 'none',
        }} />

        <p style={{
          color: 'var(--color-accent)',
          letterSpacing: '3px',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
        }}>
          CERTIFICATE OF COMPLETION
        </p>

        <div style={{ width: 60, height: 3, background: 'var(--color-accent)', margin: '0.75rem auto 2rem auto' }} />

        <p style={{ color: 'var(--color-text-muted)', margin: '0 0 0.4rem 0' }}>This certifies that</p>
        <h1 style={{ color: 'var(--color-primary)', margin: '0 0 1.5rem 0', fontSize: '2rem' }}>
          {session.user.name || session.user.email}
        </h1>

        <p style={{ color: 'var(--color-text-muted)', margin: '0 0 0.4rem 0' }}>has successfully completed</p>
        <h2 style={{ color: 'var(--color-text)', margin: '0 0 1.5rem 0' }}>{course.title}</h2>

        <p style={{ color: 'var(--color-text-muted)', margin: '0 0 0.25rem 0' }}>
          Score: <strong style={{ color: 'var(--color-text)' }}>{enrollment.testScore}%</strong>
        </p>
        <p style={{ color: 'var(--color-text-muted)', margin: '0 0 2rem 0' }}>
          Completed on {new Date(enrollment.completedAt).toLocaleDateString()}
        </p>

        <p style={{
          color: 'var(--color-primary)',
          fontWeight: 700,
          fontSize: '1.1rem',
          letterSpacing: '2px',
          margin: 0,
        }}>
          PAVIA
        </p>
      </div>
    </div>
  );
            }
