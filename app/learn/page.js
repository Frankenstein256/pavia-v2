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
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Learn</h1>
        <Link href="/learn/submit">
          <button style={{ padding: '8px 16px' }}>+ Submit a Course</button>
        </Link>
      </div>

      {loading && <p>Loading courses...</p>}
      {!loading && courses.length === 0 && <p>No courses available yet.</p>}

      <div style={{ display: 'grid', gap: 16 }}>
        {courses.map(course => (
          <Link key={course.id} href={`/learn/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
              <h3 style={{ margin: '0 0 8px 0' }}>{course.title}</h3>
              {course.category && <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: 14 }}>{course.category}</p>}
              <p style={{ margin: 0 }}>{course.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
                }
