import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🤖', title: 'AI-Generated Questions', desc: 'Get unique, domain-specific questions crafted by Gemini AI for every session.' },
  { icon: '⏱', title: '2-Minute Timer', desc: 'Simulate real interview pressure with a countdown timer per question.' },
  { icon: '📊', title: 'Instant AI Feedback', desc: 'Receive detailed scores, strengths, improvements, and ideal answers immediately.' },
  { icon: '🎯', title: '5 Interview Domains', desc: 'Practice Web Dev, JavaScript, React, Node.js, or HR behavioral questions.' },
  { icon: '📈', title: 'Progress Tracking', desc: 'View your history and track improvement across multiple sessions.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'JWT authentication keeps your data safe and sessions private.' },
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 24px',
        background: `
          radial-gradient(ellipse 80% 60% at 50% -5%, rgba(0,212,170,0.12) 0%, transparent 60%),
          var(--bg-primary)
        `
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(0,212,170,0.08)',
          border: '1px solid rgba(0,212,170,0.2)',
          borderRadius: 100,
          padding: '6px 16px',
          marginBottom: 32,
          fontSize: '0.82rem',
          color: 'var(--accent)',
          fontWeight: 600,
          letterSpacing: '0.04em'
        }}>
          ✨ Powered by Google Gemini AI
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          fontWeight: 600,
          lineHeight: 1.1,
          marginBottom: 24,
          maxWidth: 800
        }}>
          Ace Your Next Interview with{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--accent), #0099cc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            AI Coaching
          </span>
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          maxWidth: 560,
          marginBottom: 40,
          lineHeight: 1.7
        }}>
          Practice with AI-generated questions, get instant feedback, and track your growth.
          Built for developers who want to land their dream job.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary btn-lg" style={{ padding: '16px 40px', fontSize: '1.05rem' }}>
            Get Started Free →
          </Link>
          <Link to="/login" className="btn btn-ghost btn-lg" style={{ padding: '16px 32px' }}>
            Sign In
          </Link>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 20 }}>
          No credit card required · Free to use
        </p>
      </div>

      {/* Features */}
      <div style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{
            color: 'var(--accent)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: 12
          }}>
            Why InterviewAI
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            marginBottom: 12
          }}>
            Everything you need to prepare
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
            A complete interview preparation platform designed for modern developers.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20
        }}>
          {features.map(f => (
            <div key={f.title} className="card card-hover" style={{ padding: '28px' }}>
              <div style={{
                width: 48,
                height: 48,
                background: 'var(--accent-dim)',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                marginBottom: 16
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                marginBottom: 8
              }}>
                {f.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        padding: '80px 24px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, transparent, rgba(0,212,170,0.04))'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
          marginBottom: 16
        }}>
          Ready to start practicing?
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 36 }}>
          Join thousands of developers sharpening their interview skills with AI.
        </p>
        <Link to="/register" className="btn btn-primary btn-lg" style={{ padding: '16px 48px', fontSize: '1.05rem' }}>
          Start for Free →
        </Link>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        <p>Built with ❤️ using React, Node.js & Google Gemini AI · InterviewAI © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
