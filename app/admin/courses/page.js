'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminCoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    fetch('/api/admin/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (session) load();
  }, [session]);

  async function handleDecision(courseId, status) {
    await fetch('/api/admin/courses', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, status }),
    });
    load();
  }

  if (!session) return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Please log in.</p></main>;
  if (loading) return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Loading...</p></main>;

  return (
    <main className="page-container">
      <h1 style={{ color: 'var(--color-primary)', marginBottom: 16 }}>Pending Course Reviews</h1>

      {courses.length === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>No pending courses.</p>
        </div>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        {courses.map(course => (
          <div key={course.id} className="card">
            <h3 style={{ marginBottom: 6 }}>{course.title}</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 8 }}>{course.description}</p>
            <p style={{ fontSize: 13, marginBottom: 4 }}><strong>Questions:</strong> {course.questions.length}</p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10, flexWrap: 'wrap' }}>
              <button onClick={() => handleDecision(course.id, 'approved')} style={{ fontSize: 14 }}>Approve</button>
              <button onClick={() => handleDecision(course.id, 'rejected')} className="btn-secondary" style={{ fontSize: 14 }}>Reject</button>
              <a href={course.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 14 }}>
                Preview Video →
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
