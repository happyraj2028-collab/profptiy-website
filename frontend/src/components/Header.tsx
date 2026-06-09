'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Phone, Calendar, User } from 'lucide-react';

const Header: React.FC = () => {
  const { settings } = useSettings();
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show public header on admin sub-pages (dashboard pages, but show it on admin login page for convenience, or hide it on all /admin pages)
  const isAdminPage = pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Featured', path: '/featured' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  if (isAdminPage) {
    // Return a simplified admin header or null (let's return null because admin panel has its own sidebar/layout)
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0f0f12]/85 backdrop-blur-md border-b border-gold-500/10 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex flex-col group">
          <span className="text-2xl font-serif font-semibold tracking-wider text-gold-500 group-hover:text-gold-200 transition-colors">
            {settings.siteLogoText || 'PROFPITY'}
          </span>
          <span className="text-[9px] font-sans tracking-[0.3em] text-gray-400 group-hover:text-gold-300 transition-colors -mt-1 uppercase">
            {settings.siteLogoSub || 'LUXURY REALTY'}
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-sans tracking-wide transition-colors relative py-1 hover:text-gold-500 ${
                  isActive ? 'text-gold-500 font-medium' : 'text-gray-300'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <a
            href={`tel:${settings.contactPhone}`}
            className="flex items-center text-xs tracking-wider text-gray-300 hover:text-gold-500 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-gold-500 mr-2 animate-pulse" />
            {settings.contactPhone}
          </a>
          
          <Link href="/book" className="btn-gold px-5 py-2 rounded text-xs tracking-wider uppercase flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-2" />
            Book Viewings
          </Link>

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-xs uppercase tracking-wider text-gray-400 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/admin/login"
              className="p-2 text-gray-400 hover:text-gold-500 transition-colors"
              title="Admin Portal"
            >
              <User className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Hamburger Menu Toggle (Mobile) */}
        <button
          className="lg:hidden p-2 text-gray-300 hover:text-gold-500 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] bg-luxury-obsidian/98 backdrop-blur-lg z-30 flex flex-col p-6 animate-fade-in border-t border-gold-500/10">
          <nav className="flex flex-col space-y-5 my-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-lg font-serif tracking-wider ${
                    isActive ? 'text-gold-500 font-semibold pl-2 border-l-2 border-gold-500' : 'text-gray-300'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col space-y-4 pb-12">
            <a
              href={`tel:${settings.contactPhone}`}
              className="flex items-center text-sm text-gray-300"
            >
              <Phone className="w-4 h-4 text-gold-500 mr-3" />
              {settings.contactPhone}
            </a>
            <Link
              href="/book"
              className="btn-gold py-3 rounded text-center text-sm tracking-wider uppercase"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book Viewings
            </Link>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs uppercase tracking-wider text-red-400 text-center py-2"
              >
                Logout from System
              </button>
            ) : (
              <Link
                href="/admin/login"
                className="text-xs uppercase tracking-wider text-gray-400 text-center py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Access
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
