import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';

interface ProgressRingProps {
    progress: number; // 0 to 1
    size?: number;
    strokeWidth?: number;
    className?: string;
    isFinished?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
    progress,
    size = 320,
    strokeWidth = 12,
    className,
    isFinished
}) => {
    const [offset, setOffset] = useState(0);
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        const progressOffset = ((1 - progress) * circumference);
        setOffset(progressOffset);
    }, [progress, circumference]);

    return (
        <div className={clsx("relative flex items-center justify-center", className)}>
            <svg
                className="transform -rotate-90 transition-all duration-500 ease-in-out"
                width={size}
                height={size}
            >
                <circle
                    className="text-gray-100"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={center}
                    cy={center}
                />
                <circle
                    className={clsx(
                        "transition-all duration-500 ease-in-out",
                        isFinished ? "text-navy" : "text-primary"
                    )}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={center}
                    cy={center}
                />
            </svg>
            {/* Background glow or embellishments could go here */}
        </div>
    );
};
