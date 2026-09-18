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
    return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Please log in.</p></main>;
  }
  if (loading) {
    return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Loading...</p></main>;
  }

  return (
    <main className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ color: 'var(--color-primary)' }}>My Courses</h1>
        <Link href="/learn/submit">
          <button style={{ fontSize: 14, padding: '8px 14px' }}>+ Submit New</button>
        </Link>
      </div>

      {courses.length === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: 4 }}>No submissions yet</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Courses you submit will show up here.</p>
        </div>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        {courses.map(course => {
          const s = statusStyles[course.status] || statusStyles.pending;
          return (
            <div key={course.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <h3 style={{ margin: '0 0 4px 0' }}>{course.title}</h3>
                <span style={{
                  background: s.bg, color: s.color, fontSize: 12, fontWeight: 700,
                  padding: '4px 11px', borderRadius: 999, whiteSpace: 'nowrap',
                }}>
                  {s.label}
                </span>
              </div>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 14 }}>
                {course.description}
              </p>
              {course.status === 'approved' && (
                <Link href={`/learn/${course.id}`} style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 13, textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>
                  View on Learn →
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
        }
