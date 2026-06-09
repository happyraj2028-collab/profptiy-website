'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const { settings } = useSettings();
  const pathname = usePathname();

  // Hide footer on admin page layouts
  const isAdminPage = pathname.startsWith('/admin');
  if (isAdminPage) return null;

  return (
    <footer className="bg-[#0b0b0d] border-t border-gold-500/10 pt-16 pb-8 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Column 1: Company Profile */}
        <div className="flex flex-col space-y-4">
          <Link href="/" className="flex flex-col">
            <span className="text-2xl font-serif font-semibold tracking-wider text-gold-500">
              {settings.siteLogoText || 'PROFPITY'}
            </span>
            <span className="text-[9px] font-sans tracking-[0.3em] text-gray-400 -mt-1 uppercase">
              {settings.siteLogoSub || 'LUXURY REALTY'}
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed font-light mt-2">
            Curating India\'s most exclusive residential masterpieces. We broker high-net-worth architectural landmarks, custom villas, and beachfront sanctuaries with absolute discretion.
          </p>
          {/* Social Links */}
          <div className="flex items-center space-x-4 pt-2">
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded bg-luxury-charcoal flex items-center justify-center text-gray-400 hover:text-gold-500 hover:bg-gold-500/5 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded bg-luxury-charcoal flex items-center justify-center text-gray-400 hover:text-gold-500 hover:bg-gold-500/5 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {settings.twitterUrl && (
              <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded bg-luxury-charcoal flex items-center justify-center text-gray-400 hover:text-gold-500 hover:bg-gold-500/5 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {settings.linkedinUrl && (
              <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded bg-luxury-charcoal flex items-center justify-center text-gray-400 hover:text-gold-500 hover:bg-gold-500/5 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Column 2: Properties Portfolio Links */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-sm uppercase font-semibold text-gold-500 tracking-widest font-sans">Portfolio</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/properties?type=Villa" className="hover:text-gold-500 transition-colors font-light">Beachfront Villas</Link>
            </li>
            <li>
              <Link href="/properties?type=Penthouse" className="hover:text-gold-500 transition-colors font-light">Sky Penthouses</Link>
            </li>
            <li>
              <Link href="/properties?type=Mansion" className="hover:text-gold-500 transition-colors font-light">Heritage Mansions</Link>
            </li>
            <li>
              <Link href="/featured" className="hover:text-gold-500 transition-colors font-light">Featured Collection</Link>
            </li>
            <li>
              <Link href="/properties?status=For Rent" className="hover:text-gold-500 transition-colors font-light">Ultra-Premium Rentals</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Quick Navigation & Legal */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-sm uppercase font-semibold text-gold-500 tracking-widest font-sans">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/about" className="hover:text-gold-500 transition-colors font-light">About Our Brand</Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-gold-500 transition-colors font-light">Bespoke Services</Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-gold-500 transition-colors font-light">Journal & News</Link>
            </li>
            <li>
              <Link href="/career" className="hover:text-gold-500 transition-colors font-light">Careers</Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-gold-500 transition-colors font-light">Frequently Asked Questions</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Office */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-sm uppercase font-semibold text-gold-500 tracking-widest font-sans">Contact</h4>
          <ul className="space-y-3.5 text-sm font-light">
            <li className="flex items-start">
              <MapPin className="w-4 h-4 text-gold-500 mr-3 shrink-0 mt-0.5" />
              <span>{settings.officeAddress}</span>
            </li>
            <li className="flex items-center">
              <Phone className="w-4 h-4 text-gold-500 mr-3 shrink-0" />
              <a href={`tel:${settings.contactPhone}`} className="hover:text-gold-500 transition-colors">{settings.contactPhone}</a>
            </li>
            <li className="flex items-center">
              <Mail className="w-4 h-4 text-gold-500 mr-3 shrink-0" />
              <a href={`mailto:${settings.contactEmail}`} className="hover:text-gold-500 transition-colors">{settings.contactEmail}</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Sub-footer copyright and legal links */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gold-500/5 flex flex-col md:flex-row items-center justify-between text-xs font-light text-gray-500">
        <p>© {new Date().getFullYear()} {settings.siteName}. All Rights Reserved.</p>
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-gold-500 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gold-500 transition-colors">Terms & Conditions</Link>
          <Link href="/sitemap.xml" className="hover:text-gold-500 transition-colors">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
