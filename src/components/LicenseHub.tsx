import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, Award, User, Calendar, Droplet, MapPin, Phone } from 'lucide-react';
import { useAuth } from './auth-provider';

export default function LicenseHub() {
    const { user } = useAuth();
    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (!user) return;
        fetchStatus();
    }, [user]);

    const fetchStatus = async () => {
        try {
            const res = await fetch('/api/license/status', {
                headers: { 'x-user-id': user?.id.toString() || '' }
            });
            if (res.ok) {
                const data = await res.json();
                setApplication(data);
            }
        } catch (error) {
            console.error('Failed to fetch license status', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        try {
            const res = await fetch('/api/license/apply', {
                method: 'POST',
                headers: { 'x-user-id': user?.id.toString() || '' }
            });
            if (res.ok) {
                fetchStatus();
            }
        } catch (error) {
            console.error('Failed to apply', error);
        }
    };

    const handleSubmitDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const details = {
            full_name: formData.get('full_name'),
            dob: formData.get('dob'),
            blood_group: formData.get('blood_group'),
            address: formData.get('address'),
            phone: formData.get('phone'),
            rto_office: formData.get('rto_office')
        };

        try {
            const res = await fetch('/api/license/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user?.id.toString() || ''
                },
                body: JSON.stringify({ applicationId: application.id, details })
            });
            if (res.ok) {
                fetchStatus();
                setShowForm(false);
            }
        } catch (error) {
            console.error('Failed to submit details', error);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading license status...</div>;

    // State 1: No Application
    if (!application) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-3xl border border-slate-200 overflow-hidden"
            >
                {/* Background decoration */}
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>

                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-28 h-28 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30 mb-8 relative"
                >
                    <div className="absolute inset-0 bg-white/20 rounded-3xl animate-pulse"></div>
                    <FileText className="w-14 h-14 text-white relative z-10" />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold text-slate-900 mb-3 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text"
                >
                    Ready for Your License?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-600 max-w-md mb-10 text-lg leading-relaxed"
                >
                    Apply for your driving license and track the entire process from application to issuance.
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleApply}
                    className="group relative bg-gradient-to-r from-orange-600 to-orange-500 text-white px-10 py-4 rounded-2xl font-semibold shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all flex items-center gap-3 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <FileText className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Apply for License</span>
                </motion.button>
            </motion.div>
        );
    }

    // State 2: Applied (Waiting for Instructor)
    if (application.status === 'applied') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-lg border border-slate-100 p-10 relative overflow-hidden"
            >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-full blur-3xl -z-10"></div>

                <div className="flex flex-col items-center text-center relative z-10">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-yellow-500/30"
                    >
                        <Clock className="w-12 h-12 text-white" />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Application Submitted</h3>
                    <p className="text-slate-600 mb-6 text-lg max-w-md leading-relaxed">
                        Your instructor will review your application and request additional details soon.
                    </p>

                    <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-6 py-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-slate-600 font-medium">
                            Applied on {new Date(application.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </motion.div>
        );
    }

    // State 3: Info Needed (Form)
    if (application.status === 'info_needed') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
            >
                <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-orange-500" />
                            </div>
                            <span className="text-orange-500">Complete Your License Application</span>
                        </h3>
                        <p className="text-slate-400 ml-15">Fill in the required details to proceed</p>
                    </div>
                </div>

                <form onSubmit={handleSubmitDetails} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <User className="w-4 h-4 text-orange-500" /> Full Name
                            </label>
                            <input
                                name="full_name"
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                placeholder="As per Aadhar"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-orange-500" /> Date of Birth
                            </label>
                            <input
                                name="dob"
                                type="date"
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Droplet className="w-4 h-4 text-orange-500" /> Blood Group
                            </label>
                            <div className="relative">
                                <select
                                    name="blood_group"
                                    required
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all appearance-none cursor-pointer pr-10 [&>option]:bg-slate-900 [&>option]:text-white [&>option:hover]:bg-orange-500 [&>option:checked]:bg-orange-500"
                                >
                                    <option value="" className="bg-slate-900 text-slate-400">Select Blood Group</option>
                                    <option value="A+" className="bg-slate-900 text-white hover:bg-orange-500">🅰️ A+</option>
                                    <option value="A-" className="bg-slate-900 text-white hover:bg-orange-500">🅰️ A-</option>
                                    <option value="B+" className="bg-slate-900 text-white hover:bg-orange-500">🅱️ B+</option>
                                    <option value="B-" className="bg-slate-900 text-white hover:bg-orange-500">🅱️ B-</option>
                                    <option value="O+" className="bg-slate-900 text-white hover:bg-orange-500">🅾️ O+</option>
                                    <option value="O-" className="bg-slate-900 text-white hover:bg-orange-500">🅾️ O-</option>
                                    <option value="AB+" className="bg-slate-900 text-white hover:bg-orange-500">🆎 AB+</option>
                                    <option value="AB-" className="bg-slate-900 text-white hover:bg-orange-500">🆎 AB-</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-orange-500" /> Phone Number
                            </label>
                            <input
                                name="phone"
                                type="tel"
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                placeholder="+91 XXXXX XXXXX"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-orange-500" /> Full Address
                        </label>
                        <textarea
                            name="address"
                            required
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all resize-none"
                            placeholder="Street, City, State, PIN"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">RTO Office</label>
                        <input
                            name="rto_office"
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                            placeholder="e.g., MH-01"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-slate-900/30 hover:shadow-xl hover:shadow-slate-900/40 transition-all border border-slate-700"
                        >
                            Submit Details
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        );
    }

    // State 4: Processing
    if (application.status === 'processing') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-lg border border-slate-100 p-10 relative overflow-hidden"
            >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl -z-10"></div>

                <div className="flex flex-col items-center text-center relative z-10">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-slate-900/30 relative"
                    >
                        <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
                        <CheckCircle className="w-12 h-12 text-white relative z-10" />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Application Under Review</h3>
                    <p className="text-slate-600 mb-8 text-lg max-w-md leading-relaxed">
                        Your details have been submitted to the RTO. Your instructor will notify you once your license is ready.
                    </p>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 rounded-2xl p-6 text-left w-full max-w-md shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                <FileText className="w-4 h-4 text-orange-500" />
                            </div>
                            <h4 className="font-bold text-white">Submitted Details</h4>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                <span className="text-slate-400">Name</span>
                                <span className="font-semibold text-white">{application.student_details?.full_name}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                <span className="text-slate-400">DOB</span>
                                <span className="font-semibold text-white">{application.student_details?.dob}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                <span className="text-slate-400">Blood Group</span>
                                <span className="font-semibold text-white">{application.student_details?.blood_group}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-slate-400">Phone</span>
                                <span className="font-semibold text-white">{application.student_details?.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // State 5: Completed (License Issued)
    if (application.status === 'completed') {
        return (
            <div className="space-y-6">
                {/* Digital License Card */}
                <motion.div
                    initial={{ opacity: 0, rotateY: -15 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 text-white overflow-hidden"
                    style={{ perspective: "1000px" }}
                >
                    {/* Background patterns */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                                        <Award className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">Driving License</h3>
                                        <p className="text-slate-400 text-sm">Government of India</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                                    <p className="text-xs text-slate-400">Valid</p>
                                    <p className="text-sm font-bold">20 Years</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">License Number</p>
                                <p className="text-2xl font-bold font-mono tracking-wide">{application.license_number}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Name</p>
                                    <p className="font-semibold text-lg">{application.student_details?.full_name}</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">DOB</p>
                                    <p className="font-semibold text-lg">{application.student_details?.dob}</p>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Blood Group</p>
                                <p className="font-semibold text-lg">{application.student_details?.blood_group}</p>
                            </div>

                            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                <p className="text-slate-400 text-sm">
                                    Issued on {new Date(application.certificate_issued_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-green-400 text-sm font-medium">Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Certificate */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-lg border-2 border-green-200 p-10 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -z-10"></div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30"
                    >
                        <Award className="w-10 h-10 text-white" />
                    </motion.div>

                    <h3 className="text-3xl font-bold text-slate-900 mb-3">Certificate of Completion</h3>
                    <p className="text-slate-600 mb-8 text-lg max-w-md mx-auto leading-relaxed">
                        Congratulations! You have successfully completed your driving training.
                    </p>

                    <div className="inline-block bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl px-8 py-4 shadow-sm">
                        <p className="text-sm text-green-700 font-semibold mb-1">Certified Driver</p>
                        <p className="text-lg font-bold text-slate-900">
                            {application.student_details?.full_name}
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return null;
}
