'use client';

import React from 'react';
import { Compass, Landmark, Shield, Sparkles, Building, Briefcase } from 'lucide-react';

export default function ServicesPage() {
  const serviceList = [
    {
      icon: <Compass className="w-8 h-8 text-gold-500" />,
      title: 'Bespoke Property Acquisition',
      desc: 'Our buyer agents review off-market family portfolios, bank foreclosures, and developer reserves to locate land plots, mansions, or penthouse landmarks matching your specific structural criteria.',
    },
    {
      icon: <Building className="w-8 h-8 text-gold-500" />,
      title: 'Sale & Auction Representation',
      desc: 'Representing owners of prime architecture. We orchestrate private viewings, prepare detailed historical books, and manage negotiations with qualified global buyers, ensuring absolute privacy.',
    },
    {
      icon: <Briefcase className="w-8 h-8 text-gold-500" />,
      title: 'Portfolio & Tax Advisory',
      desc: 'High-value transactions require structural legal alignment. We cooperate with leading financial consultants to assist you with asset swaps, capital gains tax optimization, and property succession planning.',
    },
    {
      icon: <Sparkles className="w-8 h-8 text-gold-500" />,
      title: 'Luxury Property Staging',
      desc: 'Before presenting an estate to buyers, our staging consultants arrange custom Italian lighting, modern furniture layout setups, and biophilic integrations to emphasize the architectural masterpiece.',
    },
    {
      icon: <Shield className="w-8 h-8 text-gold-500" />,
      title: 'Concierge Verification',
      desc: 'We carry out exhaustive structural testing, zoning verifications, and property histories, providing you with a complete verification dossier before contract signing.',
    },
    {
      icon: <Landmark className="w-8 h-8 text-gold-500" />,
      title: 'Diplomatic Gated Estates',
      desc: 'Assisting embassy staff, international consulates, and security-critical figures in locating perimeters with high security ratings, blast mitigation specs, and absolute perimeter privacy.',
    },
  ];

  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-200">
      {/* Services Banner */}
      <section className="relative h-[45vh] flex items-center justify-center pt-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0a0a0b]/80 z-10" />
          <img
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200"
            alt="Mansion Corridor"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative z-10 text-center px-6">
          <span className="text-gold-500 text-xs uppercase tracking-[0.3em] font-semibold">Bespoke Divisions</span>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-white mt-2">
            Professional <span className="italic font-serif font-semibold text-gold-200">Advisory</span>
          </h1>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceList.map((service, index) => (
            <div key={index} className="glass-card p-8 rounded-xl flex flex-col h-full hover:border-gold-500/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-gold-500/5 flex items-center justify-center mb-6 border border-gold-500/10">
                {service.icon}
              </div>
              <h3 className="text-xl font-serif font-semibold text-gray-100 mb-4">{service.title}</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed mb-6">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Client workflow CTA */}
      <section className="py-20 px-6 bg-luxury-charcoal/20 border-t border-gold-500/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-serif text-white mb-4">Interested in Listing an Architectural Showpiece?</h2>
          <p className="text-xs text-gray-400 font-light leading-relaxed max-w-2xl mx-auto mb-8">
            Our brokerage handles high-value sales using off-market channels. We ensure that listing credentials, floorplans, and pricing values are kept confidential, shared only with pre-vetted buyers.
          </p>
          <a
            href="/contact"
            className="btn-gold px-8 py-3 rounded text-xs uppercase tracking-wider font-semibold inline-block"
          >
            Arrange Private Listing Appraisal
          </a>
        </div>
      </section>
    </div>
  );
}
