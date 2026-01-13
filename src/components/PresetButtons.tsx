import React from 'react';
import { clsx } from 'clsx';

interface PresetButtonsProps {
    onSelect: (minutes: number) => void;
    currentDurationSeconds: number;
    disabled?: boolean;
}

const PRESETS = [5, 10, 20];

export const PresetButtons: React.FC<PresetButtonsProps> = ({ onSelect, currentDurationSeconds, disabled }) => {
    return (
        <div className="flex gap-4 justify-center py-6">
            {PRESETS.map((p) => {
                const isSelected = p * 60 === currentDurationSeconds;
                return (
                    <button
                        key={p}
                        onClick={() => onSelect(p)}
                        disabled={disabled}
                        className={clsx(
                            "px-6 py-2 rounded-full font-medium transition-all duration-200 active:scale-95",
                            isSelected
                                ? "bg-primary text-white shadow-lg shadow-blue-500/30"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                            disabled && !isSelected && "opacity-50 cursor-not-allowed hover:bg-gray-100"
                        )}
                        aria-label={`Set timer to ${p} minutes`}
                        aria-pressed={isSelected}
                    >
                        {p} min
                    </button>
                );
            })}
        </div>
    );
};
