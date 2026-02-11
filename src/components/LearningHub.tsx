import { useState } from 'react';
import { BookOpen, Info, Shield, FileText, AlertCircle, TrafficCone, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import IndianRoadSign, { SignType } from './IndianRoadSign';

type Category = 'signs' | 'markings' | 'rules' | 'docs' | 'fines' | 'safety';

export default function LearningHub() {
    const [activeCategory, setActiveCategory] = useState<Category>('signs');

    const categories = [
        { id: 'signs', label: 'Traffic Signs', icon: TrafficCone, color: 'text-orange-600', bg: 'bg-orange-100' },
        { id: 'markings', label: 'Road Markings', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
        { id: 'rules', label: 'Rules of Road', icon: Shield, color: 'text-green-600', bg: 'bg-green-100' },
        { id: 'docs', label: 'Documents', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
        { id: 'fines', label: 'Fines & Penalties', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
        { id: 'safety', label: 'Safety & First Aid', icon: Info, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    ];

    const renderContent = () => {
        switch (activeCategory) {
            case 'signs':
                return <TrafficSignsSection />;
            case 'markings':
                return <RoadMarkingsSection />;
            case 'rules':
                return <RulesSection />;
            case 'docs':
                return <DocumentsSection />;
            case 'fines':
                return <FinesSection />;
            case 'safety':
                return <SafetySection />;
            default:
                return <TrafficSignsSection />;
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-100 flex flex-col min-h-[600px]">
            <div className="p-6 border-b border-slate-100 bg-white">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                    <BookOpen className="mr-2 h-6 w-6 text-orange-600" />
                    Driver's Learning Hub
                </h2>
                <p className="text-slate-500 text-sm mt-1">Master the rules of the road with our comprehensive guide.</p>
            </div>

            <div className="flex flex-col md:flex-row flex-1">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-4 space-y-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id as Category)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeCategory === cat.id
                                ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200'
                                : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${cat.bg}`}>
                                <cat.icon className={`w-5 h-5 ${cat.color}`} />
                            </div>
                            <span className="font-medium">{cat.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// Sub-components for Content

function SectionHeader({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600">{desc}</p>
        </div>
    );
}

function TrafficSignsSection() {
    return (
        <div>
            <SectionHeader title="Traffic Signs (India)" desc="Standard road signs as per IRC norms. Understanding these is mandatory for your driving test." />

            <div className="space-y-8">
                {/* Mandatory / Regulatory */}
                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-red-800 mb-4">
                        <AlertCircle className="w-5 h-5" /> Mandatory / Regulatory Signs
                    </h4>
                    <p className="text-sm text-red-700 mb-4">You MUST follow these. Violation is an offense.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        <SignCard label="Stop" type="stop" />
                        <SignCard label="Give Way" type="give-way" />
                        <SignCard label="No Entry" type="no-entry" />
                        <SignCard label="Speed Limit (50)" type="speed-50" />
                        <SignCard label="Compulsory Left" type="compulsory-left" />
                        <SignCard label="Sound Horn" type="sound-horn" />
                    </div>
                </div>

                {/* Cautionary / Warning */}
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-yellow-800 mb-4">
                        <AlertTriangle className="w-5 h-5" /> Cautionary / Warning Signs
                    </h4>
                    <p className="text-sm text-yellow-700 mb-4">Warns you of hazards ahead. Slow down.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        <SignCard label="Right Curve" type="right-curve" />
                        <SignCard label="Narrow Bridge" type="narrow-bridge" />
                        <SignCard label="School Ahead" type="school" />
                        <SignCard label="Pedestrian Crossing" type="pedestrian" />
                        <SignCard label="Roundabout" type="roundabout" />
                        <SignCard label="Slippery Road" type="slippery" />
                    </div>
                </div>

                {/* Informatory */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-blue-800 mb-4">
                        <Info className="w-5 h-5" /> Informatory Signs
                    </h4>
                    <p className="text-sm text-blue-700 mb-4">Helpful information about facilities.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        <SignCard label="Hospital" type="hospital" />
                        <SignCard label="Petrol Pump" type="petrol" />
                        <SignCard label="Eating Place" type="eating" />
                        <SignCard label="Parking" type="parking" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function SignCard({ label, type }: { label: string, type: SignType }) {
    return (
        <div className="flex flex-col items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <IndianRoadSign type={type} className="w-16 h-16 sm:w-20 sm:h-20" />
            <span className="text-xs text-center font-bold text-slate-700 leading-tight">{label}</span>
        </div>
    );
}

function RoadMarkingsSection() {
    return (
        <div className="space-y-6">
            <SectionHeader title="Road Markings & Signals" desc="Understand what the lines on the road and traffic lights mean." />

            <div className="grid md:grid-cols-2 gap-6">
                <InfoCard title="Broken White Line" color="border-green-200 bg-green-50">
                    <p className="text-sm text-slate-700">You act as a lane divider. You <strong>may</strong> change lanes or overtake if it is safe to do so.</p>
                </InfoCard>
                <InfoCard title="Solid White Line" color="border-red-200 bg-red-50">
                    <p className="text-sm text-slate-700">You <strong>must not</strong> cross this line to overtake or change lanes. Stay in your lane.</p>
                </InfoCard>
                <InfoCard title="Double Yellow Lines" color="border-yellow-200 bg-yellow-50">
                    <p className="text-sm text-slate-700">Strictly <strong>no crossing</strong> allowed. Used in hazardous areas or two-way traffic.</p>
                </InfoCard>
                <InfoCard title="Traffic Lights" color="border-slate-200 bg-slate-50">
                    <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                        <li><span className="text-red-600 font-bold">Red</span>: Stop completely behind the stop line.</li>
                        <li><span className="text-yellow-600 font-bold">Amber</span>: Stop if safe, otherwise clear intersection.</li>
                        <li><span className="text-green-600 font-bold">Green</span>: Proceed if the way is clear.</li>
                    </ul>
                </InfoCard>
            </div>
        </div>
    );
}

function RulesSection() {
    return (
        <div className="space-y-6">
            <SectionHeader title="Rules of the Road" desc="Essential rules every driver must follow under the Motor Vehicles Act." />

            <div className="space-y-4">
                <RuleItem title="Right of Way" active>
                    At roundabouts and intersections without signals, always give way to vehicles coming from your <strong>right</strong>. Pedestrians have the first right of way at zebra crossings.
                </RuleItem>
                <RuleItem title="Overtaking">
                    Always overtake from the <strong>right side</strong> only. Never overtake on a curve, bridge, or pedestrian crossing. Ensure the road ahead is clear before overtaking.
                </RuleItem>
                <RuleItem title="Lane Discipline">
                    Keep to the left on two-way roads. On multi-lane highways, use the right lane only for overtaking. Use indicators well in advance before changing lanes.
                </RuleItem>
                <RuleItem title="Use of Lights">
                    Use high beam only on dark highways when no vehicle is approaching. Always dip your headlights (low beam) when facing oncoming traffic to avoid blinding other drivers.
                </RuleItem>
                <RuleItem title="Horn Usage">
                    Use the horn only when necessary to warn others. Do not use horns in "Silent Zones" (near hospitals, schools).
                </RuleItem>
            </div>
        </div>
    );
}

function DocumentsSection() {
    return (
        <div className="space-y-6">
            <SectionHeader title="Mandatory Documents" desc="You must carry the following valid documents while driving." />

            <div className="grid md:grid-cols-2 gap-4">
                {[
                    { title: "Driving License (DL)", desc: "Must be valid and appropriate for the vehicle class." },
                    { title: "Registration Certificate (RC)", desc: "Proof of vehicle ownership." },
                    { title: "Insurance Policy", desc: "Third-party insurance is mandatory by law." },
                    { title: "Pollution Under Control (PUC)", desc: "Certificate verifying emission standards." }
                ].map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">{doc.title}</h4>
                            <p className="text-sm text-slate-500 mt-1">{doc.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 p-4 bg-blue-50 text-blue-800 text-sm rounded-lg flex items-start gap-3">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>Digital copies in DigiLocker or mParivahan apps are legally accepted by traffic police.</p>
            </div>
        </div>
    );
}

function FinesSection() {
    return (
        <div className="space-y-6">
            <SectionHeader title="Fines & Penalties (Maharashtra)" desc="Common traffic fines in Pune & Maharashtra under the Motor Vehicles (Amendment) Act, 2019." />

            <div className="overflow-hidden border border-gray-200 rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Offense</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Penalty (Approx.)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {[
                            { offense: "Driving without License", penalty: "₹5,000" },
                            { offense: "Driving without Helmet (Rider/Pillion)", penalty: "₹500 - ₹1,000 + License Disqualification for 3 months" },
                            { offense: "Driving without Seatbelt", penalty: "₹1,000" },
                            { offense: "Overspeeding (LMV)", penalty: "₹1,000 - ₹2,000" },
                            { offense: "Drunk Driving", penalty: "₹10,000 + 6 months jail (First Offense)" },
                            { offense: "Using Mobile while Driving", penalty: "₹1,000 - ₹5,000" },
                            { offense: "Jumping Traffic Signal", penalty: "₹500 - ₹1,500" },
                            { offense: "Racing / Dangerous Driving", penalty: "₹5,000" },
                            { offense: "Underage Driving", penalty: "₹25,000 + 3 yrs jail for guardian + Vehicle Reg. Cancelled" },
                        ].map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{row.offense}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">{row.penalty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">* Fine amounts are subject to change by Maharashtra Traffic Police updates. Always check the latest notification.</p>
            <div className="mt-4 p-4 bg-orange-50 text-orange-800 text-sm rounded-lg flex items-start gap-3 border border-orange-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p><strong>Did you know?</strong> You can pay traffic challans online via the <strong>MahaTrafficapp</strong> or the official Maharashtra Traffic Police website.</p>
            </div>
        </div>
    );
}

function SafetySection() {
    return (
        <div className="space-y-6">
            <SectionHeader title="Safety & Etiquette in Pune" desc="Essential practices for navigating Pune's dynamic traffic safely." />

            <div className="space-y-6">
                <div>
                    <h4 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
                        <Shield className="w-5 h-5 text-indigo-600" /> Defensive Driving (Pune Context)
                    </h4>
                    <ul className="grid gap-3">
                        {[
                            "Punekars love their two-wheelers. Always check your blind spots for bikes zipping through gaps.",
                            "Be extra cautious at chowks (intersections) without signals; eye contact helps establish right of way.",
                            "Maintain a safe distance from PMT buses and auto-rickshaws; they may stop suddenly.",
                            "Look out for pedestrians crossing anywhere, not just at zebra crossings.",
                            "Honk gently only when necessary to alert others of your presence, especially on narrow peth roads.",
                            "Always wear a helmet (rider & pillion) and seatbelt - it's for your safety, not just to avoid fines."
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border-t border-slate-100 pt-6">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
                        <AlertTriangle className="w-5 h-5 text-indigo-600" /> Emergency Protocols
                    </h4>
                    <p className="text-sm text-slate-600 mb-4">
                        In case of an accident or emergency in Pune/Maharashtra:
                    </p>
                    <div className="bg-indigo-50 p-4 rounded-xl space-y-2">
                        <p className="font-bold text-indigo-900 text-sm">Important Numbers:</p>
                        <div className="grid grid-cols-2 gap-2 text-sm text-indigo-800 mb-3">
                            <span>🚑 Ambulance: <strong>108</strong></span>
                            <span>🚓 Police Control Room: <strong>100</strong></span>
                            <span>🚦 Traffic Police Helpline: <strong>+91-8411800100</strong> (Pune City)</span>
                            <span>🆘 Women's Helpline: <strong>1091</strong></span>
                        </div>
                        <p className="font-bold text-indigo-900 text-sm mt-2">Steps to take:</p>
                        <ol className="list-decimal list-inside text-sm text-indigo-800 space-y-1">
                            <li>Secure the scene with hazard lights/warning triangles.</li>
                            <li>Call 108 immediately for medical help if needed.</li>
                            <li>Do not move injured persons unless in immediate danger (fire/traffic).</li>
                            <li>Take photos of the scene for insurance/police report (FIR).</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}


// UI Helpers
function InfoCard({ title, color, children }: { title: string, color: string, children: React.ReactNode }) {
    return (
        <div className={`p-4 rounded-lg border ${color}`}>
            <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
            {children}
        </div>
    );
}

function RuleItem({ title, active = false, children }: { title: string, active?: boolean, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(active);

    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
                <span className="font-bold text-slate-800">{title}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            {isOpen && (
                <div className="p-4 bg-white border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
                    {children}
                </div>
            )}
        </div>
    );
}
