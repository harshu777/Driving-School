import { useState, useEffect, useMemo } from 'react';

interface HasTime {
    start_time: string;
    [key: string]: any;
}

export function useDateTabs<T extends HasTime>(items: T[]) {
    // 1. Extract unique dates and sort them
    const uniqueDates = useMemo(() => {
        const dates = items.map(item => {
            // Use local date for grouping, not UTC
            const date = new Date(item.start_time);
            return date.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
        });
        return Array.from(new Set(dates)).sort();
    }, [items]);

    // 2. Determine display dates (fallback to today if empty)
    const displayDates = useMemo(() => {
        return uniqueDates.length > 0 ? uniqueDates : [new Date().toISOString().split('T')[0]];
    }, [uniqueDates]);

    // 3. State for active tab. Tries to find today in items, otherwise defaults to today's date string.
    const [activeTab, setActiveTab] = useState<string>(() => {
        const today = new Date().toLocaleDateString('en-CA');
        return today;
    });

    // 4. Auto-select logic:
    // Ensure activeTab is valid. If the current activeTab is NOT in the new set of dates, pick a new one.
    useEffect(() => {
        if (uniqueDates.length > 0 && !uniqueDates.includes(activeTab)) {
            const today = new Date().toLocaleDateString('en-CA');
            if (uniqueDates.includes(today)) {
                setActiveTab(today);
            } else {
                setActiveTab(uniqueDates[0]);
            }
        }
    }, [uniqueDates, activeTab]);

    // 5. Helper to get items for the active tab
    const activeItems = useMemo(() => {
        return items.filter(item => {
            const date = new Date(item.start_time);
            return date.toLocaleDateString('en-CA') === activeTab;
        });
    }, [items, activeTab]);

    return {
        activeTab,
        setActiveTab,
        displayDates,
        uniqueDates,
        activeItems
    };
}
