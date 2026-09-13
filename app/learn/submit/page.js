'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { upload } from '@vercel/blob/client';

export default function SubmitCoursePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', '', ''], correctIndex: 0 },
  ]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusText, setStatusText] = useState('');

  const inputStyle = { width: '100%', padding: '0.7rem', marginBottom: '0.75rem' };
  const labelStyle = { display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600 };

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

  function removeQuestion(i) {
    setQuestions(questions.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!session) {
      setError('Please log in first.');
      return;
    }
    if (!title || !description || !videoFile) {
      setError('Please fill in title, description, and choose a video file.');
      return;
    }

    setSubmitting(true);

    try {
      setStatusText('Uploading video...');
      const blob = await upload(videoFile.name, videoFile, {
        access: 'public',
        handleUploadUrl: '/api/video-upload',
        onUploadProgress: (progress) => {
          setUploadProgress(Math.round(progress.percentage));
        },
      });

      setStatusText('Saving course...');
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category, videoUrl: blob.url, questions }),
      });

      if (res.ok) {
        router.push('/learn');
      } else {
        setError('Failed to submit course.');
      }
    } catch (err) {
      setError('Upload failed: ' + err.message);
    }

    setSubmitting(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.3rem' }}>Submit a Course</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 0, marginBottom: '1.5rem' }}>
        Your course will be reviewed before it appears publicly.
      </p>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Title</label>
        <input placeholder="e.g. Intro to Budgeting" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />

        <label style={labelStyle}>Description</label>
        <textarea placeholder="What will people learn?" value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, minHeight: 80 }} />

        <label style={labelStyle}>Category (optional)</label>
        <input placeholder="e.g. Finance, Trading, Skills" value={category} onChange={e => setCategory(e.target.value)} style={inputStyle} />

        <label style={labelStyle}>Course Video (max 300MB)</label>
        <input
          type="file"
          accept="video/mp4,video/quicktime,video/webm,video/x-matroska"
          onChange={e => setVideoFile(e.target.files[0])}
          style={{ width: '100%', marginBottom: '1.5rem' }}
        />

        <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>Test Questions</h3>
        {questions.map((q, i) => (
          <div key={i} style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            padding: '1rem',
            marginBottom: '1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Question {i + 1}</label>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(i)}
                  style={{ background: 'transparent', color: '#B3261E', fontWeight: 500, fontSize: '0.85rem', padding: '0.2rem 0.5rem' }}
                >
                  Remove
                </button>
              )}
            </div>
            <input
              placeholder="Question text"
              value={q.text}
              onChange={e => updateQuestion(i, 'text', e.target.value)}
              style={inputStyle}
            />
            {q.options.map((opt, oi) => (
              <div key={oi} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem' }}>
                <input
                  type="radio"
                  name={`correct-${i}`}
                  checked={q.correctIndex === oi}
                  onChange={() => updateQuestion(i, 'correctIndex', oi)}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <input
                  placeholder={`Option ${oi + 1}`}
                  value={opt}
                  onChange={e => updateOption(i, oi, e.target.value)}
                  style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                />
              </div>
            ))}
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0.5rem 0 0 0' }}>
              Tap the circle next to the correct answer.
            </p>
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          style={{ background: 'var(--color-surface)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', padding: '0.6rem 1rem', marginBottom: '1.5rem' }}
        >
          + Add Question
        </button>

        {error && <p style={{ color: '#B3261E', fontSize: '0.9rem' }}>{error}</p>}
        {submitting && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            {statusText} {uploadProgress > 0 && videoFile ? `(${uploadProgress}%)` : ''}
          </p>
        )}

        <button type="submit" disabled={submitting} style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}>
          {submitting ? 'Submitting...' : 'Submit Course for Review'}
        </button>
      </form>
    </div>
  );
          }
