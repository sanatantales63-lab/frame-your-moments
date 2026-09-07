import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, X, Heart, MessageCircleHeart } from 'lucide-react';
import { getTestimonials, DEFAULT_TESTIMONIALS } from '../data/testimonialsData';
/* ── Custom CSS for Watermark & Stroke Typography ── */
const testimonialsCSS = `
.watermark-text-stroke {
  -webkit-text-stroke: 1.5px rgba(197, 160, 89, 0.12);
  color: transparent;
}
.testimonial-scroll-container {
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}
.testimonial-scroll-container::-webkit-scrollbar {
  display: none;
}
`;

export default function Testimonials() {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  /* State for Admin edit compatibility + Modal viewer */
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [activeStory, setActiveStory] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /* Load from Supabase + localStorage */
  useEffect(() => {
    getTestimonials().then((items) => {
      if (Array.isArray(items) && items.length > 0) {
        setTestimonials(items);
      }
    });
  }, []);

  /* Mobile/Desktop scroll controls */
  const scrollToCard = (index) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cards = container.children;
    if (cards[index]) {
      const card = cards[index];
      const scrollLeft = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollCenter = container.scrollLeft + container.offsetWidth / 2;
    const cards = container.children;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < cards.length; i++) {
      const cardCenter = cards[i].offsetLeft + cards[i].offsetWidth / 2;
      const dist = Math.abs(scrollCenter - cardCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    }
    setActiveIndex(closest);
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative w-full pt-8 sm:pt-12 pb-10 sm:pb-12 bg-[#FAF7F2] overflow-hidden border-t border-[#E8DFD1]/60 scroll-mt-10"
    >
      <div id="stories" className="absolute -top-10" aria-hidden="true" />
      <style dangerouslySetInnerHTML={{ __html: testimonialsCSS }} />

      {/* ── GIANT BACKGROUND WATERMARK TYPOGRAPHY ── */}
      <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-serif-luxury text-[7rem] sm:text-[12rem] lg:text-[16rem] font-bold tracking-widest uppercase watermark-text-stroke whitespace-nowrap opacity-60">
          SUCCESS STORIES
        </span>
      </div>

      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#C5A059]/[0.05] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#E64A6E]/[0.04] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10 w-full">

        {/* ══════════ SECTION HEADER (Consistent with Services & Pricing) ══════════ */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
          {/* Royal Fine-Art Line Divider */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-4 flex items-center justify-center gap-3"
          >
            <div className="w-20 sm:w-32 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-[#C5A059]/80" />
            <div className="flex items-center gap-2 text-[#C5A059]">
              <span className="w-1 h-1 rounded-full bg-[#C5A059]/60" />
              <div className="w-3.5 h-3.5 rotate-45 border border-[#C5A059] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#C5A059]" />
              </div>
              <span className="w-1 h-1 rounded-full bg-[#C5A059]/60" />
            </div>
            <div className="w-20 sm:w-32 h-[1px] bg-gradient-to-l from-transparent via-[#C5A059]/40 to-[#C5A059]/80" />
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-serif-luxury text-5xl sm:text-6xl md:text-7xl italic text-[#1C1917] font-light mb-4"
          >
            Stories of Love
          </motion.h2>

          {/* Colored Dots (Rose, Gold, Neutral) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-2 mb-6"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#E64A6E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#1C1917]/15" />
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="font-sans text-[#57534E] max-w-xl leading-relaxed text-sm sm:text-base"
          >
            Real couples, timeless memories. Read how we transformed their special days into cherished heirlooms.
          </motion.p>
        </div>

        {/* ══════════ CAROUSEL CONTAINER (Mobile + Desktop Responsive) ══════════ */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={() => scrollToCard(Math.max(0, activeIndex - 1))}
            className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#E8DFD1] text-[#1C1917] flex items-center justify-center hover:bg-[#C5A059] hover:text-white hover:border-[#C5A059] transition-all shadow-lg cursor-pointer"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollToCard(Math.min(testimonials.length - 1, activeIndex + 1))}
            className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#E8DFD1] text-[#1C1917] flex items-center justify-center hover:bg-[#C5A059] hover:text-white hover:border-[#C5A059] transition-all shadow-lg cursor-pointer"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>

          {/* Cards Scroll Track */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            data-lenis-prevent
            className="testimonial-scroll-container flex gap-6 overflow-x-auto snap-x snap-mandatory pt-4 pb-6 px-4"
          >
            {testimonials.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: 0.15 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex-shrink-0 w-[88vw] sm:w-[500px] lg:w-[540px] snap-center"
              >
                {/* ── Testimonial Card Design (Inspired by reference screenshot) ── */}
                <div className="relative bg-white rounded-[28px] p-6 sm:p-8 border border-[#E8DFD1] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(197,160,89,0.12)] transition-all duration-500 flex flex-col sm:flex-row gap-6 items-stretch overflow-hidden group">
                  
                  {/* WATERMARK GIANT QUOTE SYMBOL BEHIND CARD CONTENT */}
                  <div className="absolute right-4 bottom-2 text-[#F5EFE6] select-none pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:text-[#F3EAD9]">
                    <span className="font-serif-luxury text-[9rem] sm:text-[11rem] leading-none font-bold italic opacity-75">
                      “
                    </span>
                  </div>

                  {/* Left Column: Portrait Couple Photo */}
                  <div className="w-full sm:w-44 h-56 sm:h-auto rounded-2xl overflow-hidden flex-shrink-0 relative border border-[#E8DFD1]/60 shadow-sm">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#C5A059]/20 to-[#E64A6E]/10 flex items-center justify-center">
                        <span className="font-serif-luxury text-3xl text-[#C5A059]/60">{item.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:hidden" />
                    <span className="absolute bottom-3 left-3 sm:hidden font-cinzel text-[10px] text-white font-semibold tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      {item.event}
                    </span>
                  </div>

                  {/* Right Column: Details & Quote */}
                  <div className="flex-1 flex flex-col justify-between relative z-10">
                    <div>
                      {/* Top Header: Name, Location & Star Rating */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-serif-luxury text-2xl sm:text-[1.6rem] text-[#1C1917] font-semibold leading-snug">
                            {item.name}
                          </h3>
                          <p className="font-sans text-xs text-[#8A7968]">
                            {item.location}
                          </p>
                        </div>

                        {/* Rating Badge */}
                        <div className="flex items-center gap-1 bg-[#FAF7F2] border border-[#E8DFD1] px-2.5 py-1 rounded-full shadow-2xs">
                          <span className="font-sans text-xs font-bold text-[#1C1917]">
                            {item.rating}.0
                          </span>
                          <Star size={12} className="text-[#C5A059] fill-[#C5A059]" />
                        </div>
                      </div>

                      {/* Event Tag (Desktop) */}
                      <span className="hidden sm:inline-block font-cinzel text-[9px] tracking-[0.2em] uppercase text-[#C5A059] font-bold mb-3">
                        ✦ {item.event}
                      </span>

                      {/* Short Quote */}
                      <p className="font-sans text-xs sm:text-sm text-[#57534E] leading-relaxed mt-2 line-clamp-4">
                        "{item.quote}"
                      </p>
                    </div>

                    {/* Read Full Story Button */}
                    <div className="pt-4 border-t border-[#E8DFD1]/60 mt-4 flex items-center justify-between">
                      <button
                        onClick={() => setActiveStory(item)}
                        className="font-cinzel text-[10px] tracking-[0.18em] uppercase text-[#1C1917] font-bold hover:text-[#E64A6E] transition-colors flex items-center gap-1.5 cursor-pointer group/btn"
                      >
                        <span>Read Full Story</span>
                        <span className="text-[#C5A059] group-hover/btn:translate-x-1 transition-transform">→</span>
                      </button>

                      <Heart size={14} className="text-[#E64A6E]/40 fill-[#E64A6E]/20" />
                    </div>

                  </div>

                </div>
              </motion.div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2.5 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToCard(i)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeIndex === i
                    ? 'w-7 h-2.5 bg-[#C5A059]'
                    : 'w-2.5 h-2.5 bg-[#E8DFD1] hover:bg-[#C5A059]/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* ══════════ STORY MODAL POPUP ══════════ */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveStory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAF7F2] text-[#1C1917] max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl relative p-6 sm:p-8 border border-[#E8DFD1]"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveStory(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1C1917] text-white flex items-center justify-center hover:bg-[#E64A6E] transition-colors cursor-pointer z-20"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-full sm:w-48 aspect-[3/4] rounded-2xl overflow-hidden flex-shrink-0 border border-[#E8DFD1]">
                  {activeStory.image ? (
                    <img src={activeStory.image} alt={activeStory.name} className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#C5A059]/20 to-[#E64A6E]/10 flex items-center justify-center">
                      <span className="font-serif-luxury text-5xl text-[#C5A059]/60">{activeStory.name.charAt(0)}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-1 text-[#C5A059]">
                    {[...Array(activeStory.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-current" />
                    ))}
                  </div>

                  <h3 className="font-serif-luxury text-3xl text-[#1C1917]">
                    {activeStory.name}
                  </h3>
                  <p className="font-cinzel text-xs text-[#C5A059] tracking-wider uppercase font-semibold">
                    {activeStory.location} • {activeStory.event}
                  </p>

                  <div className="h-[1px] bg-[#E8DFD1] my-2" />

                  <p className="font-sans text-sm text-[#57534E] leading-relaxed italic">
                    "{activeStory.quote}"
                  </p>

                  {activeStory.fullStory && (
                    <p className="font-sans text-xs text-[#1C1917]/80 leading-relaxed pt-2">
                      {activeStory.fullStory}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
