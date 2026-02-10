"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/components/auth-provider';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Plus, CheckCircle, Clock, DollarSign, Calendar, Trash2, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDateTabs } from '@/hooks/useDateTabs';
import CustomCalendar from '@/components/CustomCalendar';
import { format } from 'date-fns';
import VehicleManager from '@/components/VehicleManager';
import LicenseManager from '@/components/LicenseManager';
import PendingStudents from '@/components/PendingStudents';

interface Student {
    id: number;
    name: string;
    booking_id: number;
    km_driven?: number;
    grade?: string;
    notes?: string;
    status: 'scheduled' | 'completed' | 'missed';
}

interface Slot {
    id: number;
    start_time: string;
    status: 'available' | 'booked' | 'completed';
    students?: Student[];
    booked_count?: number;
    max_students?: number;
    is_booked?: boolean;
    booking_id?: number;
}
// ... Stats interface remains same ...

// Modal Component (simplified inline for now or separate file? Inline is faster for single-file edit)
const LogbookModal = ({ isOpen, onClose, slot, onSave }: any) => {
    if (!isOpen || !slot) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-xl font-bold text-slate-900">Lesson Logbook</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-6">
                        {new Date(slot.start_time).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} - Enter details for each student.
                    </p>
                    <div className="space-y-6">
                        {slot.students?.map((student: any) => (
                            <StudentLogEntry key={student.booking_id} student={student} onSave={onSave} />
                        ))}
                        {(!slot.students || slot.students.length === 0) && <p>No students booked.</p>}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const StudentLogEntry = ({ student, onSave }: any) => {
    const [km, setKm] = useState(student.km_driven?.toString() || '');
    const [notes, setNotes] = useState(student.notes || '');
    const [grade, setGrade] = useState(student.grade || 'Good');
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        await onSave(student.booking_id, { kmDriven: parseFloat(km), notes, grade });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800">{student.name}</h4>
                {saved && <span className="text-green-600 text-sm flex items-center"><CheckCircle className="w-4 h-4 mr-1" /> Saved</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Km Driven</label>
                    <input
                        type="number"
                        value={km}
                        onChange={e => setKm(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Grade</label>
                    <select
                        value={grade}
                        onChange={e => setGrade(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Average">Average</option>
                        <option value="Needs Improvement">Needs Improvement</option>
                    </select>
                </div>
                <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Notes</label>
                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Feedback for student..."
                        className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                    />
                </div>
                <div className="md:col-span-3 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
                    >
                        Save Entry
                    </button>
                </div>
            </div>
        </div>
    );
}

const StudentHistoryModal = ({ isOpen, onClose, studentId, studentName }: any) => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && studentId) {
            setLoading(true);
            fetch(`/api/instructor/student/${studentId}/history`, {
                headers: { 'x-user-id': 'instructor' } // ID injected by middleware/hooks usually, here we rely on cookie/session or passed header from parent if needed. Actually the API uses x-user-id for AUTHORIZATION (instructor check), but we need to fetch STUDENT data. The endpoint checks if requester is instructor.
                // Wait, the API `GET /api/instructor/student/[id]/history` expects `x-user-id` header to verify the requester is an instructor.
                // We should pass the current user's ID.
            }).then(async (res) => {
                if (res.ok) setHistory(await res.json());
                setLoading(false);
            });
        }
    }, [isOpen, studentId]);

    // We need the current user ID to pass to the API for auth check. 
    // Since this component is outside the main component, we might need to pass the user ID or use the hook. 
    // Let's use the hook or pass it as prop. Passing as prop is safer if we want to reuse.
    // Actually, `useAuth` hook usage here is fine if we are within AuthProvider context.
    const { user } = useAuth();

    useEffect(() => {
        if (isOpen && studentId && user) {
            setLoading(true);
            fetch(`/api/instructor/student/${studentId}/history`, {
                headers: { 'x-user-id': user.id.toString() }
            })
                .then(res => res.json())
                .then(data => {
                    setHistory(Array.isArray(data) ? data : []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [isOpen, studentId, user]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-xl font-bold text-slate-900">History: {studentName}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <div className="p-6">
                    {loading ? <p className="text-center text-gray-500">Loading history...</p> : (
                        <div className="space-y-4">
                            {history.length === 0 ? <p className="text-gray-500">No history found.</p> : (
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Km</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {history.map((entry: any, index: number) => (
                                                <tr key={entry.booking_id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(entry.start_time).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(entry.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                        {entry.km_driven || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${entry.grade === 'Excellent' ? 'bg-green-100 text-green-800' :
                                                                entry.grade === 'Good' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {entry.grade || '-'}
                                                            </span>
                                                            {entry.status === 'completed' && (
                                                                <CheckCircle className="h-4 w-4 text-green-600" aria-label="Completed" />
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

interface Stats {
    completedLessons: number;
    totalStudents: number;
    upcomingLessons: number;
}

export default function InstructorDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [slots, setSlots] = useState<Slot[]>([]);
    const [view, setView] = useState<'schedule' | 'logbook' | 'vehicle' | 'license' | 'students'>('schedule');
    const [stats, setStats] = useState<Stats>({ completedLessons: 0, totalStudents: 0, upcomingLessons: 0 });
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use Shared Hook
    const { activeTab, setActiveTab, displayDates, activeItems: currentDaySlots } = useDateTabs(slots);

    const TIME_SLOTS = [
        "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
    ];

    const toggleTimeSlot = (time: string) => {
        setSelectedTimes(prev =>
            prev.includes(time)
                ? prev.filter(t => t !== time)
                : [...prev, time]
        );
    };

    useEffect(() => {
        if (!loading && (!user || user.role !== 'instructor')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const fetchData = useCallback(async () => {
        if (!user) return;
        try {
            const [slotsRes, statsRes] = await Promise.all([
                fetch('/api/instructor/slots', { headers: { 'x-user-id': user.id.toString() } }),
                fetch('/api/instructor/stats', { headers: { 'x-user-id': user.id.toString() } })
            ]);

            if (slotsRes.ok) setSlots(await slotsRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [user]);

    useEffect(() => {
        if (user) fetchData();
    }, [user, fetchData]);

    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null); // For Logbook Modal
    const [selectedStudentHistory, setSelectedStudentHistory] = useState<{ id: number, name: string } | null>(null); // For History Modal

    const handleLogbookSave = async (bookingId: number, data: any) => {
        try {
            const res = await fetch('/api/instructor/booking/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user!.id.toString()
                },
                body: JSON.stringify({ bookingId, ...data })
            });
            if (res.ok) {
                // Refresh data to show updated stats/status if needed
                fetchData();
            }
        } catch (error) {
            console.error('Failed to save logbook entry', error);
        }
    };
    const handleAddSlot = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedDate || selectedTimes.length === 0) return;
        setIsSubmitting(true);

        try {
            // Convert selected times to full ISO strings
            // Convert selected times to full ISO strings
            const startTimes = selectedTimes.map(timeStr => {
                const [time, period] = timeStr.split(' ');
                const [hoursVal, minutes] = time.split(':').map(Number);
                let hours = hoursVal;

                if (period === 'PM' && hours !== 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;

                // Fix: Parse YYYY-MM-DD components and construct date in LOCAL time
                const [year, month, day] = selectedDate.split('-').map(Number);
                // Note: month is 0-indexed in Date constructor
                const date = new Date(year, month - 1, day, hours, minutes, 0, 0);

                return date.toISOString();
            });

            const res = await fetch('/api/instructor/slots', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user.id.toString()
                },
                body: JSON.stringify({ startTimes }),
            });

            if (res.ok) {
                setSelectedTimes([]);
                // Keep the date selected for convenience
                fetchData();
            }
        } catch (error) {
            console.error('Error adding slot:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMarkComplete = async (slotId: number) => {
        if (!user) return;
        try {
            const res = await fetch(`/api/instructor/slots/${slotId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user.id.toString()
                },
                body: JSON.stringify({ status: 'completed' }),
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error('Error marking complete:', error);
        }
    };

    const handleDeleteSlot = async (slotId: number) => {
        if (!user || !confirm('Are you sure you want to delete this slot?')) return;
        try {
            const res = await fetch(`/api/instructor/slots/${slotId}`, {
                method: 'DELETE',
                headers: {
                    'x-user-id': user.id.toString()
                }
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting slot:', error);
        }
    };

    if (!user || user.role !== 'instructor') return null;

    // Filter logic:
    // Available: booked_count < max_students (visual aid: show availability even if partially booked)
    // Booked: actually, we should just show ALL slots in one list or categorized?
    // The previous logic split them. Now a slot can be BOTH 'available' (2/4) and 'booked' (has students).
    // Let's simplify: Show all slots in the timeline. Use visual indicators for fullness.

    // For the tabs, we currently sort slots by date.

    // Helper to get slot status display
    const getSlotStatusColor = (slot: Slot) => {
        if (slot.status === 'completed') return 'bg-green-100 text-green-600';
        if (slot.booked_count && slot.max_students && slot.booked_count >= slot.max_students) return 'bg-red-100 text-red-600'; // Full
        if (slot.booked_count && slot.booked_count > 0) return 'bg-orange-100 text-orange-600'; // Partially booked
        return 'bg-blue-100 text-blue-600'; // Empty
    };

    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Instructor Dashboard</h1>
                        <p className="mt-2 text-gray-600">Manage your schedule and track your earnings.</p>
                    </div>
                    <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg mt-4 md:mt-0">
                        <button
                            onClick={() => setView('schedule')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'schedule' ? 'bg-white text-slate-900 shadow' : 'text-gray-600 hover:text-slate-900'}`}
                        >
                            Schedule
                        </button>
                        <button
                            onClick={() => setView('logbook')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'logbook' ? 'bg-white text-slate-900 shadow' : 'text-gray-600 hover:text-slate-900'}`}
                        >
                            Logbook
                        </button>
                        <button
                            onClick={() => setView('vehicle')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'vehicle' ? 'bg-white text-slate-900 shadow' : 'text-gray-600 hover:text-slate-900'}`}
                        >
                            Vehicle
                        </button>
                        <button
                            onClick={() => setView('license')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'license' ? 'bg-white text-slate-900 shadow' : 'text-gray-600 hover:text-slate-900'}`}
                        >
                            License
                        </button>
                        <button
                            onClick={() => setView('students')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'students' ? 'bg-white text-slate-900 shadow' : 'text-gray-600 hover:text-slate-900'}`}
                        >
                            Students
                        </button>
                    </div>
                </header>

                {view === 'schedule' && (
                    <>

                        {/* Stats Section */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white overflow-hidden rounded-lg shadow p-5 border-l-4 border-orange-500"
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <CheckCircle className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">Completed Lessons</dt>
                                            <dd>
                                                <div className="text-2xl font-medium text-gray-900">{stats.completedLessons}</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white overflow-hidden rounded-lg shadow p-5 border-l-4 border-purple-500"
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Users className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">Total Students</dt>
                                            <dd>
                                                <div className="text-2xl font-medium text-gray-900">{stats.totalStudents}</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white overflow-hidden rounded-lg shadow p-5 border-l-4 border-blue-500"
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Calendar className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">Upcoming Lessons</dt>
                                            <dd>
                                                <div className="text-2xl font-medium text-gray-900">{stats.upcomingLessons}</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </motion.div>

                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Add Slots (Keep persistent) */}
                            <section className="lg:col-span-1 h-fit">
                                <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-slate-100">
                                    <div className="bg-slate-50 p-6 border-b border-slate-100">
                                        <h2 className="text-lg font-bold text-slate-900 flex items-center">
                                            <div className="p-2 bg-orange-100 rounded-lg mr-3">
                                                <Plus className="h-5 w-5 text-orange-600" />
                                            </div>
                                            Add Availability
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1 ml-12">Select date and times to open for booking.</p>
                                    </div>

                                    <div className="p-6">
                                        <form onSubmit={handleAddSlot}>
                                            <div className="mb-6">
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Date</label>
                                                <CustomCalendar
                                                    value={selectedDate ? new Date(selectedDate) : null}
                                                    onChange={(date) => {
                                                        // Use date-fns format to get local date string YYYY-MM-DD
                                                        setSelectedDate(format(date, 'yyyy-MM-dd'));
                                                    }}
                                                />
                                            </div>

                                            <div className="mb-6">
                                                <label className="block text-sm font-semibold text-slate-700 mb-3">Select Time Slots</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {TIME_SLOTS.map((time) => {
                                                        const isSelected = selectedTimes.includes(time);
                                                        return (
                                                            <button
                                                                key={time}
                                                                type="button"
                                                                onClick={() => toggleTimeSlot(time)}
                                                                className={`
                                                                    flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border
                                                                    ${isSelected
                                                                        ? 'bg-slate-900 border-slate-900 text-white shadow-md transform scale-[1.02]'
                                                                        : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-orange-50'}
                                                                `}
                                                            >
                                                                {isSelected && <CheckCircle className="w-3.5 h-3.5 mr-2 text-orange-400" />}
                                                                {time}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                {selectedTimes.length > 0 && (
                                                    <p className="text-xs text-gray-500 mt-2 text-right">
                                                        {selectedTimes.length} slots selected
                                                    </p>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting || !selectedDate || selectedTimes.length === 0}
                                                className="w-full inline-flex justify-center items-center rounded-xl border border-transparent bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 transform active:scale-[0.98]"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        Adding Slots...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="w-5 h-5 mr-2" />
                                                        Add Availability
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </section>

                            {/* Right Column: Schedule Tabs */}
                            <section className="lg:col-span-2 h-fit">
                                <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-slate-100 min-h-[600px]">
                                    <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-slate-900 flex items-center">
                                            <div className="p-2 bg-orange-100 rounded-lg mr-3">
                                                <Calendar className="h-5 w-5 text-orange-600" />
                                            </div>
                                            Your Schedule
                                        </h2>
                                        <div className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                                            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Date Tabs */}
                                        <div className="flex space-x-3 overflow-x-auto pt-4 pb-4 mb-6 scrollbar-hide">
                                            {displayDates.map((dateStr) => {
                                                const date = new Date(dateStr);
                                                const isSelected = activeTab === dateStr;
                                                const isToday = dateStr === new Date().toISOString().split('T')[0];

                                                return (
                                                    <button
                                                        key={dateStr}
                                                        onClick={() => setActiveTab(dateStr)}
                                                        className={`
                                                            flex-shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-2xl transition-all duration-300 border
                                                            ${isSelected
                                                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20 transform -translate-y-1'
                                                                : 'bg-white border-slate-100 text-slate-500 hover:border-orange-400 hover:shadow-md hover:-translate-y-0.5'}
                                                        `}
                                                    >
                                                        <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-orange-400' : 'text-gray-400'}`}>
                                                            {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                        </span>
                                                        <span className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                                            {date.getDate()}
                                                        </span>
                                                        <span className="text-[10px] font-medium opacity-80 mt-1">
                                                            {date.toLocaleDateString('en-US', { month: 'short' })}
                                                        </span>
                                                        {isSelected && (
                                                            <div className="w-1 h-1 bg-orange-500 rounded-full mt-2"></div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Left Column: Scheduled Availability (All Slots) */}
                                            <div>
                                                <h3 className="font-semibold text-slate-700 mb-4 flex items-center">
                                                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                                                    Daily Slots
                                                </h3>
                                                {currentDaySlots.length === 0 ? (
                                                    <p className="text-gray-400 italic text-sm">No slots added for this day.</p>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {currentDaySlots.map((slot) => {
                                                            const isBooked = slot.is_booked || slot.status === 'booked' || (slot.students && slot.students.length > 0);
                                                            const currentCount = slot.students?.length || slot.booked_count || 0;
                                                            const maxCount = slot.max_students || 4;
                                                            return (
                                                                <div key={slot.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                                                    <div className="flex items-center">
                                                                        <div className={`w-2 h-2 rounded-full mr-3 ${slot.status === 'completed' ? 'bg-green-500' :
                                                                            isBooked ? 'bg-blue-500' : 'bg-orange-500'
                                                                            }`} />
                                                                        <span className="text-sm font-medium text-slate-700">
                                                                            {new Date(slot.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })}
                                                                        </span>
                                                                        <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full border ${currentCount >= maxCount
                                                                            ? 'bg-red-50 text-red-600 border-red-200'
                                                                            : currentCount > 0
                                                                                ? 'bg-blue-50 text-blue-600 border-blue-200'
                                                                                : 'bg-slate-50 text-slate-500 border-slate-200'
                                                                            }`}>
                                                                            {currentCount}/{maxCount}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        {isBooked && slot.status !== 'completed' && (
                                                                            <button
                                                                                onClick={() => handleMarkComplete(slot.id)}
                                                                                className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center"
                                                                                title="Mark as Completed"
                                                                            >
                                                                                <CheckCircle className="w-4 h-4" />
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            onClick={() => !isBooked && handleDeleteSlot(slot.id)}
                                                                            disabled={isBooked}
                                                                            className={`transition-colors ${isBooked ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500'}`}
                                                                            title={isBooked ? "Cannot delete booked slot" : "Delete Slot"}
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right Column: Upcoming Bookings (Filtered) */}
                                            <div>
                                                <h3 className="font-semibold text-slate-700 mb-4 flex items-center">
                                                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                                                    Booked Lessons
                                                </h3>
                                                {currentDaySlots.filter(s => (s.students && s.students.length > 0) || s.is_booked).length === 0 ? (
                                                    <p className="text-gray-400 italic text-sm">No bookings yet.</p>
                                                ) : (
                                                    <ul className="space-y-3">
                                                        {currentDaySlots
                                                            .filter(s => (s.students && s.students.length > 0) || s.is_booked)
                                                            .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                                                            .map((slot) => (
                                                                <li key={slot.id} className={`border rounded-lg p-3 transition-all ${slot.status === 'completed' ? 'bg-gray-50 border-gray-200' : 'bg-white border-orange-200 shadow-sm'}`}>
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <span className="text-sm font-bold text-slate-900">
                                                                            {new Date(slot.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })}
                                                                        </span>
                                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${slot.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                                            }`}>
                                                                            {slot.status === 'completed' ? 'Done' : 'Active'}
                                                                        </span>
                                                                    </div>

                                                                    <div className="mb-3">
                                                                        <ul className="space-y-1">
                                                                            {slot.students?.map((student) => (
                                                                                <li
                                                                                    key={student.id}
                                                                                    className="text-sm text-slate-700 flex items-center cursor-pointer hover:text-blue-600 hover:underline group/student"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        setSelectedStudentHistory({ id: student.id, name: student.name });
                                                                                    }}
                                                                                >
                                                                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2 group-hover/student:bg-blue-500"></span>
                                                                                    {student.name}
                                                                                </li>
                                                                            )) || (
                                                                                    <li className="text-sm text-gray-500 italic">
                                                                                        Student details unavailable (ID: {slot.booking_id})
                                                                                    </li>
                                                                                )}
                                                                        </ul>
                                                                    </div>

                                                                    <div className="flex justify-end pt-2 border-t border-gray-100">
                                                                        <button
                                                                            onClick={() => setSelectedSlot(slot)}
                                                                            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${slot.status === 'completed'
                                                                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                                                : 'bg-green-600 text-white hover:bg-green-700'
                                                                                }`}
                                                                        >
                                                                            {slot.status === 'completed' ? 'Edit Logbook' : 'Log / Complete'}
                                                                        </button>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </>
                )}

                {view === 'logbook' && (
                    <LogbookView user={user} />
                )}

                {view === 'vehicle' && (
                    <VehicleManager />
                )}

                {view === 'license' && (
                    <LicenseManager />
                )}

                {view === 'students' && (
                    <PendingStudents />
                )}

                {/* Logbook Modal - Rendered globally for Schedule view */}
                <LogbookModal
                    isOpen={!!selectedSlot}
                    onClose={() => setSelectedSlot(null)}
                    slot={selectedSlot}
                    onSave={handleLogbookSave}
                />
            </main>
        </div>
    );
}
// Inline Component for Logbook View
const LogbookView = ({ user }: { user: any }) => {
    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingLog, setEditingLog] = useState<any | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Reset pagination when student changes or history loads
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedStudentId, history.length, itemsPerPage]);

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(history.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedHistory = history.slice(startIndex, endIndex);

    // Calculate Stats
    const totalKm = history.reduce((acc, curr) => acc + (Number(curr.km_driven) || 0), 0);
    const totalLessons = history.length;

    useEffect(() => {
        if (user) {
            fetch('/api/instructor/students', {
                headers: { 'x-user-id': user.id.toString() }
            })
                .then(res => res.json())
                .then(data => setStudents(Array.isArray(data) ? data : []))
                .catch(console.error);
        }
    }, [user]);

    const [showMobileDetail, setShowMobileDetail] = useState(false);

    useEffect(() => {
        if (selectedStudentId && user) {
            setLoadingHistory(true);
            fetch(`/api/instructor/student/${selectedStudentId}/history`, {
                headers: { 'x-user-id': user.id.toString() }
            })
                .then(res => res.json())
                .then(data => {
                    setHistory(Array.isArray(data) ? data : []);
                    setLoadingHistory(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoadingHistory(false);
                });
        } else {
            setHistory([]);
        }
    }, [selectedStudentId, user]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
            {/* Student List Sidebar */}
            <div className={`md:col-span-4 lg:col-span-3 bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-100 flex flex-col ${showMobileDetail ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 mb-3 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-slate-500" />
                        Students ({students.length})
                    </h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <div className="overflow-y-auto flex-1 p-3 space-y-2 custom-scrollbar">
                    {filteredStudents.map(student => {
                        const isSelected = selectedStudentId === student.id;
                        const initials = student.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                        return (
                            <button
                                key={student.id}
                                onClick={() => {
                                    setSelectedStudentId(student.id);
                                    setShowMobileDetail(true);
                                }}
                                className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center group
                                    ${isSelected
                                        ? 'bg-slate-900 text-white shadow-md transform scale-[1.02]'
                                        : 'hover:bg-slate-50 text-slate-700 hover:shadow-sm border border-transparent hover:border-slate-100'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mr-3 transition-colors
                                    ${isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-orange-500 group-hover:shadow-sm'}`}>
                                    {initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                        {student.name}
                                    </p>
                                    <p className={`text-xs truncate ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Student ID: {student.id}
                                    </p>
                                </div>
                                {isSelected && <ChevronRight className="w-5 h-5 text-slate-400" />}
                            </button>
                        );
                    })}
                    {filteredStudents.length === 0 && (
                        <div className="text-center py-10 px-4">
                            <Users className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                            <p className="text-slate-400 text-sm">No students found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* History Panel */}
            <div className={`md:col-span-8 lg:col-span-9 bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-100 flex-col ${showMobileDetail ? 'flex' : 'hidden md:flex'}`}>
                {!selectedStudentId ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
                        <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                            <Calendar className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-2">No Student Selected</h3>
                        <p className="max-w-xs text-center text-sm">Select a student from the sidebar to view their complete driving history and performance records.</p>
                    </div>
                ) : (
                    <>
                        <div className="p-4 sm:p-6 border-b border-slate-100 bg-white flex flex-col gap-4">
                            {/* Mobile Back Button */}
                            <button
                                onClick={() => setShowMobileDetail(false)}
                                className="md:hidden flex items-center text-slate-500 hover:text-slate-900 mb-2"
                            >
                                <ChevronLeft className="w-5 h-5 mr-1" />
                                Back to Students
                            </button>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center">
                                        {students.find(s => s.id === selectedStudentId)?.name}
                                        <span className="hidden sm:inline-flex ml-3 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wide">
                                            Student
                                        </span>
                                    </h2>
                                    <p className="text-slate-500 text-sm mt-1">Driving Performance Record</p>
                                </div>
                                <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                                    <div className="flex-1 sm:flex-none bg-orange-50 px-3 py-2 sm:px-4 rounded-lg border border-orange-100 text-center sm:text-left">
                                        <p className="text-[10px] sm:text-xs font-bold text-orange-600 uppercase tracking-wider">Total Km</p>
                                        <p className="text-lg sm:text-xl font-bold text-slate-900">{totalKm}</p>
                                    </div>
                                    <div className="flex-1 sm:flex-none bg-blue-50 px-3 py-2 sm:px-4 rounded-lg border border-blue-100 text-center sm:text-left">
                                        <p className="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-wider">Lessons</p>
                                        <p className="text-lg sm:text-xl font-bold text-slate-900">{totalLessons}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-y-auto flex-1 bg-slate-50/30 p-4 sm:p-6">
                            {loadingHistory ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="flex flex-col items-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mb-4"></div>
                                        <p className="text-sm text-slate-500">Loading history...</p>
                                    </div>
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Clock className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <h3 className="text-slate-900 font-medium mb-1">No Records Found</h3>
                                    <p className="text-slate-500 text-sm">This student hasn't completed any lessons yet.</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-slate-100">
                                            <thead>
                                                <tr className="bg-slate-50/80">
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Distance</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Performance</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Instructor Notes</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-100">
                                                {paginatedHistory.map((entry: any) => (
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
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                                                    {entry.km_driven ? `${entry.km_driven} km` : '-'}
                                                                </span>
                                                            </div>
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
                                                                            Verified Complete
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
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <button
                                                                onClick={() => setEditingLog(entry)}
                                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                Edit
                                                            </button>
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
                                                    Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
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
                                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                        disabled={currentPage === totalPages}
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
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Edit Log Modal */}
                        {editingLog && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                >
                                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                                        <h3 className="text-xl font-bold text-slate-900">Edit Logbook Entry</h3>
                                        <button onClick={() => setEditingLog(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-sm text-gray-500 mb-6">
                                            {new Date(editingLog.start_time).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}
                                        </p>
                                        <StudentLogEntry
                                            student={{
                                                booking_id: editingLog.booking_id,
                                                name: students.find(s => s.id === selectedStudentId)?.name || 'Student',
                                                km_driven: editingLog.km_driven,
                                                notes: editingLog.instructor_notes,
                                                grade: editingLog.grade
                                            }}
                                            onSave={async (bookingId: number, data: any) => {
                                                try {
                                                    const res = await fetch('/api/instructor/booking/update', {
                                                        method: 'PUT',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'x-user-id': user.id.toString()
                                                        },
                                                        body: JSON.stringify({ bookingId, ...data })
                                                    });
                                                    if (res.ok) {
                                                        // Refresh history
                                                        const historyRes = await fetch(`/api/instructor/student/${selectedStudentId}/history`, {
                                                            headers: { 'x-user-id': user.id.toString() }
                                                        });
                                                        const historyData = await historyRes.json();
                                                        setHistory(Array.isArray(historyData) ? historyData : []);
                                                        setEditingLog(null);
                                                    }
                                                } catch (error) {
                                                    console.error('Failed to update log:', error);
                                                }
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
