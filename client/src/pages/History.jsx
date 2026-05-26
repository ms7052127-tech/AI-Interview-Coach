import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewService } from '../services/interviewService';
import toast from 'react-hot-toast';

export default function History() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await interviewService.getHistory();
        setInterviews(data.interviews || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 8) return 'var(--success)';
    if (score >= 5) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getDifficultyBadge = (d) =>
    d === 'Easy' ? 'badge-success' : d === 'Medium' ? 'badge-warning' : 'badge-danger';

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
        <p>Loading your interview history...</p>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="container">
        <div style={{ marginBottom: 36 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            marginBottom: 8
          }}>
            Interview History
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Review your past practice sessions and track your progress.
          </p>
        </div>

        {interviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">No interviews yet</div>
            <p style={{ marginBottom: 24 }}>
              Start your first practice interview to see your history here.
            </p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/dashboard')}
            >
              🚀 Start First Interview
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
              {interviews.length} completed interview{interviews.length !== 1 ? 's' : ''}
            </p>
            {interviews.map((iv) => (
              <div key={iv._id} className="history-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 44, textAlign: 'center', fontSize: '1.5rem' }}>
                    {iv.domain === 'Web Development' ? '🌐'
                      : iv.domain === 'JavaScript' ? '⚡'
                      : iv.domain === 'React' ? '⚛️'
                      : iv.domain === 'Node.js' ? '🟢'
                      : '🤝'}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '1rem',
                      marginBottom: 4
                    }}>
                      {iv.domain}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className={`badge ${getDifficultyBadge(iv.difficulty)}`}>
                        {iv.difficulty}
                      </span>
                      <span className="badge badge-muted">
                        {iv.questionsAttempted} Q
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {formatDate(iv.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: getScoreColor(iv.score),
                    lineHeight: 1
                  }}>
                    {iv.score}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/10 avg</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
