'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const statusStyles = {
  pending: { bg: '#FFF4E0', color: '#9A6A00', label: 'Pending Review' },
  approved: { bg: '#E6F4EC', color: '#0F5132', label: 'Approved' },
  rejected: { bg: '#FBE9E7', color: '#B3261E', label: 'Rejected' },
};

export default function MyCoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch('/api/my-courses')
        .then(res => res.json())
        .then(data => {
          setCourses(Array.isArray(data) ? data : []);
          setLoading(false);
        });
    }
  }, [session]);

  if (!session) {
    return <p style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Please log in.</p>;
  }
  if (loading) {
    return <p style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading...</p>;
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, color: 'var(--color-primary)' }}>My Courses</h1>
        <Link href="/learn/submit">
          <button style={{ padding: '0.6rem 1.2rem', fontSize: '0.95rem' }}>+ Submit New</button>
        </Link>
      </div>

      {courses.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)' }}>You haven't submitted any courses yet.</p>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {courses.map(course => {
          const s = statusStyles[course.status] || statusStyles.pending;
          return (
            <div
              key={course.id}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                <h3 style={{ margin: '0 0 0.4rem 0' }}>{course.title}</h3>
                <span style={{
                  background: s.bg,
                  color: s.color,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.7rem',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                }}>
                  {s.label}
                </span>
              </div>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                {course.description}
              </p>
              {course.status === 'approved' && (
                <Link href={`/learn/${course.id}`} style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                  View on Learn →
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
        }
