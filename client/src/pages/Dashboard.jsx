import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { interviewService } from '../services/interviewService';
import toast from 'react-hot-toast';

const DOMAINS = [
  { label: 'Web Development', icon: '🌐' },
  { label: 'JavaScript', icon: '⚡' },
  { label: 'React', icon: '⚛️' },
  { label: 'Node.js', icon: '🟢' },
  { label: 'HR Questions', icon: '🤝' },
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const COUNTS = [3, 5, 7, 10];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [domain, setDomain] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [count, setCount] = useState(5);
  const [mode, setMode] = useState('normal');
  const [loading, setLoading] = useState(false);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getDifficultyClass = (d) => {
    if (difficulty !== d) return 'difficulty-chip';
    if (d === 'Easy') return 'difficulty-chip selected-easy';
    if (d === 'Medium') return 'difficulty-chip selected-medium';
    return 'difficulty-chip selected-hard';
  };

  const handleStart = async (selectedMode = 'normal') => {
    setMode(selectedMode);
    if (!domain) { toast.error('Please select an interview domain'); return; }
    if (!difficulty) { toast.error('Please select a difficulty level'); return; }

    setLoading(true);
    try {
      const data = await interviewService.generateQuestions(domain, difficulty, count);
      toast.success(`${data.questions.length} questions generated!`);
      const dest = selectedMode === 'mock' ? '/mock-interview' : '/interview';
      navigate(dest, {
        state: {
          interviewId: data.interviewId,
          questions: data.questions,
          domain,
          difficulty
        }
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = user?.averageScore >= 7 ? 'var(--success)'
    : user?.averageScore >= 5 ? 'var(--warning)'
    : 'var(--danger)';

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Hero */}
        <div className="dashboard-hero">
          <p className="dashboard-greeting">{getGreeting()}</p>
          <h1 className="dashboard-title">
            Ready to practice,<br />{user?.name?.split(' ')[0]}?
          </h1>
          <p className="dashboard-subtitle">
            Select your domain and difficulty to generate AI-powered interview questions.
          </p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-label">Interviews Done</div>
            <div className="stat-value">{user?.totalInterviews || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-label">Avg Score</div>
            <div className="stat-value" style={{ color: user?.averageScore ? scoreColor : 'var(--accent)' }}>
              {user?.averageScore ? `${user.averageScore}/10` : '—'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-label">Domain</div>
            <div className="stat-value" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: 4 }}>
              {domain || '—'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-label">Questions</div>
            <div className="stat-value">{count}</div>
          </div>
        </div>

        {/* Domain selection */}
        <div className="setup-section">
          <p className="setup-section-title">Select Domain</p>
          <div className="domain-grid">
            {DOMAINS.map(d => (
              <div
                key={d.label}
                className={`domain-card${domain === d.label ? ' selected' : ''}`}
                onClick={() => setDomain(d.label)}
              >
                <span className="domain-icon">{d.icon}</span>
                <span>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty selection */}
        <div className="setup-section">
          <p className="setup-section-title">Select Difficulty</p>
          <div className="difficulty-grid">
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                className={getDifficultyClass(d)}
                onClick={() => setDifficulty(d)}
                type="button"
              >
                {d === 'Easy' ? '🟢' : d === 'Medium' ? '🟡' : '🔴'} {d}
              </button>
            ))}
          </div>
        </div>

        {/* Question count */}
        <div className="setup-section">
          <p className="setup-section-title">Number of Questions</p>
          <div className="difficulty-grid">
            {COUNTS.map(c => (
              <button
                key={c}
                className={`difficulty-chip${count === c ? ' selected-easy' : ''}`}
                onClick={() => setCount(c)}
                type="button"
              >
                {c} Questions
              </button>
            ))}
          </div>
        </div>

        {/* Start buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 8, flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => handleStart('normal')}
            disabled={loading || !domain || !difficulty}
            style={{ minWidth: 200, fontSize: '1rem', padding: '15px 32px' }}
          >
            {loading && mode === 'normal'
              ? <><span className="spinner spinner-sm" /> Generating...</>
              : '🚀 Start Interview'}
          </button>
          <button
            onClick={() => handleStart('mock')}
            disabled={loading || !domain || !difficulty}
            style={{
              minWidth: 200, fontSize: '1rem', padding: '15px 32px',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
              fontWeight: 700, cursor: loading || !domain || !difficulty ? 'not-allowed' : 'pointer',
              opacity: loading || !domain || !difficulty ? 0.5 : 1,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 20px rgba(168,85,247,0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {loading && mode === 'mock'
              ? <><span className="spinner spinner-sm" /> Generating...</>
              : '🎥 Mock Interview'}
          </button>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 10 }}>
          🎥 Mock Interview = Camera on + Real interview feel
        </p>

        {loading && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 16, fontSize: '0.85rem' }}>
            AI is crafting your questions — this takes a few seconds ✨
          </p>
        )}
      </div>
    </div>
  );
}
