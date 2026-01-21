import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface PomodoroTimerProps {
    isStyle2?: boolean;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ isStyle2 = false }) => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);

    const workDuration = 25 * 60; // 25 minutes in seconds
    const breakDuration = 5 * 60; // 5 minutes in seconds

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        // Timer completed
                        setIsActive(false);
                        if (isBreak) {
                            // Break ended, switch to work
                            setMinutes(25);
                            setIsBreak(false);
                        } else {
                            // Work ended, switch to break
                            setMinutes(5);
                            setIsBreak(true);
                        }
                        setSeconds(0);
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        } else if (!isActive && interval) {
            clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, minutes, seconds, isBreak]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsBreak(false);
        setMinutes(25);
        setSeconds(0);
    };

    const totalSeconds = isBreak ? breakDuration : workDuration;
    const currentSeconds = minutes * 60 + seconds;
    const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

    const primaryColor = isStyle2 ? 'bg-brand-warm-orange' : 'bg-brand-blue';
    const primaryColorText = isStyle2 ? 'text-brand-warm-orange' : 'text-brand-blue';
    const gradientFrom = isStyle2 ? 'from-brand-warm-orange' : 'from-brand-blue';
    const gradientTo = isStyle2 ? 'to-brand-warm-amber' : 'to-purple-600';

    return (
        <div className="relative">
            {/* Progress Circle */}
            <div className="relative w-64 h-64 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-slate-200"
                    />
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 120}`}
                        strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                        className={`${primaryColorText} transition-all duration-1000`}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Timer Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-6xl font-black text-brand-dark tracking-tighter">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                    <div className={`text-sm font-bold tracking-widest uppercase mt-2 ${primaryColorText}`}>
                        {isBreak ? 'Mola Zamanı' : 'Çalışma Zamanı'}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4 mt-8">
                <button
                    onClick={toggleTimer}
                    className={`w-16 h-16 rounded-full ${primaryColor} text-white flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl`}
                >
                    {isActive ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                </button>
                <button
                    onClick={resetTimer}
                    className="w-16 h-16 rounded-full bg-slate-200 text-brand-dark flex items-center justify-center hover:bg-slate-300 hover:scale-110 transition-all duration-300 shadow-lg"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>
            </div>

            {/* Info */}
            <div className="mt-6 text-center">
                <p className="text-sm text-slate-500 font-medium">
                    {isBreak ? '5 dakika mola sonrası tekrar çalışmaya başlayın' : '25 dakika odaklanmış çalışma'}
                </p>
            </div>
        </div>
    );
};

export default PomodoroTimer;
