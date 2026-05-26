// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { interviewService } from '../services/interviewService';
// import toast from 'react-hot-toast';

// // ── Timer Hook ──
// function useTimer(duration, onExpire, running) {
//   const [timeLeft, setTimeLeft] = useState(duration);
//   const ref = useRef();

//   useEffect(() => { setTimeLeft(duration); }, [duration]);

//   useEffect(() => {
//     if (!running) { clearInterval(ref.current); return; }
//     ref.current = setInterval(() => {
//       setTimeLeft(prev => {
//         if (prev <= 1) { clearInterval(ref.current); onExpire?.(); return 0; }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(ref.current);
//   }, [running]);

//   const mins = Math.floor(timeLeft / 60);
//   const secs = timeLeft % 60;
//   return { timeLeft, display: `${mins}:${secs.toString().padStart(2, '0')}` };
// }

// // ── AI Girl Speaker ──
// function speakText(text, onStart, onEnd) {
//   if (!window.speechSynthesis) return;
//   window.speechSynthesis.cancel();
//   const u = new SpeechSynthesisUtterance(text);
//   const voices = window.speechSynthesis.getVoices();
//   const female = voices.find(v => /samantha|zira|susan|female|victoria|karen/i.test(v.name));
//   if (female) u.voice = female;
//   u.rate = 0.9; u.pitch = 1.15; u.volume = 1;
//   u.onstart = onStart;
//   u.onend = onEnd;
//   u.onerror = onEnd;
//   window.speechSynthesis.speak(u);
// }

// export default function MockInterview() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { interviewId, questions = [], domain, difficulty } = location.state || {};

//   // Camera
//   const videoRef = useRef(null);
//   const streamRef = useRef(null);
//   const [camReady, setCamReady] = useState(false);
//   const [camError, setCamError] = useState(false);

//   // Interview state
//   const [currentIdx, setCurrentIdx] = useState(0);
//   const [phase, setPhase] = useState('intro'); // intro | question | answering | feedback | done
//   const [answer, setAnswer] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [feedback, setFeedback] = useState(null);
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [aiSpeaking, setAiSpeaking] = useState(false);
//   const [timerRunning, setTimerRunning] = useState(false);

//   const currentQ = questions[currentIdx];
//   const isLast = currentIdx === questions.length - 1;
//   const { timeLeft, display: timerDisplay } = useTimer(120, () => handleSubmit(true), timerRunning);

//   // Start camera
//   useEffect(() => {
//     if (!interviewId || !questions.length) { navigate('/dashboard'); return; }
//     startCamera();
//     return () => {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(t => t.stop());
//       }
//     };
//   }, []);

//   const startCamera = useCallback(async () => {
//     setCamError(false);
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: { facingMode: 'user' }, 
//         audio: false 
//       });
//       streamRef.current = stream;
//       const attachStream = () => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.play().then(() => setCamReady(true)).catch(() => setCamReady(true));
//         } else {
//           setTimeout(attachStream, 200);
//         }
//       };
//       attachStream();
//     } catch (err) {
//       console.error('Camera error:', err.name, err.message);
//       setCamError(true);
//     }
//   }, []);

//   // Intro phase auto-start - start after 2 seconds regardless of camera
//   useEffect(() => {
//     if (phase === 'intro') {
//       setTimeout(() => {
//         setAiSpeaking(true);
//         speakText(
//           `Welcome to your Mock Interview! Today we are covering ${domain} at ${difficulty} level. I will ask you ${questions.length} questions. Take your time and answer clearly. Let us begin!`,
//           () => setAiSpeaking(true),
//           () => { setAiSpeaking(false); setTimeout(() => startQuestion(), 800); }
//         );
//       }, 1000);
//     }
//   }, [phase, camReady]);

//   const startQuestion = useCallback((idx = currentIdx) => {
//     setPhase('question');
//     setFeedback(null);
//     setShowAnswer(false);
//     setAnswer('');
//     setTimerRunning(false);
//     setAiSpeaking(true);
//     speakText(
//       `Question ${idx + 1}. ${questions[idx]?.text}`,
//       () => setAiSpeaking(true),
//       () => { setAiSpeaking(false); setPhase('answering'); setTimerRunning(true); }
//     );
//   }, [currentIdx, questions]);

//   const handleSubmit = useCallback(async (isTimedOut = false) => {
//     if (submitting) return;
//     if (!isTimedOut && !answer.trim()) { toast.error('Please write your answer'); return; }
//     setTimerRunning(false);
//     setSubmitting(true);
//     setPhase('feedback');
//     try {
//       const result = await interviewService.submitAnswer({
//         questionId: currentQ.id,
//         interviewId,
//         answerText: isTimedOut ? '' : answer.trim(),
//         isTimedOut,
//         timeTaken: 120 - timeLeft
//       });
//       setFeedback(result.feedback);
//       // AI reads feedback score
//       setTimeout(() => {
//         setAiSpeaking(true);
//         speakText(
//           `Your score is ${result.feedback.score} out of 10. ${result.feedback.feedback}`,
//           () => setAiSpeaking(true),
//           () => setAiSpeaking(false)
//         );
//       }, 400);
//     } catch (err) {
//       toast.error(err.message);
//       setPhase('answering');
//       setTimerRunning(true);
//     } finally {
//       setSubmitting(false);
//     }
//   }, [answer, currentQ, interviewId, submitting, timeLeft]);

//   const handleNext = async () => {
//     if (isLast) {
//       window.speechSynthesis?.cancel();
//       try {
//         const result = await interviewService.completeInterview(interviewId);
//         streamRef.current?.getTracks().forEach(t => t.stop());
//         navigate('/results', { state: { results: result.results } });
//       } catch (err) { toast.error(err.message); }
//       return;
//     }
//     const nextIdx = currentIdx + 1;
//     setCurrentIdx(nextIdx);
//     setTimeout(() => startQuestion(nextIdx), 300);
//   };

//   const getScoreColor = s => s >= 8 ? '#22c55e' : s >= 5 ? '#f59e0b' : '#ef4444';
//   const timerColor = timeLeft <= 20 ? '#ef4444' : timeLeft <= 50 ? '#f59e0b' : '#00d4aa';
//   const progress = ((currentIdx + (feedback ? 1 : 0)) / questions.length) * 100;

//   if (!interviewId || !questions.length) return null;

//   return (
//     <div style={{
//       position: 'fixed', inset: 0, zIndex: 1000,
//       background: 'rgba(0,0,0,0.95)',
//       display: 'flex', flexDirection: 'column',
//       fontFamily: 'var(--font-body)'
//     }}>
//       {/* ── Top Bar ── */}
//       <div style={{
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//         padding: '14px 24px',
//         background: 'rgba(255,255,255,0.04)',
//         borderBottom: '1px solid rgba(255,255,255,0.08)'
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//           <div style={{
//             width: 10, height: 10, borderRadius: '50%',
//             background: '#ef4444', boxShadow: '0 0 8px #ef4444',
//             animation: 'pulse 1.5s ease infinite'
//           }} />
//           <span style={{ color: '#fff', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
//             🎤 Mock Interview
//           </span>
//           <span style={{
//             background: 'rgba(0,212,170,0.15)', color: '#00d4aa',
//             border: '1px solid rgba(0,212,170,0.3)',
//             borderRadius: 100, padding: '2px 10px', fontSize: '0.78rem', fontWeight: 600
//           }}>
//             {domain}
//           </span>
//           <span style={{
//             background: difficulty === 'Easy' ? 'rgba(34,197,94,0.15)' : difficulty === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
//             color: difficulty === 'Easy' ? '#22c55e' : difficulty === 'Medium' ? '#f59e0b' : '#ef4444',
//             borderRadius: 100, padding: '2px 10px', fontSize: '0.78rem', fontWeight: 600
//           }}>
//             {difficulty}
//           </span>
//         </div>

//         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//           {/* Timer */}
//           {phase === 'answering' && (
//             <div style={{
//               display: 'flex', alignItems: 'center', gap: 8,
//               background: `${timerColor}15`, border: `1px solid ${timerColor}40`,
//               borderRadius: 100, padding: '6px 16px',
//               fontFamily: 'var(--font-display)', fontWeight: 700,
//               fontSize: '1rem', color: timerColor,
//               animation: timeLeft <= 20 ? 'pulse 1s ease infinite' : 'none'
//             }}>
//               ⏱ {timerDisplay}
//             </div>
//           )}
//           {/* Progress */}
//           <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
//             {currentIdx + 1} / {questions.length}
//           </span>
//           {/* Close */}
//           <button onClick={() => {
//             window.speechSynthesis?.cancel();
//             streamRef.current?.getTracks().forEach(t => t.stop());
//             navigate('/dashboard');
//           }} style={{
//             background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
//             color: '#ef4444', borderRadius: 8, padding: '6px 14px',
//             cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
//           }}>
//             ✕ End
//           </button>
//         </div>
//       </div>

//       {/* ── Progress bar ── */}
//       <div style={{ height: 3, background: 'rgba(255,255,255,0.06)' }}>
//         <div style={{
//           height: '100%', width: `${progress}%`,
//           background: 'linear-gradient(90deg, #00d4aa, #0099cc)',
//           transition: 'width 0.5s ease'
//         }} />
//       </div>

//       {/* ── Main Content ── */}
//       <div style={{
//         flex: 1, display: 'grid',
//         gridTemplateColumns: '35% 65%',
//         gap: 0, overflow: 'hidden'
//       }}>

//         {/* ── LEFT: Camera ── */}
//         <div style={{
//           position: 'relative', background: '#000',
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           overflow: 'hidden'
//         }}>
//           {/* Video feed */}
//           <video
//             ref={videoRef}
//             autoPlay
//             muted
//             playsInline
//             style={{
//               width: '100%', height: '100%',
//               objectFit: 'cover',
//               transform: 'scaleX(-1)', // Mirror
//               opacity: camReady ? 1 : 0,
//               transition: 'opacity 0.5s ease'
//             }}
//           />

//           {/* Camera not ready */}
//           {!camReady && (
//             <div style={{ position: 'absolute', textAlign: 'center', color: 'rgba(255,255,255,0.7)', padding: 24 }}>
//               <div style={{ fontSize: 52, marginBottom: 16 }}>📷</div>
//               {camError ? (
//                 <>
//                   <p style={{ fontSize: '0.95rem', marginBottom: 8, color: '#fff' }}>Camera access needed</p>
//                   <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
//                     Click below to enable your camera
//                   </p>
//                   <button
//                     onClick={startCamera}
//                     style={{
//                       padding: '12px 28px', borderRadius: 10,
//                       background: '#00d4aa', border: 'none',
//                       color: '#000', fontWeight: 700, fontSize: '0.9rem',
//                       cursor: 'pointer', marginBottom: 12, display: 'block', margin: '0 auto 12px'
//                     }}
//                   >
//                     🎥 Enable Camera
//                   </button>
//                   <button
//                     onClick={() => { setCamError(false); setCamReady(true); }}
//                     style={{
//                       padding: '8px 20px', borderRadius: 8,
//                       background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
//                       color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem',
//                       cursor: 'pointer', display: 'block', margin: '0 auto'
//                     }}
//                   >
//                     Continue without camera
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#00d4aa', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
//                   <p style={{ fontSize: '0.9rem' }}>Starting camera...</p>
//                   <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
//                     Allow camera permission in browser
//                   </p>
//                 </>
//               )}
//             </div>
//           )}

//           {/* Overlay gradient */}
//           <div style={{
//             position: 'absolute', inset: 0,
//             background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)',
//             pointerEvents: 'none'
//           }} />

//           {/* Bottom info */}
//           <div style={{
//             position: 'absolute', bottom: 20, left: 20, right: 20,
//             display: 'flex', alignItems: 'center', justifyContent: 'space-between'
//           }}>
//             <div style={{
//               background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
//               borderRadius: 10, padding: '8px 14px',
//               display: 'flex', alignItems: 'center', gap: 8
//             }}>
//               <div style={{ width: 8, height: 8, borderRadius: '50%', background: camReady ? '#22c55e' : '#ef4444' }} />
//               <span style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>
//                 {camReady ? 'Camera Active' : 'No Camera'}
//               </span>
//             </div>

//             {/* Phase indicator */}
//             <div style={{
//               background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
//               borderRadius: 10, padding: '8px 14px',
//               color: phase === 'answering' ? '#00d4aa' : 'rgba(255,255,255,0.6)',
//               fontSize: '0.82rem', fontWeight: 600
//             }}>
//               {phase === 'intro' && '🎬 Starting...'}
//               {phase === 'question' && '👂 Listen carefully...'}
//               {phase === 'answering' && '✍️ Your turn to answer'}
//               {phase === 'feedback' && '📊 Getting feedback...'}
//             </div>
//           </div>
//         </div>

//         {/* ── RIGHT: AI + Question + Answer ── */}
//         <div style={{
//           background: '#0e0e18',
//           borderLeft: '1px solid rgba(255,255,255,0.06)',
//           display: 'flex', flexDirection: 'column',
//           overflow: 'hidden'
//         }}>

//           {/* AI Girl section */}
//           <div style={{
//             padding: '20px 20px 16px',
//             borderBottom: '1px solid rgba(255,255,255,0.06)',
//             display: 'flex', alignItems: 'center', gap: 14,
//             background: aiSpeaking ? 'rgba(168,85,247,0.06)' : 'transparent',
//             transition: 'background 0.3s ease'
//           }}>
//             {/* CSS Avatar */}
//             <div style={{
//               width: 52, height: 52, borderRadius: '50%',
//               background: 'linear-gradient(135deg, #a855f7, #ec4899)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               fontSize: 24, flexShrink: 0,
//               boxShadow: aiSpeaking ? '0 0 20px rgba(168,85,247,0.5)' : '0 0 10px rgba(168,85,247,0.2)',
//               animation: aiSpeaking ? 'avatarPulse 1.2s ease infinite' : 'none'
//             }}>
//               👩‍💼
//             </div>

//             <div style={{ flex: 1 }}>
//               <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: 3 }}>
//                 Aria · AI Interviewer
//               </div>
//               <div style={{ fontSize: '0.78rem', color: aiSpeaking ? '#a855f7' : 'rgba(255,255,255,0.35)' }}>
//                 {aiSpeaking ? '🎙️ Speaking...' : '💬 Listening'}
//               </div>
//             </div>

//             {/* Sound bars */}
//             <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 24 }}>
//               {[...Array(6)].map((_, i) => (
//                 <div key={i} style={{
//                   width: 4, borderRadius: 2,
//                   background: 'linear-gradient(180deg, #a855f7, #ec4899)',
//                   height: aiSpeaking ? `${8 + Math.random() * 16}px` : '4px',
//                   opacity: aiSpeaking ? 1 : 0.2,
//                   animation: aiSpeaking ? `wave 0.6s ease infinite` : 'none',
//                   animationDelay: `${i * 0.1}s`,
//                   transition: 'height 0.1s ease'
//                 }} />
//               ))}
//             </div>
//           </div>

//           {/* Scrollable content */}
//           <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

//             {/* INTRO phase */}
//             {phase === 'intro' && (
//               <div style={{ textAlign: 'center', padding: '40px 0' }}>
//                 <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
//                 <h2 style={{ color: '#fff', fontFamily: 'var(--font-display)', marginBottom: 8 }}>
//                   Get Ready!
//                 </h2>
//                 <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', lineHeight: 1.6 }}>
//                   Aria is preparing your interview.<br />
//                   Make sure your camera is on and you are in a quiet place.
//                 </p>
//                 {!camReady && !camError && (
//                   <div style={{ marginTop: 20, color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
//                     Waiting for camera...
//                   </div>
//                 )}
//                 {camError && (
//                   <button
//                     onClick={() => { setCamError(false); startQuestion(); }}
//                     style={{
//                       marginTop: 20, padding: '10px 24px',
//                       background: 'rgba(0,212,170,0.15)', color: '#00d4aa',
//                       border: '1px solid rgba(0,212,170,0.3)',
//                       borderRadius: 8, cursor: 'pointer', fontWeight: 600
//                     }}
//                   >
//                     Continue without Camera
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* QUESTION / ANSWERING / FEEDBACK phases */}
//             {phase !== 'intro' && (
//               <>
//                 {/* Question */}
//                 <div style={{
//                   background: 'rgba(255,255,255,0.04)',
//                   border: '1px solid rgba(255,255,255,0.08)',
//                   borderRadius: 14, padding: 18, marginBottom: 16,
//                   position: 'relative', overflow: 'hidden'
//                 }}>
//                   <div style={{
//                     position: 'absolute', top: 0, left: 0, right: 0, height: 2,
//                     background: 'linear-gradient(90deg, #00d4aa, #0099cc, transparent)'
//                   }} />
//                   <div style={{ color: '#00d4aa', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
//                     Question {currentIdx + 1}
//                   </div>
//                   <p style={{ color: '#fff', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
//                     {currentQ?.text}
//                   </p>
//                 </div>

//                 {/* Answer textarea */}
//                 {(phase === 'answering' || phase === 'question') && (
//                   <div style={{ marginBottom: 14 }}>
//                     <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
//                       ✍️ Your Answer
//                     </div>
//                     <textarea
//                       value={answer}
//                       onChange={e => setAnswer(e.target.value)}
//                       disabled={phase === 'question' || submitting}
//                       placeholder={phase === 'question' ? 'Listen to the question...' : 'Type your answer here...'}
//                       style={{
//                         width: '100%', minHeight: 130,
//                         background: 'rgba(255,255,255,0.04)',
//                         border: `1px solid ${phase === 'answering' ? 'rgba(0,212,170,0.3)' : 'rgba(255,255,255,0.08)'}`,
//                         borderRadius: 10, padding: 14,
//                         color: '#fff', fontFamily: 'var(--font-body)',
//                         fontSize: '0.9rem', lineHeight: 1.6,
//                         resize: 'vertical', outline: 'none',
//                         opacity: phase === 'question' ? 0.4 : 1,
//                         transition: 'all 0.3s ease',
//                         boxSizing: 'border-box'
//                       }}
//                     />
//                     <div style={{ display: 'flex', gap: 10, marginTop: 10, justifyContent: 'flex-end' }}>
//                       <button
//                         onClick={() => handleSubmit(true)}
//                         disabled={phase !== 'answering' || submitting}
//                         style={{
//                           padding: '8px 16px', borderRadius: 8,
//                           background: 'rgba(255,255,255,0.06)',
//                           border: '1px solid rgba(255,255,255,0.1)',
//                           color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
//                           fontSize: '0.82rem', fontWeight: 600,
//                           opacity: phase !== 'answering' ? 0.4 : 1
//                         }}
//                       >
//                         Skip
//                       </button>
//                       <button
//                         onClick={() => handleSubmit(false)}
//                         disabled={phase !== 'answering' || !answer.trim() || submitting}
//                         style={{
//                           padding: '10px 22px', borderRadius: 8,
//                           background: answer.trim() && phase === 'answering' ? '#00d4aa' : 'rgba(0,212,170,0.2)',
//                           border: 'none', color: answer.trim() && phase === 'answering' ? '#000' : 'rgba(0,212,170,0.4)',
//                           cursor: answer.trim() && phase === 'answering' ? 'pointer' : 'not-allowed',
//                           fontWeight: 700, fontSize: '0.88rem',
//                           transition: 'all 0.2s ease',
//                           display: 'flex', alignItems: 'center', gap: 6
//                         }}
//                       >
//                         {submitting ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Evaluating...</> : '✓ Submit'}
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Feedback panel */}
//                 {phase === 'feedback' && feedback && (
//                   <div style={{ animation: 'pageIn 0.4s ease' }}>
//                     {/* Score */}
//                     <div style={{
//                       display: 'flex', alignItems: 'center', gap: 14,
//                       background: 'rgba(255,255,255,0.04)',
//                       border: `1px solid ${getScoreColor(feedback.score)}30`,
//                       borderRadius: 12, padding: 16, marginBottom: 14
//                     }}>
//                       <div style={{
//                         width: 56, height: 56, borderRadius: '50%',
//                         border: `3px solid ${getScoreColor(feedback.score)}`,
//                         display: 'flex', flexDirection: 'column',
//                         alignItems: 'center', justifyContent: 'center',
//                         flexShrink: 0,
//                         boxShadow: `0 0 16px ${getScoreColor(feedback.score)}40`
//                       }}>
//                         <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: getScoreColor(feedback.score), lineHeight: 1 }}>
//                           {feedback.score}
//                         </div>
//                         <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>/10</div>
//                       </div>
//                       <div>
//                         <div style={{ color: '#fff', fontWeight: 700, marginBottom: 4, fontSize: '0.88rem' }}>
//                           🤖 AI Feedback
//                         </div>
//                         <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>
//                           {feedback.feedback}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Strengths */}
//                     {feedback.strengths?.length > 0 && (
//                       <div style={{ marginBottom: 12 }}>
//                         <div style={{ color: '#22c55e', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
//                           ✅ Strengths
//                         </div>
//                         {feedback.strengths.map((s, i) => (
//                           <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', alignItems: 'flex-start' }}>
//                             <span style={{ color: '#22c55e', flexShrink: 0 }}>→</span> {s}
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                     {/* Improvements */}
//                     {feedback.suggestions?.length > 0 && (
//                       <div style={{ marginBottom: 12 }}>
//                         <div style={{ color: '#f59e0b', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
//                           💡 Improvements
//                         </div>
//                         {feedback.suggestions.map((s, i) => (
//                           <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', alignItems: 'flex-start' }}>
//                             <span style={{ color: '#00d4aa', flexShrink: 0 }}>→</span> {s}
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                     {/* Ideal Answer toggle */}
//                     <div style={{
//                       background: 'rgba(0,212,170,0.06)',
//                       border: '1px solid rgba(0,212,170,0.15)',
//                       borderRadius: 10, overflow: 'hidden', marginBottom: 16
//                     }}>
//                       <button
//                         onClick={() => setShowAnswer(v => !v)}
//                         style={{
//                           width: '100%', padding: '10px 16px',
//                           background: 'transparent', border: 'none',
//                           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                           cursor: 'pointer', color: '#00d4aa', fontWeight: 700, fontSize: '0.82rem'
//                         }}
//                       >
//                         <span>🎯 Ideal Answer</span>
//                         <span>{showAnswer ? '▲ Hide' : '▼ Show'}</span>
//                       </button>
//                       {showAnswer && (
//                         <div style={{ padding: '0 16px 14px', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', lineHeight: 1.7 }}>
//                           {feedback.correctAnswer}
//                         </div>
//                       )}
//                     </div>

//                     {/* Next button */}
//                     <button
//                       onClick={handleNext}
//                       style={{
//                         width: '100%', padding: '13px',
//                         background: '#00d4aa', border: 'none',
//                         borderRadius: 10, color: '#000',
//                         fontWeight: 800, fontSize: '0.95rem',
//                         cursor: 'pointer', fontFamily: 'var(--font-display)',
//                         transition: 'all 0.2s ease'
//                       }}
//                       onMouseOver={e => e.target.style.filter = 'brightness(1.1)'}
//                       onMouseOut={e => e.target.style.filter = 'none'}
//                     >
//                       {isLast ? '🏆 See Final Results' : 'Next Question →'}
//                     </button>
//                   </div>
//                 )}

//                 {/* Loading feedback */}
//                 {phase === 'feedback' && !feedback && (
//                   <div style={{ textAlign: 'center', padding: '30px 0' }}>
//                     <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#00d4aa', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
//                     <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
//                       Evaluating your answer...
//                     </p>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
//         @keyframes avatarPulse { 0%,100%{box-shadow:0 0 10px rgba(168,85,247,0.2)} 50%{box-shadow:0 0 28px rgba(168,85,247,0.6)} }
//         @keyframes wave { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(2.2)} }
//         @keyframes pageIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
//       `}</style>
//     </div>
//   );
// }



import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { interviewService } from '../services/interviewService';
import toast from 'react-hot-toast';

// ── Timer Hook ──
function useTimer(duration, onExpire, running) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const ref = useRef();

  useEffect(() => { setTimeLeft(duration); }, [duration]);

  useEffect(() => {
    if (!running) { clearInterval(ref.current); return; }
    ref.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(ref.current); onExpire?.(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  return { timeLeft, display: `${mins}:${secs.toString().padStart(2, '0')}` };
}

// ── Voice Answer Section ──
function AnswerSection({ phase, answer, setAnswer, submitting, onSubmit }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      if (finalTranscript) {
        setAnswer(prev => prev + finalTranscript);
      }
    };

    recognition.onerror = (e) => {
      console.log('Speech error:', e.error);
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const toggleVoice = () => {
    if (listening) stopListening();
    else startListening();
  };

  return (
    <div style={{ marginBottom: 14 }}>
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          ✍️ Your Answer
        </div>
        {/* Voice button */}
        {isSupported && phase === 'answering' && (
          <button
            onClick={toggleVoice}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 100,
              background: listening ? 'rgba(239,68,68,0.2)' : 'rgba(168,85,247,0.15)',
              border: listening ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(168,85,247,0.4)',
              color: listening ? '#ef4444' : '#a855f7',
              cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
              animation: listening ? 'pulse 1.5s ease infinite' : 'none'
            }}
          >
            {listening ? (
              <>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1s ease infinite' }} />
                Stop Recording
              </>
            ) : (
              <>🎤 Speak Answer</>
            )}
          </button>
        )}
      </div>

      {/* Listening indicator */}
      {listening && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 14px', marginBottom: 8,
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 8, fontSize: '0.82rem', color: '#ef4444'
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1s ease infinite', flexShrink: 0 }} />
          Listening... speak your answer clearly
        </div>
      )}

      <textarea
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        disabled={phase === 'question' || submitting}
        placeholder={phase === 'question' ? 'Listen to the question...' : listening ? 'Listening to your voice...' : 'Type your answer or click 🎤 Speak Answer'}
        style={{
          width: '100%', minHeight: 130,
          background: listening ? 'rgba(168,85,247,0.06)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${listening ? 'rgba(168,85,247,0.4)' : phase === 'answering' ? 'rgba(0,212,170,0.3)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 10, padding: 14,
          color: '#fff', fontFamily: 'var(--font-body)',
          fontSize: '0.9rem', lineHeight: 1.6,
          resize: 'vertical', outline: 'none',
          opacity: phase === 'question' ? 0.4 : 1,
          transition: 'all 0.3s ease', boxSizing: 'border-box'
        }}
      />

      <div style={{ display: 'flex', gap: 10, marginTop: 10, justifyContent: 'flex-end' }}>
        <button
          onClick={() => onSubmit(true)}
          disabled={phase !== 'answering' || submitting}
          style={{
            padding: '8px 16px', borderRadius: 8,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
            fontSize: '0.82rem', fontWeight: 600,
            opacity: phase !== 'answering' ? 0.4 : 1
          }}
        >
          Skip
        </button>
        <button
          onClick={() => { stopListening(); onSubmit(false); }}
          disabled={phase !== 'answering' || !answer.trim() || submitting}
          style={{
            padding: '10px 22px', borderRadius: 8,
            background: answer.trim() && phase === 'answering' ? '#00d4aa' : 'rgba(0,212,170,0.2)',
            border: 'none',
            color: answer.trim() && phase === 'answering' ? '#000' : 'rgba(0,212,170,0.4)',
            cursor: answer.trim() && phase === 'answering' ? 'pointer' : 'not-allowed',
            fontWeight: 700, fontSize: '0.88rem',
            transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', gap: 6
          }}
        >
          {submitting
            ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Evaluating...</>
            : '✓ Submit'}
        </button>
      </div>
    </div>
  );
}

// ── AI Girl Speaker ──
function speakText(text, onStart, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const female = voices.find(v => /samantha|zira|susan|female|victoria|karen/i.test(v.name));
  if (female) u.voice = female;
  u.rate = 0.9; u.pitch = 1.15; u.volume = 1;
  u.onstart = onStart;
  u.onend = onEnd;
  u.onerror = onEnd;
  window.speechSynthesis.speak(u);
}

export default function MockInterview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { interviewId, questions = [], domain, difficulty } = location.state || {};

  // Camera
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [camReady, setCamReady] = useState(false);
  const [camError, setCamError] = useState(false);

  // Interview state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState('intro'); // intro | question | answering | feedback | done
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);

  const currentQ = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const { timeLeft, display: timerDisplay } = useTimer(120, () => handleSubmit(true), timerRunning);

  // Start camera
  useEffect(() => {
    if (!interviewId || !questions.length) { navigate('/dashboard'); return; }
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const startCamera = useCallback(async () => {
    setCamError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      streamRef.current = stream;
      const attachStream = () => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().then(() => setCamReady(true)).catch(() => setCamReady(true));
        } else {
          setTimeout(attachStream, 200);
        }
      };
      attachStream();
    } catch (err) {
      console.error('Camera error:', err.name, err.message);
      setCamError(true);
    }
  }, []);

  // Intro phase auto-start - start after 2 seconds regardless of camera
  useEffect(() => {
    if (phase === 'intro') {
      setTimeout(() => {
        setAiSpeaking(true);
        speakText(
          `Welcome to your Mock Interview! Today we are covering ${domain} at ${difficulty} level. I will ask you ${questions.length} questions. Take your time and answer clearly. Let us begin!`,
          () => setAiSpeaking(true),
          () => { setAiSpeaking(false); setTimeout(() => startQuestion(), 800); }
        );
      }, 1000);
    }
  }, [phase, camReady]);

  const startQuestion = useCallback((idx = currentIdx) => {
    setPhase('question');
    setFeedback(null);
    setShowAnswer(false);
    setAnswer('');
    setTimerRunning(false);
    setAiSpeaking(true);
    speakText(
      `Question ${idx + 1}. ${questions[idx]?.text}`,
      () => setAiSpeaking(true),
      () => { setAiSpeaking(false); setPhase('answering'); setTimerRunning(true); }
    );
  }, [currentIdx, questions]);

  const handleSubmit = useCallback(async (isTimedOut = false) => {
    if (submitting) return;
    if (!isTimedOut && !answer.trim()) { toast.error('Please write your answer'); return; }
    setTimerRunning(false);
    setSubmitting(true);
    setPhase('feedback');
    try {
      const result = await interviewService.submitAnswer({
        questionId: currentQ.id,
        interviewId,
        answerText: isTimedOut ? '' : answer.trim(),
        isTimedOut,
        timeTaken: 120 - timeLeft
      });
      setFeedback(result.feedback);
      // AI reads feedback score
      setTimeout(() => {
        setAiSpeaking(true);
        speakText(
          `Your score is ${result.feedback.score} out of 10. ${result.feedback.feedback}`,
          () => setAiSpeaking(true),
          () => setAiSpeaking(false)
        );
      }, 400);
    } catch (err) {
      toast.error(err.message);
      setPhase('answering');
      setTimerRunning(true);
    } finally {
      setSubmitting(false);
    }
  }, [answer, currentQ, interviewId, submitting, timeLeft]);

  const handleNext = async () => {
    if (isLast) {
      window.speechSynthesis?.cancel();
      try {
        const result = await interviewService.completeInterview(interviewId);
        streamRef.current?.getTracks().forEach(t => t.stop());
        navigate('/results', { state: { results: result.results } });
      } catch (err) { toast.error(err.message); }
      return;
    }
    const nextIdx = currentIdx + 1;
    setCurrentIdx(nextIdx);
    setTimeout(() => startQuestion(nextIdx), 300);
  };

  const getScoreColor = s => s >= 8 ? '#22c55e' : s >= 5 ? '#f59e0b' : '#ef4444';
  const timerColor = timeLeft <= 20 ? '#ef4444' : timeLeft <= 50 ? '#f59e0b' : '#00d4aa';
  const progress = ((currentIdx + (feedback ? 1 : 0)) / questions.length) * 100;

  if (!interviewId || !questions.length) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.95)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-body)'
    }}>
      {/* ── Top Bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px',
        background: 'rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: '#ef4444', boxShadow: '0 0 8px #ef4444',
            animation: 'pulse 1.5s ease infinite'
          }} />
          <span style={{ color: '#fff', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            🎤 Mock Interview
          </span>
          <span style={{
            background: 'rgba(0,212,170,0.15)', color: '#00d4aa',
            border: '1px solid rgba(0,212,170,0.3)',
            borderRadius: 100, padding: '2px 10px', fontSize: '0.78rem', fontWeight: 600
          }}>
            {domain}
          </span>
          <span style={{
            background: difficulty === 'Easy' ? 'rgba(34,197,94,0.15)' : difficulty === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
            color: difficulty === 'Easy' ? '#22c55e' : difficulty === 'Medium' ? '#f59e0b' : '#ef4444',
            borderRadius: 100, padding: '2px 10px', fontSize: '0.78rem', fontWeight: 600
          }}>
            {difficulty}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Timer */}
          {phase === 'answering' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: `${timerColor}15`, border: `1px solid ${timerColor}40`,
              borderRadius: 100, padding: '6px 16px',
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '1rem', color: timerColor,
              animation: timeLeft <= 20 ? 'pulse 1s ease infinite' : 'none'
            }}>
              ⏱ {timerDisplay}
            </div>
          )}
          {/* Progress */}
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
            {currentIdx + 1} / {questions.length}
          </span>
          {/* Close */}
          <button onClick={() => {
            window.speechSynthesis?.cancel();
            streamRef.current?.getTracks().forEach(t => t.stop());
            navigate('/dashboard');
          }} style={{
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444', borderRadius: 8, padding: '6px 14px',
            cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
          }}>
            ✕ End
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)' }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          background: 'linear-gradient(90deg, #00d4aa, #0099cc)',
          transition: 'width 0.5s ease'
        }} />
      </div>

      {/* ── Main Content ── */}
      <div style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: '340px 1fr',
        gap: 0, overflow: 'hidden'
      }}>

        {/* ── LEFT: Camera ── */}
        <div style={{
          position: 'relative', background: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {/* Video feed */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)', // Mirror
              opacity: camReady ? 1 : 0,
              transition: 'opacity 0.5s ease'
            }}
          />

          {/* Camera not ready */}
          {!camReady && (
            <div style={{ position: 'absolute', textAlign: 'center', color: 'rgba(255,255,255,0.7)', padding: 24 }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>📷</div>
              {camError ? (
                <>
                  <p style={{ fontSize: '0.95rem', marginBottom: 8, color: '#fff' }}>Camera access needed</p>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
                    Click below to enable your camera
                  </p>
                  <button
                    onClick={startCamera}
                    style={{
                      padding: '12px 28px', borderRadius: 10,
                      background: '#00d4aa', border: 'none',
                      color: '#000', fontWeight: 700, fontSize: '0.9rem',
                      cursor: 'pointer', marginBottom: 12, display: 'block', margin: '0 auto 12px'
                    }}
                  >
                    🎥 Enable Camera
                  </button>
                  <button
                    onClick={() => { setCamError(false); setCamReady(true); }}
                    style={{
                      padding: '8px 20px', borderRadius: 8,
                      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                      color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem',
                      cursor: 'pointer', display: 'block', margin: '0 auto'
                    }}
                  >
                    Continue without camera
                  </button>
                </>
              ) : (
                <>
                  <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#00d4aa', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '0.9rem' }}>Starting camera...</p>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
                    Allow camera permission in browser
                  </p>
                </>
              )}
            </div>
          )}

          {/* Overlay gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)',
            pointerEvents: 'none'
          }} />

          {/* Bottom info */}
          <div style={{
            position: 'absolute', bottom: 20, left: 20, right: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
              borderRadius: 10, padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: camReady ? '#22c55e' : '#ef4444' }} />
              <span style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>
                {camReady ? 'Camera Active' : 'No Camera'}
              </span>
            </div>

            {/* Phase indicator */}
            <div style={{
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
              borderRadius: 10, padding: '8px 14px',
              color: phase === 'answering' ? '#00d4aa' : 'rgba(255,255,255,0.6)',
              fontSize: '0.82rem', fontWeight: 600
            }}>
              {phase === 'intro' && '🎬 Starting...'}
              {phase === 'question' && '👂 Listen carefully...'}
              {phase === 'answering' && '✍️ Your turn to answer'}
              {phase === 'feedback' && '📊 Getting feedback...'}
            </div>
          </div>
        </div>

        {/* ── RIGHT: AI + Question + Answer ── */}
        <div style={{
          background: '#0e0e18',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}>

          {/* AI Girl section */}
          <div style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: 14,
            background: aiSpeaking ? 'rgba(168,85,247,0.06)' : 'transparent',
            transition: 'background 0.3s ease'
          }}>
            {/* CSS Avatar */}
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, flexShrink: 0,
              boxShadow: aiSpeaking ? '0 0 20px rgba(168,85,247,0.5)' : '0 0 10px rgba(168,85,247,0.2)',
              animation: aiSpeaking ? 'avatarPulse 1.2s ease infinite' : 'none'
            }}>
              👩‍💼
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: 3 }}>
                Aria · AI Interviewer
              </div>
              <div style={{ fontSize: '0.78rem', color: aiSpeaking ? '#a855f7' : 'rgba(255,255,255,0.35)' }}>
                {aiSpeaking ? '🎙️ Speaking...' : '💬 Listening'}
              </div>
            </div>

            {/* Sound bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 24 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  width: 4, borderRadius: 2,
                  background: 'linear-gradient(180deg, #a855f7, #ec4899)',
                  height: aiSpeaking ? `${8 + Math.random() * 16}px` : '4px',
                  opacity: aiSpeaking ? 1 : 0.2,
                  animation: aiSpeaking ? `wave 0.6s ease infinite` : 'none',
                  animationDelay: `${i * 0.1}s`,
                  transition: 'height 0.1s ease'
                }} />
              ))}
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

            {/* INTRO phase */}
            {phase === 'intro' && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
                <h2 style={{ color: '#fff', fontFamily: 'var(--font-display)', marginBottom: 8 }}>
                  Get Ready!
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Aria is preparing your interview.<br />
                  Make sure your camera is on and you are in a quiet place.
                </p>
                {!camReady && !camError && (
                  <div style={{ marginTop: 20, color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
                    Waiting for camera...
                  </div>
                )}
                {camError && (
                  <button
                    onClick={() => { setCamError(false); startQuestion(); }}
                    style={{
                      marginTop: 20, padding: '10px 24px',
                      background: 'rgba(0,212,170,0.15)', color: '#00d4aa',
                      border: '1px solid rgba(0,212,170,0.3)',
                      borderRadius: 8, cursor: 'pointer', fontWeight: 600
                    }}
                  >
                    Continue without Camera
                  </button>
                )}
              </div>
            )}

            {/* QUESTION / ANSWERING / FEEDBACK phases */}
            {phase !== 'intro' && (
              <>
                {/* Question */}
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, padding: 18, marginBottom: 16,
                  position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                    background: 'linear-gradient(90deg, #00d4aa, #0099cc, transparent)'
                  }} />
                  <div style={{ color: '#00d4aa', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                    Question {currentIdx + 1}
                  </div>
                  <p style={{ color: '#fff', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                    {currentQ?.text}
                  </p>
                </div>

                {/* Answer textarea */}
                {(phase === 'answering' || phase === 'question') && (
                  <AnswerSection
                    phase={phase}
                    answer={answer}
                    setAnswer={setAnswer}
                    submitting={submitting}
                    onSubmit={handleSubmit}
                  />
                )}

                {/* Feedback panel */}
                {phase === 'feedback' && feedback && (
                  <div style={{ animation: 'pageIn 0.4s ease' }}>
                    {/* Score */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${getScoreColor(feedback.score)}30`,
                      borderRadius: 12, padding: 16, marginBottom: 14
                    }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        border: `3px solid ${getScoreColor(feedback.score)}`,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 0 16px ${getScoreColor(feedback.score)}40`
                      }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: getScoreColor(feedback.score), lineHeight: 1 }}>
                          {feedback.score}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>/10</div>
                      </div>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 700, marginBottom: 4, fontSize: '0.88rem' }}>
                          🤖 AI Feedback
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>
                          {feedback.feedback}
                        </p>
                      </div>
                    </div>

                    {/* Strengths */}
                    {feedback.strengths?.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ color: '#22c55e', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
                          ✅ Strengths
                        </div>
                        {feedback.strengths.map((s, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', alignItems: 'flex-start' }}>
                            <span style={{ color: '#22c55e', flexShrink: 0 }}>→</span> {s}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Improvements */}
                    {feedback.suggestions?.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ color: '#f59e0b', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
                          💡 Improvements
                        </div>
                        {feedback.suggestions.map((s, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', alignItems: 'flex-start' }}>
                            <span style={{ color: '#00d4aa', flexShrink: 0 }}>→</span> {s}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Ideal Answer toggle */}
                    <div style={{
                      background: 'rgba(0,212,170,0.06)',
                      border: '1px solid rgba(0,212,170,0.15)',
                      borderRadius: 10, overflow: 'hidden', marginBottom: 16
                    }}>
                      <button
                        onClick={() => setShowAnswer(v => !v)}
                        style={{
                          width: '100%', padding: '10px 16px',
                          background: 'transparent', border: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          cursor: 'pointer', color: '#00d4aa', fontWeight: 700, fontSize: '0.82rem'
                        }}
                      >
                        <span>🎯 Ideal Answer</span>
                        <span>{showAnswer ? '▲ Hide' : '▼ Show'}</span>
                      </button>
                      {showAnswer && (
                        <div style={{ padding: '0 16px 14px', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', lineHeight: 1.7 }}>
                          {feedback.correctAnswer}
                        </div>
                      )}
                    </div>

                    {/* Next button */}
                    <button
                      onClick={handleNext}
                      style={{
                        width: '100%', padding: '13px',
                        background: '#00d4aa', border: 'none',
                        borderRadius: 10, color: '#000',
                        fontWeight: 800, fontSize: '0.95rem',
                        cursor: 'pointer', fontFamily: 'var(--font-display)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={e => e.target.style.filter = 'brightness(1.1)'}
                      onMouseOut={e => e.target.style.filter = 'none'}
                    >
                      {isLast ? '🏆 See Final Results' : 'Next Question →'}
                    </button>
                  </div>
                )}

                {/* Loading feedback */}
                {phase === 'feedback' && !feedback && (
                  <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#00d4aa', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                      Evaluating your answer...
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes avatarPulse { 0%,100%{box-shadow:0 0 10px rgba(168,85,247,0.2)} 50%{box-shadow:0 0 28px rgba(168,85,247,0.6)} }
        @keyframes wave { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(2.2)} }
        @keyframes pageIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
