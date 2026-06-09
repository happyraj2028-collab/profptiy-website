'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is off-market inventory and how can I access it?',
      a: 'Off-market listings (or pocket listings) are high-value estates whose owners require absolute privacy. These properties are not indexed on public websites. To review these catalogs, you must schedule a briefing session with a senior broker to verify buyer eligibility.',
    },
    {
      q: 'How do I arrange a private site viewing?',
      a: 'You can submit a viewing request using the scheduler on our details pages or Contact form. Our associates will call you within two hours to verify your credentials and arrange the logistics (private chauffeuring and site coordination).',
    },
    {
      q: 'Does Profptiy handle legal registration and taxation advisory?',
      a: 'Yes. Our consultancy department collaborates with certified real estate attorneys and tax consultants to review titles, draft NDAs, manage escrow services, and optimize capital gains tax structures.',
    },
    {
      q: 'What are the standard brokerage commissions for transactions?',
      a: 'Brokerage fees vary based on the transaction class (purchase, long-term rental, or commercial lease) and property value. Typically, commission structures range between 1% to 2% of the closing value, which covers complete transaction assistance.',
    },
    {
      q: 'Can you represent me if I am based internationally?',
      a: 'Absolutely. We manage acquisitions for foreign NRI portfolios and multinational corporate groups. We provide digital site walkthroughs, video tours, and handle remote legal power-of-attorney procedures.',
    },
  ];

  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-200 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-4 border border-gold-500/20">
            <HelpCircle className="w-5 h-5 text-gold-500" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-3">
            Frequently Asked <span className="italic font-serif font-semibold text-gold-200">Questions</span>
          </h1>
          <p className="text-xs text-gray-400 font-light max-w-md mx-auto leading-relaxed">
            Essential information regarding luxury asset curation, private viewing logistics, and transaction security.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glassmorphism rounded-xl overflow-hidden border border-gold-500/5 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-luxury-charcoal/30 transition-colors"
                >
                  <span className="text-sm font-serif font-semibold text-gray-200 pr-4">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gold-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gold-500 shrink-0" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="p-6 pt-0 border-t border-gold-500/5 bg-luxury-charcoal/10">
                    <p className="text-xs text-gray-400 leading-relaxed font-light mt-4">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
