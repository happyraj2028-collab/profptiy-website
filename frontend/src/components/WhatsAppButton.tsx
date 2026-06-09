'use client';

import React from 'react';
import { useSettings } from '@/context/SettingsContext';

const WhatsAppButton: React.FC = () => {
  const { settings } = useSettings();
  
  if (!settings.whatsappNumber) return null;

  const message = encodeURIComponent('Hello, I am interested in viewing your luxury properties.');
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 group"
      aria-label="Contact on WhatsApp"
    >
      {/* Ripple/Pulse effect */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping -z-10 group-hover:animate-none"></span>
      
      {/* WhatsApp SVG Icon */}
      <svg
        className="w-7 h-7 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437 0 9.862-4.409 9.866-9.83.002-2.628-1.01-5.1-2.855-6.948C16.436 1.991 13.979 1.01 11.35 1.01c-5.451 0-9.875 4.41-9.879 9.83-.002 2.03.518 4.02 1.503 5.731l-.997 3.64 3.754-.977c1.554.847 3.037 1.22 4.319 1.22zm11.234-6.84c-.307-.154-1.817-.897-2.097-.999-.28-.102-.484-.154-.688.154-.204.307-.79.999-.969 1.205-.179.205-.357.229-.664.076-.307-.154-1.298-.478-2.472-1.526-.915-.816-1.531-1.824-1.71-2.131-.179-.307-.019-.473.135-.626.138-.138.307-.359.461-.538.154-.179.204-.307.307-.512.102-.205.051-.384-.025-.538-.076-.154-.688-1.66-.943-2.274-.248-.598-.501-.518-.688-.528-.178-.009-.383-.01-.588-.01a1.13 1.13 0 0 0-.817.384c-.28.307-1.072 1.049-1.072 2.56 0 1.512 1.098 2.973 1.252 3.178.154.205 2.161 3.298 5.234 4.624.731.315 1.302.504 1.748.646.734.233 1.4.2 1.927.121.588-.087 1.817-.74 2.073-1.457.256-.717.256-1.332.179-1.458-.077-.128-.28-.204-.588-.359z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
