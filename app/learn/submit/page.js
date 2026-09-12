'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function SubmitCoursePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', '', ''], correctIndex: 0 },
  ]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateQuestion(i, field, value) {
    const updated = [...questions];
    updated[i][field] = value;
    setQuestions(updated);
  }

  function updateOption(qi, oi, value) {
    const updated = [...questions];
    updated[qi].options[oi] = value;
    setQuestions(updated);
  }

  function addQuestion() {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctIndex: 0 }]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!session) {
      setError('Please log in first.');
      return;
    }
    if (!title || !description || !videoUrl) {
      setError('Please fill in title, description, and video URL.');
      return;
    }

    setSubmitting(true);
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, category, videoUrl, questions }),
    });
    setSubmitting(false);

    if (res.ok) {
      router.push('/learn');
    } else {
      setError('Failed to submit course.');
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 16px' }}>
      <h1>Submit a Course</h1>
      <p>Your course will be reviewed before it appears publicly.</p>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <input placeholder="Category (optional)" value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <input placeholder="Unlisted YouTube video URL" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} style={{ width: '100%', marginBottom: 20, padding: 8 }} />

        <h3>Test Questions</h3>
        {questions.map((q, i) => (
          <div key={i} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 12 }}>
            <input
              placeholder={`Question ${i + 1}`}
              value={q.text}
              onChange={e => updateQuestion(i, 'text', e.target.value)}
              style={{ width: '100%', marginBottom: 8, padding: 8 }}
            />
            {q.options.map((opt, oi) => (
              <div key={oi} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                <input
                  type="radio"
                  name={`correct-${i}`}
                  checked={q.correctIndex === oi}
                  onChange={() => updateQuestion(i, 'correctIndex', oi)}
                  style={{ marginRight: 8 }}
                />
                <input
                  placeholder={`Option ${oi + 1}`}
                  value={opt}
                  onChange={e => updateOption(i, oi, e.target.value)}
                  style={{ flex: 1, padding: 8 }}
                />
              </div>
            ))}
          </div>
        ))}
        <button type="button" onClick={addQuestion} style={{ marginBottom: 20 }}>+ Add Question</button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={submitting} style={{ width: '100%', padding: 12 }}>
          {submitting ? 'Submitting...' : 'Submit Course for Review'}
        </button>
      </form>
    </div>
  );
    }
