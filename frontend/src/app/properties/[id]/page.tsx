'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatPrice } from '@/components/PropertyCard';
import { MapPin, BedDouble, Bath, Maximize, CheckCircle2, Phone, Mail, Send, Play, Compass, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // Data States
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await api.properties.get(String(id));
        setProperty(data);
      } catch (error) {
        console.error('Error loading landmark details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) return;

    try {
      setFormLoading(true);
      await api.inquiries.submit({
        propertyId: String(id),
        name,
        email,
        phone,
        message,
      });
      setFormSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setTimeout(() => setFormSuccess(false), 5000);
      router.push('/thank-you');
    } catch (error) {
      alert('Failed to send inquiry. Please try again or contact us via WhatsApp.');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-luxury-obsidian min-h-screen text-center pt-48 text-xs text-gray-400 font-light">
        Retrieving Architectural Ledger...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-luxury-obsidian min-h-screen text-center pt-48 flex flex-col items-center">
        <h2 className="text-xl font-serif text-white mb-4">Landmark File Not Found</h2>
        <Link href="/properties" className="btn-gold px-6 py-2 rounded text-xs uppercase">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-200 pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link href="/properties" className="inline-flex items-center text-xs text-gray-400 hover:text-gold-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
        </Link>

        {/* Title & Price Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8">
          <div>
            <span className="text-gold-500 text-xs uppercase tracking-[0.2em] font-semibold">{property.type} • {property.status}</span>
            <h1 className="text-3xl md:text-5xl font-serif font-light text-white mt-2 mb-3 leading-tight">{property.title}</h1>
            <div className="flex items-center text-xs text-gray-400">
              <MapPin className="w-4 h-4 text-gold-500 mr-2 shrink-0" />
              <span>{property.address}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right">
            <span className="text-xs uppercase text-gray-400 font-light block">Acquisition Value</span>
            <span className="text-3xl md:text-4xl font-serif font-semibold text-gold-500">{formatPrice(property.price)}</span>
          </div>
        </div>

        {/* Image Showcase & Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-4 border border-gold-500/10">
              <img
                src={property.images?.[activeImage]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Gallery Thumbnails */}
            {property.images && property.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {property.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-24 h-16 rounded overflow-hidden border shrink-0 transition-all ${
                      idx === activeImage ? 'border-gold-500 scale-105' : 'border-gold-500/10'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Inquiry Form */}
          <div className="glassmorphism p-6 rounded-xl h-fit">
            <h3 className="text-lg font-serif text-white mb-4">Request Private Viewing</h3>
            <p className="text-xs text-gray-400 font-light mb-6 leading-relaxed">
              Arrange a private briefing. Our senior broker representing this estate will coordinate the appointment.
            </p>

            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 text-xs text-gray-300 focus:outline-none transition-colors"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 text-xs text-gray-300 focus:outline-none transition-colors"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 text-xs text-gray-300 focus:outline-none transition-colors"
              />
              <textarea
                placeholder="Describe your timeline or specific requirements..."
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 text-xs text-gray-300 focus:outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={formLoading}
                className="btn-gold w-full py-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
              >
                {formLoading ? 'Submitting request...' : formSuccess ? 'Request Submitted!' : 'Register Interest'}
              </button>
            </form>
          </div>
        </div>

        {/* Specs and Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2">
            {/* Spec Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 px-4 bg-luxury-charcoal/40 border border-gold-500/5 rounded-xl text-center mb-8">
              <div className="flex flex-col items-center">
                <BedDouble className="w-5 h-5 text-gold-500 mb-2" />
                <span className="text-xs text-gray-400 font-light">Bedrooms</span>
                <span className="text-sm font-semibold text-white mt-0.5">{property.bedrooms} Beds</span>
              </div>
              <div className="flex flex-col items-center border-l border-gold-500/5">
                <Bath className="w-5 h-5 text-gold-500 mb-2" />
                <span className="text-xs text-gray-400 font-light">Bathrooms</span>
                <span className="text-sm font-semibold text-white mt-0.5">{property.bathrooms} Baths</span>
              </div>
              <div className="flex flex-col items-center border-l border-gold-500/5">
                <Maximize className="w-5 h-5 text-gold-500 mb-2" />
                <span className="text-xs text-gray-400 font-light">Floor Area</span>
                <span className="text-sm font-semibold text-white mt-0.5">{property.sqft.toLocaleString()} sqft</span>
              </div>
              <div className="flex flex-col items-center border-l border-gold-500/5">
                <Compass className="w-5 h-5 text-gold-500 mb-2" />
                <span className="text-xs text-gray-400 font-light">Asset Class</span>
                <span className="text-sm font-semibold text-white mt-0.5">{property.type}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h3 className="text-xl font-serif text-white mb-4">Architectural Overview</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-serif text-white mb-4">Property Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity: string, idx: number) => (
                    <div key={idx} className="flex items-center text-xs text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-gold-500 mr-2 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby facilities */}
            {property.nearby && Array.isArray(property.nearby) && property.nearby.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-serif text-white mb-4">Nearby Facilities</h3>
                <div className="glassmorphism rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-luxury-charcoal/80 text-gold-500 border-b border-gold-500/10">
                        <th className="px-6 py-3 font-semibold uppercase tracking-wider">Facility</th>
                        <th className="px-6 py-3 font-semibold uppercase tracking-wider text-right">Distance / Transit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-500/5">
                      {property.nearby.map((facility: any, idx: number) => (
                        <tr key={idx} className="hover:bg-luxury-charcoal/30">
                          <td className="px-6 py-3 font-medium text-gray-200">{facility.name}</td>
                          <td className="px-6 py-3 text-right text-gray-400">{facility.distance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Video Tour Section */}
            {property.videoUrl && (
              <div className="mb-12">
                <h3 className="text-xl font-serif text-white mb-4">Cinematic Video Tour</h3>
                <div className="relative h-96 w-full rounded-xl overflow-hidden border border-gold-500/10">
                  <iframe
                    src={property.videoUrl}
                    title="Property Virtual Tour"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          {/* Agent Information Block */}
          <div className="space-y-6">
            <div className="glassmorphism p-6 rounded-xl text-center">
              <h4 className="text-xs uppercase text-gold-500 tracking-wider mb-4 font-semibold">Listing Representative</h4>
              <img
                src={property.agentImage}
                alt={property.agentName}
                className="w-24 h-24 rounded-full mx-auto object-cover border border-gold-500/20 mb-4"
              />
              <h5 className="text-base font-serif font-semibold text-gray-100">{property.agentName}</h5>
              <span className="text-[10px] uppercase text-gray-400 block mb-4">Licensed Associate Director</span>
              
              <div className="space-y-2 border-t border-gold-500/5 pt-4 text-xs font-light">
                <a href={`tel:${property.agentPhone}`} className="flex items-center justify-center gap-2 text-gray-300 hover:text-gold-500 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-gold-500" /> {property.agentPhone}
                </a>
                <a href={`mailto:${property.agentEmail}`} className="flex items-center justify-center gap-2 text-gray-300 hover:text-gold-500 transition-colors mt-2">
                  <Mail className="w-3.5 h-3.5 text-gold-500" /> {property.agentEmail}
                </a>
              </div>
            </div>

            {/* Google Map coordinates location placeholder */}
            {property.latitude && property.longitude && (
              <div className="glassmorphism p-4 rounded-xl h-64 overflow-hidden border border-gold-500/10">
                <h4 className="text-[10px] uppercase text-gold-500 tracking-wider mb-2 font-semibold">Location Pin</h4>
                <div className="w-full h-full bg-luxury-charcoal flex items-center justify-center text-[10px] text-gray-500">
                  {/* Since true dynamic map embeds require specific keys, we display coordinates for reference */}
                  <span>Coordinates: {property.latitude}° N, {property.longitude}° E</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
