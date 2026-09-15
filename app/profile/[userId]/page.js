'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

function Stars({ rating, size = 16 }) {
  return (
    <span style={{ color: 'var(--color-gold)', fontSize: size }}>
      {'★'.repeat(Math.round(rating))}
      <span style={{ color: 'var(--color-border)' }}>{'★'.repeat(5 - Math.round(rating))}</span>
    </span>
  );
}

export default function PublicProfilePage() {
  const { userId } = useParams();
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myRating, setMyRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      });
  }, [userId]);

  async function handleSubmitReview(e) {
    e.preventDefault();
    setError('');
    if (myRating === 0) {
      setError('Please select a star rating.');
      return;
    }
    setSubmitting(true);
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revieweeId: userId, rating: myRating, comment }),
    });
    setSubmitting(false);

    if (res.ok) {
      setSuccess(true);
      const refreshed = await fetch(`/api/users/${userId}`).then((r) => r.json());
      setProfile(refreshed);
    } else {
      const data = await res.json();
      setError(data.error || 'Something went wrong');
    }
  }

  if (loading) return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>Loading...</p></main>;
  if (!profile) return <main className="page-container"><p style={{ color: 'var(--color-text-muted)' }}>User not found.</p></main>;

  const isOwnProfile = session?.user?.id === userId;

  return (
    <main className="page-container">
      <div className="card" style={{ textAlign: 'center', marginBottom: 20 }}>
        {profile.image ? (
          <img src={profile.image} alt={profile.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px' }} />
        ) : (
          <div style={{
            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 12px',
            background: 'var(--color-primary)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700,
          }}>
            {(profile.name || '?')[0].toUpperCase()}
          </div>
        )}
        <h2 style={{ marginBottom: 4 }}>{profile.name || 'Anonymous'}</h2>
        {profile.avgRating ? (
          <div>
            <Stars rating={profile.avgRating} />
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginTop: 2 }}>
              {profile.avgRating.toFixed(1)} ({profile.reviewCount} review{profile.reviewCount !== 1 ? 's' : ''})
            </p>
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No reviews yet</p>
        )}
      </div>

      {profile.skillListings.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 10 }}>Listings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {profile.skillListings.map((l) => (
              <div key={l.id} className="card" style={{ padding: 12 }}>
                <p style={{ fontWeight: 600 }}>{l.title}</p>
                {l.category && <span className="badge badge-green">{l.category}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isOwnProfile && session && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 10 }}>Leave a review</h3>
          {success ? (
            <p style={{ color: 'var(--color-primary)' }}>Thanks for your review!</p>
          ) : (
            <form onSubmit={handleSubmitReview}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 12, fontSize: 28, cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    onClick={() => setMyRating(n)}
                    style={{ color: n <= myRating ? 'var(--color-gold)' : 'var(--color-border)' }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                placeholder="Optional comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ marginBottom: 10, minHeight: 60 }}
              />
              {error && <p style={{ color: 'var(--color-danger)', fontSize: 13, marginBottom: 8 }}>{error}</p>}
              <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit review'}</button>
            </form>
          )}
        </div>
      )}

      {profile.reviewsReceived.length > 0 && (
        <div>
          <h3 style={{ marginBottom: 10 }}>Reviews</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {profile.reviewsReceived.map((r) => (
              <div key={r.id} className="card" style={{ padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: 14 }}>{r.reviewer?.name || 'Anonymous'}</strong>
                  <Stars rating={r.rating} size={13} />
                </div>
                {r.comment && <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
  }
