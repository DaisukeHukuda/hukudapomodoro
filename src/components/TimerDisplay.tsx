import React from 'react';
import { clsx } from 'clsx';
import { TimerStatus } from '../hooks/useTimer';

interface TimerDisplayProps {
    remainingSeconds: number;
    status: TimerStatus;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ remainingSeconds, status }) => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Document title update side effect (simple one)
    React.useEffect(() => {
        document.title = `${formattedTime} - Pomodoro Timer`;
        if (status === 'finished') document.title = 'Time\'s Up! - Pomodoro Timer';
    }, [formattedTime, status]);

    return (
        <div className="flex flex-col items-center justify-center z-10 absolute inset-0 pointer-events-none">
            <div
                className={clsx(
                    "text-6xl md:text-8xl font-bold tracking-tighter tabular-nums transition-colors duration-300",
                    status === 'finished' ? "text-navy" : "text-navy"
                )}
                aria-label={`Time remaining: ${minutes} minutes and ${seconds} seconds`}
            >
                {formattedTime}
            </div>
            <div className={clsx(
                "text-lg font-medium tracking-wide uppercase mt-2 transition-opacity duration-300",
                status === 'idle' ? "text-gray-400 opacity-100" :
                    status === 'paused' ? "text-gray-500 opacity-100" :
                        status === 'finished' ? "text-primary font-bold opacity-100" : "opacity-0"
            )}>
                {status === 'idle' ? 'Ready' :
                    status === 'paused' ? 'Paused' :
                        status === 'finished' ? 'Time\'s Up' : 'Running'}
            </div>
        </div>
    );
};
