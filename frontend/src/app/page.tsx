'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { api } from '@/lib/api';
import PropertyCard, { Property } from '@/components/PropertyCard';
import { Search, Shield, Award, Landmark, Eye, Heart, Compass, CheckCircle2, MessageSquare, BookOpen, Send, Check } from 'lucide-react';

export default function HomePage() {
  const { settings } = useSettings();
  const router = useRouter();

  // Data States
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  // Search Bar Filter States
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('For Sale');
  const [priceMax, setPriceMax] = useState('');

  // Inquiry Form States
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Active Testimonial Index
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Fetch Homepage Data
  useEffect(() => {
    const loadData = async () => {
      try {
        setPropertiesLoading(true);
        // Fetch properties (featured only)
        const props = await api.properties.list({ featured: true, limit: 3 });
        setFeaturedProperties(props);

        // Fetch approved testimonials
        const reviews = await api.testimonials.list(true);
        setTestimonials(reviews.slice(0, 3));

        // Fetch recent blogs
        const posts = await api.blogs.list({ limit: 3 });
        setBlogs(posts);
      } catch (err) {
        console.error('Error fetching homepage resources:', err);
      } finally {
        setPropertiesLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (city) queryParams.append('city', city);
    if (type) queryParams.append('type', type);
    if (status) queryParams.append('status', status);
    if (priceMax) queryParams.append('priceMax', priceMax);
    router.push(`/properties?${queryParams.toString()}`);
  };

  // Handle Lead Form Submission
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryPhone || !inquiryMsg) return;

    try {
      setInquiryLoading(true);
      await api.inquiries.submit({
        name: inquiryName,
        email: inquiryEmail,
        phone: inquiryPhone,
        message: inquiryMsg,
      });
      setInquirySuccess(true);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryPhone('');
      setInquiryMsg('');
      setTimeout(() => setInquirySuccess(false), 5000);
      router.push('/thank-you');
    } catch (err) {
      alert('Failed to submit inquiry. Please try again or contact us via WhatsApp.');
    } finally {
      setInquiryLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-luxury-obsidian">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-1/2 right-10 w-[600px] h-[600px] bg-gold-500/3 rounded-full blur-[150px] -z-10" />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0a0a0b]/85 z-10" />
          <img
            src={settings.heroBgImage || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600"}
            alt="Luxury Mansion Background"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Hero Content */}
        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          <span className="text-gold-500 uppercase tracking-[0.4em] text-xs font-semibold mb-4 animate-fade-in">
            {settings.heroTagline || "A Legacy of Absolute Discernment"}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-[1.1] mb-6 tracking-wide max-w-4xl">
            {settings.heroTitle || "Where Architecture Meets Artistic Grandeur"}
          </h1>
          <p className="text-sm md:text-base text-gray-400 font-light max-w-2xl leading-relaxed mb-10">
            {settings.heroSubtitle || "Brokerage services specialized in ultra-premium residential masterpieces, private estates, and beachfront sanctuaries for the most fastidious collectors."}
          </p>

          {/* Search Filter Box */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-4xl glassmorphism p-5 md:p-6 rounded-xl flex flex-col gap-4 text-left shadow-2xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filter 1: Status */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] tracking-wider uppercase text-gold-500 font-semibold">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-luxury-charcoal/60 border border-gold-500/10 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-gold-500 transition-colors"
                >
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                </select>
              </div>

              {/* Filter 2: Type */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] tracking-wider uppercase text-gold-500 font-semibold">Asset Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-luxury-charcoal/60 border border-gold-500/10 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-gold-500 transition-colors"
                >
                  <option value="">All Categories</option>
                  <option value="Villa">Beachfront Villa</option>
                  <option value="Penthouse">Sky Penthouse</option>
                  <option value="Mansion">Heritage Mansion</option>
                  <option value="Apartment">Modern Apartment</option>
                </select>
              </div>

              {/* Filter 3: City */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] tracking-wider uppercase text-gold-500 font-semibold">Location</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-luxury-charcoal/60 border border-gold-500/10 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-gold-500 transition-colors"
                >
                  <option value="">All Regions</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Goa">Goa</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Gurgaon">Gurgaon</option>
                </select>
              </div>

              {/* Filter 4: Max Price */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] tracking-wider uppercase text-gold-500 font-semibold">Maximum Budget</label>
                <select
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="bg-luxury-charcoal/60 border border-gold-500/10 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-gold-500 transition-colors"
                >
                  <option value="">Unlimited</option>
                  <option value="100000000">₹10 Crores (100M)</option>
                  <option value="200000000">₹20 Crores (200M)</option>
                  <option value="500000000">₹50 Crores (500M)</option>
                  <option value="1500000000">₹150 Crores (1.5B)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-gold w-full py-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" /> Search Private Inventory
            </button>
          </form>
        </div>
      </section>

      {/* --- STATS COUNTER --- */}
      <section className="bg-luxury-charcoal/50 py-12 border-t border-b border-gold-500/10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-serif text-gold-500 font-bold mb-1 stat-glow">₹5,000Cr+</div>
            <div className="text-[10px] tracking-widest uppercase text-gray-400 font-light">Transactions Brokered</div>
          </div>
          <div className="border-l border-gold-500/10">
            <div className="text-3xl md:text-4xl font-serif text-gold-500 font-bold mb-1 stat-glow">15+ Years</div>
            <div className="text-[10px] tracking-widest uppercase text-gray-400 font-light">Industry Authority</div>
          </div>
          <div className="border-l border-gold-500/10">
            <div className="text-3xl md:text-4xl font-serif text-gold-500 font-bold mb-1 stat-glow">250+</div>
            <div className="text-[10px] tracking-widest uppercase text-gray-400 font-light">Landmarks Listed</div>
          </div>
          <div className="border-l border-gold-500/10">
            <div className="text-3xl md:text-4xl font-serif text-gold-500 font-bold mb-1 stat-glow">4.9/5★</div>
            <div className="text-[10px] tracking-widest uppercase text-gray-400 font-light">Client Satisfaction Rating</div>
          </div>
        </div>
      </section>

      {/* --- FEATURED INVENTORY --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-12">
          <div>
            <span className="text-gold-500 text-xs uppercase tracking-widest font-semibold">Curated Collection</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white mt-1">
              Featured <span className="italic font-serif font-semibold text-gold-200">Landmarks</span>
            </h2>
          </div>
          <Link href="/featured" className="text-xs uppercase tracking-wider text-gold-500 hover:text-gold-200 mt-4 md:mt-0 transition-colors border-b border-gold-500/30 pb-0.5">
            View All Showpieces
          </Link>
        </div>

        {propertiesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-luxury-charcoal/30 border border-gold-500/5 rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* --- WHY CHOOSE US (Luxury Theme) --- */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-luxury-charcoal/20 border-t border-gold-500/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-gold-500 text-xs uppercase tracking-widest font-semibold">The Standard of Discretion</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white mt-1 mb-6">
              Why Collectors Partner With <br />
              <span className="italic font-serif font-semibold text-gold-200">Profptiy Luxury</span>
            </h2>
            <p className="text-sm text-gray-400 font-light leading-relaxed mb-8">
              We do not merely transact buildings. We orchestrate architectural legacy. Our focus is absolute exclusivity, ensuring that both property developers and buyers experience transaction safety and supreme privacy.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-100 font-sans">Strict Confidentiality Protocols</h4>
                  <p className="text-xs text-gray-400 font-light mt-1">High-net-worth deals are kept offline, protected from general listing aggregates.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-100 font-sans">Bespoke Architectural Appraisal</h4>
                  <p className="text-xs text-gray-400 font-light mt-1">Every villa is evaluated on structural glass, spatial flow, and heritage value.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                  <Landmark className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-100 font-sans">End-to-End Legal Concierge</h4>
                  <p className="text-xs text-gray-400 font-light mt-1">Flawless documentation, tax structuring support, and fast registrations.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 border border-gold-500/20 rounded-2xl transform translate-x-4 translate-y-4 -z-10" />
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
              alt="Luxury architecture details"
              className="w-full h-[450px] object-cover rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* --- PROPERTY CATEGORIES (Visual Cards) --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-gold-500 text-xs uppercase tracking-widest font-semibold">Curated Architectural Portfolios</span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-white mt-1">Explore Collections</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Category 1 */}
          <Link href="/properties?type=Villa" className="relative group h-96 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-[#0a0a0b]/40 group-hover:bg-[#0a0a0b]/60 transition-colors duration-500 z-10" />
            <img
              src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600"
              alt="Beachfront villa"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <span className="text-gold-500 text-[10px] tracking-widest uppercase">Concierge Favorites</span>
              <h3 className="text-2xl font-serif text-white mt-1">Beachfront Sanctuaries</h3>
            </div>
          </Link>

          {/* Category 2 */}
          <Link href="/properties?type=Penthouse" className="relative group h-96 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-[#0a0a0b]/40 group-hover:bg-[#0a0a0b]/60 transition-colors duration-500 z-10" />
            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600"
              alt="Penthouse"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <span className="text-gold-500 text-[10px] tracking-widest uppercase">Panoramic Views</span>
              <h3 className="text-2xl font-serif text-white mt-1">Sky Penthouses</h3>
            </div>
          </Link>

          {/* Category 3 */}
          <Link href="/properties?type=Mansion" className="relative group h-96 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-[#0a0a0b]/40 group-hover:bg-[#0a0a0b]/60 transition-colors duration-500 z-10" />
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600"
              alt="Heritage estate"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <span className="text-gold-500 text-[10px] tracking-widest uppercase">Absolute Sovereignty</span>
              <h3 className="text-2xl font-serif text-white mt-1">Heritage Mansions</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* --- SERVICES SECTION (Bespoke Services) --- */}
      <section className="py-24 px-6 bg-luxury-charcoal/30 border-t border-b border-gold-500/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold-500 text-xs uppercase tracking-widest font-semibold">Tailored Advisory</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white mt-1">Bespoke Real Estate Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gold-500/5 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6 text-gold-500" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-gray-100 mb-3">Portfolio Curation</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Analyzing client investment goals to formulate handpicked lists of under-market assets, private off-market estates, and development acquisitions.
              </p>
            </div>

            <div className="glass-card p-8 rounded-xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gold-500/5 flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-gold-500" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-gray-100 mb-3">VIP Viewing Tours</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Orchestrating exclusive, private helicopter or chauffeur-driven site visit schedules, complete with on-site architects to answer structural specs.
              </p>
            </div>

            <div className="glass-card p-8 rounded-xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gold-500/5 flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-gold-500" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-gray-100 mb-3">Legacy Advisory</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Advising families on property succession, multi-generational trusts, real estate portfolio valuations, and high-end asset swaps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SLIDER --- */}
      {testimonials.length > 0 && (
        <section className="py-24 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gold-500 text-xs uppercase tracking-widest font-semibold">Endorsements</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white mt-1">Client Experiences</h2>
          </div>

          <div className="glass-card p-8 md:p-12 rounded-xl relative flex flex-col items-center text-center">
            <MessageSquare className="w-10 h-10 text-gold-500/20 absolute top-8 left-8" />
            
            <p className="text-base md:text-lg font-serif italic text-gray-300 leading-relaxed max-w-2xl mb-8">
              "{testimonials[activeTestimonial].content}"
            </p>

            <div className="flex items-center gap-4">
              <img
                src={testimonials[activeTestimonial].avatar}
                alt={testimonials[activeTestimonial].name}
                className="w-12 h-12 rounded-full object-cover border border-gold-500/30"
              />
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-100">{testimonials[activeTestimonial].name}</div>
                <div className="text-[10px] tracking-wide text-gold-500">
                  {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
                </div>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === activeTestimonial ? 'bg-gold-500 w-6' : 'bg-gray-600'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- CALL TO ACTION --- */}
      <section className="relative py-28 px-6 bg-gradient-to-r from-luxury-obsidian to-luxury-charcoal border-t border-b border-gold-500/10 overflow-hidden text-center">
        <div className="absolute inset-0 bg-[#000000]/60 z-0" />
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200"
          alt="CTA Background"
          className="absolute inset-0 w-full h-full object-cover -z-10 opacity-30"
        />
        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">
          <span className="text-gold-500 text-xs uppercase tracking-widest font-semibold mb-4">Immediate Consultation</span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-white mb-6">
            {settings.ctaTitle || 'Acquire Your Next Architectural Legacy'}
          </h2>
          <p className="text-sm text-gray-400 font-light max-w-xl leading-relaxed mb-8">
            {settings.ctaSubtitle || 'Schedule a private briefing with our senior brokers. We will review our off-market inventory matches matching your portfolio profiles.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/book" className="btn-gold px-8 py-3 rounded text-xs uppercase tracking-wider font-semibold">
              {settings.ctaBtnText || 'Schedule Consultation'}
            </Link>
            <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn-outline-gold px-8 py-3 rounded text-xs uppercase tracking-wider font-semibold">
              Confer Via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* --- JOURNAL / NEWS JOURNAL TEASER --- */}
      {blogs.length > 0 && (
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold-500 text-xs uppercase tracking-widest font-semibold">The Journal</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white mt-1">Luxury Lifestyle & Insights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((post) => (
              <article key={post.id} className="glass-card rounded-xl overflow-hidden flex flex-col group h-full">
                <div className="relative h-48 overflow-hidden shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 bg-luxury-obsidian/75 backdrop-blur-md border border-gold-500/10 text-[9px] tracking-widest text-gold-500 uppercase rounded">
                      {post.tags?.[0] || 'Real Estate'}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-serif font-semibold text-gray-100 group-hover:text-gold-500 transition-colors line-clamp-2 mb-3">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-xs text-gray-400 font-light leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs uppercase tracking-wider text-gold-500 hover:text-gold-200 mt-auto flex items-center gap-1 font-medium"
                  >
                    Read Journal <BookOpen className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* --- CONTACT FORM & GOOGLE MAPS --- */}
      <section className="py-24 px-6 border-t border-gold-500/5 bg-[#0b0b0d]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Lead capture form */}
          <div>
            <span className="text-gold-500 text-xs uppercase tracking-widest font-semibold">Lead Acquisition</span>
            <h2 className="text-3xl font-serif font-light text-white mt-1 mb-6">Contact Our Office</h2>
            <p className="text-xs text-gray-400 font-light mb-8 leading-relaxed">
              If you have inquiries regarding acquisition details, sales representation, or listing opportunities, submit details below. Our administrative coordinators respond in 2 hours.
            </p>

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-4 py-3 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-4 py-3 text-xs text-gray-300 focus:outline-none transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Contact Number (With Area Code)"
                  required
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-4 py-3 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <textarea
                  placeholder="Tell us about your property requirements (e.g. villa size, preferred area, specific MLS ID)..."
                  required
                  rows={4}
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-4 py-3 text-xs text-gray-300 focus:outline-none transition-colors"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={inquiryLoading}
                className="btn-gold px-8 py-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
              >
                {inquiryLoading ? (
                  <span>Submitting Lead...</span>
                ) : inquirySuccess ? (
                  <>
                    <span>Acquisition Success!</span> <Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Submit Query</span> <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Location Map */}
          <div className="h-[400px] lg:h-full min-h-[350px] relative rounded-2xl overflow-hidden border border-gold-500/10 shadow-lg">
            {settings.googleMapEmbedUrl ? (
              <iframe
                title="Office Location Map"
                src={settings.googleMapEmbedUrl}
                width="100%"
                height="100%"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-75"
              />
            ) : (
              <div className="w-full h-full bg-luxury-charcoal flex items-center justify-center text-xs text-gray-400 font-light">
                Google Map Unconfigured
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
