'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, BedDouble, Bath, Maximize } from 'lucide-react';

export interface Property {
  id: string;
  title: string;
  price: number;
  type: string;
  status: string;
  city: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];
  featured: boolean;
}

interface PropertyCardProps {
  property: Property;
}

export const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} L`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const thumbnail = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600';

  return (
    <div className="glass-card rounded-xl overflow-hidden flex flex-col h-full group">
      {/* Property Image & Status Badges */}
      <div className="relative h-64 overflow-hidden shrink-0">
        <img
          src={thumbnail}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Absolute Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1 bg-gold-500/90 text-luxury-obsidian text-[10px] tracking-widest font-semibold uppercase rounded">
            {property.type}
          </span>
        </div>

        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-luxury-obsidian/80 backdrop-blur-md text-gold-500 border border-gold-500/20 text-[10px] tracking-widest font-semibold uppercase rounded">
            {property.status}
          </span>
        </div>

        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-obsidian via-transparent to-transparent opacity-60"></div>
        
        {/* Floating Price in Overlay */}
        <div className="absolute bottom-4 left-4">
          <span className="text-xl font-serif text-gold-200 font-semibold drop-shadow-md">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-serif font-semibold text-gray-100 mb-2 group-hover:text-gold-500 transition-colors line-clamp-1">
          {property.title}
        </h3>

        {/* Location Info */}
        <div className="flex items-center text-xs text-gray-400 mb-5">
          <MapPin className="w-3.5 h-3.5 text-gold-500 mr-1.5 shrink-0" />
          <span className="line-clamp-1 font-light">{property.area}, {property.city}</span>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-gold-500/5 text-xs text-gray-400 mb-6 mt-auto">
          <div className="flex items-center justify-center gap-1.5">
            <BedDouble className="w-4 h-4 text-gold-500/80 shrink-0" />
            <span className="font-light">{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 border-l border-r border-gold-500/5">
            <Bath className="w-4 h-4 text-gold-500/80 shrink-0" />
            <span className="font-light">{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Maximize className="w-4 h-4 text-gold-500/80 shrink-0" />
            <span className="font-light">{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/properties/${property.id}`}
          className="w-full text-center py-2.5 bg-luxury-charcoal hover:bg-gold-500 hover:text-luxury-obsidian border border-gold-500/20 hover:border-gold-500 rounded text-xs uppercase tracking-wider transition-all duration-300 font-medium"
        >
          Explore Landmark
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
