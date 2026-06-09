'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { ShieldCheck, Lock, Mail, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) return;

    try {
      setLoading(true);
      const data = await api.auth.login({ email, password });
      login(data.token, data.user);
    } catch (error: any) {
      setErrorMsg(error.message || 'Invalid administrative credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-200 flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full glassmorphism p-8 rounded-2xl shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-600"></div>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-4 border border-gold-500/20">
            <ShieldCheck className="w-6 h-6 text-gold-500" />
          </div>
          <h1 className="text-2xl font-serif text-white font-semibold">Administrative Access</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Management Portal</p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2 mb-6">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@profptiy.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 pl-9 text-xs text-gray-300 focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-gray-600 absolute left-3 top-3" />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 pl-9 text-xs text-gray-300 focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-gray-600 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-3 rounded text-xs uppercase tracking-wider font-semibold mt-4"
          >
            {loading ? 'Authenticating Credentials...' : 'Sign In To Panel'}
          </button>
        </form>

        <div className="text-center mt-6 text-[10px] text-gray-500 font-light">
          <Link href="/" className="hover:text-gold-500 transition-colors">Return to public portal</Link>
        </div>
      </div>
    </div>
  );
}
