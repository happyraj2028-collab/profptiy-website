'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import PropertyCard, { Property } from '@/components/PropertyCard';
import { Star } from 'lucide-react';

export default function FeaturedPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const data = await api.properties.list({ featured: true });
        setProperties(data);
      } catch (error) {
        console.error('Error fetching featured landmarks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-200 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-4 border border-gold-500/20">
            <Star className="w-5 h-5 text-gold-500 fill-current" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-3">
            Featured <span className="italic font-serif font-semibold text-gold-200">Masterpieces</span>
          </h1>
          <p className="text-xs text-gray-400 font-light max-w-lg mx-auto leading-relaxed">
            Exclusively handpicked residential structures chosen for historical location prestige, advanced biophilic architecture, and signature luxury amenities.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-luxury-charcoal/30 border border-gold-500/5 rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="glassmorphism p-12 rounded-xl text-center max-w-md mx-auto">
            <p className="text-xs text-gray-400 font-light">No featured properties are currently open for public viewing.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
