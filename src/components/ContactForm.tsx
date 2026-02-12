
"use client";

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ContactForm() {
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errors, setErrors] = useState<{ email?: string; phoneNumber?: string; location?: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');
        setErrors({});

        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const phoneNumber = formData.get('phoneNumber') as string;
        const location = formData.get('location') as string;

        // Validation
        const newErrors: { email?: string; phoneNumber?: string; location?: string } = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        // Phone validation (10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneNumber || !phoneRegex.test(phoneNumber.replace(/\s/g, '').replace(/-/g, ''))) {
            newErrors.phoneNumber = 'Please enter a valid 10-digit phone number.';
        }

        // Location validation
        if (!location || location.trim() === '') {
            newErrors.location = 'Please enter your location.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setFormStatus('idle');
            return;
        }

        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phoneNumber: formData.get('phoneNumber'),
            location: formData.get('location'),
            message: formData.get('message')
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setFormStatus('success');
            } else {
                setFormStatus('error');
            }
        } catch (err) {
            console.error(err);
            setFormStatus('error');
        }
    };

    if (formStatus === 'success') {
        return (
            <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-100 text-center">
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p>Thank you for contacting us. We will get back to you shortly.</p>
                <button
                    onClick={() => setFormStatus('idle')}
                    className="mt-4 text-green-800 font-semibold hover:underline"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">First Name</label>
                    <input type="text" name="firstName" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-gray-900" placeholder="John" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Last Name</label>
                    <input type="text" name="lastName" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-gray-900" placeholder="Doe" />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                    <input type="email" name="email" required className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'} focus:ring-2 outline-none transition-all text-gray-900`} placeholder="john@example.com" />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                    <input type="tel" name="phoneNumber" required maxLength={10} pattern="[0-9]{10}" inputMode="numeric" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '') }} className={`w-full px-4 py-3 rounded-lg border ${errors.phoneNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'} focus:ring-2 outline-none transition-all text-gray-900`} placeholder="9876543210" />
                    {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Location / Area</label>
                <input type="text" name="location" required className={`w-full px-4 py-3 rounded-lg border ${errors.location ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'} focus:ring-2 outline-none transition-all text-gray-900`} placeholder="e.g. Kothrud, Pune" />
                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Message</label>
                <textarea name="message" rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none text-gray-900" placeholder="How can we help you?"></textarea>
            </div>

            <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {formStatus === 'submitting' ? 'Sending...' : (
                    <>
                        Send Message <Send className="w-5 h-5" />
                    </>
                )}
            </button>
            {formStatus === 'error' && (
                <p className="text-red-600 text-center font-medium">Failed to send message. Please try again.</p>
            )}
        </form>
    );
}
