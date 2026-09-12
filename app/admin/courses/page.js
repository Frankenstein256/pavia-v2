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

  if (!session) return <p style={{ padding: 24 }}>Please log in.</p>;
  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 16 }}>
      <h1>Pending Course Reviews</h1>
      {courses.length === 0 && <p>No pending courses.</p>}
      {courses.map(course => (
        <div key={course.id} style={{ border: '1px solid #ccc', padding: 16, marginBottom: 16 }}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <p><strong>Video:</strong> {course.videoUrl}</p>
          <p><strong>Questions:</strong> {course.questions.length}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => handleDecision(course.id, 'approved')} style={{ padding: '8px 16px' }}>Approve</button>
            <button onClick={() => handleDecision(course.id, 'rejected')} style={{ padding: '8px 16px' }}>Reject</button>
            <a href={course.videoUrl} target="_blank" rel="noopener noreferrer">Preview Video</a>
          </div>
        </div>
      ))}
    </div>
  );
        }
