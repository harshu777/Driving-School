"use client";

import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, Car, Star, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-sm font-bold mb-6 border border-orange-200">
                  🏆 #1 Rated Driving School in Pune
                </span>
                <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                  Master the Road with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Confidence</span>
                </h1>
                <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Join thousands of successful drivers. Our certified instructors and modern fleet ensure you pass your test and drive safely for life.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/register" className="px-8 py-4 bg-orange-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-orange-500/20 hover:bg-orange-700 hover:scale-105 transition-all flex items-center justify-center gap-2">
                    <Car className="w-5 h-5" /> Book Your First Lesson
                  </Link>
                  <Link href="/about" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                    Learn More
                  </Link>
                </div>

                <div className="mt-10 flex items-center justify-center lg:justify-start gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
                        <div className={`w-full h-full bg-slate-300`} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex text-orange-400 text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Trusted by 500+ Students</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:h-[600px] w-full flex items-center justify-center"
            >
              <div className="relative w-full aspect-square max-w-[600px] lg:max-w-none">
                {/* Blob Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-400/10 rounded-full blur-3xl -z-10" />

                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-all duration-500">
                  <Image
                    src="/hero.png"
                    alt="Happy student driver and instructor"
                    width={600}
                    height={600}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce-slow">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold">100% Safety</p>
                    <p className="text-xs text-slate-500">Certified Instructors</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
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
