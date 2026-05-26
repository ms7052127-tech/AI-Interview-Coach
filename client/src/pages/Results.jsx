import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateUser, user } = useAuth();
  const results = location.state?.results;
  const [expanded, setExpanded] = useState(null);

  if (!results) {
    navigate('/dashboard');
    return null;
  }

  const { domain, difficulty, totalQuestions, averageScore, feedbackSummary, date } = results;

  // Update cached user stats
  if (user) {
    updateUser({
      totalInterviews: (user.totalInterviews || 0) + 1,
      averageScore: averageScore
    });
  }

  const getScoreLabel = (score) => {
    if (score >= 8) return { label: 'Excellent', color: 'var(--success)', icon: '🏆' };
    if (score >= 6) return { label: 'Good', color: 'var(--accent)', icon: '✅' };
    if (score >= 4) return { label: 'Fair', color: 'var(--warning)', icon: '📈' };
    return { label: 'Needs Work', color: 'var(--danger)', icon: '💪' };
  };

  const { label, color, icon } = getScoreLabel(averageScore);

  const getScoreColor = (score) => {
    if (score >= 8) return 'var(--success)';
    if (score >= 5) return 'var(--warning)';
    return 'var(--danger)';
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className="results-page">
      <div className="container" style={{ maxWidth: 800 }}>
        {/* Hero */}
        <div className="results-hero">
          <div className="results-trophy">{icon}</div>
          <div className="results-score-big">{averageScore}/10</div>
          <div className="results-label" style={{ color }}>
            {label} Performance
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 8 }}>
            {formattedDate}
          </p>
          <div className="results-meta">
            <span className="badge badge-accent">{domain}</span>
            <span className={`badge badge-${difficulty === 'Easy' ? 'success' : difficulty === 'Medium' ? 'warning' : 'danger'}`}>
              {difficulty}
            </span>
          </div>
        </div>

        {/* Summary stats */}
        <div className="results-summary-grid">
          <div className="results-stat">
            <div className="results-stat-value">{totalQuestions}</div>
            <div className="results-stat-label">Questions Attempted</div>
          </div>
          <div className="results-stat">
            <div className="results-stat-value" style={{ color }}>
              {averageScore}
            </div>
            <div className="results-stat-label">Average Score</div>
          </div>
          <div className="results-stat">
            <div className="results-stat-value">
              {feedbackSummary?.filter(f => f.score >= 7).length || 0}
            </div>
            <div className="results-stat-label">High Scores (7+)</div>
          </div>
          <div className="results-stat">
            <div className="results-stat-value">
              {Math.round((averageScore / 10) * 100)}%
            </div>
            <div className="results-stat-label">Overall Grade</div>
          </div>
        </div>

        {/* Per-question breakdown */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          marginBottom: 20,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontSize: '0.85rem'
        }}>
          Question Breakdown
        </h2>

        {feedbackSummary?.map((item, idx) => (
          <div key={idx} className="question-result-item">
            <div
              className="question-result-header"
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            >
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                minWidth: 24,
                fontWeight: 700
              }}>
                Q{idx + 1}
              </span>
              <span className="question-result-text">{item.questionText}</span>
              <span className="question-result-score" style={{ color: getScoreColor(item.score) }}>
                {item.score}/10
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {expanded === idx ? '▲' : '▼'}
              </span>
            </div>

            {expanded === idx && (
              <div className="question-result-body">
                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: 6
                  }}>
                    📝 Feedback
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {item.feedback}
                  </p>
                </div>

                {item.suggestions?.length > 0 && (
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: 6
                    }}>
                      💡 Suggestions
                    </div>
                    <ul className="feedback-list">
                      {item.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}

                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: 6
                  }}>
                    🎯 Ideal Answer
                  </div>
                  <div className="correct-answer-box">{item.correctAnswer}</div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/dashboard')}
          >
            🎯 Practice Again
          </button>
          <Link to="/history" className="btn btn-secondary btn-lg">
            📚 View History
          </Link>
        </div>
      </div>
    </div>
  );
}
