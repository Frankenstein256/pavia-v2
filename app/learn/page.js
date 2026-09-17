'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LearnPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Learn</h1>
      </div>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>
        Build useful skills and move forward.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <Link href="/learn/my-courses" style={{ flex: 1 }}>
          <button className="btn-secondary" style={{ width: '100%', fontSize: 14 }}>My Courses</button>
        </Link>
        <Link href="/learn/submit" style={{ flex: 1 }}>
          <button style={{ width: '100%', fontSize: 14 }}>+ Submit a Course</button>
        </Link>
      </div>

      {loading && <p style={{ color: 'var(--color-text-muted)' }}>Loading courses...</p>}

      {!loading && courses.length === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: 4 }}>No courses yet</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Check back soon, or submit one yourself.</p>
        </div>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        {courses.map(course => (
          <Link key={course.id} href={`/learn/${course.id}`} style={{ textDecoration: 'none' }}>
            <div className="card">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }}
                />
              ) : (
                <div style={{
                  width: '100%', height: 100, borderRadius: 10, marginBottom: 10,
                  background: '#EAF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3 2 8l10 5 10-5-10-5Z" /><path d="M6 10.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-5.5" />
                  </svg>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <h3 style={{ color: 'var(--color-text)', margin: '0 0 4px 0' }}>{course.title}</h3>
                {course.category && <span className="badge badge-gold">{course.category}</span>}
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: 0 }}>{course.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
          }
