"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// Metadata export moved to layout or separate file because strict "use client" usage with framer-motion
// For now we will keep the page client-side for animations.
import { Award, Users, Shield, Target, ChevronRight, Clock, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function About() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Header */}
            <section className="relative bg-slate-900 text-white py-20 overflow-hidden">
                {/* Doodle Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 L0 50 Q50 0 100 50 L100 100 Z" fill="white" />
                    </svg>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        About DriveSafe
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-xl text-gray-300 max-w-2xl mx-auto"
                    >
                        Empowering a new generation of safe, confident, and responsible drivers since 2010.
                    </motion.p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            {/* Graphic element */}
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-100 rounded-full z-0"></div>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-slate-100 rounded-full z-0"></div>
                            <img
                                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800"
                                alt="Driving Instructor teaching student"
                                className="relative z-10 rounded-2xl shadow-xl w-full object-cover h-[400px]"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                At DriveSafe, we don't just teach you how to pass a test; we teach you how to drive for life.
                                Our mission is to create safer roads by cultivating responsible driving habits, defensive driving skills,
                                and comprehensive road knowledge in every student.
                            </p>

                            <ul className="space-y-4 pt-4">
                                {[
                                    "Safety First Methodology",
                                    "Certified & Patient Instructors",
                                    "Modern Fleet of Vehicles",
                                    "Personalized Learning Plans"
                                ].map((item, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="bg-orange-100 p-1 rounded-full">
                                            <ChevronRight className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <span className="font-medium text-slate-700">{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Fun Stats / Doodle Section */}
            <section className="py-16 bg-orange-50 relative overflow-hidden">
                {/* Decorative Doodles */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-10 left-10 opacity-20"
                >
                    <Users className="w-32 h-32 text-orange-300" />
                </motion.div>
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-10 right-10 opacity-20"
                >
                    <Award className="w-32 h-32 text-orange-300" />
                </motion.div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
                    >
                        {[
                            { icon: Users, label: "Students Trained", value: "5,000+" },
                            { icon: Shield, label: "Safety Rating", value: "100%" },
                            { icon: Award, label: "Pass Rate", value: "98%" },
                            { icon: Target, label: "Years Experience", value: "15+" },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 transform hover:-translate-y-1 transition-transform"
                            >
                                <stat.icon className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                                <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                                <p className="text-gray-500 font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Rules & Guidelines Section */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">School Rules & Guidelines</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            To ensure a safe and productive learning environment for everyone, we kindly ask all students to adhere to the following guidelines.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Clock,
                                title: "Punctuality",
                                desc: "Please arrive 10 minutes before your scheduled lesson. Late arrivals may result in reduced lesson time.",
                                color: "text-blue-500",
                                bg: "bg-blue-50"
                            },
                            {
                                icon: AlertCircle,
                                title: "Cancellations",
                                desc: "Cancellations must be made at least 24 hours in advance to avoid a cancellation fee or loss of lesson credit.",
                                color: "text-red-500",
                                bg: "bg-red-50"
                            },
                            {
                                icon: FileText,
                                title: "Learner's Permit",
                                desc: "You must carry your valid learner's permit to every driving lesson. No permit, no driving - it's the law!",
                                color: "text-orange-500",
                                bg: "bg-orange-50"
                            },
                            {
                                icon: CheckCircle,
                                title: "Dress Code",
                                desc: "Wear comfortable clothing and sensible footwear. No flip-flops, high heels, or heavy boots for driving lessons.",
                                color: "text-green-500",
                                bg: "bg-green-50"
                            },
                            {
                                icon: Shield,
                                title: "Safety First",
                                desc: "Follow your instructor's directions at all times. Use seatbelts. Zero tolerance for alcohol or drug use.",
                                color: "text-purple-500",
                                bg: "bg-purple-50"
                            },
                            {
                                icon: Target,
                                title: "Progress Tracking",
                                desc: "Bring your logbook to every session. Consistent practice between lessons is highly recommended for faster progress.",
                                color: "text-indigo-500",
                                bg: "bg-indigo-50"
                            }
                        ].map((rule, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow bg-white"
                            >
                                <div className={`w-12 h-12 rounded-xl ${rule.bg} flex items-center justify-center flex-shrink-0`}>
                                    <rule.icon className={`w-6 h-6 ${rule.color}`} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-2">{rule.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{rule.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-slate-900 mb-4"
                    >
                        Meet Our Experts
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 max-w-2xl mx-auto mb-12"
                    >
                        Our instructors are certified professionals dedicated to your success and safety.
                    </motion.p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: "Harshal Baviskar", role: "Senior Instructor", color: "bg-blue-100" },
                            { name: "Jane Smith", role: "Defensive Driving Expert", color: "bg-green-100" },
                            { name: "Mike Johnson", role: "Theory Specialist", color: "bg-purple-100" }
                        ].map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                whileHover={{ y: -10 }}
                                className="group relative bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
                            >
                                <div className={`aspect-square ${member.color} rounded-2xl mb-6 overflow-hidden relative mx-auto max-w-[200px]`}>
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                        {/* Placeholder for trainer image using icon */}
                                        <Users className="w-16 h-16 opacity-50" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                                <p className="text-orange-600 font-medium">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
