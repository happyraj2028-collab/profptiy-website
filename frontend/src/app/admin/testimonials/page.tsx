'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Plus, Edit2, Trash2, X, Star, CheckCircle, RefreshCw } from 'lucide-react';

export default function AdminTestimonialsPage() {
  // Data States
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState('5');
  const [avatar, setAvatar] = useState('');
  const [approved, setApproved] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await api.testimonials.list(false); // Fetch both approved and unapproved
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials registry:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setRole('');
    setCompany('');
    setContent('');
    setRating('5');
    setAvatar('');
    setApproved(false);
  };

  const handleEdit = (t: any) => {
    setEditingId(t.id);
    setName(t.name);
    setRole(t.role);
    setCompany(t.company);
    setContent(t.content);
    setRating(String(t.rating));
    setAvatar(t.avatar || '');
    setApproved(t.approved);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await api.testimonials.delete(id);
      fetchReviews();
    } catch (error) {
      alert('Error deleting testimonial');
    }
  };

  const handleToggleApprove = async (id: string, currentStatus: boolean) => {
    try {
      await api.testimonials.approve(id, !currentStatus);
      fetchReviews();
    } catch (error) {
      alert('Error updating testimonial approval status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) {
      alert('Name and content are required.');
      return;
    }

    const payload = {
      name,
      role: role || 'Client',
      company: company || 'Homeowner',
      content,
      rating: parseInt(rating),
      avatar: avatar || undefined,
      approved,
    };

    try {
      if (editingId) {
        await api.testimonials.update(editingId, payload);
      } else {
        await api.testimonials.submit(payload); // Submission method will handle creation
      }
      resetForm();
      setShowForm(false);
      fetchReviews();
    } catch (error) {
      alert('Error saving testimonial feedback.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gold-500/5 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white font-semibold">Manage Testimonials</h1>
          <p className="text-xs text-gray-400 font-light mt-1">Moderate customer reviews and approve client endorsements for the front page.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-gold px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Review
          </button>
        )}
      </div>

      {/* Testimonial Form */}
      {showForm && (
        <div className="glassmorphism p-6 rounded-xl relative border border-gold-500/20 max-w-xl">
          <button
            onClick={() => {
              resetForm();
              setShowForm(false);
            }}
            className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-lg font-serif text-white mb-6">
            {editingId ? 'Edit Customer Review' : 'Create Customer Endorsement'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Client Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aditya Roy"
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Role / Profession</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Industrialist"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Company / Group</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Roy Group"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="flex flex-col space-y-1 sm:col-span-2">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Avatar Image URL</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://unsplash.com/..."
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Rating Stars</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 text-xs text-gray-300 focus:outline-none transition-colors"
                >
                  <option value="5">5 Stars ★★★★★</option>
                  <option value="4">4 Stars ★★★★</option>
                  <option value="3">3 Stars ★★★</option>
                  <option value="2">2 Stars ★★</option>
                  <option value="1">1 Star ★</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="approved"
                checked={approved}
                onChange={(e) => setApproved(e.target.checked)}
                className="w-4 h-4 accent-gold-500 cursor-pointer"
              />
              <label htmlFor="approved" className="text-xs text-gray-300 select-none cursor-pointer">
                Approve immediately (Make visible on front page)
              </label>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Review content *</label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Review details outlining transaction satisfaction..."
                rows={4}
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3.5 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-gold-500/5 pt-5">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="btn-outline-gold px-6 py-2 rounded text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-gold px-6 py-2 rounded text-xs uppercase font-semibold"
              >
                {editingId ? 'Save Changes' : 'Publish Endorsement'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials Table */}
      {!showForm && (
        <div className="glassmorphism rounded-xl overflow-x-auto">
          {loading ? (
            <div className="p-6 text-xs text-gray-500 font-light">Retrieving testimonials...</div>
          ) : testimonials.length === 0 ? (
            <div className="p-10 text-center text-xs text-gray-500 font-light">
              No testimonial records are logged. Click 'Add Review' to write one.
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-luxury-charcoal/80 text-gold-500 border-b border-gold-500/10 uppercase tracking-widest text-[9px]">
                  <th className="px-6 py-3.5">Client Identity</th>
                  <th className="px-6 py-3.5">Endorsement Review</th>
                  <th className="px-6 py-3.5">Rating</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/5 font-light">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-luxury-charcoal/30">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-200">{t.name}</div>
                      <div className="text-[10px] text-gray-500">{t.role}, {t.company}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-light max-w-[280px] truncate">
                      "{t.content}"
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5 text-gold-500 font-semibold">
                        {t.rating} <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleApprove(t.id, t.approved)}
                        className={`px-2 py-0.5 rounded-[3px] text-[8px] uppercase tracking-wider font-semibold transition-all border ${
                          t.approved
                            ? 'bg-green-500/10 text-green-400 border-green-500/15 hover:bg-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/15 hover:bg-yellow-500/20'
                        }`}
                        title={t.approved ? 'Revoke Approval' : 'Approve Testimonial'}
                      >
                        {t.approved ? 'Approved' : 'Pending Approval'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2 mt-1.5">
                      <button
                        onClick={() => handleEdit(t)}
                        className="p-1.5 text-gray-400 hover:text-gold-500 rounded bg-luxury-charcoal border border-gold-500/5 hover:border-gold-500/20 transition-all"
                        title="Edit Testimonial"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 text-red-400 hover:text-red-300 rounded bg-luxury-charcoal border border-red-500/5 hover:border-red-500/20 transition-all"
                        title="Delete Testimonial"
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
      )}
    </div>
  );
}
