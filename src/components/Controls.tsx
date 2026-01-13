import React from 'react';
import { clsx } from 'clsx';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { TimerStatus } from '../hooks/useTimer';

interface ControlsProps {
    status: TimerStatus;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ status, onStart, onPause, onReset }) => {
    return (
        <div className="flex gap-6 mt-12 items-center">
            {status === 'running' ? (
                <button
                    onClick={onPause}
                    className="group relative flex items-center justify-center w-20 h-20 bg-white border-2 border-gray-100 rounded-full shadow-sm hover:shadow-md hover:border-gray-200 transition-all active:scale-95"
                    aria-label="Pause timer"
                >
                    <Pause className="w-8 h-8 text-gray-700 fill-gray-700" />
                    <span className="absolute -bottom-8 text-sm text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Pause</span>
                </button>
            ) : (
                <button
                    onClick={onStart}
                    className={clsx(
                        "group relative flex items-center justify-center w-20 h-20 rounded-full shadow-xl shadow-blue-500/20 transition-all active:scale-95",
                        status === 'finished' ? "bg-navy hover:bg-slate-800" : "bg-primary hover:bg-blue-700"
                    )}
                    aria-label={status === 'paused' ? "Resume timer" : "Start timer"}
                >
                    <Play className={clsx("w-8 h-8 text-white fill-white ml-1")} />
                    <span className="absolute -bottom-8 text-sm text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {status === 'paused' ? 'Resume' : 'Start'}
                    </span>
                </button>
            )}

            {(status === 'paused' || status === 'finished') && (
                <button
                    onClick={onReset}
                    className="group relative flex items-center justify-center w-14 h-14 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors active:scale-95"
                    aria-label="Reset timer"
                >
                    <RotateCcw className="w-6 h-6 text-gray-500" />
                    <span className="absolute -bottom-8 text-sm text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Reset</span>
                </button>
            )}
        </div>
    );
};
