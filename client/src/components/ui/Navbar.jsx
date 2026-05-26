import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    navigate('/login');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setMenuOpen(false);

  const navLinks = user ? [
    { to: '/', label: '🏠 Home' },
    { to: '/dashboard', label: '📊 Dashboard' },
    { to: '/history', label: '📋 History' },
    { to: '/mcq', label: '📝 MCQ' },
    { to: '/profile', label: '👤 Profile' },
  ] : [
    { to: '/', label: '🏠 Home' },
    { to: '/login', label: '🔑 Login' },
    { to: '/register', label: '🚀 Sign Up' },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <div className="logo-icon">🎯</div>
            <span>InterviewAI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="navbar-nav">
            <Link to="/" className={`nav-link${isActive('/') ? ' active' : ''}`}>🏠 Home</Link>
            {user && (
              <>
                <Link to="/dashboard" className={`nav-link${isActive('/dashboard') ? ' active' : ''}`}>Dashboard</Link>
                <Link to="/history" className={`nav-link${isActive('/history') ? ' active' : ''}`}>History</Link>
                <Link to="/mcq" className={`nav-link${isActive('/mcq') ? ' active' : ''}`}>📝 MCQ</Link>
                <Link to="/profile" className={`nav-link${isActive('/profile') ? ' active' : ''}`}>Profile</Link>
              </>
            )}
          </div>

          {/* Right */}
          <div className="navbar-right">
            <button className="theme-toggle" onClick={toggleTheme} title={isDark ? 'Light Mode' : 'Dark Mode'}>
              {isDark ? '☀️' : '🌙'}
            </button>

            {user ? (
              <>
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <div className="user-chip" style={{ cursor: 'pointer' }}>
                    <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                    <span>{user.name?.split(' ')[0]}</span>
                  </div>
                </Link>
                <button className="btn btn-ghost btn-sm logout-desktop" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 6 }} className="desktop-auth">
                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              className="hamburger"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
              <span style={{ opacity: menuOpen ? 0 : 1 }} />
              <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Drawer */}
      {menuOpen && (
        <div className="mobile-nav open" onClick={closeMenu}>
          <div className="mobile-nav-header" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--accent), #0099cc)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🎯</div>
              InterviewAI
            </div>
            <button
              onClick={closeMenu}
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 36, height: 36, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>
          </div>

          {/* User info */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.15)', borderRadius: 12, marginBottom: 8 }} onClick={e => e.stopPropagation()}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #0099cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{user.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{user.email}</div>
              </div>
            </div>
          )}

          {/* Nav links */}
          <div onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`mobile-nav-link${isActive(link.to) ? ' active' : ''}`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Bottom actions */}
          <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }} onClick={e => e.stopPropagation()}>
            <button
              onClick={toggleTheme}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600 }}
            >
              {isDark ? '☀️' : '🌙'} {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>

            {user && (
              <button
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, cursor: 'pointer', color: '#ef4444', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600 }}
              >
                🚪 Logout
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
