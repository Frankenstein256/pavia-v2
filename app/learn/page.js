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
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, color: 'var(--color-primary)' }}>Learn</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/learn/my-courses">
            <button style={{
              background: 'var(--color-surface)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              padding: '0.6rem 1.2rem',
              fontSize: '0.95rem',
            }}>
              My Courses
            </button>
          </Link>
          <Link href="/learn/submit">
            <button style={{ padding: '0.6rem 1.2rem', fontSize: '0.95rem' }}>+ Submit a Course</button>
          </Link>
        </div>
      </div>

      {loading && <p style={{ color: 'var(--color-text-muted)' }}>Loading courses...</p>}
      {!loading && courses.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)' }}>No courses available yet.</p>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {courses.map(course => (
          <Link
            key={course.id}
            href={`/learn/${course.id}`}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              padding: '1.25rem',
              transition: 'border-color 0.15s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                <h3 style={{ margin: '0 0 0.4rem 0', color: 'var(--color-text)' }}>{course.title}</h3>
                {course.category && (
                  <span style={{
                    background: 'var(--color-accent)',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    whiteSpace: 'nowrap',
                  }}>
                    {course.category}
                  </span>
                )}
              </div>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                {course.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
        }
