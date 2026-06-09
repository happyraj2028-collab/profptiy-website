'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Lock, ShieldCheck, Check, AlertCircle } from 'lucide-react';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!token) {
      setErrorMsg('Recovery token is missing from URL.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await api.auth.resetPassword({ token, password });
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/login');
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-200 flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full glassmorphism p-8 rounded-2xl shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-600"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-4 border border-gold-500/20">
            <ShieldCheck className="w-6 h-6 text-gold-500" />
          </div>
          <h1 className="text-2xl font-serif text-white font-semibold">Reset Password</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Specify new credentials</p>
        </div>

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs p-3 rounded-lg flex items-center gap-2 mb-6">
            <Check className="w-4 h-4 shrink-0" />
            <span>Password reset success! Redirecting to login...</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 pl-9 text-xs text-gray-300 focus:outline-none transition-colors"
                />
                <Lock className="w-4 h-4 text-gray-600 absolute left-3 top-3" />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
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
              {loading ? 'Saving Changes...' : 'Update Password'}
            </button>
          </form>
        )}

        <div className="text-center mt-6 text-xs text-gray-500">
          <Link href="/admin/login" className="hover:text-gold-500 transition-colors">Return to login</Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="bg-luxury-obsidian min-h-screen text-center pt-32 text-xs">Loading Security Coordinates...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
