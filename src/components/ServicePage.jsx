import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
} from 'lucide-react';
import {
  getServiceGallery,
  getServiceMeta,
  fetchServiceGalleryFromSupabase,
  getServiceBanner,
  fetchServiceBannerFromSupabase
} from '../data/servicesData';
import Navbar from './Navbar';
import Footer from './Footer';

/* ─── Ornamental divider ─────────────────────────────────────────────────────── */
function OrnamentDivider({ color = '#C5A059' }) {
  return (
    <div className="flex items-center justify-center gap-3 my-5">
      <div className="h-px w-16 sm:w-24" style={{ background: `linear-gradient(to right, transparent, ${color})` }} />
      <div className="flex items-center gap-1.5" style={{ color }}>
        <span className="w-1 h-1 rounded-full" style={{ background: color, opacity: 0.55 }} />
        <div className="w-3 h-3 rotate-45 border flex items-center justify-center" style={{ borderColor: `${color}99` }}>
          <div className="w-1.5 h-1.5" style={{ background: color }} />
        </div>
        <span className="w-1 h-1 rounded-full" style={{ background: color, opacity: 0.55 }} />
      </div>
      <div className="h-px w-16 sm:w-24" style={{ background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  );
}

/* ─── Lightbox ───────────────────────────────────────────────────────────────── */
function Lightbox({ images, activeIndex, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  if (activeIndex === null || !images[activeIndex]) return null;
  const img = images[activeIndex];

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ background: 'rgba(8,8,8,0.96)' }}
        onClick={onClose}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}
        >
          <X size={18} className="text-white/70" />
        </button>

        {/* Counter */}
        <div
          className="absolute top-5 left-1/2 -translate-x-1/2 z-10 px-5 py-2 rounded-full font-cinzel text-[10px] tracking-[0.28em] uppercase text-white/40"
        >
          {activeIndex + 1} / {images.length}
        </div>

        {/* Prev */}
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 sm:left-8 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)' }}
        >
          <ChevronLeft size={20} className="text-white/70" />
        </button>

        {/* Image */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[88vw] max-h-[88vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={img.src}
            alt={img.caption || `Photo ${activeIndex + 1}`}
            className="max-w-full max-h-[88vh] object-contain rounded-lg"
            style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}
          />
        </motion.div>

        {/* Next */}
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 sm:right-8 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)' }}
        >
          <ChevronRight size={20} className="text-white/70" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Heights pattern for masonry feel ────────────────────────────────────────── */
const MASONRY_HEIGHTS = [
  '280px', '340px', '260px', '380px',
  '320px', '260px', '360px', '300px',
  '350px', '280px', '310px', '370px',
  '260px', '340px', '290px', '330px',
];

/* ─── Gallery card ───────────────────────────────────────────────────────────── */
function GalleryCard({ image, index, onClick, accentColor }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const height = MASONRY_HEIGHTS[index % MASONRY_HEIGHTS.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(index)}
      className="group relative overflow-hidden rounded-xl cursor-pointer w-full mb-2.5 sm:mb-3"
      style={{ height }}
    >
      <img
        src={image.src}
        alt={`Photo ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />

      {/* Hover overlay — clean zoom icon */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{ background: 'rgba(0,0,0,0.28)' }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300"
          style={{ background: `${accentColor}dd`, backdropFilter: 'blur(4px)' }}
        >
          <ZoomIn size={15} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────────── */
export default function ServicePage({ slug, onBackToHome, onNavigateToVideos }) {
  const meta = getServiceMeta(slug);
  const [gallery, setGallery] = useState([]);
  const [bannerImage, setBannerImage] = useState(() => getServiceBanner(slug) || meta?.bannerImage || '');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    setGallery(getServiceGallery(slug));
    setBannerImage(getServiceBanner(slug) || meta?.bannerImage || '');
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Fetch dynamic banner from Supabase
    fetchServiceBannerFromSupabase(slug).then((res) => {
      if (res && res.url) {
        setBannerImage(res.url);
      }
    });

    // Fetch gallery photos from Supabase
    fetchServiceGalleryFromSupabase(slug).then((data) => {
      if (data && data.length > 0) setGallery(data);
    });
  }, [slug]);

  const openLightbox = useCallback((idx) => setLightboxIndex(idx), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() =>
    setLightboxIndex((i) => (i > 0 ? i - 1 : gallery.length - 1)), [gallery.length]);
  const nextImage = useCallback(() =>
    setLightboxIndex((i) => (i < gallery.length - 1 ? i + 1 : 0)), [gallery.length]);

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <p className="font-serif-luxury text-3xl text-[#1C1917] mb-4">Service not found</p>
          <button
            onClick={onBackToHome}
            className="font-cinzel text-[11px] tracking-widest uppercase text-[#C5A059] hover:underline cursor-pointer"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const accent = meta.accentColor;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] overflow-x-hidden">
      {/* Navbar */}
      <Navbar onNavigateToVideos={onNavigateToVideos} />

      {/* ════════════ HERO BANNER ════════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: 'clamp(520px, 90vh, 760px)' }}
      >
        {/* Background image */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        >
          {bannerImage ? (
            <img
              src={bannerImage}
              alt={meta.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: 'radial-gradient(ellipse 80% 80% at 50% 40%, #2A2421 0%, #151311 60%, #0B0A09 100%)',
              }}
            />
          )}
        </motion.div>

        {/* ── Cinematic vignette layered overlays ── */}
        {/* 1. Radial vignette — dark edges, lighter center */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 75% at 50% 50%, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.82) 100%)',
          }}
        />
        {/* 2. Strong top gradient — navbar area darkened */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />
        {/* 3. Side edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30" />
        {/* 4. Accent color bottom wash */}
        <div
          className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${accent}20, transparent)` }}
        />

        {/* Back button */}
        <motion.button
          onClick={onBackToHome}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="absolute top-[86px] left-6 sm:left-10 z-20 flex items-center gap-2.5 group cursor-pointer"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <ArrowLeft size={14} className="text-white group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="font-cinzel text-[9px] tracking-[0.3em] uppercase text-white/55 group-hover:text-white/80 transition-colors">
            Back
          </span>
        </motion.button>

        {/* ── Hero text — centered, minimal ── */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          {/* Studio label */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="font-cinzel text-[10px] tracking-[0.4em] uppercase mb-5"
            style={{ color: `${accent}cc` }}
          >
            Frame Your Moments
          </motion.p>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif-luxury font-light text-white leading-none"
            style={{ fontSize: 'clamp(3.2rem, 10vw, 8rem)' }}
          >
            {meta.title}
          </motion.h1>

          {/* Subtitle in accent */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif-luxury italic font-light mt-1"
            style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)', color: accent }}
          >
            {meta.subtitle}
          </motion.p>

          {/* Thin ornament line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.85 }}
            className="flex items-center gap-3 mt-7"
          >
            <div className="h-px w-14 sm:w-24" style={{ background: `linear-gradient(to right, transparent, ${accent}99)` }} />
            <div className="w-1.5 h-1.5 rotate-45 border" style={{ borderColor: `${accent}99` }} />
            <div className="h-px w-14 sm:w-24" style={{ background: `linear-gradient(to left, transparent, ${accent}99)` }} />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="font-serif-luxury italic text-white/60 mt-5 max-w-lg leading-relaxed"
            style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)' }}
          >
            {meta.tagline}
          </motion.p>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
          <motion.div
            className="w-1 h-1 rounded-full"
            style={{ background: `${accent}99` }}
            animate={{ y: [0, 5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {/* ════════════ DESCRIPTION ════════════ */}
      <section className="w-full py-16 sm:py-20 bg-[#FAF7F2]">
        <div className="max-w-[800px] mx-auto px-6 sm:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <OrnamentDivider color={accent} />
            <p className="font-sans text-[#6B6458] leading-[1.85] text-[15px] sm:text-[16px] mt-6">
              {meta.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════════ GALLERY ════════════ */}
      <section className="w-full pb-24 sm:pb-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">

          {/* Gallery heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10 sm:mb-14"
          >
            <p
              className="font-cinzel text-[9px] tracking-[0.4em] uppercase mb-4"
              style={{ color: accent }}
            >
              Our Portfolio
            </p>
            <h2
              className="font-serif-luxury font-light text-[#1C1917] leading-tight"
              style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3.2rem)' }}
            >
              {meta.title} Gallery
            </h2>
            <OrnamentDivider color={accent} />
          </motion.div>

          {/* Grid — 2 col mobile, 3–4 col desktop */}
          {gallery.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif-luxury text-2xl text-[#8A7968] mb-2">Gallery Coming Soon</p>
              <p className="font-cinzel text-[9px] tracking-widest uppercase text-[#B0A898]">
                Owner can add photos from the admin panel
              </p>
            </div>
          ) : (
            <>
              {/* Masonry columns — 2 col mobile, 3 col md, 4 col lg */}
              <style dangerouslySetInnerHTML={{ __html: `
                .fym-masonry { columns: 2; column-gap: 10px; }
                @media (min-width: 768px) { .fym-masonry { columns: 3; column-gap: 12px; } }
                @media (min-width: 1024px) { .fym-masonry { columns: 4; column-gap: 14px; } }
              ` }} />
              <div className="fym-masonry">
                {gallery.map((image, index) => (
                  <GalleryCard
                    key={image.id || index}
                    image={image}
                    index={index}
                    onClick={openLightbox}
                    accentColor={accent}
                  />
                ))}
              </div>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="text-center mt-16 sm:mt-20"
              >
                <p className="font-serif-luxury text-[#1C1917] text-2xl sm:text-3xl font-light mb-2">
                  Interested in a Session?
                </p>
                <p className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-[#8A7968] mb-7">
                  Let's create something timeless together
                </p>
                <button
                  onClick={() => {
                    onBackToHome();
                    setTimeout(() => {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }, 400);
                  }}
                  className="inline-flex items-center gap-2.5 px-9 py-3.5 rounded-full font-cinzel text-[11px] tracking-[0.22em] uppercase font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${accent}f0, ${accent}a0)`,
                    boxShadow: `0 10px 30px ${accent}38`,
                  }}
                >
                  Book Now
                </button>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer onNavigateToVideos={onNavigateToVideos} />

      {/* Lightbox */}
      <Lightbox
        images={gallery}
        activeIndex={lightboxIndex}
        onClose={closeLightbox}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </div>
  );
}
