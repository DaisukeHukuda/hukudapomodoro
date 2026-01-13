import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

// --- Types ---
type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

// --- Audio Utility ---

// --- Helper Functions ---
const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const POMODORO_KEY = 'pomodoro_custom_minutes';

export default function App() {
    // --- State ---
    const [status, setStatus] = useState<TimerStatus>('idle');
    const [durationMs, setDurationMs] = useState<number>(25 * 60 * 1000); // Default 25m or user selection
    const [timeLeft, setTimeLeft] = useState<number>(25 * 60 * 1000);
    const [customMinutes, setCustomMinutes] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');

    // We use refs for precise timing to avoid closure staleness issues in intervals
    const endTimeRef = useRef<number>(0);
    const rafRef = useRef<number | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Load custom minutes from storage
    useEffect(() => {
        const stored = localStorage.getItem(POMODORO_KEY);
        if (stored) setCustomMinutes(stored);

        return () => {
            // Cleanup audio context on unmount
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
            }
        };
    }, []);

    const playBell = () => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.5);

            gain.gain.setValueAtTime(0.5, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 1.5);
        } catch (e) {
            console.error("Audio playback failed", e);
        }
    };

    const ensureAudioContext = () => {
        if (!audioCtxRef.current) {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
                audioCtxRef.current = new AudioCtx();
            }
        }
        // Resume if suspended (common in some browsers until interaction)
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    };

    // --- Timer Logic ---
    const tick = () => {
        const now = Date.now();
        const remaining = endTimeRef.current - now;

        if (remaining <= 0) {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            playBell();
            setStatus('finished');
            setTimeLeft(0);
        } else {
            setTimeLeft(remaining);
            rafRef.current = requestAnimationFrame(tick);
        }
    };

    const startTimer = (ms: number) => {
        ensureAudioContext(); // Initialize audio on user gesture

        setDurationMs(ms);
        setTimeLeft(ms);
        setStatus('running');
        setErrorMsg('');

        endTimeRef.current = Date.now() + ms;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(tick);
    };

    const pauseTimer = () => {
        setStatus('paused');
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };

    const resumeTimer = () => {
        setStatus('running');
        // Calculate new end time based on current timeLeft
        endTimeRef.current = Date.now() + timeLeft;
        rafRef.current = requestAnimationFrame(tick);
    };

    const resetTimer = () => {
        setStatus('idle');
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        // Reset to what? Let's reset to the last selected duration or 0? 
        // Usually "Reset" goes back to IDLE state waiting for input.
        // Let's keep the last duration in timeLeft for display purposes
        setTimeLeft(durationMs);
    };

    // --- Handlers ---
    const handlePresetClick = (minutes: number) => {
        const ms = minutes * 60 * 1000;
        startTimer(ms);
    };

    const handleCustomStart = () => {
        const mins = parseInt(customMinutes, 10);
        if (isNaN(mins) || mins < 1 || mins > 180) {
            setErrorMsg('1〜180の整数を入力してください');
            return;
        }
        localStorage.setItem(POMODORO_KEY, customMinutes);
        startTimer(mins * 60 * 1000);
    };

    // Calculate progress for UI
    const progressPercentage = durationMs > 0 ? (timeLeft / durationMs) * 100 : 0;
    // Invert for "filling up" or "depleting"? Usually timer depletes.
    // Let's show "depleting" bar => width = percentage.

    return (
        <div className="container">
            <div className="card">
                <h1 className="title">Pomodoro Timer</h1>

                {/* --- Timer Display --- */}
                <div className="timer-display">
                    <div className="time-text">{formatTime(timeLeft)}</div>
                    <div className="progress-bar-bg">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${Math.max(0, progressPercentage)}%` }}
                        />
                    </div>
                </div>

                {/* --- Controls / Inputs --- */}
                <div className="controls">
                    {status === 'idle' || status === 'finished' ? (
                        <div className="setup-panel">
                            <div className="presets">
                                <button onClick={() => handlePresetClick(5)}>5分</button>
                                <button onClick={() => handlePresetClick(10)}>10分</button>
                                <button onClick={() => handlePresetClick(20)}>20分</button>
                            </div>

                            <div className="custom-input">
                                <input
                                    type="number"
                                    placeholder="分"
                                    value={customMinutes}
                                    onChange={(e) => setCustomMinutes(e.target.value)}
                                    min="1"
                                    max="180"
                                />
                                <button className="btn-primary" onClick={handleCustomStart}>START</button>
                            </div>
                            {errorMsg && <p className="error-msg">{errorMsg}</p>}
                        </div>
                    ) : (
                        <div className="action-buttons">
                            {status === 'running' && (
                                <button className="btn-secondary" onClick={pauseTimer}>PAUSE</button>
                            )}
                            {status === 'paused' && (
                                <button className="btn-primary" onClick={resumeTimer}>RESUME</button>
                            )}
                            <button className="btn-danger" onClick={resetTimer}>RESET</button>
                        </div>
                    )}
                </div>

                {/* --- Status Message --- */}
                {status === 'finished' && (
                    <div className="finished-message">
                        Time's Up! 🔔
                    </div>
                )}
            </div>

            <style>{`
        /* Local Styles for Component */
        .container {
          width: 100%;
          max-width: 480px;
          padding: 20px;
        }
        .card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          text-align: center;
        }
        .title {
          color: var(--color-secondary);
          margin-bottom: 30px;
          font-weight: 700;
        }
        .timer-display {
          margin-bottom: 40px;
        }
        .time-text {
          font-size: 5rem;
          font-weight: 800;
          color: var(--color-primary);
          font-variant-numeric: tabular-nums;
          line-height: 1;
          margin-bottom: 20px;
        }
        .progress-bar-bg {
          width: 100%;
          height: 8px;
          background: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--color-primary);
          transition: width 0.1s linear; /* Smooth update */
        }
        
        .presets {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 20px;
        }
        .presets button {
          background: #f5f7fa;
          color: var(--color-secondary);
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
        }
        .presets button:hover {
          background: var(--color-accent);
          color: var(--color-primary);
        }

        .custom-input {
          display: flex;
          gap: 10px;
          justify-content: center;
          align-items: center;
        }
        .custom-input input {
          width: 80px;
          padding: 10px;
          font-size: 1rem;
          border: 2px solid #ddd;
          border-radius: 8px;
          text-align: center;
        }
        .btn-primary {
          background: var(--color-primary);
          color: white;
          padding: 10px 30px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
        }
        .btn-primary:hover {
          background: var(--color-secondary);
          transform: translateY(-1px);
        }
        .btn-secondary {
          background: #f0f0f0;
          color: var(--color-text);
          padding: 10px 30px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
        }
        .btn-secondary:hover {
          background: #e0e0e0;
        }
        .btn-danger {
          background: transparent;
          color: #ff4d4f;
          padding: 10px 20px;
          font-weight: 600;
        }
        .btn-danger:hover {
          background: #fff0f0;
          border-radius: 8px;
        }
        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }
        .finished-message {
          margin-top: 20px;
          font-size: 1.5rem;
          color: var(--color-primary);
          animation: bounce 0.5s ease;
        }
        .error-msg {
          color: #ff4d4f;
          font-size: 0.9rem;
          margin-top: 10px;
        }

        @keyframes bounce {
          0% { transform: scale(0.9); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 480px) {
          .time-text { font-size: 4rem; }
          .card { padding: 20px; }
        }
      `}</style>
        </div>
    );
}
