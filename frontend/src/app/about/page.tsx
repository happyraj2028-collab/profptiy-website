'use client';

import React from 'react';
import { useSettings } from '@/context/SettingsContext';
import { Award, Eye, Heart, ShieldAlert, Check } from 'lucide-react';

export default function AboutPage() {
  const { settings } = useSettings();

  const milestones = [
    { year: '2011', title: 'Founding of Profptiy', desc: 'Began as a private advisory boutique catering exclusively to industrial family offices.' },
    { year: '2016', title: 'Off-Market Breakthrough', desc: 'Launched our private inventory network, enabling discrete brokerages without public MLS syndication.' },
    { year: '2021', title: 'Coastal Expansion', desc: 'Inaugurated our beachfront portfolio in Goa, setting price records for villa transaction values.' },
    { year: '2025', title: 'Global Concierge Integration', desc: 'Merged premium asset acquisitions with tax advisory and luxury property styling groups.' },
  ];

  const partners = [
    {
      name: 'Sanjay Malhotra',
      role: 'Founding Partner & Delhi/Mumbai Advisor',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      bio: 'Over 18 years broker experience in high-end municipal transactions. Specialized in Lutyens zone estates and South Mumbai sky penthouses.',
    },
    {
      name: 'Nisha Fernandes',
      role: 'Managing Partner - Coastal & Vacation Estates',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      bio: 'Vacation property specialist with deep links to developer communities in Goa and Nandi Hills. Expert in architectural style evaluations.',
    },
  ];

  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-200">
      {/* Cinematic Banner */}
      <section className="relative h-[45vh] flex items-center justify-center pt-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0a0a0b]/80 z-10" />
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200"
            alt="Luxury Meeting Room"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative z-10 text-center px-6">
          <span className="text-gold-500 text-xs uppercase tracking-[0.3em] font-semibold">Our Heritage</span>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-white mt-2">
            The Brand <span className="italic font-serif font-semibold text-gold-200">Story</span>
          </h1>
        </div>
      </section>

      {/* Philosophy Grid */}
      <section className="py-24 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-gold-500 text-xs uppercase tracking-widest font-semibold">Where Discretion Rules</span>
          <h2 className="text-3xl font-serif font-light text-white mt-1 mb-6">Redefining High-End Brokerage</h2>
          <p className="text-sm text-gray-400 font-light leading-relaxed mb-5">
            Profptiy Luxury Real Estate was founded on a simple realization: the elite do not want their homes aggregated on public portals alongside general rentals. Acquisition of true luxury properties requires custom advisory, historical evaluation, and financial confidentiality.
          </p>
          <p className="text-sm text-gray-400 font-light leading-relaxed mb-6">
            For more than a decade, we have operated as a bespoke consultancy rather than a volume agency. We representing both buyers and developers in transactions exceeding ₹5000+ Crores, with absolute discretion.
          </p>
          <ul className="space-y-3 text-xs text-gray-300">
            <li className="flex items-center"><Check className="w-4 h-4 text-gold-500 mr-2.5" /> 100% verified off-market inventories.</li>
            <li className="flex items-center"><Check className="w-4 h-4 text-gold-500 mr-2.5" /> Direct liaison with award-winning architects.</li>
            <li className="flex items-center"><Check className="w-4 h-4 text-gold-500 mr-2.5" /> Strict NDA compliance for buyer profiles.</li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500" alt="Mansion interior" className="w-full h-64 object-cover rounded-xl mt-8" />
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500" alt="Mansion pool" className="w-full h-64 object-cover rounded-xl" />
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-24 px-6 bg-luxury-charcoal/30 border-t border-b border-gold-500/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold-500 text-xs uppercase tracking-widest font-semibold font-sans">The Timeline</span>
            <h2 className="text-3xl font-serif font-light text-white mt-1">Our Historic Milestones</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {milestones.map((m) => (
              <div key={m.year} className="relative p-6 bg-luxury-charcoal/50 border border-gold-500/5 rounded-xl">
                <span className="text-3xl font-serif font-semibold text-gold-500/30 absolute top-4 right-4">{m.year}</span>
                <h3 className="text-base font-serif font-semibold text-gray-100 mb-2 mt-4">{m.title}</h3>
                <p className="text-xs text-gray-400 font-light leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Profiles */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-gold-500 text-xs uppercase tracking-widest font-semibold">The Principals</span>
          <h2 className="text-3xl font-serif font-light text-white mt-1">Partner Advisors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {partners.map((p) => (
            <div key={p.name} className="glass-card p-6 md:p-8 rounded-xl flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
              <img
                src={p.image}
                alt={p.name}
                className="w-32 h-32 rounded-xl object-cover border border-gold-500/10 shrink-0"
              />
              <div>
                <h3 className="text-lg font-serif font-semibold text-gray-100">{p.name}</h3>
                <span className="text-xs text-gold-500 block mb-3 font-sans uppercase tracking-wide">{p.role}</span>
                <p className="text-xs text-gray-400 font-light leading-relaxed">{p.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
