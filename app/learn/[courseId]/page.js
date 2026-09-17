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

  if (loading) return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Loading...</p></main>;
  if (!course) return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Course not found.</p></main>;

  return (
    <main className="page-container">
      <h1 style={{ color: 'var(--color-primary)', marginBottom: 6 }}>{course.title}</h1>
      {course.category && (
        <span className="badge badge-gold" style={{ marginBottom: 12, display: 'inline-block' }}>
          {course.category}
        </span>
      )}
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>{course.description}</p>

      {!session && (
        <div className="card">
          <p style={{ margin: 0 }}>Please log in to enroll and take this course.</p>
        </div>
      )}

      {session && !enrollment && (
        <button onClick={handleEnroll}>Enroll</button>
      )}

      {session && enrollment && (
        <>
          <video
            src={course.videoUrl}
            controls
            style={{ width: '100%', borderRadius: 'var(--radius)', marginBottom: 16, backgroundColor: '#000' }}
          />

          {!enrollment.videoWatched && (
            <button onClick={handleMarkWatched} style={{ marginBottom: 32 }}>
              Mark Video as Watched
            </button>
          )}

          {enrollment.videoWatched && !enrollment.completedAt && (
            <div className="card">
              <h2 style={{ color: 'var(--color-primary)', marginBottom: 14 }}>Test</h2>
              {course.questions.map((q, i) => {
                const options = JSON.parse(q.options);
                return (
                  <div key={q.id} style={{ marginBottom: 20 }}>
                    <p style={{ fontWeight: 600, marginBottom: 8 }}>{i + 1}. {q.text}</p>
                    {options.map((opt, oi) => (
                      <label key={oi} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={`q-${i}`}
                          checked={answers[i] === oi}
                          onChange={() => setAnswers({ ...answers, [i]: oi })}
                          style={{ accentColor: 'var(--color-primary)', width: 'auto' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                );
              })}
              {error && <p style={{ color: 'var(--color-danger)', fontSize: 14 }}>{error}</p>}
              {enrollment.testScore != null && enrollment.testScore < 70 && (
                <p style={{ color: 'var(--color-danger)', fontSize: 14 }}>
                  You scored {enrollment.testScore}%. You need 70% to pass — try again.
                </p>
              )}
              <button onClick={handleSubmitTest}>Submit Test</button>
            </div>
          )}

          {enrollment.completedAt && (
            <div className="card" style={{ borderColor: 'var(--color-primary)', textAlign: 'center' }}>
              <h2 style={{ color: 'var(--color-primary)', marginBottom: 8 }}>🎉 Course Completed!</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 12 }}>You scored {enrollment.testScore}%.</p>
              <a
                href={`/learn/${courseId}/certificate`}
                style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}
              >
                View Certificate →
              </a>
            </div>
          )}
        </>
      )}
    </main>
  );
    }
