
"use client";

import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomCalendarProps {
    value: Date | null;
    onChange: (date: Date) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ value, onChange }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-4 px-2">
                <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    type="button"
                    className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="font-bold text-slate-800 text-lg">
                    {format(currentMonth, 'MMMM yyyy')}
                </div>
                <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    type="button"
                    className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const dateFormat = "EEEE";
        const startDate = startOfWeek(currentMonth);

        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center py-2">
                    {format(addDays(startDate, i), dateFormat).substring(0, 2)}
                </div>
            );
        }

        return <div className="grid grid-cols-7 mb-2 border-b border-gray-100 pb-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;

                const isSelected = value ? isSameDay(day, value) : false;
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isDayToday = isToday(day);

                days.push(
                    <div
                        key={day.toString()}
                        className={`relative h-10 w-full flex items-center justify-center cursor-pointer rounded-lg transition-all duration-200 text-sm font-medium
                            ${!isCurrentMonth ? "text-gray-300 pointer-events-none" : isSelected
                                ? "bg-slate-900 text-white shadow-md transform scale-105"
                                : "text-slate-700 hover:bg-orange-50 hover:text-orange-600"}
                            ${isDayToday && !isSelected ? "border border-orange-200 bg-orange-50 font-bold" : ""}
                        `}
                        onClick={() => {
                            if (isCurrentMonth) {
                                onChange(cloneDay);
                            }
                        }}
                    >
                        <span>{formattedDate}</span>
                        {isSelected && (
                            <span className="absolute -bottom-1 w-1 h-1 bg-orange-500 rounded-full"></span>
                        )}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 gap-1" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="space-y-1">{rows}</div>;
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
};

export default CustomCalendar;
