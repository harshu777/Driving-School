"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, Car, Star, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white pt-24 pb-32 lg:pt-40 lg:pb-48 overflow-hidden">
        {/* Abstract Doodle Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 opacity-10" width="600" height="600" viewBox="0 0 600 600">
            <circle cx="300" cy="300" r="300" fill="white" />
          </svg>
          <svg className="absolute bottom-0 left-0 transform -translate-x-1/3 translate-y-1/3 opacity-10" width="400" height="400" viewBox="0 0 400 400">
            <rect x="0" y="0" width="400" height="400" rx="40" transform="rotate(45 200 200)" fill="white" />
          </svg>
          {/* road lines effect */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-40 w-full flex justify-center space-x-20 opacity-10">
            <div className="w-4 h-full bg-white skew-x-12"></div>
            <div className="w-4 h-full bg-white skew-x-12"></div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-block"
          >
            <span className="bg-orange-600/20 text-orange-400 py-1 px-4 rounded-full text-sm font-semibold border border-orange-500/30">
              #1 Rated Driving School
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6"
          >
            Master the Road with <br />
            <span className="text-orange-500 relative inline-block">
              Confidence
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-600 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Professional driving lessons tailored to your needs. Safety first, skills forever.
            Join thousands of successful drivers who passed with DriveSafe.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex justify-center gap-4 flex-col sm:flex-row px-4"
          >
            <Link href="/login" className="rounded-xl bg-orange-600 px-8 py-4 text-lg font-bold text-white shadow-xl hover:bg-orange-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
              <Car className="w-5 h-5" /> Start Driving
            </Link>
            <Link href="/about" className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 text-lg font-bold text-white hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-2">
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features / Doodle Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Doodles */}
        <div className="absolute top-20 left-10 w-20 h-20 border-4 border-orange-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-xl"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-4">Why Choose DriveSafe?</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">We combine modern teaching techniques with certified instructors to ensure you become a pro.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <ShieldCheck className="h-10 w-10 text-white" />,
                title: "Safety Focused",
                description: "Our #1 priority is your safety. Learn defensive driving techniques that protect you for life.",
                color: "bg-blue-500 shadow-blue-500/30"
              },
              {
                icon: <Calendar className="h-10 w-10 text-white" />,
                title: "Flexible Scheduling",
                description: "Book slots that fit your life. Weekend and evening slots available for your convenience.",
                color: "bg-orange-500 shadow-orange-500/30"
              },
              {
                icon: <Star className="h-10 w-10 text-white" />,
                title: "Top Rated Instructors",
                description: "Learn from the best. Our instructors are certified, patient, and highly rated by students.",
                color: "bg-green-500 shadow-green-500/30"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group"
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Car className="w-64 h-64 text-white" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="flex justify-center mb-6 text-orange-400 gap-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 fill-current" />)}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">"I passed my test on the first try thanks to DriveSafe! The instructors are amazing."</h2>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-gray-600 rounded-full overflow-hidden">
                  {/* Avatar placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500"></div>
                </div>
                <div className="text-left">
                  <p className="text-white font-bold">Sarah Jenkins</p>
                  <p className="text-gray-400 text-sm">New Driver</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to hit the road?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">Don't wait any longer. Start your driving journey today with our expert guidance.</p>
          <div className="flex justify-center gap-4">
            <Link href="/contact" className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
              Contact Us
            </Link>
            <Link href="/login" className="px-8 py-4 bg-white text-slate-900 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm">
              Student Login
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
