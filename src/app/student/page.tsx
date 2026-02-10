"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/components/auth-provider';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import ProgressBar from '@/components/ProgressBar';
import Countdown from '@/components/Countdown';
import { useDateTabs } from '@/hooks/useDateTabs';
import LicenseHub from '@/components/LicenseHub';

interface Slot {
    id: number;
    start_time: string;
    instructor_name: string;
    status: 'available';
    booked_count: number;
    max_students: number;
}

interface ProgressData {
    upcoming: { id: number; start_time: string; instructor_name: string }[];
    completed: { id: number; start_time: string; instructor_name: string }[];
    progressPercentage: number;
    totalLessons: number;
}

export default function StudentDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
    const [progress, setProgress] = useState<ProgressData>({ upcoming: [], completed: [], progressPercentage: 0, totalLessons: 0 });
    const [bookingLoading, setBookingLoading] = useState<number | null>(null); // slot id being booked
    const [error, setError] = useState('');

    // Use Shared Hook
    const { activeTab, setActiveTab, displayDates, activeItems: currentDaySlots } = useDateTabs(availableSlots);

    useEffect(() => {
        if (!loading && (!user || user.role !== 'student')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const fetchData = useCallback(async () => {
        if (!user) return;
        try {
            const [slotsRes, progressRes] = await Promise.all([
                fetch('/api/student/slots', { headers: { 'x-user-id': user.id.toString() } }),
                fetch('/api/student/progress', { headers: { 'x-user-id': user.id.toString() } })
            ]);

            if (slotsRes.ok) setAvailableSlots(await slotsRes.json());
            if (progressRes.ok) setProgress(await progressRes.json());
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [user]);

    useEffect(() => {
        if (user) fetchData();
    }, [user, fetchData]);

    const handleBookSlot = async (slotId: number) => {
        if (!user) return;
        setBookingLoading(slotId);
        setError('');
        try {
            const res = await fetch('/api/student/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user.id.toString()
                },
                body: JSON.stringify({ slotId: slotId }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to book slot');
                return;
            }

            // Refresh data
            fetchData();
        } catch (error) {
            setError('An error occurred while booking');
        } finally {
            setBookingLoading(null);
        }
    };

    const nextLesson = progress.upcoming.length > 0 ? progress.upcoming[0] : null;

    // View State for Logbook
    const [view, setView] = useState<'book' | 'history' | 'license'>('book');
    const [history, setHistory] = useState<any[]>([]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        if (view === 'history' && user) {
            setCurrentPage(1); // Reset page on view change
            fetch('/api/student/history', {
                headers: { 'x-user-id': user.id.toString() }
            })
                .then(res => res.json())
                .then(data => setHistory(Array.isArray(data) ? data : []))
                .catch(console.error);
        }
    }, [view, user]);

    if (!user || user.role !== 'student') return null;

    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Dashboard</h1>
                        <p className="mt-2 text-gray-600">Track your progress and book your next lesson.</p>
                    </div>
                    <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg mt-4 md:mt-0">
                        <button
                            onClick={() => setView('book')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'book' ? 'bg-white text-slate-900 shadow' : 'text-gray-600 hover:text-slate-900'}`}
                        >
                            Book Lesson
                        </button>
                        <button
                            onClick={() => setView('history')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'history' ? 'bg-white text-slate-900 shadow' : 'text-gray-600 hover:text-slate-900'}`}
                        >
                            My Logbook
                        </button>
                        <button
                            onClick={() => setView('license')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'license' ? 'bg-white text-slate-900 shadow' : 'text-gray-600 hover:text-slate-900'}`}
                        >
                            License
                        </button>
                    </div>
                </header>

                {/* Pending Approval Banner */}
                {user.status === 'pending' && (
                    <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-3 flex-1">
                                <h3 className="text-lg font-bold text-yellow-800">Account Pending Approval</h3>
                                <p className="mt-2 text-sm text-yellow-700">
                                    Your account is currently pending instructor approval. You can view your dashboard, but you won't be able to book lessons until an instructor approves your account.
                                </p>
                                <p className="mt-1 text-xs text-yellow-600">
                                    This usually takes 24-48 hours. You'll receive access once approved.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {user.status === 'rejected' && (
                    <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-3 flex-1">
                                <h3 className="text-lg font-bold text-red-800">Account Not Approved</h3>
                                <p className="mt-2 text-sm text-red-700">
                                    Your account registration was not approved. Please contact an instructor for more information.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-8">
                    {/* My Progress - Always Visible */}
                    <section className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center text-center lg:col-span-1">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center w-full justify-center">
                            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                            My Progress
                        </h2>
                        <div className="mb-4">
                            <div className="relative flex items-center justify-center">
                                <svg className="transform -rotate-90 w-32 h-32">
                                    <circle cx="64" cy="64" r="58" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                                    <circle cx="64" cy="64" r="58" stroke="#ea580c" strokeWidth="8" fill="transparent"
                                        strokeDasharray={364}
                                        strokeDashoffset={364 - (progress.progressPercentage / 100) * 364}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-bold text-slate-800">{Math.round(progress.progressPercentage)}%</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-500 mt-2">{progress.totalLessons} Lessons Completed</p>
                        <p className="text-sm text-gray-400">Goal: 10 Lessons</p>
                    </section>

                    {/* Next Lesson - Always Visible */}
                    <section className="bg-white shadow rounded-lg p-6 lg:col-span-2">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                            <Clock className="mr-2 h-5 w-5 text-orange-600" />
                            Next Lesson
                        </h2>
                        {nextLesson ? (
                            <div className="bg-slate-50 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between border border-slate-200">
                                <div className="mb-4 sm:mb-0">
                                    <p className="text-lg font-bold text-slate-900">{new Date(nextLesson.start_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })}</p>
                                    <p className="text-gray-600">Instructor: {nextLesson.instructor_name}</p>
                                </div>
                                <Countdown targetDate={nextLesson.start_time} />
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200">
                                <p className="text-gray-500">No upcoming lessons scheduled.</p>
                                <p className="text-sm text-gray-400 mt-1">Book a slot below to get started!</p>
                            </div>
                        )}
                    </section>
                </div>

                {/* Conditional View */}
                {view === 'book' ? (
                    <section className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                            <Calendar className="mr-2 h-5 w-5 text-orange-600" />
                            Book a Lesson
                        </h2>

                        {error && (
                            <div className="mb-4 rounded bg-red-100 p-3 text-red-700 flex items-center">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                {error}
                            </div>
                        )}

                        {/* Date Tabs */}
                        <div className="flex space-x-2 overflow-x-auto pb-4 mb-4 border-b border-gray-200">
                            {displayDates.map((dateStr) => {
                                const date = new Date(dateStr);
                                const isSelected = activeTab === dateStr;
                                const isToday = dateStr === new Date().toISOString().split('T')[0];

                                return (
                                    <button
                                        key={dateStr}
                                        onClick={() => setActiveTab(dateStr)}
                                        className={`
                                            flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                                            ${isSelected
                                                ? 'bg-slate-900 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                                        `}
                                    >
                                        <span className="block text-xs opacity-75 uppercase tracking-wider">
                                            {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                                        </span>
                                        <span className="block text-lg">
                                            {date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Slots Grid for Active Tab */}
                        {currentDaySlots.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p>No available slots for this day.</p>
                                <p className="text-sm">Try selecting another date.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {currentDaySlots
                                    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                                    .map(slot => (
                                        <div key={slot.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-slate-50">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${(slot.max_students - slot.booked_count) <= 1
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {slot.max_students - slot.booked_count} spots left
                                                </span>
                                            </div>
                                            <p className="text-lg font-bold text-slate-900 mb-1">
                                                {new Date(slot.start_time).toLocaleDateString(undefined, { weekday: 'long' })}
                                            </p>
                                            <p className="text-md text-slate-700 mb-3">
                                                {new Date(slot.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })}
                                            </p>
                                            <p className="text-sm text-gray-500 mb-4">Instructor: {slot.instructor_name}</p>

                                            <button
                                                onClick={() => handleBookSlot(slot.id)}
                                                disabled={bookingLoading === slot.id || user.status !== 'approved'}
                                                className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {bookingLoading === slot.id ? 'Booking...' : user.status !== 'approved' ? 'Approval Required' : 'Book Slot'}
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </section>
                ) : view === 'history' ? (
                    <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-100 flex flex-col">
                        <div className="p-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                                    <CheckCircle className="mr-2 h-6 w-6 text-green-600" />
                                    My Driving Record
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">Track your progress and instructor feedback.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                                    <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Total Km</p>
                                    <p className="text-xl font-bold text-slate-900">
                                        {history.reduce((acc, curr) => acc + (Number(curr.km_driven) || 0), 0)}
                                    </p>
                                </div>
                                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Lessons</p>
                                    <p className="text-xl font-bold text-slate-900">{history.length}</p>
                                </div>
                            </div>
                        </div>

                        {history.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-slate-900 font-medium mb-1">No Records Found</h3>
                                <p className="text-slate-500 text-sm">You haven't completed any lessons yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-100">
                                        <thead>
                                            <tr className="bg-slate-50/80">
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Instructor</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Distance</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Performance</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-slate-100">
                                            {history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((entry, index) => (
                                                <tr key={entry.booking_id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-slate-900">
                                                                {new Date(entry.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                            </span>
                                                            <span className="text-xs text-slate-500">
                                                                {new Date(entry.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                                                        {entry.instructor_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                                            {entry.km_driven ? `${entry.km_driven} km` : '-'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${entry.grade === 'Excellent' ? 'bg-green-50 text-green-700 border-green-100' :
                                                                entry.grade === 'Good' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                    entry.grade === 'Average' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                                        'bg-gray-50 text-gray-700 border-gray-100'
                                                                }`}>
                                                                {entry.grade || 'Not Graded'}
                                                            </span>
                                                            {entry.status === 'completed' && (
                                                                <div className="group relative">
                                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">
                                                                        Verified
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm text-slate-600 max-w-xs truncate" title={entry.instructor_notes}>
                                                            {entry.instructor_notes || '-'}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Controls */}
                                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-100 sm:px-6">
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-slate-500">
                                                    Rows per page:
                                                </span>
                                                <select
                                                    value={itemsPerPage}
                                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                                    className="block w-16 rounded-md border-gray-200 py-1 text-sm focus:border-slate-500 focus:ring-slate-500"
                                                >
                                                    <option value={10}>10</option>
                                                    <option value={20}>20</option>
                                                    <option value={50}>50</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-slate-600">
                                                Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{Math.ceil(history.length / itemsPerPage)}</span>
                                            </span>
                                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <span className="sr-only">Previous</span>
                                                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(history.length / itemsPerPage)))}
                                                    disabled={currentPage === Math.ceil(history.length / itemsPerPage)}
                                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <span className="sr-only">Next</span>
                                                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                                </button>
                                            </nav>
                                        </div>
                                    </div>

                                    {/* Mobile Pagination */}
                                    <div className="flex items-center justify-between sm:hidden w-full">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm text-gray-700">Page {currentPage}</span>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(history.length / itemsPerPage)))}
                                            disabled={currentPage === Math.ceil(history.length / itemsPerPage)}
                                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : view === 'license' ? (
                    <LicenseHub />
                ) : null}
            </main>
        </div>
    );
}
