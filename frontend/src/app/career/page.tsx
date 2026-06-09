'use client';

import React, { useState } from 'react';
import { Send, Briefcase, Check } from 'lucide-react';

export default function CareerPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Senior Associate Broker');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const jobs = [
    {
      title: 'Senior Associate Broker',
      location: 'South Mumbai Office',
      type: 'Full-Time / Commisioned',
      desc: 'Seeking an advisor with a proven track record of brokering high-value residential transactions exceeding ₹15 Crores. Candidate must maintain absolute professional discretion.',
    },
    {
      title: 'Real Estate Valuation Analyst',
      location: 'Gurugram HQ',
      type: 'Full-Time',
      desc: 'Responsible for evaluating structural glass, biophilic architecture components, zoning restrictions, and compiling comprehensive appraisal dossiers for our private catalog listings.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setLoading(true);
    // Mimic API submission
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setName('');
      setEmail('');
      setMsg('');
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-200 pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-3">
            Join Our <span className="italic font-serif font-semibold text-gold-200">Advisory Team</span>
          </h1>
          <p className="text-xs text-gray-400 font-light max-w-lg mx-auto leading-relaxed">
            Expand your career in real estate brokerage by joining our boutique luxury consulting firm.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Job listings */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-serif text-white border-b border-gold-500/10 pb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gold-500" /> Open Opportunities
            </h3>
            {jobs.map((job, idx) => (
              <div key={idx} className="glass-card p-6 rounded-xl border border-gold-500/5">
                <span className="text-[10px] text-gold-500 uppercase font-semibold tracking-wider">{job.type} • {job.location}</span>
                <h4 className="text-base font-serif font-semibold text-gray-100 mt-1 mb-3">{job.title}</h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">{job.desc}</p>
              </div>
            ))}
          </div>

          {/* Apply Form */}
          <div className="glassmorphism p-6 rounded-xl h-fit">
            <h3 className="text-lg font-serif text-white mb-4">Submit Application</h3>
            <p className="text-xs text-gray-400 font-light mb-6 leading-relaxed">
              Upload your qualifications. Our human resources coordinators will reply within 3 days.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              >
                <option value="Senior Associate Broker">Senior Associate Broker</option>
                <option value="Real Estate Valuation Analyst">Real Estate Valuation Analyst</option>
                <option value="Other / General Application">Other / General Application</option>
              </select>

              <textarea
                placeholder="Briefly state your qualifications and deal histories..."
                rows={3}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full py-2.5 rounded text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting Application...' : success ? (
                  <>
                    <span>Applied Successfully!</span> <Check className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>Send Application</span> <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
