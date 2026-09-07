import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Play,
  X,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Film,
  Sparkles,
  Heart,
  MessageCircle,
  Clock,
  Eye,
  Share2,
  Calendar,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { getStoredFilms, getStoredReels, fetchFilmsFromSupabase, fetchReelsFromSupabase } from '../data/videosData';
import Footer from './Footer';

const CATEGORIES = [
  { id: 'all', label: 'All Videos' },
  { id: 'wedding_films', label: 'Wedding Films' },
  { id: 'pre_wedding', label: 'Pre-Wedding' },
  { id: 'trailers', label: 'Trailers' },
  { id: 'haldi', label: 'Haldi Ceremony' }
];

export default function VideosPage({ onBackToHome }) {
  const [films, setFilms] = useState([]);
  const [reels, setReels] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active modal states
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [selectedReelIndex, setSelectedReelIndex] = useState(null);
  const [isReelMuted, setIsReelMuted] = useState(false);

  const reelsScrollRef = useRef(null);

  useEffect(() => {
    // Initial local cache
    setFilms(getStoredFilms());
    setReels(getStoredReels());
    window.scrollTo(0, 0);

    // Sync with Supabase
    fetchFilmsFromSupabase().then((data) => {
      if (data && data.length > 0) setFilms(data);
    });
    fetchReelsFromSupabase().then((data) => {
      if (data && data.length > 0) setReels(data);
    });
  }, []);

  // Filtered films list
  const filteredFilms = films.filter((film) => {
    const matchesCat = activeCategory === 'all' || film.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      film.title.toLowerCase().includes(query) ||
      film.couple.toLowerCase().includes(query) ||
      film.location.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  const scrollReels = (direction) => {
    if (!reelsScrollRef.current) return;
    const scrollAmount = 300;
    reelsScrollRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleNextReel = () => {
    if (selectedReelIndex !== null && selectedReelIndex < reels.length - 1) {
      setSelectedReelIndex(selectedReelIndex + 1);
    } else {
      setSelectedReelIndex(0);
    }
  };

  const handlePrevReel = () => {
    if (selectedReelIndex !== null && selectedReelIndex > 0) {
      setSelectedReelIndex(selectedReelIndex - 1);
    } else {
      setSelectedReelIndex(reels.length - 1);
    }
  };

  const activeReel = selectedReelIndex !== null ? reels[selectedReelIndex] : null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] font-sans selection:bg-[#E64A6E] selection:text-white">
      
      {/* ═══ TOP STICKY NAVIGATION BAR ═══ */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD1] shadow-2xs">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 h-16 sm:h-[72px] flex items-center justify-between">
          
          {/* Back to Home Button */}
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 font-cinzel text-xs tracking-[0.18em] uppercase font-bold text-[#E64A6E] hover:text-[#C5A059] transition-colors cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          {/* Center Brand Logo */}
          <button onClick={onBackToHome} className="flex items-center py-1 cursor-pointer">
            <img
              src="/logo.png"
              alt="Frame Your Moments"
              className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-sm"
            />
          </button>

          {/* Right Direct WhatsApp Action */}
          <a
            href="https://wa.me/918013346138?text=Hello%20Frame%20Your%20Moments!%20I%20am%20watching%20your%20wedding%20films%20and%20would%20like%20to%20inquire%20about%20booking."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1917] hover:bg-[#E64A6E] text-white font-cinzel text-[10px] tracking-widest uppercase font-bold transition-all shadow-xs"
          >
            <MessageCircle size={13} />
            <span>Book Coverage</span>
          </a>

        </div>
      </header>

      {/* ═══ MAIN HERO HEADER ═══ */}
      <section className="pt-12 sm:pt-16 pb-8 px-5 sm:px-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-[#C5A059]" />
            <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-bold text-[#E64A6E]">
              Cinematic Masterpieces
            </span>
            <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-light text-[#1C1917] leading-tight">
            Wedding Stories
          </h1>

          <p className="font-sans text-sm sm:text-base text-[#57534E] max-w-2xl mx-auto leading-relaxed">
            Experience the magic of love through our cinematic wedding videos. Every frame tells a story, every moment captures an emotion.
          </p>
        </motion.div>

        {/* ═══ SEARCH & CATEGORY FILTER BAR (Matching Drishtikon Design) ═══ */}
        <div className="mt-10 sm:mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7968]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-[#E8DFD1] text-xs sm:text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/15 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8A7968] hover:text-[#1C1917]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const count = cat.id === 'all'
                ? films.length
                : films.filter((f) => f.category === cat.id).length;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-full font-cinzel text-[10px] sm:text-[11px] tracking-wider uppercase font-semibold transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#E64A6E] text-white border-[#E64A6E] shadow-sm scale-105'
                      : 'bg-white text-[#57534E] border-[#E8DFD1] hover:border-[#C5A059] hover:text-[#1C1917]'
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* ═══ QUICK REELS SECTION (Drishtikon Style 9:16 Vertical Video Row) ═══ */}
      <section className="py-8 sm:py-12 max-w-[1400px] mx-auto px-5 sm:px-10">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#E8DFD1]">
          <div>
            <span className="font-cinzel text-[10px] tracking-[0.25em] uppercase font-bold text-[#C5A059] block mb-0.5">
              Shorts & Moments
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[#1C1917]">
              Quick Reels
            </h2>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollReels('left')}
              className="w-9 h-9 rounded-full bg-white border border-[#E8DFD1] flex items-center justify-center text-[#1C1917] hover:bg-[#C5A059] hover:text-white transition-colors shadow-2xs cursor-pointer"
              aria-label="Previous Reels"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollReels('right')}
              className="w-9 h-9 rounded-full bg-white border border-[#E8DFD1] flex items-center justify-center text-[#1C1917] hover:bg-[#C5A059] hover:text-white transition-colors shadow-2xs cursor-pointer"
              aria-label="Next Reels"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Reels Track */}
        <div
          ref={reelsScrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reels.map((reel, idx) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              onClick={() => setSelectedReelIndex(idx)}
              className="group relative flex-shrink-0 w-[200px] sm:w-[230px] lg:w-[240px] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-black cursor-pointer shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-[#E8DFD1] snap-start"
            >
              {/* Thumbnail Background */}
              <img
                src={reel.thumbnail}
                alt={reel.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 filter brightness-[0.9]"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 group-hover:from-black/95 transition-colors" />

              {/* Play Badge Top Left */}
              <div className="absolute top-3.5 left-3.5 w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/40 group-hover:bg-[#E64A6E] group-hover:scale-110 transition-all">
                <Play size={12} className="fill-current ml-0.5" />
              </div>

              {/* Duration Badge Top Right */}
              <div className="absolute top-3.5 right-3.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-sans font-medium text-white flex items-center gap-1 border border-white/15">
                <Clock size={10} />
                <span>{reel.duration}</span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <span className="font-cinzel text-[9px] tracking-wider uppercase text-[#E2C275] block font-bold">
                  {reel.category}
                </span>
                <h3 className="font-serif-luxury text-sm sm:text-base font-semibold leading-tight line-clamp-2 drop-shadow-sm">
                  {reel.title}
                </h3>
                <div className="flex items-center justify-between pt-1 text-[10px] text-[#D6C7B2] font-sans">
                  <span>{reel.couple}</span>
                  <span className="flex items-center gap-1">
                    <Eye size={11} />
                    {reel.views}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ WEDDING FILMS & CINEMA GRID (16:9 Landscape) ═══ */}
      <section className="py-10 sm:py-16 max-w-[1400px] mx-auto px-5 sm:px-10">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E8DFD1]">
          <div>
            <span className="font-cinzel text-[10px] tracking-[0.25em] uppercase font-bold text-[#C5A059] block mb-0.5">
              Full Cinema Collection
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-medium text-[#1C1917]">
              Featured Wedding Films
            </h2>
          </div>
          <span className="text-xs font-sans text-[#8A7968]">
            Showing {filteredFilms.length} films
          </span>
        </div>

        {filteredFilms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E8DFD1] p-8 space-y-3">
            <Film size={36} className="text-[#C5A059] mx-auto" />
            <h3 className="font-serif-luxury text-2xl text-[#1C1917]">No wedding films matched your search</h3>
            <p className="font-sans text-xs text-[#57534E]">Try searching with a different couple name or clear the filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="px-5 py-2 rounded-full bg-[#1C1917] text-white text-xs font-cinzel tracking-wider uppercase font-bold mt-2 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredFilms.map((film, idx) => (
              <motion.div
                key={film.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => setSelectedFilm(film)}
                className="group bg-white rounded-3xl overflow-hidden border border-[#E8DFD1] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* 16:9 Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <img
                    src={film.thumbnail}
                    alt={film.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Center Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:bg-[#E64A6E] group-hover:scale-110 transition-all shadow-lg">
                      <Play size={20} className="fill-current ml-1" />
                    </div>
                  </div>

                  {/* Duration Tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-sans font-medium text-white flex items-center gap-1.5 border border-white/15">
                    <Clock size={11} className="text-[#C5A059]" />
                    <span>{film.duration}</span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#1C1917]/80 backdrop-blur-md text-[10px] font-cinzel font-bold text-[#E2C275] border border-white/10 uppercase tracking-wider">
                    {film.categoryLabel}
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#8A7968] font-sans mb-1.5">
                      <MapPin size={13} className="text-[#E64A6E]" />
                      <span>{film.location}</span>
                    </div>
                    <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#1C1917] font-semibold leading-snug group-hover:text-[#E64A6E] transition-colors line-clamp-2">
                      {film.title}
                    </h3>
                  </div>

                  <p className="font-sans text-xs text-[#57534E] leading-relaxed line-clamp-2">
                    {film.description}
                  </p>

                  <div className="pt-2 border-t border-[#E8DFD1]/60 flex items-center justify-between text-xs font-cinzel tracking-wider uppercase font-bold text-[#C5A059]">
                    <span>Watch Full 4K Cinema</span>
                    <Play size={12} className="fill-current" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ═══ MODAL 1: IN-SITE VERTICAL REEL PLAYER (NO REDIRECT TO INSTA) ═══ */}
      <AnimatePresence>
        {activeReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setSelectedReelIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedReelIndex(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/15 hover:bg-[#E64A6E] text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer z-50"
              aria-label="Close Reel Player"
            >
              <X size={20} />
            </button>

            {/* Previous Reel Navigation Button */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevReel(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-[#C5A059] text-white hidden md:flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-50"
              aria-label="Previous Reel"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Next Reel Navigation Button */}
            <button
              onClick={(e) => { e.stopPropagation(); handleNextReel(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-[#C5A059] text-white hidden md:flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-50"
              aria-label="Next Reel"
            >
              <ChevronRight size={22} />
            </button>

            {/* 9:16 Vertical Reel Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col justify-between"
            >
              {/* Native Video / Instagram Embed / YouTube Embed Playing Directly In-Site */}
              {activeReel.instaCode ? (
                /*
                  Instagram embed always renders with:
                    - a ~56px profile header at top
                    - the 9:16 video in the middle
                    - a ~50px white action bar (likes/comments) at the bottom
                  
                  Strategy: 
                  1. Outer wrapper clips the bottom 20% → hides Instagram action bar
                  2. iframe is 130% tall and shifted -8% up → pushes header above visible area
                  3. Solid black top mask (z-10) covers any leftover header pixels
                  4. Solid black bottom mask covers the gap between iframe and our overlay
                */
                <div className="absolute inset-0 bg-black">
                  {/* Clip wrapper — visible area stops at 70% height, hiding footer */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: '30%',
                      overflow: 'hidden',
                      backgroundColor: 'black',
                    }}
                  >
                    <iframe
                      key={activeReel.id}
                      src={`https://www.instagram.com/reel/${activeReel.instaCode}/embed`}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '145%',
                        top: '-9%',   /* hides ~56px Instagram header bar */
                        border: 'none',
                        backgroundColor: 'black',
                      }}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      scrolling="no"
                      title={activeReel.title}
                    />
                  </div>
                  {/* Top solid mask — covers any leftover Instagram header pixels */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0,
                      height: '9%',
                      background: 'black',
                      zIndex: 6,
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Bottom solid mask — covers the gap between clip-wrapper and our overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0, left: 0, right: 0,
                      height: '30%',
                      background: 'black',
                      zIndex: 6,
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              ) : activeReel.youtubeId ? (
                <iframe
                  key={activeReel.id}
                  src={`https://www.youtube-nocookie.com/embed/${activeReel.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  className="absolute inset-0 w-full h-full border-0 bg-black"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={activeReel.title}
                />
              ) : (
                <video
                  key={activeReel.id}
                  autoPlay
                  loop
                  playsInline
                  muted={isReelMuted}
                  poster={activeReel.thumbnail}
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src={activeReel.videoUrl} type="video/mp4" />
                  <source src="/featured_wedding_film.webm" type="video/webm" />
                </video>
              )}

              {/* Top Vignette with Sound Control & Tag */}
              <div className="relative z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E64A6E] flex items-center justify-center text-white font-cinzel text-[10px] font-bold">
                    FYM
                  </div>
                  <div>
                    <span className="font-cinzel text-[10px] tracking-wider uppercase font-bold text-white block leading-tight">
                      Frame Your Moments
                    </span>
                    <span className="text-[10px] text-[#C5A059] font-sans block">
                      {activeReel.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsReelMuted(!isReelMuted)}
                  className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
                >
                  {isReelMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-emerald-400" />}
                </button>
              </div>

              {/* Bottom Vignette with Reel Info & WhatsApp Action */}
              <div className="relative z-20 p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent space-y-3">
                <div>
                  <span className="font-cinzel text-[10px] tracking-wider uppercase text-[#E2C275] block font-bold">
                    ✦ {activeReel.couple}
                  </span>
                  <h4 className="font-serif-luxury text-lg text-white font-semibold leading-snug">
                    {activeReel.title}
                  </h4>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <a
                    href={`https://wa.me/918013346138?text=Hello%20Frame%20Your%20Moments!%20I%20loved%20your%20reel%20"${encodeURIComponent(activeReel.title)}"%20and%20want%20similar%20wedding%20coverage.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-cinzel text-[11px] tracking-wider uppercase font-bold text-center flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform"
                  >
                    <MessageCircle size={15} />
                    <span>Inquire This Style</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MODAL 2: 4K CINEMA THEATER PLAYER (YouTube 11-Digit Embed & MP4) ═══ */}
      <AnimatePresence>
        {selectedFilm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedFilm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#141210] rounded-3xl overflow-hidden shadow-2xl border border-white/15 flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedFilm(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 hover:bg-[#E64A6E] text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer z-30"
              >
                <X size={18} />
              </button>

              {/* Video Player (YouTube 11-digit embed OR direct MP4) */}
              <div className="relative aspect-video w-full bg-black overflow-hidden">
                {selectedFilm.youtubeId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${selectedFilm.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title={selectedFilm.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    autoPlay
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  >
                    <source src={selectedFilm.videoUrl} type="video/mp4" />
                    <source src="/featured_wedding_film.webm" type="video/webm" />
                  </video>
                )}
              </div>

              {/* Theater Details & WhatsApp Booking Bar */}
              <div className="p-6 sm:p-8 text-white space-y-4 bg-[#141210]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#C5A059] font-cinzel uppercase tracking-wider mb-1">
                      <span>{selectedFilm.categoryLabel}</span>
                      <span>•</span>
                      <span>{selectedFilm.location}</span>
                      <span>•</span>
                      <span>{selectedFilm.duration}</span>
                    </div>
                    <h3 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium">
                      {selectedFilm.title}
                    </h3>
                  </div>

                  <a
                    href={`https://wa.me/918013346138?text=Hello%20Frame%20Your%20Moments!%20I%20watched%20the%20film%20"${encodeURIComponent(selectedFilm.title)}"%20and%20would%20like%20to%20discuss%20our%20wedding%20cinematography.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA771C] hover:from-[#E2C275] hover:to-[#B38728] text-[#1C1917] font-cinzel text-xs tracking-wider uppercase font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                  >
                    <MessageCircle size={15} />
                    <span>Inquire This Package</span>
                  </a>
                </div>

                <p className="font-sans text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
                  {selectedFilm.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ FOOTER ═══ */}
      <Footer />

    </div>
  );
}
