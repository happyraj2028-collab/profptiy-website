'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('');

  const tags = ['Luxury Market', 'Architecture', 'Design', 'Sustainability', 'Investment'];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await api.blogs.list({ tag: activeTag });
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blog articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [activeTag]);

  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-200 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-3">
            The Luxury <span className="italic font-serif font-semibold text-gold-200">Journal</span>
          </h1>
          <p className="text-xs text-gray-400 font-light max-w-lg mx-auto leading-relaxed">
            Market analysis, architectural history, design philosophies, and luxury living updates curated by our editors.
          </p>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-12">
          <button
            onClick={() => setActiveTag('')}
            className={`px-4 py-1.5 rounded text-[10px] tracking-widest uppercase transition-all border ${
              activeTag === ''
                ? 'bg-gold-500 border-gold-500 text-luxury-obsidian font-semibold'
                : 'bg-luxury-charcoal border-gold-500/10 text-gray-400 hover:text-gold-500'
            }`}
          >
            All Journal Posts
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded text-[10px] tracking-widest uppercase transition-all border ${
                activeTag === tag
                  ? 'bg-gold-500 border-gold-500 text-luxury-obsidian font-semibold'
                  : 'bg-luxury-charcoal border-gold-500/10 text-gray-400 hover:text-gold-500'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-luxury-charcoal/30 border border-gold-500/5 rounded-xl h-[420px] animate-pulse" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="glassmorphism p-12 rounded-xl text-center max-w-md mx-auto">
            <p className="text-xs text-gray-400 font-light">No articles have been compiled under this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((post) => (
              <article key={post.id} className="glass-card rounded-xl overflow-hidden flex flex-col group h-full">
                <div className="relative h-56 overflow-hidden shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-luxury-obsidian/85 border border-gold-500/10 text-[9px] tracking-widest text-gold-500 uppercase rounded">
                      {post.tags?.[0] || 'Insight'}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  {/* Meta data */}
                  <div className="flex items-center gap-4 text-[10px] text-gray-500 mb-3 font-light">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {post.authorName}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-semibold text-gray-100 group-hover:text-gold-500 transition-colors line-clamp-2 mb-4 leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-xs text-gray-400 font-light leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs uppercase tracking-wider text-gold-500 hover:text-gold-200 mt-auto flex items-center gap-1.5 font-medium transition-colors"
                  >
                    Explore Document <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
