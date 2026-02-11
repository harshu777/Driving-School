
import Link from 'next/link';
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <Car className="h-8 w-8 text-orange-500" />
                            <span className="text-xl font-bold text-white tracking-tight">DriveSafe</span>
                        </Link>
                        <p className="text-sm text-gray-400">
                            Empowering drivers with confidence and safety skills for a lifetime of journeying.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
                            <li><Link href="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-orange-500 transition-colors">Contact</Link></li>
                            <li><Link href="/login" className="hover:text-orange-500 transition-colors">Student Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact Info</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-orange-500" />
                                123 Driving School Lane, Cityville
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-orange-500" />
                                +1 (555) 123-4567
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-orange-500" />
                                info@drivesafe.com
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-orange-500 transition-colors"><Facebook className="h-6 w-6" /></a>
                            <a href="#" className="hover:text-orange-500 transition-colors"><Twitter className="h-6 w-6" /></a>
                            <a href="#" className="hover:text-orange-500 transition-colors"><Instagram className="h-6 w-6" /></a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-slate-800 pt-8 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} DriveSafe Driving School. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
