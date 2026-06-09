'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import PropertyCard, { Property } from '@/components/PropertyCard';
import { Search, Filter, RefreshCw, SlidersHorizontal, MapPin } from 'lucide-react';

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter States
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');

  // Data States
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Sync URL parameters to states on initial mount
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
    setCity(searchParams.get('city') || '');
    setType(searchParams.get('type') || '');
    setStatus(searchParams.get('status') || '');
    setPriceMin(searchParams.get('priceMin') || '');
    setPriceMax(searchParams.get('priceMax') || '');
    setBedrooms(searchParams.get('bedrooms') || '');
    setBathrooms(searchParams.get('bathrooms') || '');
  }, [searchParams]);

  // Trigger search query
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const filters = {
        keyword,
        city,
        type,
        status,
        priceMin,
        priceMax,
        bedrooms,
        bathrooms,
      };
      const data = await api.properties.list(filters);
      setProperties(data);
      setTotalCount(data.length);
    } catch (error) {
      console.error('Error loading property catalog:', error);
    } finally {
      setLoading(false);
    }
  };

  // Run search when URL params change
  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  // Handle filter submission
  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = new URLSearchParams();
    if (keyword) query.append('keyword', keyword);
    if (city) query.append('city', city);
    if (type) query.append('type', type);
    if (status) query.append('status', status);
    if (priceMin) query.append('priceMin', priceMin);
    if (priceMax) query.append('priceMax', priceMax);
    if (bedrooms) query.append('bedrooms', bedrooms);
    if (bathrooms) query.append('bathrooms', bathrooms);
    
    router.push(`/properties?${query.toString()}`);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setKeyword('');
    setCity('');
    setType('');
    setStatus('');
    setPriceMin('');
    setPriceMax('');
    setBedrooms('');
    setBathrooms('');
    router.push('/properties');
  };

  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-200 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-serif text-white mb-3">
          Landmark <span className="italic font-serif font-semibold text-gold-200">Catalog</span>
        </h1>
        <p className="text-xs text-gray-400 font-light mb-12 max-w-2xl leading-relaxed">
          Filter through our portfolio of custom estates. From sea-view penthouses in Mumbai to heritage mansions in Delhi, discover premium properties with verified parameters.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <form onSubmit={handleApplyFilters} className="glassmorphism p-6 rounded-xl flex flex-col gap-5 h-fit lg:sticky lg:top-28">
            <div className="flex items-center justify-between border-b border-gold-500/10 pb-3">
              <h2 className="text-sm uppercase tracking-wider font-semibold font-sans flex items-center gap-2 text-gold-500">
                <SlidersHorizontal className="w-4 h-4" /> Filter Options
              </h2>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[10px] uppercase tracking-wider text-gray-400 hover:text-gold-500 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Clear All
              </button>
            </div>

            {/* Keyword Search */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Keyword Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. sea view, pool..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-luxury-charcoal/80 border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 pl-8 text-xs text-gray-300 focus:outline-none transition-colors"
                />
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* City */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Region</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-luxury-charcoal/80 border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              >
                <option value="">All Regions</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Goa">Goa</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Gurgaon">Gurgaon</option>
              </select>
            </div>

            {/* Type */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Asset Class</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-luxury-charcoal/80 border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              >
                <option value="">All Types</option>
                <option value="Villa">Villa</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Mansion">Mansion</option>
                <option value="Apartment">Apartment</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Listing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-luxury-charcoal/80 border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              >
                <option value="">All Listing Statuses</option>
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
                <option value="Sold">Sold</option>
              </select>
            </div>

            {/* Budget range */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Price Range (INR)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full bg-luxury-charcoal/80 border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full bg-luxury-charcoal/80 border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Min Beds</label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full bg-luxury-charcoal/80 border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                  <option value="6">6+</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Min Baths</label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full bg-luxury-charcoal/80 border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                  <option value="6">6+</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-gold w-full py-2.5 rounded text-xs uppercase tracking-wider font-semibold mt-2"
            >
              Filter Landmarks
            </button>
          </form>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs text-gray-400 font-light">
                Showing <strong className="text-gold-500">{totalCount}</strong> luxury assets in private files
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 4, 5].map((n) => (
                  <div key={n} className="bg-luxury-charcoal/30 border border-gold-500/5 rounded-xl h-96 animate-pulse" />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="glassmorphism p-12 rounded-xl text-center flex flex-col items-center justify-center">
                <MapPin className="w-10 h-10 text-gold-500/30 mb-4" />
                <h3 className="text-lg font-serif font-semibold text-gray-200 mb-2">No Matching Listings Found</h3>
                <p className="text-xs text-gray-400 font-light max-w-sm mb-6">
                  We currently do not hold any public inventories matching these filters. Try resetting the criteria or contact our concierge for off-market files.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn-outline-gold px-6 py-2 rounded text-xs uppercase tracking-wider"
                >
                  Reset All Criteria
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="bg-luxury-obsidian min-h-screen text-center pt-32 text-xs">Loading Catalog System...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
