"use client";

import { useEffect, useState } from 'react';
// Wait, I didn't install date-fns. I'll use native JS.

interface CountdownProps {
    targetDate: string; // ISO string
}

export default function Countdown({ targetDate }: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const difference = target - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                });
            } else {
                setTimeLeft(null); // Time passed
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) {
        return <div className="text-gray-500">Lesson is starting or passed!</div>;
    }

    return (
        <div className="flex gap-4 text-center">
            <div className="flex flex-col rounded-lg bg-slate-100 p-2 min-w-[60px]">
                <span className="text-2xl font-bold text-orange-600">{timeLeft.days}</span>
                <span className="text-xs text-gray-500 uppercase">Days</span>
            </div>
            <div className="flex flex-col rounded-lg bg-slate-100 p-2 min-w-[60px]">
                <span className="text-2xl font-bold text-slate-800">{timeLeft.hours}</span>
                <span className="text-xs text-gray-500 uppercase">Hrs</span>
            </div>
            <div className="flex flex-col rounded-lg bg-slate-100 p-2 min-w-[60px]">
                <span className="text-2xl font-bold text-slate-800">{timeLeft.minutes}</span>
                <span className="text-xs text-gray-500 uppercase">Mins</span>
            </div>
        </div>
    );
}
