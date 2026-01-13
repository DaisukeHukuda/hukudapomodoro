import React, { useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { useTimer } from './hooks/useTimer';
import { TimerDisplay } from './components/TimerDisplay';
import { ProgressRing } from './components/ProgressRing';
import { Controls } from './components/Controls';
import { PresetButtons } from './components/PresetButtons';
import { CustomInput } from './components/CustomInput';

// Reliable bell sound effect (Classic Desk Bell)
const BELL_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    remaining,
    duration,
    status,
    start,
    pause,
    reset,
    setDuration
  } = useTimer({
    initialDurationSeconds: 25 * 60,
    onFinish: () => {
      // Play sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      }
      // Vibrate if on mobile
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  });

  const progress = duration > 0 ? remaining / duration : 0;

  // Preload audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, []);

  const handleSetTime = (minutes: number) => {
    setDuration(minutes * 60);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-navy overflow-hidden relative">
      {/* Background decorative blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vh] h-[50vh] bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vh] h-[50vh] bg-slate-200 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className={clsx(
        "relative bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl p-8 md:p-12 w-full max-w-[420px] mx-auto transition-all duration-500",
        status === 'finished' ? "shadow-blue-900/20 ring-4 ring-navy/5 scale-[1.02]" : "shadow-slate-200/50"
      )}>
        <audio ref={audioRef} src={BELL_URL} preload="auto" />

        <div className="flex flex-col items-center">
          {/* Header */}
          <h1 className="text-xl font-bold tracking-tight text-slate-800 mb-8 lowercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary block"></span>
            pomodoro timer
          </h1>

          {/* Timer Visualization */}
          <div className="relative mb-8">
            <ProgressRing
              progress={progress}
              isFinished={status === 'finished'}
              size={280}
              strokeWidth={8}
            />
            <TimerDisplay remainingSeconds={remaining} status={status} />
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center w-full gap-4">
            <Controls
              status={status}
              onStart={start}
              onPause={pause}
              onReset={reset}
            />

            <div className={clsx(
              "w-full transition-all duration-500 ease-in-out overflow-hidden",
              status === 'idle' ? "max-h-60 opacity-100 translate-y-0" : "max-h-0 opacity-0 translate-y-4"
            )}>
              <div className="pt-8 border-t border-gray-100 w-full flex flex-col items-center">
                <p className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider text-[10px]">Set Duration</p>
                <PresetButtons
                  onSelect={handleSetTime}
                  currentDurationSeconds={duration}
                />
                <CustomInput onSet={handleSetTime} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-gray-400 text-sm font-medium text-center">
        Designed for Focus
      </footer>
    </div>
  )
}

export default App
