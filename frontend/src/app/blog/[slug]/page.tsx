'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await api.blogs.get(String(slug));
        setBlog(data);
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchArticle();
  }, [slug]);

  // Quick formatter to convert simple seed markdown headers to HTML tags
  const renderContent = (content: string) => {
    if (!content) return null;
    return content.split('\n\n').map((block, idx) => {
      if (block.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl font-serif text-gold-200 mt-8 mb-4 font-semibold">
            {block.replace('### ', '')}
          </h3>
        );
      }
      if (block.startsWith('- ')) {
        return (
          <ul key={idx} className="list-disc list-inside space-y-2 text-sm text-gray-400 font-light my-4">
            {block.split('\n').map((li, i) => (
              <li key={i}>{li.replace('- ', '')}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={idx} className="text-sm text-gray-400 font-light leading-relaxed mb-4">
          {block}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="bg-luxury-obsidian min-h-screen text-center pt-48 text-xs text-gray-400 font-light">
        Loading Journal Entry...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="bg-luxury-obsidian min-h-screen text-center pt-48 flex flex-col items-center">
        <h2 className="text-xl font-serif text-white mb-4">Journal Entry Not Found</h2>
        <Link href="/blog" className="btn-gold px-6 py-2 rounded text-xs uppercase">
          Return to Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-200 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center text-xs text-gray-400 hover:text-gold-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal
        </Link>

        {/* Tags */}
        <div className="flex gap-2 mb-4">
          {blog.tags?.map((tag: string) => (
            <span key={tag} className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-gold-500 font-semibold px-2 py-0.5 bg-gold-500/5 rounded border border-gold-500/10">
              <Tag className="w-2.5 h-2.5" /> {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-serif font-light text-white mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Author / Date Meta */}
        <div className="flex items-center gap-6 text-xs text-gray-500 mb-8 border-b border-gold-500/10 pb-6 font-light">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gold-500" />
            {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-2">
            <User className="w-4 h-4 text-gold-500" />
            Written by {blog.authorName}
          </span>
        </div>

        {/* Cover Image */}
        <div className="h-96 md:h-[450px] w-full rounded-xl overflow-hidden mb-12 border border-gold-500/10">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Body */}
        <div className="prose prose-invert max-w-none mb-16">
          {renderContent(blog.content)}
        </div>

        {/* CTA box */}
        <div className="glassmorphism p-8 rounded-xl text-center">
          <h3 className="text-xl font-serif text-white mb-3">Looking for Private Advisory?</h3>
          <p className="text-xs text-gray-400 font-light leading-relaxed max-w-lg mx-auto mb-6">
            Our brokerage publishes select market dossiers offline. Register your contact details to subscribe to private transaction reports.
          </p>
          <Link href="/book" className="btn-gold px-8 py-2.5 rounded text-xs uppercase tracking-wider font-semibold inline-block">
            Arrange Briefing Call
          </Link>
        </div>
      </div>
    </div>
  );
}
