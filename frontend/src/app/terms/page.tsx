'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-400 pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto font-light leading-relaxed">
        <h1 className="text-3xl md:text-4xl font-serif text-white mb-6">Terms & Conditions</h1>
        <p className="text-xs mb-8 text-gray-500">Effective Date: June 8, 2026</p>

        <section className="space-y-6 text-sm">
          <p>
            By accessing the luxury real estate portal of Profptiy, you agree to comply with the terms of service outlined below.
          </p>

          <h2 className="text-lg font-serif text-gold-500 mt-8 mb-2">1. Scope of Information</h2>
          <p>
            Property descriptions, architectural specifications, coordinates, and prices displayed on our website are compiled for illustrative purposes. While we carry out verification procedures, all details should be verified independently during contract phases.
          </p>

          <h2 className="text-lg font-serif text-gold-500 mt-8 mb-2">2. Client Representations</h2>
          <p>
            When utilizing our booking or lead systems, you agree to provide valid contact details. We reserve the right to cancel appointment requests which contain false contact numbers or emails.
          </p>

          <h2 className="text-lg font-serif text-gold-500 mt-8 mb-2">3. Intellectual Property</h2>
          <p>
            Logos, custom graphics, typography layout tokens, and text copy compiled on this portal are protected under copyright law. Unauthorized duplication of our catalog lists or images is strictly prohibited.
          </p>

          <h2 className="text-lg font-serif text-gold-500 mt-8 mb-2">4. Disclaimer of Liability</h2>
          <p>
            Profptiy Luxury Real Estate acts as a broker and advisor. Under no circumstances will our directors, partners, or associate agents be liable for transactional losses, delays in developer construction schedules, or direct financial damages arising from property searches.
          </p>
        </section>
      </div>
    </div>
  );
}
