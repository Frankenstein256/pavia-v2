'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CoursePage() {
  const { courseId } = useParams();
  const { data: session } = useSession();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/courses/${courseId}`)
      .then(res => res.json())
      .then(data => {
        setCourse(data);
        setLoading(false);
      });
  }, [courseId]);

  useEffect(() => {
    if (session) {
      fetch(`/api/enrollments/${courseId}`)
        .then(res => res.json())
        .then(data => setEnrollment(data));
    }
  }, [session, courseId]);

  async function handleEnroll() {
    const res = await fetch('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    });
    const data = await res.json();
    setEnrollment(data);
  }

  async function handleMarkWatched() {
    const res = await fetch(`/api/enrollments/${courseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoWatched: true }),
    });
    const data = await res.json();
    setEnrollment(data);
  }

  async function handleSubmitTest() {
    setError('');
    if (Object.keys(answers).length < course.questions.length) {
      setError('Please answer all questions.');
      return;
    }
    const answerArray = course.questions.map((q, i) => answers[i]);
    const res = await fetch(`/api/enrollments/${courseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answerArray }),
    });
    const data = await res.json();
    setEnrollment(data);
  }

  if (loading) return <p style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading...</p>;
  if (!course) return <p style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Course not found.</p>;

  const cardStyle = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.3rem' }}>{course.title}</h1>
      {course.category && (
        <span style={{
          display: 'inline-block',
          background: 'var(--color-accent)',
          color: '#fff',
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '0.2rem 0.6rem',
          borderRadius: '999px',
          marginBottom: '0.75rem',
        }}>
          {course.category}
        </span>
      )}
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>{course.description}</p>

      {!session && (
        <div style={cardStyle}>
          <p style={{ margin: 0 }}>Please log in to enroll and take this course.</p>
        </div>
      )}

      {session && !enrollment && (
        <button onClick={handleEnroll} style={{ padding: '0.75rem 1.5rem' }}>Enroll</button>
      )}

      {session && enrollment && (
        <>
          <video
            src={course.videoUrl}
            controls
            style={{ width: '100%', borderRadius: 'var(--radius)', marginBottom: '1rem', backgroundColor: '#000' }}
          />

          {!enrollment.videoWatched && (
            <button onClick={handleMarkWatched} style={{ padding: '0.75rem 1.5rem', marginBottom: '2rem' }}>
              Mark Video as Watched
            </button>
          )}

          {enrollment.videoWatched && !enrollment.completedAt && (
            <div style={cardStyle}>
              <h2 style={{ color: 'var(--color-primary)', marginTop: 0 }}>Test</h2>
              {course.questions.map((q, i) => {
                const options = JSON.parse(q.options);
                return (
                  <div key={q.id} style={{ marginBottom: '1.25rem' }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{i + 1}. {q.text}</p>
                    {options.map((opt, oi) => (
                      <label key={oi} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={`q-${i}`}
                          checked={answers[i] === oi}
                          onChange={() => setAnswers({ ...answers, [i]: oi })}
                          style={{ accentColor: 'var(--color-primary)' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                );
              })}
              {error && <p style={{ color: '#B3261E', fontSize: '0.9rem' }}>{error}</p>}
              {enrollment.testScore != null && enrollment.testScore < 70 && (
                <p style={{ color: '#B3261E', fontSize: '0.9rem' }}>
                  You scored {enrollment.testScore}%. You need 70% to pass — try again.
                </p>
              )}
              <button onClick={handleSubmitTest} style={{ padding: '0.75rem 1.5rem' }}>Submit Test</button>
            </div>
          )}

          {enrollment.completedAt && (
            <div style={{
              ...cardStyle,
              borderColor: 'var(--color-primary)',
              textAlign: 'center',
            }}>
              <h2 style={{ color: 'var(--color-primary)', marginTop: 0 }}>🎉 Course Completed!</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>You scored {enrollment.testScore}%.</p>
              <a
                href={`/learn/${courseId}/certificate`}
                style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}
              >
                View Certificate →
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
