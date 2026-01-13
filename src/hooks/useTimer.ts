import { useState, useEffect, useRef, useCallback } from 'react';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

interface UseTimerProps {
    initialDurationSeconds?: number;
    onFinish?: () => void;
}

export const useTimer = ({ initialDurationSeconds = 25 * 60, onFinish }: UseTimerProps = {}) => {
    const [duration, setDuration] = useState(initialDurationSeconds);
    const [remaining, setRemaining] = useState(initialDurationSeconds);
    const [status, setStatus] = useState<TimerStatus>('idle');

    const endTimeRef = useRef<number | null>(null);
    const frameIdRef = useRef<number | null>(null);

    const calculateRemaining = useCallback(() => {
        if (!endTimeRef.current) return 0;
        const now = Date.now();
        const diff = Math.ceil((endTimeRef.current - now) / 1000);
        return Math.max(0, diff);
    }, []);

    const tick = useCallback(() => {
        if (status !== 'running') return;

        const nextRemaining = calculateRemaining();
        setRemaining(nextRemaining);

        if (nextRemaining <= 0) {
            setStatus('finished');
            if (onFinish) onFinish();
        } else {
            frameIdRef.current = requestAnimationFrame(tick);
        }
    }, [status, calculateRemaining, onFinish]);

    useEffect(() => {
        if (status === 'running') {
            frameIdRef.current = requestAnimationFrame(tick);
        } else if (frameIdRef.current) {
            cancelAnimationFrame(frameIdRef.current);
        }
        return () => {
            if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
        };
    }, [status, tick]);

    const start = useCallback(() => {
        if (status === 'running') return;

        // If starting from idle or finished, reset
        if (status === 'idle' || status === 'finished') {
            const now = Date.now();
            endTimeRef.current = now + duration * 1000;
            setRemaining(duration);
        } else if (status === 'paused') {
            // Resume
            const now = Date.now();
            endTimeRef.current = now + remaining * 1000;
        }

        setStatus('running');
    }, [status, duration, remaining]);

    const pause = useCallback(() => {
        if (status !== 'running') return;
        setStatus('paused');
        // remaining is already updated in state
        if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    }, [status]);

    const reset = useCallback(() => {
        setStatus('idle');
        setRemaining(duration);
        endTimeRef.current = null;
        if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    }, [duration]);

    const setTimerDuration = useCallback((seconds: number) => {
        setDuration(seconds);
        setRemaining(seconds);
        setStatus('idle');
        endTimeRef.current = null;
    }, []);

    return {
        remaining,
        duration,
        status,
        start,
        pause,
        reset,
        setDuration: setTimerDuration,
    };
};
