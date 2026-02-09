import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Fuel, Wrench, Calendar, DollarSign, IndianRupee, Plus, AlertCircle, CheckCircle, Save, X } from 'lucide-react';
import { useAuth } from './auth-provider';

export default function VehicleManager() {
    const { user } = useAuth();
    const [vehicle, setVehicle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'fuel' | 'maintenance'>('overview');
    const [showEditModal, setShowEditModal] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        if (!user) return;
        fetchVehicle();
    }, [user]);

    const fetchVehicle = async () => {
        try {
            const res = await fetch('/api/instructor/vehicle', {
                headers: { 'x-user-id': user?.id.toString() || '' }
            });
            if (res.ok) {
                const data = await res.json();
                setVehicle(data);
            }
        } catch (error) {
            console.error('Failed to fetch vehicle', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading vehicle data...</div>;

    if (!vehicle) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                    <Car className="w-12 h-12 text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">No Vehicle Added</h2>
                <p className="text-slate-500 max-w-md mb-8">
                    Add your driving school vehicle to track fuel, maintenance, and expenses in one place.
                </p>
                <button
                    onClick={() => setShowEditModal(true)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Vehicle
                </button>
                {showEditModal && <VehicleForm onClose={() => setShowEditModal(false)} onSuccess={() => { setShowEditModal(false); fetchVehicle(); }} />}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header / Tabs */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden">
                        {vehicle?.image_url ? (
                            <img src={vehicle.image_url} alt={vehicle.make} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Car className="w-8 h-8" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{vehicle?.make} {vehicle?.model}</h1>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono font-medium">{vehicle?.plate_number}</span>
                            <span>•</span>
                            <span>{vehicle?.year}</span>
                        </div>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                    {(['overview', 'fuel', 'maintenance'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'overview' && (
                        <VehicleOverview vehicle={vehicle} onEdit={() => setShowEditModal(true)} />
                    )}
                    {activeTab === 'fuel' && (
                        <FuelLogManager vehicleId={vehicle.id} stats={vehicle.stats} />
                    )}
                    {activeTab === 'maintenance' && (
                        <MaintenanceLogManager vehicleId={vehicle.id} stats={vehicle.stats} />
                    )}
                </motion.div>
            </AnimatePresence>

            {showEditModal && (
                <VehicleForm
                    initialData={vehicle}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={() => { setShowEditModal(false); fetchVehicle(); }}
                />
            )}
        </div>
    );
}

// --- Subcomponents ---

function VehicleOverview({ vehicle, onEdit }: any) {
    const isServiceDue = vehicle.next_service_due_date && new Date(vehicle.next_service_due_date) < new Date(new Date().setDate(new Date().getDate() + 30)); // Due within 30 days

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <IndianRupee className="w-24 h-24 text-orange-500" />
                </div>
                <div className="relative z-10">
                    <p className="text-slate-500 text-sm font-medium mb-1">Total Fuel Cost</p>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">₹{vehicle.stats?.total_fuel_cost?.toFixed(2) || '0.00'}</h3>
                    <p className="text-xs text-slate-400 mt-2">
                        {vehicle.stats?.total_liters?.toFixed(1) || '0'} Liters total
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Wrench className="w-24 h-24 text-blue-500" />
                </div>
                <div className="relative z-10">
                    <p className="text-slate-500 text-sm font-medium mb-1">Maintenance Cost</p>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">₹{vehicle.stats?.total_maintenance_cost?.toFixed(2) || '0.00'}</h3>
                    <p className="text-xs text-slate-400 mt-2">Lifetime service expenses</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                <button
                    onClick={onEdit}
                    className="w-full py-3 border-2 border-slate-100 rounded-xl text-slate-600 font-semibold hover:border-slate-300 hover:text-slate-900 transition-colors flex items-center justify-center gap-2"
                >
                    <Car className="w-5 h-5" />
                    Edit Vehicle Details
                </button>
            </div>

            {/* Reminders / Status */}
            <div className="col-span-1 md:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-slate-400" />
                    Status & Reminders
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatusCard
                        label="Next Service"
                        date={vehicle.next_service_due_date}
                        icon={Wrench}
                        isUrgent={isServiceDue}
                    />
                    <StatusCard
                        label="Insurance Expiry"
                        date={vehicle.insurance_expiry_date}
                        icon={CheckCircle}
                    />
                    <StatusCard
                        label="Road Tax"
                        date={vehicle.road_tax_expiry_date}
                        icon={IndianRupee}
                    />
                    <StatusCard
                        label="Last Service"
                        date={vehicle.last_service_date}
                        icon={Calendar}
                        isPast
                    />
                </div>
            </div>
        </div>
    );
}

function StatusCard({ label, date, icon: Icon, isUrgent, isPast }: any) {
    if (!date) return (
        <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-xs text-slate-500 font-medium uppercase">{label}</p>
                <p className="text-sm text-slate-400">Not set</p>
            </div>
        </div>
    );

    const dateObj = new Date(date);
    const formatted = dateObj.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

    // Logic for urgent styling

    return (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${isUrgent ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className={`text-xs font-medium uppercase ${isUrgent ? 'text-red-600' : 'text-slate-500'}`}>{label}</p>
                <p className={`text-sm font-bold ${isUrgent ? 'text-red-900' : 'text-slate-900'}`}>{formatted}</p>
            </div>
        </div>
    )
}

function VehicleForm({ initialData, onClose, onSuccess }: any) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/instructor/vehicle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user?.id.toString() || ''
                },
                body: JSON.stringify(data)
            });
            if (res.ok) onSuccess();
        } catch (error) {
            console.error('Save failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Car className="w-5 h-5" />
                        {initialData ? 'Edit Vehicle' : 'Add Vehicle'}
                    </h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Make</label>
                            <input name="make" defaultValue={initialData?.make} required className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. Toyota" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Model</label>
                            <input name="model" defaultValue={initialData?.model} required className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. Yaris" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Year</label>
                            <input name="year" type="number" defaultValue={initialData?.year} required className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="2023" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Plate Number</label>
                            <input name="plate_number" defaultValue={initialData?.plate_number} required className="w-full px-3 py-2 border rounded-lg text-sm uppercase" placeholder="AB23 CDE" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Image URL</label>
                        <input name="image_url" defaultValue={initialData?.image_url} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="https://..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Next Service Due</label>
                            <input name="next_service_due_date" type="date" defaultValue={initialData?.next_service_due_date ? new Date(initialData.next_service_due_date).toISOString().split('T')[0] : ''} className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Insurance Expiry</label>
                            <input name="insurance_expiry_date" type="date" defaultValue={initialData?.insurance_expiry_date ? new Date(initialData.insurance_expiry_date).toISOString().split('T')[0] : ''} className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-medium">Cancel</button>
                        <button disabled={loading} type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Details'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Placeholder for now
function FuelLogManager({ vehicleId }: any) {
    const { user } = useAuth();
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        fetch(`/api/instructor/vehicle/fuel?vehicleId=${vehicleId}`, { headers: { 'x-user-id': user?.id.toString() || '' } })
            .then(res => res.json())
            .then(data => setLogs(data));
    }, [vehicleId, user]);

    // Simple ADD Form could be here...

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-900">Fuel History</h3>
                <button className="text-sm bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-medium text-slate-600 shadow-sm hover:text-orange-500">+ Add Log</button>
            </div>
            {logs.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No fuel logs yet.</div>
            ) : (
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Liters</th>
                            <th className="px-4 py-3">Cost</th>
                            <th className="px-4 py-3">Odometer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium text-slate-900">{new Date(log.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3">{log.liters} L</td>
                                <td className="px-4 py-3 font-bold text-slate-900">₹{log.total_cost}</td>
                                <td className="px-4 py-3 text-slate-500">{log.odometer_reading} km</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

function MaintenanceLogManager({ vehicleId }: any) {
    const { user } = useAuth();
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        fetch(`/api/instructor/vehicle/maintenance?vehicleId=${vehicleId}`, { headers: { 'x-user-id': user?.id.toString() || '' } })
            .then(res => res.json())
            .then(data => setLogs(data));
    }, [vehicleId, user]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-900">Maintenance History</h3>
                <button className="text-sm bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-medium text-slate-600 shadow-sm hover:text-blue-500">+ Add Log</button>
            </div>
            {logs.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No maintenance records yet.</div>
            ) : (
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Cost</th>
                            <th className="px-4 py-3">Garage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium text-slate-900">{new Date(log.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{log.service_type}</span>
                                </td>
                                <td className="px-4 py-3 font-bold text-slate-900">₹{log.cost}</td>
                                <td className="px-4 py-3 text-slate-500 text-xs">{log.garage_name || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
