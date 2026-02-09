import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, Award, User, X } from 'lucide-react';
import { useAuth } from './auth-provider';

export default function LicenseManager() {
    const { user } = useAuth();
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [licenseNumber, setLicenseNumber] = useState('');

    useEffect(() => {
        if (!user) return;
        fetchApplications();
    }, [user]);

    const fetchApplications = async () => {
        try {
            const res = await fetch('/api/instructor/license', {
                headers: { 'x-user-id': user?.id.toString() || '' }
            });
            if (res.ok) {
                const data = await res.json();
                setApplications(data);
            }
        } catch (error) {
            console.error('Failed to fetch applications', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (appId: number, newStatus: string, licenseNum?: string) => {
        try {
            const body: any = { applicationId: appId, status: newStatus };
            if (licenseNum) body.licenseNumber = licenseNum;

            const res = await fetch('/api/license/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user?.id.toString() || ''
                },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                fetchApplications();
                setSelectedApp(null);
                setLicenseNumber('');
            }
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: any = {
            applied: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'New Application' },
            info_needed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Awaiting Details' },
            processing: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Under Review' },
            completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'License Issued' }
        };
        const badge = badges[status] || badges.applied;
        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>{badge.label}</span>;
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading applications...</div>;

    if (applications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                    <FileText className="w-12 h-12 text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">No License Applications</h2>
                <p className="text-slate-500 max-w-md">
                    Your students haven't applied for licenses yet. Applications will appear here once submitted.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-slate-600" />
                    License Applications
                </h2>

                <div className="space-y-3">
                    {applications.map((app) => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{app.student_name}</h3>
                                            <p className="text-xs text-slate-500">{app.student_email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        {getStatusBadge(app.status)}
                                        <span className="text-xs text-slate-400">
                                            Applied {new Date(app.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    {app.status === 'applied' && (
                                        <button
                                            onClick={() => updateStatus(app.id, 'info_needed')}
                                            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                                        >
                                            Request Details
                                        </button>
                                    )}
                                    {app.status === 'processing' && (
                                        <button
                                            onClick={() => setSelectedApp(app)}
                                            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-1"
                                        >
                                            <Award className="w-4 h-4" />
                                            Issue License
                                        </button>
                                    )}
                                    {app.status === 'completed' && (
                                        <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                                            <CheckCircle className="w-5 h-5" />
                                            Issued: {app.license_number}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {app.status === 'processing' && app.student_details && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <h4 className="text-xs font-semibold text-slate-600 uppercase mb-2">Submitted Details:</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                        <div>
                                            <p className="text-slate-500 text-xs">Name</p>
                                            <p className="font-medium text-slate-900">{app.student_details.full_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-xs">DOB</p>
                                            <p className="font-medium text-slate-900">{app.student_details.dob}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-xs">Blood Group</p>
                                            <p className="font-medium text-slate-900">{app.student_details.blood_group}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-xs">Phone</p>
                                            <p className="font-medium text-slate-900">{app.student_details.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Issue License Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Award className="w-6 h-6" />
                                Issue License
                            </h3>
                            <button onClick={() => setSelectedApp(null)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-600 mb-4">
                                Issue license for <strong>{selectedApp.student_name}</strong>
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">License Number</label>
                                <input
                                    type="text"
                                    value={licenseNumber}
                                    onChange={(e) => setLicenseNumber(e.target.value)}
                                    placeholder="e.g., MH-01-20260001234"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => updateStatus(selectedApp.id, 'completed', licenseNumber)}
                                    disabled={!licenseNumber.trim()}
                                    className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Issue
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
