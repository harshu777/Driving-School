
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us - DriveSafe Driving School',
    description: 'Get in touch with DriveSafe Driving School. Contact us for bookings, inquiries, or support. We are here to help you start your driving journey.',
    keywords: ['contact driving school', 'driving lessons booking', 'drivesafe contact', 'customer support'],
};

export default function Contact() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <section className="bg-slate-900 text-white py-16 text-center relative overflow-hidden">
                {/* Abstract doodle/shape */}
                <div className="absolute -left-20 -top-20 w-64 h-64 bg-orange-600 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-gray-300 max-w-xl mx-auto">
                        Have questions about our driving lessons? Ready to book your first slot? We're here to help!
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

                    {/* Contact Info Side */}
                    <div className="bg-slate-900 text-white p-10 md:p-14 flex flex-col justify-between relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/20 rounded-full mr-8 mt-8 blur-xl"></div>

                        <div>
                            <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-lg">
                                        <Phone className="w-6 h-6 text-orange-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-orange-100">Phone</h3>
                                        <p className="text-gray-300">+1 (555) 123-4567</p>
                                        <p className="text-gray-400 text-sm">Mon-Fri 9am-6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-lg">
                                        <Mail className="w-6 h-6 text-orange-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-orange-100">Email</h3>
                                        <p className="text-gray-300">info@drivesafe.com</p>
                                        <p className="text-gray-400 text-sm">Online support 24/7</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-lg">
                                        <MapPin className="w-6 h-6 text-orange-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-orange-100">Location</h3>
                                        <p className="text-gray-300">123 Driving School Lane,</p>
                                        <p className="text-gray-300">Cityville, ST 12345</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <div className="flex gap-4">
                                {/* Social icons placeholder */}
                                <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-orange-500 transition-colors cursor-pointer flex items-center justify-center">FB</div>
                                <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-orange-500 transition-colors cursor-pointer flex items-center justify-center">TW</div>
                                <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-orange-500 transition-colors cursor-pointer flex items-center justify-center">IG</div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Side */}
                    <div className="p-10 md:p-14">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Send us a Message</h2>
                        <ContactForm />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
