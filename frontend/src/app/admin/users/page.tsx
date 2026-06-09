'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Plus, Edit2, Trash2, X, Shield, Users, ShieldAlert, Key } from 'lucide-react';

export default function AdminUsersPage() {
  const { user: currentUser, isAdmin } = useAuth();

  // Data States
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form toggles
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('AGENT');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.users.list();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching user accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('AGENT');
  };

  const handleEdit = (u: any) => {
    setEditingId(u.id);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setPassword(''); // Leave blank unless changing
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?.id) {
      alert('Self-deletion check: You cannot delete your own profile.');
      return;
    }
    if (!confirm('Are you sure you want to delete this user profile?')) return;

    try {
      await api.users.delete(id);
      fetchUsers();
    } catch (error: any) {
      alert(error.message || 'Error deleting user.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || (!editingId && !password)) {
      alert('Please fill out all required fields.');
      return;
    }

    const payload = {
      name,
      email,
      role,
      password: password || undefined,
    };

    try {
      if (editingId) {
        await api.users.update(editingId, payload);
      } else {
        await api.users.create(payload);
      }
      resetForm();
      setShowForm(false);
      fetchUsers();
    } catch (error: any) {
      alert(error.message || 'Error saving user accounts.');
    }
  };

  // Role verification check
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="w-12 h-12 text-red-500 mb-4 animate-bounce" />
        <h2 className="text-xl font-serif text-white mb-2">Access Restrained</h2>
        <p className="text-xs text-gray-400 max-w-sm">
          You hold agent credentials. Only full administrators are authorized to manage user accounts and system permissions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gold-500/5 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white font-semibold">User Management</h1>
          <p className="text-xs text-gray-400 font-light mt-1">Invite and configure role permissions for associate brokers and coordinators.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-gold px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add User
          </button>
        )}
      </div>

      {/* Form Container */}
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
            {editingId ? 'Edit User Credentials' : 'Create User Account'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">User Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sanjay Malhotra"
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sanjay@profptiy.com"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Security Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 text-xs text-gray-300 focus:outline-none transition-colors"
                >
                  <option value="AGENT">Agent (Basic Access)</option>
                  <option value="ADMIN">Administrator (Full Access)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">
                Password {editingId ? '(Leave blank to retain current password)' : '*'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required={!editingId}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editingId ? '••••••••' : 'Password must be 6+ characters'}
                  className="w-full bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 pl-9 text-xs text-gray-300 focus:outline-none transition-colors"
                />
                <Key className="w-4 h-4 text-gray-600 absolute left-3 top-2.5" />
              </div>
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
                {editingId ? 'Save Changes' : 'Invite User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      {!showForm && (
        <div className="glassmorphism rounded-xl overflow-x-auto">
          {loading ? (
            <div className="p-6 text-xs text-gray-500 font-light">Retrieving user registry...</div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-luxury-charcoal/80 text-gold-500 border-b border-gold-500/10 uppercase tracking-widest text-[9px]">
                  <th className="px-6 py-3.5">User Identity</th>
                  <th className="px-6 py-3.5">Email Address</th>
                  <th className="px-6 py-3.5">System Role</th>
                  <th className="px-6 py-3.5">Registration Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/5 font-light">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-luxury-charcoal/30">
                    <td className="px-6 py-4 font-semibold text-gray-200">
                      {u.name} {u.id === currentUser?.id && <span className="text-[10px] text-gold-500 font-normal ml-1">(You)</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-[3px] text-[8px] uppercase tracking-wider font-semibold flex items-center gap-1 w-fit ${
                        u.role === 'ADMIN'
                          ? 'bg-gold-500/15 text-gold-500 border border-gold-500/20'
                          : 'bg-gray-500/15 text-gray-400 border border-gray-500/20'
                      }`}>
                        <Shield className="w-2.5 h-2.5" /> {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="p-1.5 text-gray-400 hover:text-gold-500 rounded bg-luxury-charcoal border border-gold-500/5 hover:border-gold-500/20 transition-all"
                        title="Edit User"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        disabled={u.id === currentUser?.id}
                        className={`p-1.5 rounded bg-luxury-charcoal border transition-all ${
                          u.id === currentUser?.id
                            ? 'text-gray-600 border-gray-600/10 cursor-not-allowed opacity-50'
                            : 'text-red-400 hover:text-red-300 border-red-500/5 hover:border-red-500/20'
                        }`}
                        title="Delete User"
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
