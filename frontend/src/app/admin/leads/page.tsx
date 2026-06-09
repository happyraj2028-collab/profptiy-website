'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Trash2, Check, RefreshCw, Mail, Phone, Calendar, Eye, MessageSquare } from 'lucide-react';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any>(null); // For detail view modal

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await api.inquiries.list();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.inquiries.updateStatus(id, status);
      fetchLeads();
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead((prev: any) => ({ ...prev, status }));
      }
    } catch (error) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.inquiries.delete(id);
      fetchLeads();
      setSelectedLead(null);
    } catch (error) {
      alert('Error deleting lead');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gold-500/5 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white font-semibold">Manage Leads</h1>
          <p className="text-xs text-gray-400 font-light mt-1">Review and process customer property inquiries and booking schedules.</p>
        </div>
        <button
          onClick={fetchLeads}
          className="btn-outline-gold p-2 rounded flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
          title="Refresh Data"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reload
        </button>
      </div>

      {/* Leads Table & Detail Viewer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Column */}
        <div className="lg:col-span-2 glassmorphism rounded-xl overflow-x-auto">
          {loading ? (
            <div className="p-6 text-xs text-gray-500 font-light">Retrieving lead files...</div>
          ) : leads.length === 0 ? (
            <div className="p-10 text-center text-xs text-gray-500 font-light">
              No inquiries are logged in database registry.
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-luxury-charcoal/80 text-gold-500 border-b border-gold-500/10 uppercase tracking-widest text-[9px]">
                  <th className="px-4 py-3.5">Client Details</th>
                  <th className="px-4 py-3.5">Interest Item</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/5 font-light">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`hover:bg-luxury-charcoal/30 cursor-pointer ${
                      selectedLead?.id === lead.id ? 'bg-luxury-charcoal/40 border-l-2 border-gold-500' : ''
                    }`}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-200">{lead.name}</div>
                      <div className="text-[10px] text-gray-500">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-300 font-light truncate max-w-[140px]">
                      {lead.propertyTitle || 'General Advisory Call'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-[3px] text-[8px] uppercase tracking-wider font-semibold ${
                        lead.status === 'New' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/15' :
                        lead.status === 'Contacted' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/15' :
                        'bg-green-500/10 text-green-400 border border-green-500/15'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right flex items-center justify-end gap-1 mt-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-1 text-gray-400 hover:text-gold-500 rounded"
                        title="View Message"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
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

        {/* Detailed Viewer Column */}
        <div className="glassmorphism p-6 rounded-xl h-fit border border-gold-500/10">
          <h3 className="text-sm font-semibold text-gold-500 uppercase tracking-wider mb-4 border-b border-gold-500/5 pb-2 font-sans flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" /> Inquiry Details
          </h3>

          {selectedLead ? (
            <div className="space-y-5">
              <div className="text-xs space-y-2.5 font-light">
                <div>
                  <span className="text-gray-500 block uppercase text-[10px]">Client Name</span>
                  <strong className="text-gray-200 text-sm font-semibold">{selectedLead.name}</strong>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  <a href={`mailto:${selectedLead.email}`} className="text-gray-300 hover:text-gold-500">{selectedLead.email}</a>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  <a href={`tel:${selectedLead.phone}`} className="text-gray-300 hover:text-gold-500">{selectedLead.phone}</a>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  <span>Submitted: {new Date(selectedLead.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-gold-500/5 pt-4">
                <span className="text-gray-500 block uppercase text-[10px] mb-1">Subject Property / Topic</span>
                <span className="text-xs text-gray-200 font-semibold">{selectedLead.propertyTitle || 'General Advisory Call Request'}</span>
                {selectedLead.propertyId && (
                  <a
                    href={`/properties/${selectedLead.propertyId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-gold-500 hover:underline block mt-1"
                  >
                    View Property Page
                  </a>
                )}
              </div>

              <div className="border-t border-gold-500/5 pt-4">
                <span className="text-gray-500 block uppercase text-[10px] mb-2">Message Body</span>
                <blockquote className="bg-luxury-charcoal/50 p-4 border-l-2 border-gold-500 text-xs text-gray-300 leading-relaxed rounded italic whitespace-pre-line">
                  {selectedLead.message}
                </blockquote>
              </div>

              {/* Status Update Actions */}
              <div className="border-t border-gold-500/5 pt-4 flex gap-2">
                {selectedLead.status === 'New' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedLead.id, 'Contacted')}
                    className="btn-outline-gold px-4 py-2 rounded text-[10px] uppercase font-semibold flex-grow flex items-center justify-center gap-1"
                  >
                    Mark Contacted
                  </button>
                )}
                {selectedLead.status !== 'Resolved' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedLead.id, 'Resolved')}
                    className="btn-gold px-4 py-2 rounded text-[10px] uppercase font-semibold flex-grow flex items-center justify-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500 font-light py-8 text-center">
              Select a lead record from the registry table to review client requirements.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
