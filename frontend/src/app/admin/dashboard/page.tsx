'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatPrice } from '@/components/PropertyCard';
import { Home, Users, BookOpen, MessageSquare, Trash2, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.analytics.dashboard();
      setData(res);
    } catch (error) {
      console.error('Error fetching analytics details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleUpdateLeadStatus = async (id: string, status: string) => {
    try {
      await api.inquiries.updateStatus(id, status);
      // Refresh local analytics
      loadAnalytics();
    } catch (error) {
      alert('Error updating inquiry status');
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.inquiries.delete(id);
      loadAnalytics();
    } catch (error) {
      alert('Error deleting inquiry');
    }
  };

  if (loading) {
    return <div className="text-xs text-gray-500 font-light">Compiling analytics register...</div>;
  }

  const { summary, leadsBreakdown, propertyTypes, propertyStatuses, recentInquiries, recentProperties } = data;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif text-white font-semibold">Dashboard Overview</h1>
        <p className="text-xs text-gray-400 font-light mt-1">Real-time statistics regarding property deal acquisitions and customer lead records.</p>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="glass-card p-5 rounded-xl border border-gold-500/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-gray-500 tracking-wider font-semibold">Total Properties</span>
            <div className="text-2xl font-serif font-bold text-white mt-1">{summary.properties}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold-500/5 flex items-center justify-center border border-gold-500/10">
            <Home className="w-5 h-5 text-gold-500" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-card p-5 rounded-xl border border-gold-500/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-gray-500 tracking-wider font-semibold">Total Leads</span>
            <div className="text-2xl font-serif font-bold text-white mt-1">{summary.inquiries}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold-500/5 flex items-center justify-center border border-gold-500/10">
            <Users className="w-5 h-5 text-gold-500" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-card p-5 rounded-xl border border-gold-500/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-gray-500 tracking-wider font-semibold">Blog Posts</span>
            <div className="text-2xl font-serif font-bold text-white mt-1">{summary.blogs}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold-500/5 flex items-center justify-center border border-gold-500/10">
            <BookOpen className="w-5 h-5 text-gold-500" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="glass-card p-5 rounded-xl border border-gold-500/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-gray-500 tracking-wider font-semibold">Reviews Handled</span>
            <div className="text-2xl font-serif font-bold text-white mt-1">{summary.testimonials}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold-500/5 flex items-center justify-center border border-gold-500/10">
            <MessageSquare className="w-5 h-5 text-gold-500" />
          </div>
        </div>
      </div>

      {/* Leads status progress metrics */}
      <div className="glassmorphism p-6 rounded-xl">
        <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4 font-sans">Leads Pipeline Distribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-luxury-charcoal/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-yellow-500/80 shrink-0" />
            <div>
              <span className="text-[10px] text-gray-500 block uppercase">New / Unprocessed</span>
              <strong className="text-lg text-white font-semibold">{leadsBreakdown.new} Leads</strong>
            </div>
          </div>
          <div className="p-4 bg-luxury-charcoal/50 rounded-lg flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-blue-500/80 shrink-0" />
            <div>
              <span className="text-[10px] text-gray-500 block uppercase">Contact In Progress</span>
              <strong className="text-lg text-white font-semibold">{leadsBreakdown.contacted} Active</strong>
            </div>
          </div>
          <div className="p-4 bg-luxury-charcoal/50 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-green-500/80 shrink-0" />
            <div>
              <span className="text-[10px] text-gray-500 block uppercase">Resolved Deals</span>
              <strong className="text-lg text-white font-semibold">{leadsBreakdown.resolved} Resolved</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recent leads / properties grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent leads table */}
        <div className="glassmorphism p-6 rounded-xl overflow-x-auto">
          <div className="flex items-center justify-between mb-4 border-b border-gold-500/5 pb-3">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-sans">Recent Lead Inquiries</h3>
            <Link href="/admin/leads" className="text-[10px] text-gold-500 uppercase tracking-widest hover:underline">View All Leads</Link>
          </div>
          
          {recentInquiries.length === 0 ? (
            <p className="text-xs text-gray-400 py-4 font-light">No customer inquiry records are logged in database yet.</p>
          ) : (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-gray-500 font-medium">
                  <th className="py-2">Client</th>
                  <th className="py-2">Interest Property</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/5">
                {recentInquiries.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-luxury-charcoal/30">
                    <td className="py-3 pr-2">
                      <div className="font-semibold text-gray-200">{lead.name}</div>
                      <div className="text-[10px] text-gray-500">{lead.phone}</div>
                    </td>
                    <td className="py-3 pr-2 text-gray-300 font-light truncate max-w-[150px]">
                      {lead.propertyTitle || 'General Call Request'}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-[3px] text-[9px] uppercase tracking-wider font-semibold ${
                        lead.status === 'New' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' :
                        lead.status === 'Contacted' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                        'bg-green-500/15 text-green-400 border border-green-500/20'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 text-right flex items-center justify-end gap-1.5 mt-2">
                      {lead.status === 'New' && (
                        <button
                          onClick={() => handleUpdateLeadStatus(lead.id, 'Contacted')}
                          className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] rounded"
                        >
                          Contact
                        </button>
                      )}
                      {lead.status !== 'Resolved' && (
                        <button
                          onClick={() => handleUpdateLeadStatus(lead.id, 'Resolved')}
                          className="px-2 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-[10px] rounded"
                        >
                          Resolve
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-1 text-red-400 hover:text-red-300 rounded"
                        title="Delete Lead"
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

        {/* Recent properties list */}
        <div className="glassmorphism p-6 rounded-xl overflow-x-auto">
          <div className="flex items-center justify-between mb-4 border-b border-gold-500/5 pb-3">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-sans">Recent Property Listings</h3>
            <Link href="/admin/properties" className="text-[10px] text-gold-500 uppercase tracking-widest hover:underline">Manage Listings</Link>
          </div>

          {recentProperties.length === 0 ? (
            <p className="text-xs text-gray-400 py-4 font-light">No properties are listed in database.</p>
          ) : (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-gray-500 font-medium">
                  <th className="py-2">Landmark Title</th>
                  <th className="py-2">Class</th>
                  <th className="py-2">Price</th>
                  <th className="py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/5">
                {recentProperties.map((prop: any) => (
                  <tr key={prop.id} className="hover:bg-luxury-charcoal/30">
                    <td className="py-3 pr-2 font-semibold text-gray-200 truncate max-w-[150px]">{prop.title}</td>
                    <td className="py-3 text-gray-400 font-light">{prop.type}</td>
                    <td className="py-3 text-gold-500 font-semibold">{formatPrice(prop.price)}</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded-[3px] text-[9px] uppercase tracking-wider border border-gold-500/20 bg-gold-500/5 text-gold-500">
                        {prop.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
