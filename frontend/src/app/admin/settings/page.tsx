'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { api } from '@/lib/api';
import { Save, Check, Settings, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminSettingsPage() {
  const { settings: currentSettings, refreshSettings } = useSettings();
  const { isAdmin } = useAuth();

  // Local Field States
  const [siteName, setSiteName] = useState('');
  const [siteLogoText, setSiteLogoText] = useState('');
  const [siteLogoSub, setSiteLogoSub] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [googleMapEmbedUrl, setGoogleMapEmbedUrl] = useState('');
  
  // Socials
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  
  // SEO
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Homepage CMS Sections (Hero & CTA)
  const [heroTagline, setHeroTagline] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroBgImage, setHeroBgImage] = useState('');
  const [ctaTitle, setCtaTitle] = useState('');
  const [ctaSubtitle, setCtaSubtitle] = useState('');
  const [ctaBtnText, setCtaBtnText] = useState('');

  // Status states
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load settings into states
  useEffect(() => {
    if (currentSettings) {
      setSiteName(currentSettings.siteName || '');
      setSiteLogoText(currentSettings.siteLogoText || '');
      setSiteLogoSub(currentSettings.siteLogoSub || '');
      setContactEmail(currentSettings.contactEmail || '');
      setContactPhone(currentSettings.contactPhone || '');
      setWhatsappNumber(currentSettings.whatsappNumber || '');
      setOfficeAddress(currentSettings.officeAddress || '');
      setGoogleMapEmbedUrl(currentSettings.googleMapEmbedUrl || '');
      setFacebookUrl(currentSettings.facebookUrl || '');
      setInstagramUrl(currentSettings.instagramUrl || '');
      setTwitterUrl(currentSettings.twitterUrl || '');
      setLinkedinUrl(currentSettings.linkedinUrl || '');
      setMetaTitle(currentSettings.metaTitle || '');
      setMetaDescription(currentSettings.metaDescription || '');

      // Load homepage CMS fields
      setHeroTagline(currentSettings.heroTagline || 'A Legacy of Absolute Discernment');
      setHeroTitle(currentSettings.heroTitle || 'Where Architecture Meets Artistic Grandeur');
      setHeroSubtitle(currentSettings.heroSubtitle || 'Brokerage services specialized in ultra-premium residential masterpieces, private estates, and beachfront sanctuaries for the most fastidious collectors.');
      setHeroBgImage(currentSettings.heroBgImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600');
      setCtaTitle(currentSettings.ctaTitle || 'Acquire Your Next Architectural Legacy');
      setCtaSubtitle(currentSettings.ctaSubtitle || 'Schedule a private briefing with our senior brokers. We will review our off-market inventory matches matching your portfolio profiles.');
      setCtaBtnText(currentSettings.ctaBtnText || 'Schedule Consultation');
    }
  }, [currentSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      siteName,
      siteLogoText,
      siteLogoSub,
      contactEmail,
      contactPhone,
      whatsappNumber,
      officeAddress,
      googleMapEmbedUrl,
      facebookUrl,
      instagramUrl,
      twitterUrl,
      linkedinUrl,
      metaTitle,
      metaDescription,
      
      // Add Homepage CMS fields
      heroTagline,
      heroTitle,
      heroSubtitle,
      heroBgImage,
      ctaTitle,
      ctaSubtitle,
      ctaBtnText,
    };

    try {
      setSaving(true);
      setSuccess(false);
      await api.settings.updateBulk(payload);
      await refreshSettings();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      alert('Error updating CMS configurations');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Shield className="w-12 h-12 text-red-500 mb-4 animate-bounce" />
        <h2 className="text-xl font-serif text-white mb-2">Access Restrained</h2>
        <p className="text-xs text-gray-400 max-w-sm">Only full administrators are authorized to edit CMS settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-gold-500/5 pb-5">
        <h1 className="text-2xl md:text-3xl font-serif text-white font-semibold">CMS Website Settings</h1>
        <p className="text-xs text-gray-400 font-light mt-1">Configure global variables, communication channels, homepage sections, and SEO tags.</p>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs p-3 rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Website configurations saved and synchronized globally!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Homepage Hero Layout */}
        <div className="glassmorphism p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-gold-500 uppercase tracking-wider font-sans flex items-center gap-1.5 border-b border-gold-500/5 pb-2">
            Homepage Hero Section
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Hero Tagline</label>
              <input
                type="text"
                value={heroTagline}
                onChange={(e) => setHeroTagline(e.target.value)}
                placeholder="A Legacy of Absolute Discernment"
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Hero Background Image URL</label>
              <input
                type="text"
                value={heroBgImage}
                onChange={(e) => setHeroBgImage(e.target.value)}
                placeholder="Background URL"
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase text-gray-400 font-semibold">Hero Title Heading</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Where Architecture Meets Artistic Grandeur"
              className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase text-gray-400 font-semibold">Hero Subtitle Description</label>
            <textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="Hero paragraph description"
              rows={3}
              className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3.5 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Section 2: Homepage CTA Layout */}
        <div className="glassmorphism p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-gold-500 uppercase tracking-wider font-sans flex items-center gap-1.5 border-b border-gold-500/5 pb-2">
            Homepage Call To Action (CTA)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">CTA Title</label>
              <input
                type="text"
                value={ctaTitle}
                onChange={(e) => setCtaTitle(e.target.value)}
                placeholder="Acquire Your Next Architectural Legacy"
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">CTA Button Text</label>
              <input
                type="text"
                value={ctaBtnText}
                onChange={(e) => setCtaBtnText(e.target.value)}
                placeholder="Schedule Consultation"
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase text-gray-400 font-semibold">CTA Subtitle Description</label>
            <textarea
              value={ctaSubtitle}
              onChange={(e) => setCtaSubtitle(e.target.value)}
              placeholder="CTA Paragraph description"
              rows={3}
              className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3.5 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Section 3: Branding */}
        <div className="glassmorphism p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-gold-500 uppercase tracking-wider font-sans flex items-center gap-1.5 border-b border-gold-500/5 pb-2">
            <Settings className="w-4 h-4" /> Branding Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Website Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Profptiy Luxury Real Estate"
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Logo Text Primary</label>
              <input
                type="text"
                value={siteLogoText}
                onChange={(e) => setSiteLogoText(e.target.value)}
                placeholder="PROFPITY"
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Logo Subtext</label>
              <input
                type="text"
                value={siteLogoSub}
                onChange={(e) => setSiteLogoSub(e.target.value)}
                placeholder="LUXURY REALTY"
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Communication Channels */}
        <div className="glassmorphism p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-gold-500 uppercase tracking-wider font-sans flex items-center gap-1.5 border-b border-gold-500/5 pb-2">
            Communication Coordinates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Inquiry Inbox Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="info@profptiy.com"
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Hotline Phone Number</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">WhatsApp Number (Int'l format without +)</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="919876543210"
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Office Location Address</label>
              <input
                type="text"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Google Map Embed Iframe URL</label>
              <input
                type="text"
                value={googleMapEmbedUrl}
                onChange={(e) => setGoogleMapEmbedUrl(e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Social Media */}
        <div className="glassmorphism p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-gold-500 uppercase tracking-wider font-sans flex items-center gap-1.5 border-b border-gold-500/5 pb-2">
            Social Media Coordinates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Facebook URL</label>
              <input
                type="text"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Instagram URL</label>
              <input
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Twitter (X) URL</label>
              <input
                type="text"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">LinkedIn Company URL</label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 6: SEO */}
        <div className="glassmorphism p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-gold-500 uppercase tracking-wider font-sans flex items-center gap-1.5 border-b border-gold-500/5 pb-2">
            SEO Metadata Parameters
          </h3>
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase text-gray-400 font-semibold">Meta Title Title Tag</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Profptiy | Luxury Mansions, Villas & Penthouses"
              className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase text-gray-400 font-semibold">Meta Description Tag</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Provide a search-result description outlining asset class locations..."
              rows={3}
              className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3.5 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-gold px-8 py-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving Website Configurations...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
