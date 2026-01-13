import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Settings } from 'lucide-react';

interface CustomInputProps {
    onSet: (minutes: number) => void;
    disabled?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({ onSet, disabled }) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValue(val);
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const num = parseInt(value, 10);
        if (isNaN(num)) {
            setError('Enter a number');
            return;
        }
        if (num < 1 || num > 180) {
            setError('1-180 min');
            return;
        }
        onSet(num);
        setValue('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 mt-4 relative">
            <div className="flex items-center gap-2">
                <div className="relative">
                    <input
                        type="number"
                        min="1"
                        max="180"
                        value={value}
                        onChange={handleChange}
                        disabled={disabled}
                        placeholder="Custom (min)"
                        className={clsx(
                            "w-36 px-4 py-2 rounded-lg border focus:ring-2 outline-none transition-all text-center",
                            error ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:border-primary focus:ring-blue-100",
                            disabled && "bg-gray-50 text-gray-400 cursor-not-allowed"
                        )}
                    />
                </div>
                <button
                    type="submit"
                    disabled={disabled || !value}
                    className={clsx(
                        "p-2 rounded-lg transition-colors",
                        disabled ? "text-gray-300" : "text-gray-500 hover:text-primary bg-gray-100 hover:bg-blue-50"
                    )}
                    aria-label="Set custom time"
                >
                    <Settings size={20} />
                </button>
            </div>
            {error && (
                <span className="text-xs text-red-500 font-medium absolute top-full mt-1 animate-pulse">
                    {error}
                </span>
            )}
        </form>
    );
};
