'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

function getYouTubeEmbedUrl(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

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

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
  if (!course) return <p style={{ padding: 24 }}>Course not found.</p>;

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 16px' }}>
      <h1>{course.title}</h1>
      <p>{course.description}</p>

      {!session && <p>Please log in to enroll and take this course.</p>}

      {session && !enrollment && (
        <button onClick={handleEnroll} style={{ padding: '10px 20px' }}>Enroll</button>
      )}

      {session && enrollment && (
        <>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: 16 }}>
            <iframe
              src={getYouTubeEmbedUrl(course.videoUrl)}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              frameBorder="0"
              allowFullScreen
            />
          </div>

          {!enrollment.videoWatched && (
            <button onClick={handleMarkWatched} style={{ padding: '10px 20px', marginBottom: 24 }}>
              Mark Video as Watched
            </button>
          )}

          {enrollment.videoWatched && !enrollment.completedAt && (
            <div>
              <h2>Test</h2>
              {course.questions.map((q, i) => {
                const options = JSON.parse(q.options);
                return (
                  <div key={q.id} style={{ marginBottom: 16 }}>
                    <p><strong>{i + 1}. {q.text}</strong></p>
                    {options.map((opt, oi) => (
                      <label key={oi} style={{ display: 'block', marginBottom: 4 }}>
                        <input
                          type="radio"
                          name={`q-${i}`}
                          checked={answers[i] === oi}
                          onChange={() => setAnswers({ ...answers, [i]: oi })}
                        /> {opt}
                      </label>
                    ))}
                  </div>
                );
              })}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {enrollment.testScore != null && enrollment.testScore < 70 && (
                <p style={{ color: 'red' }}>You scored {enrollment.testScore}%. You need 70% to pass — try again.</p>
              )}
              <button onClick={handleSubmitTest} style={{ padding: '10px 20px' }}>Submit Test</button>
            </div>
          )}

          {enrollment.completedAt && (
            <div style={{ border: '2px solid green', padding: 20, textAlign: 'center' }}>
              <h2>🎉 Course Completed!</h2>
              <p>You scored {enrollment.testScore}%.</p>
              <a href={`/learn/${courseId}/certificate`}>View Certificate</a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
