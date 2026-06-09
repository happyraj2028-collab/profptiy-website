'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface SiteSettings {
  siteName: string;
  siteLogoText: string;
  siteLogoSub: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  officeAddress: string;
  googleMapEmbedUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  metaTitle: string;
  metaDescription: string;
  [key: string]: string;
}

const defaultSettings: SiteSettings = {
  siteName: 'Profptiy Luxury Real Estate',
  siteLogoText: 'PROFPITY',
  siteLogoSub: 'LUXURY REALTY',
  contactEmail: 'info@profptiy-luxury.com',
  contactPhone: '+91 98765 43210',
  whatsappNumber: '919876543210',
  officeAddress: 'Tower A, Signature Suites, DLF Phase 5, Gurugram, India',
  googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3509.3094892429413!2d77.09848527632616!3d28.461141475758155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18deba555555%3A0xe54e8ffb8f8fa7bf!2sDLF%20Phase%205%20Gurugram!5e0!3m2!1sen!2sin!4v1717849200000!5m2!1sen!2sin',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  twitterUrl: 'https://twitter.com',
  linkedinUrl: 'https://linkedin.com',
  metaTitle: 'Profptiy | Luxury Mansions, Villas & Penthouses',
  metaDescription: 'Discover India\'s most exclusive luxury real estate listings. Explore ultra-premium villas, mansions, and penthouses in prime locations.',
};

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await api.settings.list();
      // Merge retrieved settings onto defaults to ensure no missing keys
      setSettings(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('⚠️ Could not fetch dynamic CMS settings from backend, using default assets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
