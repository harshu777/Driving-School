"use client";

import { useEffect, useState } from 'react';
import { useAuth } from './auth-provider';
import { UserCheck, UserX, Clock, CheckCircle, Trash2, Search, Filter, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Student {
    id: number;
    name: string;
    email: string;
    status: 'approved' | 'pending' | 'rejected' | 'suspended'; // extended status
    created_at: string;
}

export default function StudentManager() {
    const { user } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

    const fetchStudents = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Fetch ALL students by passing status=all query param
            const res = await fetch('/api/instructor/students?status=all', {
                headers: { 'x-user-id': user.id.toString() }
            });
            if (res.ok) {
                const data = await res.json();
                setStudents(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [user]);

    const handleAction = async (studentId: number, action: 'approve' | 'reject') => {
        if (!user) return;
        setActionLoading(studentId);

        try {
            const res = await fetch('/api/instructor/approve-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user.id.toString()
                },
                body: JSON.stringify({ studentId, action })
            });

            if (res.ok) {
                fetchStudents();
            }
        } catch (error) {
            console.error('Error updating student status:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async () => {
        if (!user || !studentToDelete) return;
        setActionLoading(studentToDelete.id);

        try {
            const res = await fetch(`/api/instructor/student/${studentToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'x-user-id': user.id.toString()
                }
            });

            if (res.ok) {
                fetchStudents();
                setDeleteModalOpen(false);
                setStudentToDelete(null);
            } else {
                alert('Failed to delete student');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'all' || student.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const pendingCount = students.filter(s => s.status === 'pending').length;

    if (loading && students.length === 0) {
        return (
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-100 min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-slate-100 min-h-[600px] flex flex-col">
            <div className="bg-slate-50 p-6 border-b border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center">
                            Student Management
                            {pendingCount > 0 && (
                                <span className="ml-3 inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-sm font-medium text-orange-800">
                                    {pendingCount} Pending
                                </span>
                            )}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Manage student registrations, approvals, and removals.</p>
                    </div>

                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                </div>

                <div className="mt-6 flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { id: 'all', label: 'All Students' },
                        { id: 'pending', label: 'Pending' },
                        { id: 'approved', label: 'Approved' },
                        { id: 'rejected', label: 'Rejected' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`
                                px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                                ${activeTab === tab.id
                                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                {filteredStudents.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Filter className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-slate-900 font-medium mb-1">No students found</h3>
                        <p className="text-slate-500 text-sm">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {filteredStudents.map((student) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={student.id}
                                    className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow relative overflow-hidden group"
                                >
                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                                            ${student.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                student.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    student.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'}`}>
                                            {student.status}
                                        </span>
                                    </div>

                                    <div className="flex items-start mb-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mr-3
                                            ${student.status === 'approved' ? 'bg-blue-100 text-blue-600' :
                                                student.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                                    'bg-slate-100 text-slate-500'}`}>
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0 pr-20">
                                            <h3 className="font-bold text-slate-900 truncate">{student.name}</h3>
                                            <p className="text-sm text-gray-500 truncate">{student.email}</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Joined {new Date(student.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex space-x-2">
                                            {student.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(student.id, 'approve')}
                                                        disabled={actionLoading === student.id}
                                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <UserCheck className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(student.id, 'reject')}
                                                        disabled={actionLoading === student.id}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                        title="Reject"
                                                    >
                                                        <UserX className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => {
                                                setStudentToDelete(student);
                                                setDeleteModalOpen(true);
                                            }}
                                            disabled={actionLoading === student.id}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                                            title="Delete Student"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Action Loading Overlay */}
                                    {actionLoading === student.id && (
                                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900"></div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModalOpen && studentToDelete && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden"
                        >
                            <div className="p-6 text-center">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Student?</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Are you sure you want to delete <span className="font-semibold text-slate-900">{studentToDelete.name}</span>?
                                    This action cannot be undone and will remove all their bookings and records.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDeleteModalOpen(false)}
                                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={actionLoading === studentToDelete.id}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                                    >
                                        {actionLoading === studentToDelete.id ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        ) : (
                                            'Delete'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
