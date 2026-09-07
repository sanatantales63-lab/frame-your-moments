import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  User,
  Share2,
  Check,
  ChevronRight,
  Search,
  Sparkles,
  MessageCircle,
  Tag,
  ArrowUpRight
} from 'lucide-react';
import {
  fetchBlogsFromSupabase,
  getBlogsFromLocal
} from '../data/blogsData';

export default function BlogsPage({ onBackToHome, onNavigateToVideos, initialBlogSlug = null }) {
  const [blogs, setBlogs] = useState(getBlogsFromLocal);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBlog, setActiveBlog] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load from Supabase on mount
  useEffect(() => {
    fetchBlogsFromSupabase().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setBlogs(data);
      }
    });
  }, []);

  // Handle direct slug deep-linking
  useEffect(() => {
    if (initialBlogSlug && blogs.length > 0) {
      const found = blogs.find((b) => b.slug === initialBlogSlug);
      if (found) {
        setActiveBlog(found);
      }
    }
  }, [initialBlogSlug, blogs]);

  // Extract unique categories
  const categories = ['All', ...new Set(blogs.map((b) => b.category).filter(Boolean))];

  // Filtered blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCat = selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const featuredBlog = blogs.find((b) => b.published !== false) || blogs[0];
  const gridBlogs = filteredBlogs.filter((b) => b.id !== featuredBlog?.id || searchQuery || selectedCategory !== 'All');

  const handleOpenBlog = (blog) => {
    setActiveBlog(blog);
    window.location.hash = `blog-${blog.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseReader = () => {
    setActiveBlog(null);
    window.location.hash = 'blogs';
  };

  const handleShare = (blog) => {
    const url = `${window.location.origin}/#blog-${blog.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] font-sans selection:bg-[#E64A6E] selection:text-white">
      {/* ─── Top Editorial Sticky Header ─── */}
      <header className="sticky top-0 left-0 right-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD1] transition-all">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 h-16 sm:h-[72px] flex items-center justify-between">
          <button
            onClick={activeBlog ? handleCloseReader : onBackToHome}
            className="flex items-center gap-2.5 font-cinzel text-[11px] tracking-[0.2em] uppercase font-bold text-[#44403C] hover:text-[#E64A6E] transition-colors cursor-pointer group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>{activeBlog ? 'Back to Journal' : 'Back to Home'}</span>
          </button>

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onBackToHome();
            }}
            className="flex items-center"
          >
            <img
              src="/logo.png"
              alt="Frame Your Moments"
              className="h-12 sm:h-14 w-auto object-contain transition-transform hover:scale-105"
            />
          </a>

          <div className="flex items-center gap-3">
            {onNavigateToVideos && (
              <button
                onClick={onNavigateToVideos}
                className="hidden sm:inline-flex items-center gap-1.5 font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#8A7968] hover:text-[#C5A059] transition-colors cursor-pointer"
              >
                <span>Wedding Films</span>
                <ChevronRight size={12} />
              </button>
            )}
            <a
              href="#contact"
              onClick={onBackToHome}
              className="px-4 sm:px-5 py-2 bg-gradient-to-r from-[#E64A6E] to-[#D8335B] text-white font-cinzel text-[10px] tracking-[0.18em] uppercase font-bold rounded-full shadow-[0_4px_12px_rgba(230,74,110,0.3)] hover:scale-105 transition-all cursor-pointer"
            >
              Inquire
            </a>
          </div>
        </div>
      </header>

      {/* ─── ARTICLE READER VIEW (Deep Magazine View) ─── */}
      <AnimatePresence mode="wait">
        {activeBlog ? (
          <motion.article
            key={activeBlog.id || activeBlog.slug}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[1000px] mx-auto px-5 sm:px-10 py-10 sm:py-16"
          >
            {/* Category & Metadata Breadcrumb */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-[#E64A6E]/10 border border-[#E64A6E]/30 text-[#E64A6E] font-cinzel text-[10px] tracking-[0.2em] uppercase font-bold">
                {activeBlog.category || 'Journal'}
              </span>
              <span className="text-[#8A7968] text-xs flex items-center gap-1">
                <Calendar size={13} />
                {formatDate(activeBlog.created_at)}
              </span>
              <span className="text-[#8A7968] text-xs flex items-center gap-1">
                <Clock size={13} />
                {activeBlog.read_time || '5 min read'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl text-[#1C1917] font-light leading-[1.15] mb-6">
              {activeBlog.title}
            </h1>

            {/* Author Byline & Social Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#E8DFD1] mb-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#E64A6E] to-[#C5A059] flex items-center justify-center text-white font-cinzel font-bold text-xs shadow-md">
                  FYM
                </div>
                <div>
                  <h4 className="font-cinzel text-xs tracking-wider uppercase font-bold text-[#1C1917]">
                    {activeBlog.author || 'Frame Your Moments Editorial'}
                  </h4>
                  <p className="text-[11px] text-[#8A7968] font-sans">
                    {activeBlog.author_role || 'Fine Art Wedding Studio'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(activeBlog)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E8DFD1] text-xs font-cinzel tracking-wider text-[#44403C] hover:border-[#E64A6E] hover:text-[#E64A6E] transition-all shadow-xs cursor-pointer"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                  <span>{copiedLink ? 'Link Copied!' : 'Share Article'}</span>
                </button>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Check out this wedding story by Frame Your Moments: ${activeBlog.title} - ${window.location.origin}/#blog-${activeBlog.slug}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-all shadow-xs"
                  title="Share on WhatsApp"
                >
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>

            {/* Cover Hero Photo */}
            {activeBlog.cover_image && (
              <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl mb-12 border border-[#E8DFD1]/80">
                <img
                  src={activeBlog.cover_image}
                  alt={activeBlog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {activeBlog.excerpt && (
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 bg-black/60 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-white/20 text-white/95 text-xs sm:text-sm font-serif-luxury italic leading-relaxed max-w-2xl">
                    "{activeBlog.excerpt}"
                  </div>
                )}
              </div>
            )}

            {/* Formatted Article Body */}
            <div
              className="prose prose-stone max-w-none font-sans text-[#2A2522] leading-[1.85] text-base sm:text-lg
                prose-headings:font-serif-luxury prose-headings:font-normal prose-headings:text-[#1C1917]
                prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-[#E8DFD1] prose-h2:pb-2
                prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:mb-6 prose-p:text-[#3D3733]
                prose-blockquote:border-l-4 prose-blockquote:border-[#E64A6E] prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-[#8A7968]
                prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8 prose-img:border prose-img:border-[#E8DFD1]
                prose-strong:text-[#1C1917] prose-strong:font-semibold"
              dangerouslySetInnerHTML={{ __html: activeBlog.content }}
            />

            {/* Tags Strip */}
            {activeBlog.tags && activeBlog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[#E8DFD1] flex flex-wrap items-center gap-2">
                <span className="text-xs font-cinzel text-[#8A7968] uppercase tracking-wider flex items-center gap-1.5 mr-2">
                  <Tag size={13} /> Tags:
                </span>
                {activeBlog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white border border-[#E8DFD1] text-[#44403C] rounded-full text-xs font-cinzel tracking-wider hover:border-[#C5A059] transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Grand Wedding Booking CTA Banner */}
            <div className="mt-16 bg-gradient-to-br from-[#2A0A18] via-[#1A060F] to-[#120309] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-[#E64A6E]/30 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#E64A6E]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-xl space-y-3">
                <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase font-bold text-[#F5D77F] flex items-center justify-center sm:justify-start gap-2">
                  <Sparkles size={13} /> Fine Art Wedding Experience
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-4xl font-light">
                  Ready to Turn Your Wedding into Heirloom Cinema?
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                  We accept limited weddings each season to ensure unparalleled fine-art craftsmanship. Inquire early to reserve your dates.
                </p>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <a
                  href="#contact"
                  onClick={onBackToHome}
                  className="px-8 py-4 bg-gradient-to-r from-[#E64A6E] via-[#E8557B] to-[#D8335B] text-white font-cinzel text-xs tracking-[0.2em] uppercase font-bold rounded-full shadow-[0_6px_25px_rgba(230,74,110,0.45)] hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
                >
                  Book Consultation
                </a>
              </div>
            </div>

            {/* Read More Stories Strip */}
            <div className="mt-20">
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E8DFD1]">
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#1C1917]">
                  More from the Journal
                </h3>
                <button
                  onClick={handleCloseReader}
                  className="text-xs font-cinzel text-[#E64A6E] hover:text-[#C5A059] tracking-widest uppercase font-bold cursor-pointer"
                >
                  View All Stories →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs
                  .filter((b) => b.id !== activeBlog.id && b.slug !== activeBlog.slug)
                  .slice(0, 3)
                  .map((b) => (
                    <div
                      key={b.id || b.slug}
                      onClick={() => handleOpenBlog(b)}
                      className="group bg-white rounded-2xl overflow-hidden border border-[#E8DFD1] hover:border-[#C5A059] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                    >
                      <div className="aspect-[16/10] relative overflow-hidden bg-stone-100">
                        <img
                          src={b.cover_image}
                          alt={b.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white font-cinzel text-[9px] tracking-widest uppercase font-bold rounded-full">
                          {b.category}
                        </span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <h4 className="font-serif-luxury text-lg text-[#1C1917] group-hover:text-[#E64A6E] transition-colors leading-snug line-clamp-2">
                          {b.title}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-[#8A7968] font-cinzel tracking-wider pt-2 border-t border-stone-100">
                          <span>{b.read_time || '5 min read'}</span>
                          <span className="text-[#E64A6E] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center">
                            Read →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.article>
        ) : (
          /* ─── JOURNAL MAIN DIRECTORY VIEW ─── */
          <motion.div
            key="blogs-directory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-[1400px] mx-auto px-5 sm:px-10 py-12 sm:py-20"
          >
            {/* ═══ EDITORIAL HERO HEADER ═══ */}
            <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E64A6E]/10 border border-[#E64A6E]/30 text-[#E64A6E] font-cinzel text-[10px] tracking-[0.25em] uppercase font-bold">
                <Sparkles size={12} /> The Frame Your Moments Journal
              </span>
              <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl text-[#1C1917] font-light leading-[1.08]">
                Stories, Guides & Wedding Inspirations
              </h1>
              <p className="font-sans text-sm sm:text-base text-[#6B635B] leading-relaxed max-w-2xl mx-auto">
                Explore expert planning guides, royal destination insights, and timeless fine-art wedding ideas crafted by our cinematography team.
              </p>

              {/* Search & Category Filter Bar */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="relative w-full sm:w-80">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7968]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search wedding stories..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DFD1] rounded-full text-xs font-sans text-[#1C1917] placeholder:text-[#B0A898] focus:outline-none focus:border-[#E64A6E] shadow-xs"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full font-cinzel text-[10px] tracking-wider uppercase font-bold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#1C1917] text-white shadow-md'
                          : 'bg-white text-[#6B635B] border border-[#E8DFD1] hover:border-[#C5A059] hover:text-[#1C1917]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══ FEATURED HERO BLOG SPOTLIGHT (When no active search) ═══ */}
            {!searchQuery && selectedCategory === 'All' && featuredBlog && (
              <div
                onClick={() => handleOpenBlog(featuredBlog)}
                className="group relative rounded-3xl overflow-hidden bg-white border border-[#E8DFD1] hover:border-[#C5A059] shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer mb-16 grid grid-cols-1 lg:grid-cols-12"
              >
                <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto relative overflow-hidden bg-stone-100">
                  <img
                    src={featuredBlog.cover_image}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-5 left-5">
                    <span className="px-3.5 py-1.5 bg-[#E64A6E] text-white font-cinzel text-[10px] tracking-[0.2em] uppercase font-bold rounded-full shadow-lg">
                      ★ Featured Story
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs font-cinzel text-[#8A7968]">
                      <span className="text-[#C5A059] font-bold uppercase tracking-wider">{featuredBlog.category}</span>
                      <span>•</span>
                      <span>{featuredBlog.read_time || '5 min read'}</span>
                    </div>

                    <h2 className="font-serif-luxury text-2xl sm:text-4xl text-[#1C1917] group-hover:text-[#E64A6E] transition-colors leading-snug">
                      {featuredBlog.title}
                    </h2>

                    <p className="font-sans text-sm text-[#6B635B] leading-relaxed line-clamp-3">
                      {featuredBlog.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-[#E8DFD1]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1C1917] text-white flex items-center justify-center font-cinzel text-xs font-bold">
                        FYM
                      </div>
                      <div>
                        <span className="block font-cinzel text-[11px] uppercase font-bold text-[#1C1917]">
                          {featuredBlog.author || 'FYM Editorial'}
                        </span>
                        <span className="block text-[10px] text-[#8A7968]">
                          {formatDate(featuredBlog.created_at)}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF7F2] group-hover:bg-[#E64A6E] group-hover:text-white font-cinzel text-[10px] tracking-wider uppercase font-bold text-[#1C1917] transition-all">
                      <span>Read Story</span>
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ 3-COLUMN EDITORIAL BLOG GRID ═══ */}
            <div className="mb-10 flex items-center justify-between border-b border-[#E8DFD1] pb-3">
              <h3 className="font-cinzel text-xs tracking-[0.25em] uppercase font-bold text-[#8A7968]">
                {selectedCategory === 'All' ? 'All Editorial Articles' : `${selectedCategory} Articles`} ({filteredBlogs.length})
              </h3>
            </div>

            {filteredBlogs.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-dashed border-[#E8DFD1]">
                <BookOpen size={36} className="mx-auto text-[#B0A898]" />
                <h4 className="font-serif-luxury text-xl text-[#1C1917]">No articles found</h4>
                <p className="text-xs text-[#8A7968]">Try searching with different keywords or choosing another category.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-5 py-2 bg-[#1C1917] text-white font-cinzel text-xs tracking-wider uppercase rounded-full cursor-pointer hover:bg-[#E64A6E] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridBlogs.map((blog, idx) => (
                  <motion.div
                    key={blog.id || blog.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                    onClick={() => handleOpenBlog(blog)}
                    className="group bg-white rounded-3xl overflow-hidden border border-[#E8DFD1] hover:border-[#C5A059] shadow-xs hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col"
                  >
                    {/* Cover image container */}
                    <div className="aspect-[16/10] relative overflow-hidden bg-stone-100">
                      <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 bg-black/75 backdrop-blur-md text-white font-cinzel text-[9px] tracking-widest uppercase font-bold rounded-full border border-white/20">
                          {blog.category}
                        </span>
                      </div>
                    </div>

                    {/* Blog Card Content */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[11px] font-cinzel text-[#8A7968]">
                          <Calendar size={12} />
                          <span>{formatDate(blog.created_at)}</span>
                          <span>•</span>
                          <Clock size={12} />
                          <span>{blog.read_time || '5 min read'}</span>
                        </div>

                        <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#1C1917] group-hover:text-[#E64A6E] transition-colors leading-snug">
                          {blog.title}
                        </h3>

                        <p className="font-sans text-xs sm:text-sm text-[#6B635B] leading-relaxed line-clamp-3">
                          {blog.excerpt}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[11px] font-cinzel text-[#8A7968]">
                          By {blog.author?.split(' ')[0] || 'FYM'}
                        </span>
                        <span className="font-cinzel text-[10px] tracking-wider uppercase font-bold text-[#E64A6E] group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1">
                          Read Story →
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
