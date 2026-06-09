'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Star, MessageSquare, Send, Check } from 'lucide-react';

export default function TestimonialsPage() {
  // Data States
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await api.testimonials.list(true);
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) return;

    try {
      setSubmitLoading(true);
      await api.testimonials.submit({
        name,
        role,
        company,
        content,
        rating,
      });
      setSubmitSuccess(true);
      setName('');
      setRole('');
      setCompany('');
      setContent('');
      setRating(5);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-200 pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-3">
            Client <span className="italic font-serif font-semibold text-gold-200">Endorsements</span>
          </h1>
          <p className="text-xs text-gray-400 font-light max-w-lg mx-auto leading-relaxed">
            Read stories of how we broker residential acquisitions, vacation homes, and corporate structures for high-profile partners.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Testimonial List */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              [1, 2].map((n) => (
                <div key={n} className="bg-luxury-charcoal/30 border border-gold-500/5 rounded-xl h-48 animate-pulse" />
              ))
            ) : testimonials.length === 0 ? (
              <p className="text-xs text-gray-400 font-light">No customer endorsements are listed at this time.</p>
            ) : (
              testimonials.map((t) => (
                <div key={t.id} className="glass-card p-6 rounded-xl relative">
                  <div className="flex items-center gap-1.5 text-gold-500 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm font-serif italic text-gray-300 leading-relaxed mb-6">
                    "{t.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-gold-500/10"
                    />
                    <div>
                      <div className="text-xs font-semibold text-gray-200">{t.name}</div>
                      <div className="text-[10px] text-gray-500">{t.role}, {t.company}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Submission Form */}
          <div className="glassmorphism p-6 rounded-xl h-fit">
            <h3 className="text-lg font-serif text-white mb-4">Leave Feedback</h3>
            <p className="text-xs text-gray-400 font-light mb-6 leading-relaxed">
              If you have recently acquired or sold properties via our portal, submit your review.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Role (e.g. Founder)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              {/* Rating Star Select */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-gray-400 font-semibold uppercase">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                >
                  <option value="5">5 Stars ★★★★★</option>
                  <option value="4">4 Stars ★★★★</option>
                  <option value="3">3 Stars ★★★</option>
                  <option value="2">2 Stars ★★</option>
                  <option value="1">1 Star ★</option>
                </select>
              </div>

              <textarea
                placeholder="Share your experience working with our senior advisors..."
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={submitLoading}
                className="btn-gold w-full py-2.5 rounded text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
              >
                {submitLoading ? 'Submitting...' : submitSuccess ? (
                  <>
                    <span>Submitted!</span> <Check className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>Submit Review</span> <Send className="w-3.5 h-3.5" />
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
