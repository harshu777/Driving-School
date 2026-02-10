"use client";

import { useEffect, useState } from 'react';
import { useAuth } from './auth-provider';
import { UserCheck, UserX, Clock, CheckCircle } from 'lucide-react';

interface PendingStudent {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

export default function PendingStudents() {
    const { user } = useAuth();
    const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const fetchPendingStudents = async () => {
        if (!user) return;
        try {
            const res = await fetch('/api/instructor/pending-students', {
                headers: { 'x-user-id': user.id.toString() }
            });
            if (res.ok) {
                const data = await res.json();
                setPendingStudents(data);
            }
        } catch (error) {
            console.error('Error fetching pending students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingStudents();
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
                // Refresh the list
                fetchPendingStudents();
            }
        } catch (error) {
            console.error('Error updating student status:', error);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-slate-100">
            <div className="bg-slate-50 p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg mr-3">
                            <UserCheck className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Pending Student Approvals</h2>
                            <p className="text-sm text-gray-500 mt-1">Review and approve new student registrations</p>
                        </div>
                    </div>
                    {pendingStudents.length > 0 && (
                        <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-800">
                            {pendingStudents.length} pending
                        </span>
                    )}
                </div>
            </div>

            <div className="p-6">
                {pendingStudents.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-slate-900 font-medium mb-1">All Caught Up!</h3>
                        <p className="text-slate-500 text-sm">No pending student approvals at the moment.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingStudents.map((student) => (
                            <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-slate-50">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
                                            <span className="ml-3 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-bold text-yellow-800">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Pending
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">{student.email}</p>
                                        <p className="text-xs text-gray-400">
                                            Registered: {new Date(student.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() => handleAction(student.id, 'approve')}
                                            disabled={actionLoading === student.id}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {actionLoading === student.id ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            ) : (
                                                <>
                                                    <UserCheck className="w-4 h-4 mr-1" />
                                                    Approve
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleAction(student.id, 'reject')}
                                            disabled={actionLoading === student.id}
                                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {actionLoading === student.id ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            ) : (
                                                <>
                                                    <UserX className="w-4 h-4 mr-1" />
                                                    Reject
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
