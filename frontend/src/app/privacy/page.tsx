'use client';

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-400 pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto font-light leading-relaxed">
        <h1 className="text-3xl md:text-4xl font-serif text-white mb-6">Privacy Policy</h1>
        <p className="text-xs mb-8 text-gray-500">Effective Date: June 8, 2026</p>

        <section className="space-y-6 text-sm">
          <p>
            At Profptiy Luxury Real Estate, confidentiality is the cornerstone of our advisory service. This document states how we collect, store, and process client information when you browse our website or submit property inquiries.
          </p>

          <h2 className="text-lg font-serif text-gold-500 mt-8 mb-2">1. Information We Collect</h2>
          <p>
            We collect personal details only when explicitly provided by you via our property inquiry forms, booking schedulers, or testimonial modules. This includes: name, contact number, email address, budget details, and preferred asset locations.
          </p>

          <h2 className="text-lg font-serif text-gold-500 mt-8 mb-2">2. Processing & Usage</h2>
          <p>
            Collected details are processed to respond to viewing inquiries and coordinate consultation sessions. In accordance with strict HNW compliance protocols:
          </p>
          <ul className="list-disc list-inside space-y-2.5 text-xs text-gray-400 my-4 pl-2">
            <li>We do not sell, rent, or lease client information to third-party marketing firms.</li>
            <li>Inquiry data is shared only with the specific associate broker representing the landmark property of interest.</li>
            <li>We utilize secure database servers configured with input sanitization and JWT authentication layers.</li>
          </ul>

          <h2 className="text-lg font-serif text-gold-500 mt-8 mb-2">3. Storage & Retention</h2>
          <p>
            Lead logs are stored in our secure PostgreSQL database for audit and client history tracking. You may request the deletion of your contact files at any time by sending a message to <span className="text-gold-500">privacy@profptiy.com</span>.
          </p>

          <h2 className="text-lg font-serif text-gold-500 mt-8 mb-2">4. Dynamic CMS Cookies</h2>
          <p>
            Our portal implements light technical cookies to maintain user configurations (such as saved search preferences and administrator auth tokens). No tracking cookies are injected.
          </p>
        </section>
      </div>
    </div>
  );
}
