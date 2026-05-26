// import React, { useState, useCallback, useEffect, useRef } from 'react';
// import { useLocation, useNavigate, Link } from 'react-router-dom';
// import Timer from '../components/ui/Timer';
// import { interviewService } from '../services/interviewService';
// import toast from 'react-hot-toast';

// // ── AI Girl Panel ──────────────────────────────────────────
// function AIGirlPanel({ questionText, questionNum, total }) {
//   const [speaking, setSpeaking] = useState(false);
//   const [supported, setSupported] = useState(true);

//   useEffect(() => {
//     if (!window.speechSynthesis) { setSupported(false); return; }
//     // Auto-speak on new question
//     setTimeout(() => speakText(questionText), 400);
//     return () => window.speechSynthesis?.cancel();
//   }, [questionText]);

//   const speakText = (text) => {
//     if (!window.speechSynthesis) return;
//     window.speechSynthesis.cancel();
//     const utterance = new SpeechSynthesisUtterance(text);

//     const loadVoices = () => {
//       const voices = window.speechSynthesis.getVoices();
//       const female = voices.find(v =>
//         /samantha|zira|susan|female|google uk english female|microsoft zira|victoria|karen|moira/i.test(v.name)
//       );
//       if (female) utterance.voice = female;
//     };

//     if (window.speechSynthesis.getVoices().length) loadVoices();
//     else window.speechSynthesis.onvoiceschanged = loadVoices;

//     utterance.rate = 0.9;
//     utterance.pitch = 1.2;
//     utterance.volume = 1;
//     utterance.onstart = () => setSpeaking(true);
//     utterance.onend = () => setSpeaking(false);
//     utterance.onerror = () => setSpeaking(false);
//     window.speechSynthesis.speak(utterance);
//   };

//   const handleStop = () => { window.speechSynthesis?.cancel(); setSpeaking(false); };

//   return (
//     <div className="ai-girl-panel">
//       {/* Top label */}
//       <div className="ai-girl-panel-label">
//         <span className="badge badge-accent">👩‍💼 Aria · AI Interviewer</span>
//       </div>

//       {/* Main avatar area */}
//       <div className="ai-girl-avatar-wrap">
//         {/* Glow ring when speaking */}
//         <div className={`ai-glow-ring${speaking ? ' active' : ''}`} />

//         {/* CSS AI Girl Avatar */}
//         <div className={`ai-girl-avatar-large${speaking ? ' speaking' : ''}`}>
//           <div className="ai-girl-face">
//             <div className="ai-face-head">
//               <div className="ai-hair" />
//               <div className="ai-face-inner">
//                 <div className="ai-eyes">
//                   <div className={`ai-eye${speaking ? ' blinking' : ''}`} />
//                   <div className={`ai-eye${speaking ? ' blinking' : ''}`} />
//                 </div>
//                 <div className="ai-nose" />
//                 <div className={`ai-mouth${speaking ? ' talking' : ''}`} />
//               </div>
//             </div>
//             <div className="ai-body">
//               <div className="ai-collar" />
//               <div className="ai-suit" />
//             </div>
//           </div>
//         </div>

//         {/* Sound bars */}
//         <div className={`ai-soundbars${speaking ? ' active' : ''}`}>
//           {[...Array(9)].map((_, i) => (
//             <span key={i} style={{ animationDelay: `${i * 0.08}s` }} />
//           ))}
//         </div>
//       </div>

//       {/* Status */}
//       <div className="ai-girl-status-text">
//         {speaking ? (
//           <span style={{ color: 'var(--accent)' }}>🎙️ Reading your question...</span>
//         ) : (
//           <span style={{ color: 'var(--text-muted)' }}>💬 Ready · Listening</span>
//         )}
//       </div>

//       {/* Controls */}
//       <div className="ai-girl-controls">
//         {supported && (
//           speaking ? (
//             <button className="speak-btn" onClick={handleStop}>⏹ Stop</button>
//           ) : (
//             <button className="speak-btn" onClick={() => speakText(questionText)}>
//               🔊 Read Question
//             </button>
//           )
//         )}
//       </div>

//       {/* Progress pills */}
//       <div className="ai-progress-pills">
//         {Array.from({ length: total }).map((_, i) => (
//           <div
//             key={i}
//             className={`ai-pill${i < questionNum ? ' done' : i === questionNum - 1 ? ' active' : ''}`}
//           />
//         ))}
//       </div>

//       <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
//         Question {questionNum} of {total}
//       </p>
//     </div>
//   );
// }

// // ── Main Interview Page ──────────────────────────────────────
// export default function Interview() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { interviewId, questions = [], domain, difficulty } = location.state || {};

//   const [currentIdx, setCurrentIdx] = useState(0);
//   const [answer, setAnswer] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [feedback, setFeedback] = useState(null);
//   const [timerKey, setTimerKey] = useState(0);
//   const [timerRunning, setTimerRunning] = useState(true);
//   const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

//   const currentQuestion = questions[currentIdx];
//   const isLast = currentIdx === questions.length - 1;

//   if (!interviewId || !questions.length) {
//     navigate('/dashboard');
//     return null;
//   }

//   const submitAnswer = useCallback(async (isTimedOut = false) => {
//     if (submitting) return;
//     if (!isTimedOut && !answer.trim()) {
//       toast.error('Please write an answer before submitting');
//       return;
//     }
//     setTimerRunning(false);
//     setSubmitting(true);
//     try {
//       const result = await interviewService.submitAnswer({
//         questionId: currentQuestion.id,
//         interviewId,
//         answerText: isTimedOut ? '' : answer.trim(),
//         isTimedOut,
//         timeTaken: 120
//       });
//       setFeedback(result.feedback);
//       if (isTimedOut) toast('⏱ Time expired!', { icon: '⏰' });
//       else toast.success('Answer submitted!');
//     } catch (err) {
//       toast.error(err.message);
//       setTimerRunning(true);
//     } finally {
//       setSubmitting(false);
//     }
//   }, [answer, currentQuestion, interviewId, submitting]);

//   const handleTimerExpire = useCallback(() => {
//     if (!feedback) submitAnswer(true);
//   }, [feedback, submitAnswer]);

//   const handleNext = async () => {
//     if (isLast) {
//       try {
//         const result = await interviewService.completeInterview(interviewId);
//         navigate('/results', { state: { results: result.results } });
//       } catch (err) {
//         toast.error(err.message);
//       }
//       return;
//     }
//     setCurrentIdx(i => i + 1);
//     setAnswer('');
//     setFeedback(null);
//     setTimerRunning(true);
//     setTimerKey(k => k + 1);
//     setShowCorrectAnswer(false);
//   };

//   const getScoreColor = (s) => s >= 8 ? 'var(--success)' : s >= 5 ? 'var(--warning)' : 'var(--danger)';
//   const progress = ((currentIdx + (feedback ? 1 : 0)) / questions.length) * 100;

//   return (
//     <div className="interview-page-v2">
//       <div className="interview-layout">

//         {/* ── LEFT: AI Girl ── */}
//         <aside className="interview-left">
//           <AIGirlPanel
//             questionText={currentQuestion?.text}
//             questionNum={currentIdx + 1}
//             total={questions.length}
//           />
//         </aside>

//         {/* ── RIGHT: Question + Answer ── */}
//         <div className="interview-right">
//           {/* Top bar */}
//           <div className="interview-topbar">
//             <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//               <span className="badge badge-accent">{domain}</span>
//               <span className={`badge badge-${difficulty === 'Easy' ? 'success' : difficulty === 'Medium' ? 'warning' : 'danger'}`}>
//                 {difficulty}
//               </span>
//             </div>
//             {!feedback && (
//               <Timer key={timerKey} duration={120} onExpire={handleTimerExpire} isRunning={timerRunning} />
//             )}
//           </div>

//           {/* Progress */}
//           <div className="progress-bar-wrap" style={{ marginBottom: 20 }}>
//             <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
//           </div>

//           {/* Question */}
//           <div className="question-card" style={{ marginBottom: 16 }}>
//             <div className="question-num">Question {currentIdx + 1}</div>
//             <p className="question-text">{currentQuestion?.text}</p>
//           </div>

//           {/* Answer */}
//           {!feedback && (
//             <div className="answer-card">
//               <div className="answer-label">✍️ Your Answer</div>
//               <textarea
//                 className="answer-textarea"
//                 placeholder="Type your answer here... Be detailed and clear. Use examples where possible."
//                 value={answer}
//                 onChange={e => setAnswer(e.target.value)}
//                 disabled={submitting}
//                 style={{ minHeight: 160 }}
//               />
//               <div className="answer-actions">
//                 <button className="btn btn-ghost btn-sm" onClick={() => submitAnswer(true)} disabled={submitting}>
//                   Skip
//                 </button>
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => submitAnswer(false)}
//                   disabled={submitting || !answer.trim()}
//                   style={{ minWidth: 150 }}
//                 >
//                   {submitting ? <><span className="spinner spinner-sm" /> Evaluating...</> : '✓ Submit Answer'}
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Feedback */}
//           {feedback && (
//             <div className="feedback-panel" style={{ marginTop: 0 }}>
//               <div className="feedback-header">
//                 <div className="feedback-title">🤖 AI Feedback</div>
//                 <div className="score-circle" style={{ borderColor: getScoreColor(feedback.score) }}>
//                   <div className="score-number" style={{ color: getScoreColor(feedback.score) }}>{feedback.score}</div>
//                   <div className="score-max">/10</div>
//                 </div>
//               </div>

//               <div className="feedback-section">
//                 <div className="feedback-section-title">📝 Assessment</div>
//                 <p className="feedback-text">{feedback.feedback}</p>
//               </div>

//               {feedback.strengths?.length > 0 && (
//                 <div className="feedback-section">
//                   <div className="feedback-section-title" style={{ color: 'var(--success)' }}>✅ Strengths</div>
//                   <ul className="feedback-list">{feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
//                 </div>
//               )}

//               {feedback.suggestions?.length > 0 && (
//                 <div className="feedback-section">
//                   <div className="feedback-section-title" style={{ color: 'var(--amber)' }}>💡 Improvements</div>
//                   <ul className="feedback-list">{feedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
//                 </div>
//               )}

//               <hr className="divider" />

//               {/* Correct Answer */}
//               <div className="feedback-section">
//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
//                   <div className="feedback-section-title" style={{ color: 'var(--accent)', marginBottom: 0 }}>
//                     🎯 Ideal Answer
//                   </div>
//                   <button className="btn btn-ghost btn-sm" onClick={() => setShowCorrectAnswer(v => !v)}>
//                     {showCorrectAnswer ? '🙈 Hide' : '👁 Show Answer'}
//                   </button>
//                 </div>
//                 {showCorrectAnswer
//                   ? <div className="correct-answer-box" style={{ animation: 'pageIn 0.3s ease' }}>{feedback.correctAnswer}</div>
//                   : <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>Click "Show Answer" to reveal the ideal answer.</p>
//                 }
//               </div>

//               <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
//                 <button className="btn btn-primary btn-lg" onClick={handleNext}>
//                   {isLast ? '🏆 See Results' : 'Next Question →'}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Timer from '../components/ui/Timer';
import { interviewService } from '../services/interviewService';
import toast from 'react-hot-toast';

// ── AI Girl Panel ──────────────────────────────────────────
function AIGirlPanel({ questionText, questionNum, total }) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!window.speechSynthesis) { setSupported(false); return; }
    // Auto-speak on new question
    setTimeout(() => speakText(questionText), 400);
    return () => window.speechSynthesis?.cancel();
  }, [questionText]);

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const female = voices.find(v =>
        /samantha|zira|susan|female|google uk english female|microsoft zira|victoria|karen|moira/i.test(v.name)
      );
      if (female) utterance.voice = female;
    };

    if (window.speechSynthesis.getVoices().length) loadVoices();
    else window.speechSynthesis.onvoiceschanged = loadVoices;

    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.volume = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => { window.speechSynthesis?.cancel(); setSpeaking(false); };

  return (
    <div className="ai-girl-panel">
      {/* Top label */}
      <div className="ai-girl-panel-label">
        <span className="badge badge-accent">👩‍💼 Aria · AI Interviewer</span>
      </div>

      {/* Main avatar area */}
      <div className="ai-girl-avatar-wrap">
        {/* Glow ring when speaking */}
        <div className={`ai-glow-ring${speaking ? ' active' : ''}`} />

        {/* CSS AI Girl Avatar */}
        <div className={`ai-girl-avatar-large${speaking ? ' speaking' : ''}`}>
          <div className="ai-girl-face">
            <div className="ai-face-head">
              <div className="ai-hair" />
              <div className="ai-face-inner">
                <div className="ai-eyes">
                  <div className={`ai-eye${speaking ? ' blinking' : ''}`} />
                  <div className={`ai-eye${speaking ? ' blinking' : ''}`} />
                </div>
                <div className="ai-nose" />
                <div className={`ai-mouth${speaking ? ' talking' : ''}`} />
              </div>
            </div>
            <div className="ai-body">
              <div className="ai-collar" />
              <div className="ai-suit" />
            </div>
          </div>
        </div>

        {/* Sound bars */}
        <div className={`ai-soundbars${speaking ? ' active' : ''}`}>
          {[...Array(9)].map((_, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="ai-girl-status-text">
        {speaking ? (
          <span style={{ color: 'var(--accent)' }}>🎙️ Reading your question...</span>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>💬 Ready · Listening</span>
        )}
      </div>

      {/* Controls */}
      <div className="ai-girl-controls">
        {supported && (
          speaking ? (
            <button className="speak-btn" onClick={handleStop}>⏹ Stop</button>
          ) : (
            <button className="speak-btn" onClick={() => speakText(questionText)}>
              🔊 Read Question
            </button>
          )
        )}
      </div>

      {/* Progress pills */}
      <div className="ai-progress-pills">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`ai-pill${i < questionNum ? ' done' : i === questionNum - 1 ? ' active' : ''}`}
          />
        ))}
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
        Question {questionNum} of {total}
      </p>
    </div>
  );
}

// ── Main Interview Page ──────────────────────────────────────
// ── Voice Mic Button ──
function VoiceMicBtn({ answer, setAnswer }) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  if (!isSupported) return null;

  const toggle = () => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    recRef.current = rec;
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onstart = () => setListening(true);
    rec.onresult = (e) => {
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + ' ';
      }
      if (final) setAnswer(prev => prev + final);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  };

  return (
    <button onClick={toggle} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 14px', borderRadius: 100,
      background: listening ? 'rgba(239,68,68,0.15)' : 'var(--accent-dim)',
      border: listening ? '1px solid rgba(239,68,68,0.4)' : '1px solid var(--border-accent)',
      color: listening ? 'var(--danger)' : 'var(--accent)',
      cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
      fontFamily: 'var(--font-body)'
    }}>
      {listening ? <>🔴 Stop</> : <>🎤 Speak</>}
    </button>
  );
}

export default function Interview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { interviewId, questions = [], domain, difficulty } = location.state || {};

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timerKey, setTimerKey] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const currentQuestion = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;

  if (!interviewId || !questions.length) {
    navigate('/dashboard');
    return null;
  }

  const submitAnswer = useCallback(async (isTimedOut = false) => {
    if (submitting) return;
    if (!isTimedOut && !answer.trim()) {
      toast.error('Please write an answer before submitting');
      return;
    }
    setTimerRunning(false);
    setSubmitting(true);
    try {
      const result = await interviewService.submitAnswer({
        questionId: currentQuestion.id,
        interviewId,
        answerText: isTimedOut ? '' : answer.trim(),
        isTimedOut,
        timeTaken: 120
      });
      setFeedback(result.feedback);
      if (isTimedOut) toast('⏱ Time expired!', { icon: '⏰' });
      else toast.success('Answer submitted!');
    } catch (err) {
      toast.error(err.message);
      setTimerRunning(true);
    } finally {
      setSubmitting(false);
    }
  }, [answer, currentQuestion, interviewId, submitting]);

  const handleTimerExpire = useCallback(() => {
    if (!feedback) submitAnswer(true);
  }, [feedback, submitAnswer]);

  const handleNext = async () => {
    if (isLast) {
      try {
        const result = await interviewService.completeInterview(interviewId);
        navigate('/results', { state: { results: result.results } });
      } catch (err) {
        toast.error(err.message);
      }
      return;
    }
    setCurrentIdx(i => i + 1);
    setAnswer('');
    setFeedback(null);
    setTimerRunning(true);
    setTimerKey(k => k + 1);
    setShowCorrectAnswer(false);
  };

  const getScoreColor = (s) => s >= 8 ? 'var(--success)' : s >= 5 ? 'var(--warning)' : 'var(--danger)';
  const progress = ((currentIdx + (feedback ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="interview-page-v2">
      <div className="interview-layout">

        {/* ── LEFT: AI Girl ── */}
        <aside className="interview-left">
          <AIGirlPanel
            questionText={currentQuestion?.text}
            questionNum={currentIdx + 1}
            total={questions.length}
          />
        </aside>

        {/* ── RIGHT: Question + Answer ── */}
        <div className="interview-right">
          {/* Top bar */}
          <div className="interview-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-accent">{domain}</span>
              <span className={`badge badge-${difficulty === 'Easy' ? 'success' : difficulty === 'Medium' ? 'warning' : 'danger'}`}>
                {difficulty}
              </span>
            </div>
            {!feedback && (
              <Timer key={timerKey} duration={120} onExpire={handleTimerExpire} isRunning={timerRunning} />
            )}
          </div>

          {/* Progress */}
          <div className="progress-bar-wrap" style={{ marginBottom: 20 }}>
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* Question */}
          <div className="question-card" style={{ marginBottom: 16 }}>
            <div className="question-num">Question {currentIdx + 1}</div>
            <p className="question-text">{currentQuestion?.text}</p>
          </div>

          {/* Answer */}
          {!feedback && (
            <div className="answer-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div className="answer-label" style={{ margin: 0 }}>✍️ Your Answer</div>
                <VoiceMicBtn answer={answer} setAnswer={setAnswer} />
              </div>
              <textarea
                className="answer-textarea"
                placeholder="Type your answer or click 🎤 Speak to use voice..."
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                disabled={submitting}
                style={{ minHeight: 160 }}
              />
              <div className="answer-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => submitAnswer(true)} disabled={submitting}>
                  Skip
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => submitAnswer(false)}
                  disabled={submitting || !answer.trim()}
                  style={{ minWidth: 150 }}
                >
                  {submitting ? <><span className="spinner spinner-sm" /> Evaluating...</> : '✓ Submit Answer'}
                </button>
              </div>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className="feedback-panel" style={{ marginTop: 0 }}>
              <div className="feedback-header">
                <div className="feedback-title">🤖 AI Feedback</div>
                <div className="score-circle" style={{ borderColor: getScoreColor(feedback.score) }}>
                  <div className="score-number" style={{ color: getScoreColor(feedback.score) }}>{feedback.score}</div>
                  <div className="score-max">/10</div>
                </div>
              </div>

              <div className="feedback-section">
                <div className="feedback-section-title">📝 Assessment</div>
                <p className="feedback-text">{feedback.feedback}</p>
              </div>

              {feedback.strengths?.length > 0 && (
                <div className="feedback-section">
                  <div className="feedback-section-title" style={{ color: 'var(--success)' }}>✅ Strengths</div>
                  <ul className="feedback-list">{feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
              )}

              {feedback.suggestions?.length > 0 && (
                <div className="feedback-section">
                  <div className="feedback-section-title" style={{ color: 'var(--amber)' }}>💡 Improvements</div>
                  <ul className="feedback-list">{feedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
              )}

              <hr className="divider" />

              {/* Correct Answer */}
              <div className="feedback-section">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div className="feedback-section-title" style={{ color: 'var(--accent)', marginBottom: 0 }}>
                    🎯 Ideal Answer
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowCorrectAnswer(v => !v)}>
                    {showCorrectAnswer ? '🙈 Hide' : '👁 Show Answer'}
                  </button>
                </div>
                {showCorrectAnswer
                  ? <div className="correct-answer-box" style={{ animation: 'pageIn 0.3s ease' }}>{feedback.correctAnswer}</div>
                  : <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>Click "Show Answer" to reveal the ideal answer.</p>
                }
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <button className="btn btn-primary btn-lg" onClick={handleNext}>
                  {isLast ? '🏆 See Results' : 'Next Question →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
