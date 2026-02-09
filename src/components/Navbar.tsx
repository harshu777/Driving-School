"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './auth-provider';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <Car className="h-8 w-8 text-orange-500" />
                            <span className="text-xl font-bold tracking-tight">DriveSafe</span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link href="/" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-800 hover:text-orange-500 transition-colors">
                                Home
                            </Link>
                            <Link href="#about" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-800 hover:text-orange-500 transition-colors">
                                About
                            </Link>
                            <Link href="#contact" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-800 hover:text-orange-500 transition-colors">
                                Contact
                            </Link>

                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <Link href={user.role === 'instructor' ? '/instructor' : '/student'} className="rounded-md px-3 py-2 text-sm font-medium text-orange-500 hover:text-orange-400">
                                        Dashboard
                                    </Link>
                                    <button onClick={logout} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="inline-flex items-center justify-center rounded-md bg-slate-800 p-2 text-gray-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="md:hidden">
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={toggleMenu}
                                className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                            />

                            {/* Side Drawer */}
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed right-0 top-0 bottom-0 w-64 bg-slate-900 shadow-xl z-50 flex flex-col"
                            >
                                <div className="p-4 flex justify-end border-b border-slate-800">
                                    <button
                                        onClick={toggleMenu}
                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="px-2 py-4 space-y-1 overflow-y-auto">
                                    <Link
                                        href="/"
                                        onClick={toggleMenu}
                                        className="block rounded-md px-3 py-2 text-base font-medium hover:bg-slate-800 hover:text-orange-500 text-white transition-colors"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="#about"
                                        onClick={toggleMenu}
                                        className="block rounded-md px-3 py-2 text-base font-medium hover:bg-slate-800 hover:text-orange-500 text-gray-300 transition-colors"
                                    >
                                        About
                                    </Link>
                                    <Link
                                        href="#contact"
                                        onClick={toggleMenu}
                                        className="block rounded-md px-3 py-2 text-base font-medium hover:bg-slate-800 hover:text-orange-500 text-gray-300 transition-colors"
                                    >
                                        Contact
                                    </Link>
                                    {user ? (
                                        <div className="pt-4 border-t border-slate-800 mt-4 space-y-1">
                                            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                Account
                                            </div>
                                            <Link
                                                href={user.role === 'instructor' ? '/instructor' : '/student'}
                                                onClick={toggleMenu}
                                                className="block rounded-md px-3 py-2 text-base font-medium text-orange-500 hover:bg-slate-800 transition-colors"
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    toggleMenu();
                                                }}
                                                className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-red-500 hover:bg-slate-800 transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="pt-4 mt-4">
                                            <Link
                                                href="/login"
                                                onClick={toggleMenu}
                                                className="block text-center rounded-md bg-orange-600 px-3 py-2 text-base font-medium text-white hover:bg-orange-700 transition-colors shadow-sm"
                                            >
                                                Login
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
