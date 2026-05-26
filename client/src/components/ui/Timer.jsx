import React, { useState, useEffect, useRef } from 'react';

export default function Timer({ duration = 120, onExpire, isRunning = true }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);
  const expiredRef = useRef(false);

  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  useEffect(() => {
    setTimeLeft(duration);
    expiredRef.current = false;
  }, [duration]);

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
      return;
    }

    expiredRef.current = false;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          // Use setTimeout to avoid setState during render
          if (!expiredRef.current) {
            expiredRef.current = true;
            setTimeout(() => onExpireRef.current?.(), 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const pct = Math.round((timeLeft / duration) * 100);

  const getClass = () => {
    if (timeLeft <= 20) return 'timer-ring danger';
    if (timeLeft <= 50) return 'timer-ring warning';
    return 'timer-ring';
  };

  return (
    <div className={getClass()} title={`${pct}% time remaining`}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2"/>
        <circle
          cx="9" cy="9" r="7.5"
          stroke="currentColor" strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 7.5}`}
          strokeDashoffset={`${2 * Math.PI * 7.5 * (1 - pct / 100)}`}
          transform="rotate(-90 9 9)"
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      {display}
    </div>
  );
}
