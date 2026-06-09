'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatPrice } from '@/components/PropertyCard';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, MapPin, Eye } from 'lucide-react';

export default function AdminPropertiesPage() {
  // Data States
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('Villa');
  const [status, setStatus] = useState('For Sale');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [bedrooms, setBedrooms] = useState('0');
  const [bathrooms, setBathrooms] = useState('0');
  const [sqft, setSqft] = useState('0');
  const [featured, setFeatured] = useState(false);
  const [imagesText, setImagesText] = useState(''); // Comma separated URLs
  const [videoUrl, setVideoUrl] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [amenitiesText, setAmenitiesText] = useState(''); // Comma separated tags
  const [nearbyText, setNearbyText] = useState(''); // JSON string of [{name, distance}]
  const [agentName, setAgentName] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [agentPhone, setAgentPhone] = useState('');

  const fetchListings = async () => {
    try {
      setLoading(true);
      const data = await api.properties.list();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching property registry:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setType('Villa');
    setStatus('For Sale');
    setCity('');
    setArea('');
    setAddress('');
    setBedrooms('0');
    setBathrooms('0');
    setSqft('0');
    setFeatured(false);
    setImagesText('');
    setVideoUrl('');
    setLatitude('');
    setLongitude('');
    setAmenitiesText('');
    setNearbyText('');
    setAgentName('');
    setAgentEmail('');
    setAgentPhone('');
  };

  const handleEdit = (prop: any) => {
    setEditingId(prop.id);
    setTitle(prop.title);
    setDescription(prop.description || '');
    setPrice(String(prop.price));
    setType(prop.type);
    setStatus(prop.status);
    setCity(prop.city);
    setArea(prop.area);
    setAddress(prop.address);
    setBedrooms(String(prop.bedrooms));
    setBathrooms(String(prop.bathrooms));
    setSqft(String(prop.sqft));
    setFeatured(prop.featured);
    setImagesText(prop.images?.join(', ') || '');
    setVideoUrl(prop.videoUrl || '');
    setLatitude(prop.latitude ? String(prop.latitude) : '');
    setLongitude(prop.longitude ? String(prop.longitude) : '');
    setAmenitiesText(prop.amenities?.join(', ') || '');
    setNearbyText(prop.nearby ? JSON.stringify(prop.nearby) : '');
    setAgentName(prop.agentName || '');
    setAgentEmail(prop.agentEmail || '');
    setAgentPhone(prop.agentPhone || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing permanently?')) return;
    try {
      await api.properties.delete(id);
      fetchListings();
    } catch (error) {
      alert('Error deleting listing');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !city || !area || !address) {
      alert('Please fill out required fields.');
      return;
    }

    // Process lists
    const images = imagesText.split(',').map(s => s.trim()).filter(s => s !== '');
    const amenities = amenitiesText.split(',').map(s => s.trim()).filter(s => s !== '');
    let nearby = null;
    if (nearbyText) {
      try {
        nearby = JSON.parse(nearbyText);
      } catch (err) {
        alert('Invalid JSON in nearby facilities input. Setting to null.');
      }
    }

    const payload = {
      title,
      description,
      price: parseFloat(price),
      type,
      status,
      city,
      area,
      address,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      sqft: parseInt(sqft),
      featured,
      images,
      videoUrl,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      amenities,
      nearby,
      agentName,
      agentEmail,
      agentPhone,
    };

    try {
      if (editingId) {
        await api.properties.update(editingId, payload);
      } else {
        await api.properties.create(payload);
      }
      resetForm();
      setShowForm(false);
      fetchListings();
    } catch (error) {
      alert('Error saving property listing.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gold-500/5 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white font-semibold">Manage Listings</h1>
          <p className="text-xs text-gray-400 font-light mt-1">Create, update, or archive luxury real estate showpieces.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-gold px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Property
          </button>
        )}
      </div>

      {/* Add / Edit Form Overlay / Container */}
      {showForm && (
        <div className="glassmorphism p-6 rounded-xl relative border border-gold-500/20">
          <button
            onClick={() => {
              resetForm();
              setShowForm(false);
            }}
            className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-lg font-serif text-white mb-6">
            {editingId ? 'Edit Property Listing' : 'Add New Property Listing'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Title & Class */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1 md:col-span-2">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Property Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Obsidian Pavilion Penthouse"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Asset Class *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                >
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Mansion">Mansion</option>
                  <option value="Apartment">Apartment</option>
                </select>
              </div>
            </div>

            {/* Row 2: Price, Status, Featured */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Price (INR) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 185000000"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Listing Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                >
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>

              <div className="flex items-center gap-2 py-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-gold-500 cursor-pointer"
                />
                <label htmlFor="featured" className="text-xs text-gray-300 select-none cursor-pointer">
                  Flag as Featured (Home display)
                </label>
              </div>
            </div>

            {/* Row 3: City, Area, Address */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Area / Sector *</label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Worli"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Complete Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street and building coordinates"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Row 4: Specs Beds, Baths, Sqft */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Bedrooms</label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Bathrooms</label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Floor Sqft</label>
                <input
                  type="number"
                  value={sqft}
                  onChange={(e) => setSqft(e.target.value)}
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Row 5: Description */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Architectural Overview Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive text overview detailing history, interior materials, panoramic views..."
                rows={4}
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3.5 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>

            {/* Row 6: Image URLs & Video Tour Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Property Image URLs (Comma Separated)</label>
                <input
                  type="text"
                  value={imagesText}
                  onChange={(e) => setImagesText(e.target.value)}
                  placeholder="URL 1, URL 2, URL 3"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Video Tour Embed Link (e.g. YouTube Embed URL)</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Row 7: Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g. 19.0176"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g. 72.8184"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Row 8: Amenities & Nearby JSON */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Amenities list (Comma Separated)</label>
                <input
                  type="text"
                  value={amenitiesText}
                  onChange={(e) => setAmenitiesText(e.target.value)}
                  placeholder="Sea View, Private Pool, Concierge"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Nearby Facilities (JSON Array)</label>
                <input
                  type="text"
                  value={nearbyText}
                  onChange={(e) => setNearbyText(e.target.value)}
                  placeholder='[{"name": "Airport", "distance": "5 mins"}]'
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Row 9: Agent Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gold-500/5 pt-5">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Agent Name</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Sanjay Malhotra"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Agent Email</label>
                <input
                  type="email"
                  value={agentEmail}
                  onChange={(e) => setAgentEmail(e.target.value)}
                  placeholder="sanjay@profptiy.com"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Agent Phone</label>
                <input
                  type="text"
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 border-t border-gold-500/5 pt-5">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="btn-outline-gold px-6 py-2 rounded text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-gold px-6 py-2 rounded text-xs uppercase font-semibold"
              >
                {editingId ? 'Save Landmark Changes' : 'Create Landmark Listing'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Properties Table */}
      {!showForm && (
        <div className="glassmorphism rounded-xl overflow-x-auto">
          {loading ? (
            <div className="p-6 text-xs text-gray-500 font-light">Retrieving properties...</div>
          ) : properties.length === 0 ? (
            <div className="p-10 text-center text-xs text-gray-500 font-light">
              No luxury listings are logged. Click 'Add Property' to create one.
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-luxury-charcoal/80 text-gold-500 border-b border-gold-500/10 uppercase tracking-widest text-[9px]">
                  <th className="px-6 py-3.5">Asset Details</th>
                  <th className="px-6 py-3.5">Region</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Specs</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/5 font-light">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-luxury-charcoal/30">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-200">{prop.title}</div>
                      <div className="text-[10px] text-gray-500">{prop.type} {prop.featured && '★ Featured'}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {prop.area}, {prop.city}
                    </td>
                    <td className="px-6 py-4 text-gold-500 font-semibold">
                      {formatPrice(prop.price)}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {prop.bedrooms}B / {prop.bathrooms}B / {prop.sqft.toLocaleString()} sqft
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-[3px] text-[9px] uppercase tracking-wider border border-gold-500/20 bg-gold-500/5 text-gold-500">
                        {prop.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2 mt-1">
                      <a
                        href={`/properties/${prop.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-400 hover:text-gold-500 rounded bg-luxury-charcoal border border-gold-500/5 hover:border-gold-500/20 transition-all"
                        title="View Live Listing"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleEdit(prop)}
                        className="p-1.5 text-gray-400 hover:text-gold-500 rounded bg-luxury-charcoal border border-gold-500/5 hover:border-gold-500/20 transition-all"
                        title="Edit Listing"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prop.id)}
                        className="p-1.5 text-red-400 hover:text-red-300 rounded bg-luxury-charcoal border border-red-500/5 hover:border-red-500/20 transition-all"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
