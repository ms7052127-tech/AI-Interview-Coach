import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { interviewService } from '../services/interviewService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewService.getHistory()
      .then(data => setInterviews(data.interviews || []))
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Compute real stats from history
  const totalInterviews = interviews.length;
  const avgScore = totalInterviews > 0
    ? Math.round((interviews.reduce((s, i) => s + i.score, 0) / totalInterviews) * 10) / 10
    : 0;
  const bestScore = totalInterviews > 0 ? Math.max(...interviews.map(i => i.score)) : 0;
  const totalQuestions = interviews.reduce((s, i) => s + (i.questionsAttempted || 0), 0);

  // Domain breakdown
  const domainMap = {};
  interviews.forEach(iv => {
    if (!domainMap[iv.domain]) domainMap[iv.domain] = { count: 0, totalScore: 0 };
    domainMap[iv.domain].count++;
    domainMap[iv.domain].totalScore += iv.score;
  });
  const domainStats = Object.entries(domainMap).map(([domain, d]) => ({
    domain,
    count: d.count,
    avg: Math.round((d.totalScore / d.count) * 10) / 10
  })).sort((a, b) => b.count - a.count);

  // Difficulty breakdown
  const diffMap = {};
  interviews.forEach(iv => {
    if (!diffMap[iv.difficulty]) diffMap[iv.difficulty] = { count: 0, totalScore: 0 };
    diffMap[iv.difficulty].count++;
    diffMap[iv.difficulty].totalScore += iv.score;
  });

  const getScoreColor = (score) => {
    if (score >= 8) return 'var(--success)';
    if (score >= 5) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getGrade = (score) => {
    if (score >= 9) return { label: 'Expert', icon: '🏆', color: '#ffd700' };
    if (score >= 7) return { label: 'Advanced', icon: '⭐', color: 'var(--success)' };
    if (score >= 5) return { label: 'Intermediate', icon: '📈', color: 'var(--warning)' };
    if (score >= 3) return { label: 'Beginner', icon: '🌱', color: 'var(--info)' };
    return { label: 'Starter', icon: '🎯', color: 'var(--text-muted)' };
  };

  const grade = getGrade(avgScore);
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'N/A';

  const domainIcons = {
    'Web Development': '🌐',
    'JavaScript': '⚡',
    'React': '⚛️',
    'Node.js': '🟢',
    'HR Questions': '🤝'
  };

  const recentInterviews = interviews.slice(0, 5);

  return (
    <div style={{ padding: '40px 0 80px', animation: 'pageIn 0.3s ease' }}>
      <div className="container" style={{ maxWidth: 900 }}>

        {/* ── Hero Card ── */}
        <div style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: 90, height: 90, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), #0099cc)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.2rem', fontFamily: 'var(--font-display)', fontWeight: 800,
              color: '#fff', flexShrink: 0,
              boxShadow: '0 0 30px var(--accent-glow)'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: 0 }}>
                  {user?.name}
                </h1>
                <span style={{
                  background: `${grade.color}20`,
                  color: grade.color,
                  border: `1px solid ${grade.color}40`,
                  borderRadius: 100, padding: '3px 12px',
                  fontSize: '0.78rem', fontWeight: 700
                }}>
                  {grade.icon} {grade.label}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 12px' }}>
                📧 {user?.email}
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  📅 Joined {joinDate}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  🎯 {totalInterviews} Interviews Completed
                </span>
              </div>
            </div>

            {/* Big score */}
            {totalInterviews > 0 && (
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  border: `3px solid ${getScoreColor(avgScore)}`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 24px ${getScoreColor(avgScore)}40`
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.6rem',
                    fontWeight: 800, color: getScoreColor(avgScore), lineHeight: 1
                  }}>
                    {avgScore}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>/10 avg</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14, marginBottom: 24
        }}>
          {[
            { icon: '🎯', label: 'Total Interviews', value: totalInterviews, color: 'var(--accent)' },
            { icon: '⭐', label: 'Avg Score', value: totalInterviews > 0 ? `${avgScore}/10` : '—', color: getScoreColor(avgScore) },
            { icon: '🏆', label: 'Best Score', value: totalInterviews > 0 ? `${bestScore}/10` : '—', color: '#ffd700' },
            { icon: '❓', label: 'Questions Done', value: totalQuestions, color: 'var(--info)' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: 18,
              display: 'flex', flexDirection: 'column', gap: 6
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: `${s.color}18`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'
              }}>
                {s.icon}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                {s.label}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '1.4rem',
                fontWeight: 800, color: s.color, lineHeight: 1
              }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

          {/* ── Domain Performance ── */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 24
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              📊 Domain Performance
            </h3>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}><div className="spinner spinner-sm" /></div>
            ) : domainStats.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>
                No interviews yet
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {domainStats.map(d => (
                  <div key={d.domain}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {domainIcons[d.domain]} {d.domain}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {d.count} interview{d.count > 1 ? 's' : ''} · <span style={{ color: getScoreColor(d.avg), fontWeight: 700 }}>{d.avg}/10</span>
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 3,
                        background: `linear-gradient(90deg, ${getScoreColor(d.avg)}, ${getScoreColor(d.avg)}aa)`,
                        width: `${(d.avg / 10) * 100}%`,
                        transition: 'width 0.6s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Difficulty Breakdown ── */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 24
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚡ Difficulty Breakdown
            </h3>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}><div className="spinner spinner-sm" /></div>
            ) : totalInterviews === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>
                No interviews yet
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {['Easy', 'Medium', 'Hard'].map(diff => {
                  const d = diffMap[diff];
                  const color = diff === 'Easy' ? 'var(--success)' : diff === 'Medium' ? 'var(--warning)' : 'var(--danger)';
                  const emoji = diff === 'Easy' ? '🟢' : diff === 'Medium' ? '🟡' : '🔴';
                  return (
                    <div key={diff} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: 14, background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${d ? color + '30' : 'var(--border)'}`
                    }}>
                      <span style={{ fontSize: '1.4rem' }}>{emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>{diff}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {d ? `${d.count} interview${d.count > 1 ? 's' : ''}` : 'Not attempted'}
                        </div>
                      </div>
                      {d && (
                        <div style={{
                          fontFamily: 'var(--font-display)', fontWeight: 800,
                          fontSize: '1.1rem', color
                        }}>
                          {Math.round((d.totalScore / d.count) * 10) / 10}/10
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Achievement Badges ── */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 24
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 18 }}>
            🏅 Achievements
          </h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { icon: '🎯', label: 'First Interview', unlocked: totalInterviews >= 1, desc: 'Complete your first interview' },
              { icon: '🔥', label: '5 Interviews', unlocked: totalInterviews >= 5, desc: 'Complete 5 interviews' },
              { icon: '💎', label: '10 Interviews', unlocked: totalInterviews >= 10, desc: 'Complete 10 interviews' },
              { icon: '⭐', label: 'High Scorer', unlocked: bestScore >= 8, desc: 'Score 8+ in any interview' },
              { icon: '🏆', label: 'Top Performer', unlocked: avgScore >= 8, desc: 'Maintain 8+ avg score' },
              { icon: '🌐', label: 'Web Dev Pro', unlocked: domainMap['Web Development']?.count >= 2, desc: '2 Web Dev interviews' },
              { icon: '⚡', label: 'JS Master', unlocked: domainMap['JavaScript']?.count >= 2, desc: '2 JavaScript interviews' },
              { icon: '⚛️', label: 'React Expert', unlocked: domainMap['React']?.count >= 2, desc: '2 React interviews' },
              { icon: '🟢', label: 'Node Ninja', unlocked: domainMap['Node.js']?.count >= 2, desc: '2 Node.js interviews' },
              { icon: '🤝', label: 'People Person', unlocked: domainMap['HR Questions']?.count >= 2, desc: '2 HR interviews' },
            ].map(badge => (
              <div key={badge.label} title={badge.desc} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 6, padding: '14px 16px', borderRadius: 'var(--radius-md)',
                background: badge.unlocked ? 'var(--accent-dim)' : 'var(--bg-secondary)',
                border: `1px solid ${badge.unlocked ? 'var(--accent)' : 'var(--border)'}`,
                opacity: badge.unlocked ? 1 : 0.4,
                transition: 'all 0.2s ease',
                cursor: 'default', minWidth: 80, textAlign: 'center'
              }}>
                <span style={{ fontSize: '1.6rem', filter: badge.unlocked ? 'none' : 'grayscale(1)' }}>
                  {badge.icon}
                </span>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700,
                  color: badge.unlocked ? 'var(--accent)' : 'var(--text-muted)',
                  lineHeight: 1.2
                }}>
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent Interviews ── */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: 24
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: 0 }}>
              📋 Recent Interviews
            </h3>
            <Link to="/history" style={{ fontSize: '0.82rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              View All →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}><div className="spinner spinner-sm" /></div>
          ) : recentInterviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🎯</div>
              <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: '0.9rem' }}>
                No interviews yet! Start practicing to see your history here.
              </p>
              <Link to="/dashboard" className="btn btn-primary">
                Start First Interview →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentInterviews.map((iv, idx) => (
                <div key={iv._id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'var(--bg-elevated)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', flexShrink: 0
                  }}>
                    {domainIcons[iv.domain]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 3 }}>
                      {iv.domain}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className={`badge badge-${iv.difficulty === 'Easy' ? 'success' : iv.difficulty === 'Medium' ? 'warning' : 'danger'}`} style={{ fontSize: '0.7rem' }}>
                        {iv.difficulty}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {iv.questionsAttempted} questions
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {new Date(iv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.3rem',
                    fontWeight: 800, color: getScoreColor(iv.score),
                    flexShrink: 0
                  }}>
                    {iv.score}/10
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
