'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { api } from '@/lib/api';
import { Calendar, Clock, Sparkles, Send, Check } from 'lucide-react';

export default function BookPage() {
  const { settings } = useSettings();
  const router = useRouter();

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [assetClass, setAssetClass] = useState('Villa');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !date) return;

    const formattedMessage = `Requested Consultation Booking:\nDate: ${date}\nTime Slot: ${timeSlot}\nAsset Preference: ${assetClass}\n\nClient Message: ${msg}`;

    try {
      setLoading(true);
      await api.inquiries.submit({
        name,
        email,
        phone,
        message: formattedMessage,
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setDate('');
      setMsg('');
      setTimeout(() => setSuccess(false), 5000);
      router.push('/thank-you');
    } catch (error) {
      alert('Error booking slot. Please contact our coordinator via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-200 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-gold-500 text-xs uppercase tracking-[0.2em] font-semibold">Private Viewing Reservations</span>
          <h1 className="text-3xl md:text-5xl font-serif text-white mt-2 mb-3">
            Schedule a <span className="italic font-serif font-semibold text-gold-200">Consultation</span>
          </h1>
          <p className="text-xs text-gray-400 font-light max-w-md mx-auto leading-relaxed">
            Reserve a call or in-person estate walkthrough with a senior partner.
          </p>
        </div>

        <div className="glassmorphism p-8 rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-4 py-3 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-4 py-3 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Contact Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 XXXXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-4 py-3 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              {/* Asset preference */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Asset Class Preference</label>
                <select
                  value={assetClass}
                  onChange={(e) => setAssetClass(e.target.value)}
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-4 py-3.5 text-xs text-gray-300 focus:outline-none transition-colors"
                >
                  <option value="Villa">Beachfront Villa</option>
                  <option value="Penthouse">Sky Penthouse</option>
                  <option value="Mansion">Heritage Mansion</option>
                  <option value="Apartment">Modern Apartment</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date selection */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Preferred Date</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-4 py-3 text-xs text-gray-300 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Time slot select */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Preferred Time Window</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-4 py-3.5 text-xs text-gray-300 focus:outline-none transition-colors"
                >
                  <option value="10:00 AM - 12:00 PM">Morning: 10:00 AM - 12:00 PM</option>
                  <option value="12:00 PM - 02:00 PM">Midday: 12:00 PM - 02:00 PM</option>
                  <option value="02:00 PM - 05:00 PM">Afternoon: 02:00 PM - 05:00 PM</option>
                  <option value="05:00 PM - 07:00 PM">Evening: 05:00 PM - 07:00 PM</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Special Instructions</label>
              <textarea
                placeholder="Mention specific locations of interest or budget specifications..."
                rows={3}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-4 py-3 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 rounded text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
            >
              {loading ? 'Processing Slot Booking...' : success ? (
                <>
                  <span>Viewing Scheduled!</span> <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Schedule Consultation</span> <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
