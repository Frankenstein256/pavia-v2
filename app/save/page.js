'use client';

import { useState, useEffect } from 'react';

export default function SavePage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [creating, setCreating] = useState(false);
  const [addAmounts, setAddAmounts] = useState({});

  useEffect(() => {
    loadGoals();
  }, []);

  async function loadGoals() {
    const res = await fetch('/api/savings');
    if (res.ok) {
      const data = await res.json();
      setGoals(data);
    }
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    await fetch('/api/savings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, targetAmount }),
    });
    setName('');
    setTargetAmount('');
    setCreating(false);
    loadGoals();
  }

  async function handleAddMoney(goalId) {
    const amount = addAmounts[goalId];
    if (!amount) return;
    await fetch(`/api/savings/${goalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    setAddAmounts({ ...addAmounts, [goalId]: '' });
    loadGoals();
  }

  if (loading) return <main style={{ padding: '2rem' }}>Loading...</main>;

  return (
    <main style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Save</h1>

      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Goal name (e.g. Laptop fund)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ flex: 1, padding: '0.6rem' }}
        />
        <input
          type="number"
          placeholder="Target (GHS)"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
          style={{ width: '120px', padding: '0.6rem' }}
        />
        <button type="submit" disabled={creating} style={{ padding: '0.6rem 1rem', cursor: 'pointer' }}>
          Add goal
        </button>
      </form>

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {goals.length === 0 && <p>No savings goals yet. Create one above.</p>}

        {goals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
          return (
            <div key={goal.id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '1rem' }}>
              <h3 style={{ margin: 0 }}>{goal.name}</h3>
              <p style={{ margin: '0.3rem 0', color: '#666' }}>
                GHS {goal.savedAmount} of {goal.targetAmount} ({percent}%)
              </p>
              <div style={{ background: '#eee', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
                <div style={{ background: '#0F5132', height: '100%', width: `${percent}%` }} />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <input
                  type="number"
                  placeholder="Add amount"
                  value={addAmounts[goal.id] || ''}
                  onChange={(e) => setAddAmounts({ ...addAmounts, [goal.id]: e.target.value })}
                  style={{ flex: 1, padding: '0.5rem' }}
                />
                <button onClick={() => handleAddMoney(goal.id)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                  Add
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
  }
