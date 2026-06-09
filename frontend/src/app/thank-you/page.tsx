'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-200 pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="max-w-md w-full glassmorphism p-8 rounded-2xl text-center shadow-2xl relative overflow-hidden">
        {/* Top gold bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-600"></div>

        {/* Check circle */}
        <div className="w-14 h-14 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-6 border border-gold-500/20">
          <Check className="w-6 h-6 text-gold-500" />
        </div>

        <h1 className="text-2xl md:text-3xl font-serif text-white mb-3 font-semibold">
          Acquisition Registered
        </h1>
        <p className="text-xs text-gray-400 font-light leading-relaxed mb-8">
          Thank you. Your dossier requirements have been recorded in our administrative system. An associate broker will review your files and contact you shortly.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/properties"
            className="btn-gold py-2.5 rounded text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5"
          >
            Browse Properties <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/"
            className="btn-outline-gold py-2.5 rounded text-xs uppercase tracking-wider font-semibold"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
