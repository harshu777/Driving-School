"use client";

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, Car } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* Abstract background pattern or image could go here */}
          <div className="absolute right-0 top-0 h-full w-1/2 bg-orange-600/20 skew-x-12 transform origin-top-right" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Master the Road with <span className="text-orange-500">Confidence</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Professional driving lessons tailored to your needs. Safety first, skills forever. Join the best driving school in the city.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex justify-center gap-4"
          >
            <Link href="/login" className="rounded-md bg-orange-600 px-8 py-3 text-lg font-bold text-white shadow-lg hover:bg-orange-700 transition-all hover:scale-105">
              Apply Now
            </Link>
            <Link href="#how-it-works" className="rounded-md border-2 border-white px-8 py-3 text-lg font-bold text-white hover:bg-white hover:text-slate-900 transition-colors">
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Start your driving journey in 3 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                icon: <Calendar className="h-12 w-12 text-orange-600" />,
                title: "1. Book a Slot",
                description: "Choose a time that fits your schedule from our real-time availability calendar."
              },
              {
                icon: <Car className="h-12 w-12 text-orange-600" />,
                title: "2. Learn to Drive",
                description: "Get behind the wheel with our certified instructors in modern, safe vehicles."
              },
              {
                icon: <ShieldCheck className="h-12 w-12 text-orange-600" />,
                title: "3. Get Licensed",
                description: "Track your progress and pass your test with flying colors."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="mb-6 rounded-full bg-orange-100 p-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-gray-400 text-center">
        <p>&copy; {new Date().getFullYear()} DriveSafe Driving School. All rights reserved.</p>
      </footer>
    </div>
  );
}
