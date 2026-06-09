'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Plus, Edit2, Trash2, X, FileText } from 'lucide-react';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form toggles
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState('');
  const [slug, setSlug] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [authorName, setAuthorName] = useState('');

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await api.blogs.list();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setExcerpt('');
    setImage('');
    setSlug('');
    setTagsText('');
    setAuthorName('');
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setExcerpt(post.excerpt);
    setImage(post.image);
    setSlug(post.slug);
    setTagsText(post.tags?.join(', ') || '');
    setAuthorName(post.authorName || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.blogs.delete(id);
      fetchBlogs();
    } catch (error) {
      alert('Error deleting blog post');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !excerpt || !image || !slug) {
      alert('All fields except author/tags are required.');
      return;
    }

    const tags = tagsText.split(',').map(s => s.trim()).filter(s => s !== '');
    const payload = {
      title,
      content,
      excerpt,
      image,
      slug,
      tags,
      authorName: authorName || 'Profptiy Editor',
    };

    try {
      if (editingId) {
        await api.blogs.update(editingId, payload);
      } else {
        await api.blogs.create(payload);
      }
      resetForm();
      setShowForm(false);
      fetchBlogs();
    } catch (error: any) {
      alert(error.message || 'Error saving blog article.');
    }
  };

  // Helper to generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      // Auto generate slug
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // remove special characters
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-'); // collapse multiple hyphens
      setSlug(generated);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gold-500/5 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white font-semibold">Manage Blogs</h1>
          <p className="text-xs text-gray-400 font-light mt-1">Publish and edit news, market trends, and design columns.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-gold px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Article
          </button>
        )}
      </div>

      {/* Editor Form */}
      {showForm && (
        <div className="glassmorphism p-6 rounded-xl relative border border-gold-500/20">
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
            {editingId ? 'Edit Journal Entry' : 'Create Journal Entry'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Article Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Modern Architecture Design Trends"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="modern-architecture-design-trends"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1 md:col-span-2">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Featured Image URL *</label>
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Unsplash image URL"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-semibold">Author Name</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Ananya Sharma"
                  className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 text-xs text-gray-300 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Tags / Categories (Comma Separated)</label>
              <input
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="Architecture, Design, Luxury"
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Article Summary Excerpt *</label>
              <input
                type="text"
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary displayed on listings page cards"
                className="bg-luxury-charcoal border border-gold-500/10 focus:border-gold-500 rounded px-3 py-2.5 text-xs text-gray-300 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-semibold">Article Content Body *</label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Full article content body. Use double line breaks for paragraphs, '### Title' for subheaders..."
                rows={8}
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
                {editingId ? 'Save Article Changes' : 'Publish Article'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blogs Table */}
      {!showForm && (
        <div className="glassmorphism rounded-xl overflow-x-auto">
          {loading ? (
            <div className="p-6 text-xs text-gray-500 font-light">Retrieving articles...</div>
          ) : blogs.length === 0 ? (
            <div className="p-10 text-center text-xs text-gray-500 font-light">
              No journal articles are published. Click 'Create Article' to publish one.
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-luxury-charcoal/80 text-gold-500 border-b border-gold-500/10 uppercase tracking-widest text-[9px]">
                  <th className="px-6 py-3.5">Article Details</th>
                  <th className="px-6 py-3.5">Author</th>
                  <th className="px-6 py-3.5">Tags</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/5 font-light">
                {blogs.map((post) => (
                  <tr key={post.id} className="hover:bg-luxury-charcoal/30">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-200">{post.title}</div>
                      <div className="text-[10px] text-gray-500">/{post.slug} • {new Date(post.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{post.authorName}</td>
                    <td className="px-6 py-4 text-gray-400">{post.tags?.join(', ') || 'None'}</td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2 mt-2">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-400 hover:text-gold-500 rounded bg-luxury-charcoal border border-gold-500/5 hover:border-gold-500/20 transition-all"
                        title="View Live"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-1.5 text-gray-400 hover:text-gold-500 rounded bg-luxury-charcoal border border-gold-500/5 hover:border-gold-500/20 transition-all"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 text-red-400 hover:text-red-300 rounded bg-luxury-charcoal border border-red-500/5 hover:border-red-500/20 transition-all"
                        title="Delete Article"
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
