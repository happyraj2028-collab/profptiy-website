import type { Metadata } from 'next';
import './globals.css';
import { SettingsProvider } from '@/context/SettingsContext';
import { AuthProvider } from '@/context/AuthContext'; // Wait, let's make sure context file names match. The file is AuthContext.tsx, so we can import AuthProvider from there.
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Profptiy Luxury Real Estate',
  description: 'Ultra-premium mansions, beachfront villas, and luxury penthouses in prime locations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-luxury-obsidian text-gray-200 antialiased selection:bg-gold-500 selection:text-luxury-charcoal">
        <SettingsProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <WhatsAppButton />
            </div>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
