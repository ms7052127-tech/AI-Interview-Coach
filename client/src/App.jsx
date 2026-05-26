import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ProtectedRoute from './components/ui/ProtectedRoute';
import Navbar from './components/ui/Navbar';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Results from './pages/Results';
import History from './pages/History';
import Profile from './pages/Profile';
import MockInterview from './pages/MockInterview';
import MCQ from './pages/MCQ';
import AriaChat from './pages/AriaChat';

// Navbar always shown on ALL pages
function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}

function AppRoutes() {
  const { isDark } = useTheme();

  return (
    <>
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#1e1e2a' : '#ffffff',
            color: isDark ? '#f0f0f5' : '#0a0a0f',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontFamily: 'DM Sans, sans-serif',
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.12)',
            padding: '12px 16px',
          },
          success: { iconTheme: { primary: '#00d4aa', secondary: isDark ? '#0a0a0f' : '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: isDark ? '#0a0a0f' : '#fff' } }
        }}
      />
      <AppLayout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/mock-interview" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
          <Route path="/mcq" element={<ProtectedRoute><MCQ /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><AriaChat /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
