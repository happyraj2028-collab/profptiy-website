'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { api } from '@/lib/api';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const { settings } = useSettings();
  const router = useRouter();

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) return;

    try {
      setLoading(true);
      await api.inquiries.submit({
        name,
        email,
        phone,
        message,
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
      router.push('/thank-you');
    } catch (error) {
      alert('Error submitting inquiry. Please contact us via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-200 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-gold-500 text-xs uppercase tracking-[0.2em] font-semibold">Immediate Assistance</span>
          <h1 className="text-3xl md:text-5xl font-serif text-white mt-2 mb-3">
            Contact <span className="italic font-serif font-semibold text-gold-200">Our Advisors</span>
          </h1>
          <p className="text-xs text-gray-400 font-light max-w-lg mx-auto leading-relaxed">
            Reach out via phone, email, or schedule a briefing in our corporate office in Gurugram.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Contact Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glassmorphism p-6 rounded-xl flex items-start gap-4">
              <Phone className="w-5 h-5 text-gold-500 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-gray-100 font-sans">Corporate Hotlines</h4>
                <a href={`tel:${settings.contactPhone}`} className="text-xs text-gray-400 hover:text-gold-500 transition-colors block mt-1">
                  {settings.contactPhone}
                </a>
                <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-green-400 hover:underline block mt-1 font-medium">
                  Chat via WhatsApp
                </a>
              </div>
            </div>

            <div className="glassmorphism p-6 rounded-xl flex items-start gap-4">
              <Mail className="w-5 h-5 text-gold-500 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-gray-100 font-sans">Electronic Mail</h4>
                <a href={`mailto:${settings.contactEmail}`} className="text-xs text-gray-400 hover:text-gold-500 transition-colors block mt-1">
                  {settings.contactEmail}
                </a>
                <span className="text-[10px] text-gray-500 block mt-1">Corporate responses within 2 hours.</span>
              </div>
            </div>

            <div className="glassmorphism p-6 rounded-xl flex items-start gap-4">
              <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-gray-100 font-sans">Headquarters Office</h4>
                <span className="text-xs text-gray-400 block mt-1 leading-relaxed">
                  {settings.officeAddress}
                </span>
                <span className="text-[10px] text-gray-500 block mt-1">Visitor parking and Valet service active.</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 glassmorphism p-8 rounded-xl">
            <h3 className="text-xl font-serif text-white mb-4">Send Message</h3>
            <p className="text-xs text-gray-400 font-light mb-6 leading-relaxed">
              If you have queries regarding property assets, partnerships, or press releases, submit below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-4 py-3 text-xs text-gray-300 focus:outline-none transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-4 py-3 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              <input
                type="tel"
                placeholder="Contact Number (With Area Code)"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-4 py-3 text-xs text-gray-300 focus:outline-none transition-colors"
              />

              <textarea
                placeholder="Write your comprehensive requirements or comments..."
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-4 py-3 text-xs text-gray-300 focus:outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={loading}
                className="btn-gold px-8 py-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
              >
                {loading ? 'Sending Message...' : success ? (
                  <>
                    <span>Sent Successfully!</span> <Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Submit Query</span> <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Map */}
        {settings.googleMapEmbedUrl && (
          <div className="h-96 w-full rounded-2xl overflow-hidden border border-gold-500/10 shadow-lg">
            <iframe
              title="Office Location Map"
              src={settings.googleMapEmbedUrl}
              width="100%"
              height="100%"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale opacity-70"
            />
          </div>
        )}
      </div>
    </div>
  );
}
