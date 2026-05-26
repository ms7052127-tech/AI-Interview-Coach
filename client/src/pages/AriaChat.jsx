import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SUGGESTIONS = [
  "How do I explain closures in JavaScript?",
  "What is the difference between let, var and const?",
  "How does useEffect work in React?",
  "What is event loop in Node.js?",
  "How to prepare for a technical interview?",
  "What are some common React interview questions?",
  "Explain REST API best practices",
  "How to answer 'Tell me about yourself'?",
];

export default function AriaChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm Aria, your AI interview coach. Ask me anything about:\n\n• JavaScript, React, Node.js concepts\n• Web Development questions\n• HR & behavioral interview tips\n• How to improve your answers\n• Interview preparation strategies\n\nWhat would you like to know? 😊`,
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const recRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msg, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are Aria, a friendly and expert AI interview coach for software developers. You help users prepare for technical interviews covering JavaScript, React, Node.js, Web Development, and HR behavioral questions.

Your personality:
- Warm, encouraging, and supportive
- Give clear, concise answers with examples
- Use emojis occasionally to be friendly
- When explaining technical concepts, give simple examples
- For HR questions, use STAR method guidance
- Always end with a follow-up question or encouragement

User's name: ${user?.name || 'there'}
Keep responses under 300 words unless a detailed explanation is needed.`,
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: msg }
          ]
        })
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't process that. Please try again!";

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply,
        time: new Date()
      }]);
    } catch (err) {
      toast.error('Failed to get response. Please try again.');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🙏",
        time: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleVoice = () => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error('Voice not supported in this browser'); return; }
    const rec = new SR();
    recRef.current = rec;
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.onstart = () => setListening(true);
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Chat cleared! 🧹 What would you like to know, ${user?.name?.split(' ')[0] || 'there'}?`,
      time: new Date()
    }]);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatContent = (text) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div style={{
      height: 'calc(100vh - 65px)',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)'
    }}>
      {/* ── Header ── */}
      <div style={{
        padding: '16px 24px',
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Aria avatar */}
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
            boxShadow: '0 0 16px rgba(168,85,247,0.3)'
          }}>
            👩‍💼
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>
              Aria · AI Interview Coach
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
              Online · Ready to help
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={clearChat}
            style={{
              padding: '7px 14px', borderRadius: 8,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 600,
              fontFamily: 'var(--font-body)'
            }}
          >
            🧹 Clear
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '20px 0',
        display: 'flex', flexDirection: 'column',
        gap: 4
      }}>
        <div style={{ maxWidth: 760, width: '100%', margin: '0 auto', padding: '0 16px' }}>

          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-end',
              gap: 10, marginBottom: 16,
              animation: 'pageIn 0.3s ease'
            }}>
              {/* Avatar */}
              {msg.role === 'assistant' && (
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0
                }}>
                  👩‍💼
                </div>
              )}
              {msg.role === 'user' && (
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), #0099cc)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '0.85rem', color: '#fff', flexShrink: 0
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Bubble */}
              <div style={{ maxWidth: '75%' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user'
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, var(--accent), #0099cc)'
                    : 'var(--bg-card)',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                  color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                  fontSize: '0.93rem',
                  lineHeight: 1.65,
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {formatContent(msg.content)}
                </div>
                <div style={{
                  fontSize: '0.7rem', color: 'var(--text-muted)',
                  marginTop: 4,
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                  paddingLeft: msg.role === 'assistant' ? 4 : 0,
                  paddingRight: msg.role === 'user' ? 4 : 0
                }}>
                  {formatTime(msg.time)}
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: 10,
              marginBottom: 16, animation: 'pageIn 0.3s ease'
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0
              }}>
                👩‍💼
              </div>
              <div style={{
                padding: '14px 18px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '18px 18px 18px 4px',
                display: 'flex', gap: 5, alignItems: 'center'
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--accent)',
                    animation: 'bounce 1.2s ease infinite',
                    animationDelay: `${i * 0.2}s`
                  }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggestions — show only at start */}
        {messages.length === 1 && (
          <div style={{ maxWidth: 760, width: '100%', margin: '8px auto 0', padding: '0 16px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              💬 Quick Questions
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  style={{
                    padding: '8px 14px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 100,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: '0.82rem',
                    fontFamily: 'var(--font-body)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)'; }}
                  onMouseOut={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Input Area ── */}
      <div style={{
        padding: '16px',
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border)'
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {listening && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', marginBottom: 10,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8, fontSize: '0.82rem', color: '#ef4444'
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s ease infinite' }} />
              Listening... speak your question
            </div>
          )}

          <div style={{
            display: 'flex', gap: 10, alignItems: 'flex-end',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 16, padding: '10px 12px',
            transition: 'border-color 0.2s ease'
          }}
            onFocus={() => {}}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Aria anything about interviews..."
              rows={1}
              style={{
                flex: 1, background: 'transparent',
                border: 'none', outline: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem', lineHeight: 1.5,
                resize: 'none', maxHeight: 120, overflowY: 'auto'
              }}
              onInput={e => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />

            {/* Voice button */}
            <button
              onClick={toggleVoice}
              title="Voice input"
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: listening ? 'rgba(239,68,68,0.15)' : 'var(--bg-elevated)',
                border: listening ? '1px solid rgba(239,68,68,0.4)' : '1px solid var(--border)',
                color: listening ? '#ef4444' : 'var(--text-muted)',
                cursor: 'pointer', fontSize: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s ease'
              }}
            >
              🎤
            </button>

            {/* Send button */}
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: input.trim() && !loading ? 'var(--accent)' : 'var(--bg-elevated)',
                border: 'none',
                color: input.trim() && !loading ? '#000' : 'var(--text-muted)',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                fontSize: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s ease'
              }}
            >
              {loading ? (
                <div style={{ width: 16, height: 16, border: '2px solid var(--text-muted)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : '➤'}
            </button>
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 8 }}>
            Press Enter to send · Shift+Enter for new line · 🎤 for voice
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes pageIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
