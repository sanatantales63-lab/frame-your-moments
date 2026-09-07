import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getHeroPhotos } from '../data/siteMediaData';

// ── Heights for visual variety in the masonry scroll ──
const heightPatterns = [
  'h-52 sm:h-64 lg:h-72',
  'h-40 sm:h-48 lg:h-56',
  'h-56 sm:h-60 lg:h-80',
  'h-48 sm:h-56 lg:h-68',
  'h-44 sm:h-52 lg:h-64',
  'h-60 sm:h-68 lg:h-84',
];

// ── Infinite vertical scroll column ──
const HERO_SCROLL_DURATION = 60;

function ScrollColumn({ images, direction = 'up', duration = HERO_SCROLL_DURATION }) {
  const from = direction === 'up' ? '0%' : '-50%';
  const to = direction === 'up' ? '-50%' : '0%';

  // Need at least 2 images to loop seamlessly; duplicate if needed
  const loopImages = images.length > 0
    ? [...images, ...images] // duplicate for seamless loop
    : [];

  if (loopImages.length === 0) {
    // Empty placeholder column when no photos uploaded
    return (
      <div className="overflow-hidden h-full relative flex-1 flex flex-col gap-2 sm:gap-3">
        {heightPatterns.map((h, i) => (
          <div key={i} className={`w-full ${h} rounded-md sm:rounded-lg overflow-hidden flex-shrink-0 bg-[#E8DFD1]/40`} />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden h-full relative flex-1">
      <motion.div
        animate={{ y: [from, to] }}
        transition={{ repeat: Infinity, duration, ease: 'linear' }}
        className="flex flex-col gap-2 sm:gap-3"
      >
        {loopImages.map((img, i) => (
          <div key={i} className={`w-full ${img.h || heightPatterns[i % heightPatterns.length]} rounded-md sm:rounded-lg overflow-hidden flex-shrink-0`}>
            <img
              src={img.src || img.url || ''}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              draggable={false}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const [heroPhotos, setHeroPhotos] = useState([]);

  useEffect(() => {
    getHeroPhotos().then((photos) => {
      setHeroPhotos(Array.isArray(photos) ? photos : []);
    });
  }, []);

  // Distribute photos into 3 columns based on their 'column' field or round-robin
  const col1Photos = heroPhotos
    .filter((p) => p.column === 1 || (!p.column && heroPhotos.indexOf(p) % 3 === 0))
    .map((p, i) => ({ ...p, h: heightPatterns[i % heightPatterns.length] }));

  const col2Photos = heroPhotos
    .filter((p) => p.column === 2 || (!p.column && heroPhotos.indexOf(p) % 3 === 1))
    .map((p, i) => ({ ...p, h: heightPatterns[(i + 1) % heightPatterns.length] }));

  const col3Photos = heroPhotos
    .filter((p) => p.column === 3 || (!p.column && heroPhotos.indexOf(p) % 3 === 2))
    .map((p, i) => ({ ...p, h: heightPatterns[(i + 2) % heightPatterns.length] }));

  // If no column metadata, distribute round-robin
  const col1 = col1Photos.length > 0 ? col1Photos : heroPhotos.filter((_, i) => i % 3 === 0).map((p, i) => ({ ...p, h: heightPatterns[i % heightPatterns.length] }));
  const col2 = col2Photos.length > 0 ? col2Photos : heroPhotos.filter((_, i) => i % 3 === 1).map((p, i) => ({ ...p, h: heightPatterns[(i + 1) % heightPatterns.length] }));
  const col3 = col3Photos.length > 0 ? col3Photos : heroPhotos.filter((_, i) => i % 3 === 2).map((p, i) => ({ ...p, h: heightPatterns[(i + 2) % heightPatterns.length] }));

  return (
    <section id="hero" className="relative w-full bg-[#FAF7F2] pt-[72px] overflow-hidden">
      {/* ── Piixonova-style one-time diagonal shine reflection on load ── */}
      <motion.div
        initial={{ left: '-120%' }}
        animate={{ left: '120%' }}
        transition={{ duration: 1.2, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute top-0 bottom-0 z-30 pointer-events-none"
        style={{
          width: '220px',
          background: 'linear-gradient(105deg, transparent 0%, transparent 30%, rgba(255,255,255,0.12) 42%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.12) 58%, transparent 70%, transparent 100%)',
          filter: 'blur(2px)',
          transform: 'skewX(-15deg)',
        }}
      />
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">

        {/* ─── LEFT: Photo Grid — ALWAYS 3 columns, even mobile ─── */}
        <div className="lg:w-[55%] xl:w-[52%] h-[55vh] sm:h-[60vh] lg:h-[calc(100vh-72px)] relative">
          {/* Photo columns container */}
          <div className="absolute inset-0 flex gap-2 sm:gap-3 px-3 sm:px-5 py-0 overflow-hidden">
            <ScrollColumn images={col1} direction="up" duration={HERO_SCROLL_DURATION} />
            <ScrollColumn images={col2} direction="down" duration={HERO_SCROLL_DURATION} />
            <ScrollColumn images={col3} direction="up" duration={HERO_SCROLL_DURATION} />
          </div>

          {/* ✨ Dreamy cloudy gradient overlays (top + bottom) — the premium Piixonova feel */}
          <div className="absolute top-0 left-0 right-0 h-28 sm:h-36 lg:h-44 bg-gradient-to-b from-[#FAF7F2] via-[#FAF7F2]/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 lg:h-44 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/80 to-transparent z-10 pointer-events-none" />
          {/* Subtle side fade on the right edge (blends into text area) */}
          <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-[#FAF7F2] to-transparent z-10 pointer-events-none" />
        </div>

        {/* ─── RIGHT: Text Content Area ─── */}
        <div className="lg:w-[45%] xl:w-[48%] flex flex-col justify-center px-6 sm:px-10 lg:px-12 xl:px-16 py-8 lg:py-0 relative z-20">
          <div className="max-w-md space-y-7">

            {/* Main heading — large serif, italic accent */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif-luxury text-[2.4rem] sm:text-5xl xl:text-[3.5rem] font-normal text-[#1C1917] leading-[1.1]"
            >
              Luxury Wedding Stories.{' '}
              <em className="not-italic font-serif-luxury italic text-[#8A7968]">Beautifully</em>{' '}
              Captured.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="font-sans text-[14px] sm:text-[15px] text-[#57534E] leading-relaxed"
            >
              Globally recognized photographers crafting wedding stories.
              Worked across <strong className="text-[#1C1917] font-semibold">India, UAE, UK, Europe.</strong>
            </motion.p>

            {/* Book Now CTA — Piixonova signature Rose-Crimson gradient with shine sweep */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <a
                href="#contact"
                className="group relative inline-flex items-center justify-center px-10 py-3.5 bg-gradient-to-r from-[#E64A6E] via-[#E8557B] to-[#D8335B] text-white font-cinzel text-[11px] tracking-[0.25em] uppercase font-bold rounded-full overflow-hidden shadow-[0_8px_25px_rgba(230,74,110,0.32)] hover:shadow-[0_12px_30px_rgba(230,74,110,0.45)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 cursor-pointer"
              >
                {/* Auto shine sweep every 4s */}
                <span className="absolute inset-0 shine-sweep pointer-events-none" />
                {/* Hover shine sweep */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                <span className="relative z-10">Book Now</span>
              </a>
            </motion.div>

            {/* Rating bar — using logo as avatar placeholder */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-[2.5px] border-[#FAF7F2] overflow-hidden shadow-sm bg-[#E8DFD1] flex items-center justify-center">
                    <img src="/logo.png" alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#57534E]">
                <span className="text-[#1C1917] font-semibold">Couples Rated 4.9</span>
                <span className="text-[#C5A059] ml-1">★</span>
                <span className="ml-1 text-[#8A7968]">with 320+ ratings</span>
              </p>
            </motion.div>
          </div>

          {/* Bottom Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 max-w-md">
            {/* Destination card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-white rounded-2xl p-5 border border-[#E8DFD1] shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
              <h3 className="font-cinzel text-[10px] tracking-[0.2em] text-[#1C1917] uppercase font-bold mb-2.5">
                Destination Weddings
              </h3>
              <p className="text-[12px] text-[#57534E] leading-relaxed">
                From Jaipur's palaces to Dubai's shores and London's charm, globally acclaimed for capturing luxury weddings with cinematic artistry.
              </p>
              <a href="#portfolio" className="inline-flex items-center gap-1 mt-3 font-cinzel text-[10px] tracking-[0.15em] text-[#C5A059] uppercase hover:text-[#1C1917] transition-colors group">
                <span>→ See Photos</span>
              </a>
            </motion.div>

            {/* Our Promise card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="bg-white rounded-2xl p-5 border border-[#E8DFD1] shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
              <h3 className="font-cinzel text-[10px] tracking-[0.2em] text-[#1C1917] uppercase font-bold mb-2.5">
                Our Promise ✨
              </h3>
              <p className="text-[12px] text-[#57534E] leading-relaxed">
                Your wedding day is once‑in‑a‑lifetime — we treat it that way. Capturing your story with soul, precision, and timeless craft.
              </p>
              <a href="#films" className="inline-flex items-center gap-1 mt-3 font-cinzel text-[10px] tracking-[0.15em] text-[#C5A059] uppercase hover:text-[#1C1917] transition-colors">
                <span>→ See Films</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
