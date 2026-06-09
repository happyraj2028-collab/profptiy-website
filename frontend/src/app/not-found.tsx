'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-200 pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="max-w-md w-full glassmorphism p-8 rounded-2xl text-center shadow-2xl relative overflow-hidden">
        {/* Top gold line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gold-500/30"></div>

        <div className="w-14 h-14 rounded-full bg-gold-500/5 flex items-center justify-center mx-auto mb-6 border border-gold-500/10">
          <Compass className="w-6 h-6 text-gold-500 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        <span className="text-gold-500 text-xs uppercase tracking-[0.2em] font-semibold mb-2 block">Error Code 404</span>
        <h1 className="text-2xl md:text-3xl font-serif text-white mb-3 font-light">
          Coordinates <span className="italic font-serif font-semibold text-gold-200">Lost</span>
        </h1>
        <p className="text-xs text-gray-400 font-light leading-relaxed mb-8">
          The property ledger or page you are requesting does not exist in our registries. It may have been archived or sold.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/properties"
            className="btn-gold py-2.5 rounded text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5"
          >
            Explore Listings <ArrowRight className="w-3.5 h-3.5" />
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
