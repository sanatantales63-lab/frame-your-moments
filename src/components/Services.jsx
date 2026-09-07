import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, ChevronRight, ChevronLeft, Flame, ArrowRight, Camera, Sparkles } from 'lucide-react';
import { getServiceBanner, fetchAllServiceBannersFromSupabase } from '../data/servicesData';

const services = [
  {
    id: 1,
    slug: 'wedding',
    title: 'Premium Wedding',
    desc: 'Premium wedding coverage.',
    image: '',
    isHot: true,
  },
  {
    id: 2,
    slug: 'engagement',
    title: 'Engagement Sessions',
    desc: 'Intimate engagement shoots.',
    image: '',
  },
  {
    id: 3,
    slug: 'pre-wedding',
    title: 'Pre-wedding Photography',
    desc: 'Romantic pre-wedding sessions.',
    image: '',
  },
  {
    id: 4,
    slug: 'event',
    title: 'Event Photography',
    desc: 'Elegant event/personal shoot.',
    image: '',
  },
];

/* ── CSS-only animated grid background ── */
const gridCSS = `
@keyframes gridScrollY {
  from { transform: translateY(0); }
  to   { transform: translateY(80px); }
}
@keyframes gridScrollX {
  from { transform: translateX(0); }
  to   { transform: translateX(80px); }
}
@keyframes shimmerLine {
  0%   { opacity: 0.03; }
  50%  { opacity: 0.12; }
  100% { opacity: 0.03; }
}
.grid-lines-vertical {
  position: absolute;
  inset: -80px;
  width: calc(100% + 160px);
  height: calc(100% + 160px);
  background-image: repeating-linear-gradient(
    90deg,
    rgba(197, 160, 89, 0.07) 0px,
    rgba(197, 160, 89, 0.07) 1px,
    transparent 1px,
    transparent 80px
  );
  animation: gridScrollX 6s linear infinite;
  pointer-events: none;
}
.grid-lines-horizontal {
  position: absolute;
  inset: -80px;
  width: calc(100% + 160px);
  height: calc(100% + 160px);
  background-image: repeating-linear-gradient(
    0deg,
    rgba(197, 160, 89, 0.07) 0px,
    rgba(197, 160, 89, 0.07) 1px,
    transparent 1px,
    transparent 80px
  );
  animation: gridScrollY 6s linear infinite;
  pointer-events: none;
}
.grid-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(197,160,89,0.06) 0%, transparent 70%);
  pointer-events: none;
}
.grid-shimmer-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(197,160,89,0.25) 30%, rgba(230,74,110,0.15) 70%, transparent 100%);
  animation: shimmerLine 4s ease-in-out infinite;
  pointer-events: none;
}
`;

export default function Services({ onNavigateToService }) {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [serviceBanners, setServiceBanners] = useState(() => ({
    'wedding': getServiceBanner('wedding'),
    'engagement': getServiceBanner('engagement'),
    'pre-wedding': getServiceBanner('pre-wedding'),
    'event': getServiceBanner('event')
  }));

  useEffect(() => {
    fetchAllServiceBannersFromSupabase().then((banners) => {
      if (banners && Object.keys(banners).length > 0) {
        const updated = {};
        Object.keys(banners).forEach((slug) => {
          updated[slug] = banners[slug]?.url || '';
        });
        setServiceBanners((prev) => ({ ...prev, ...updated }));
      }
    });
  }, []);

  const scrollCards = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 340;
    scrollContainerRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full py-24 sm:py-32 bg-[#0A0A0A] text-white overflow-hidden scroll-mt-10"
    >
      <div id="films" className="absolute -top-10" aria-hidden="true" />
      {/* Inject grid animation CSS */}
      <style dangerouslySetInnerHTML={{ __html: gridCSS }} />

      {/* ── Animated Grid Background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="grid-lines-vertical" />
        <div className="grid-lines-horizontal" />
        <div className="grid-glow" />
        {/* Moving shimmer accent lines */}
        <div className="grid-shimmer-line" style={{ top: '25%' }} />
        <div className="grid-shimmer-line" style={{ top: '55%', animationDelay: '2s' }} />
        <div className="grid-shimmer-line" style={{ top: '80%', animationDelay: '3.5s' }} />
      </div>

      {/* ── Subtle edge vignettes ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A] opacity-60 pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10 w-full">

        {/* ══════════ SECTION HEADER ══════════ */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          {/* Traditional Royal Fine-Art Line Divider */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center justify-center gap-3"
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
            className="font-serif-luxury text-5xl sm:text-6xl md:text-7xl italic text-white font-light mb-4"
          >
            Our Services
          </motion.h2>

          {/* Colored Dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-2 mb-6"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#E64A6E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/25" />
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="font-sans text-[#A8A29E] max-w-xl leading-relaxed text-sm sm:text-base"
          >
            From intimate pre-wedding shoots to grand wedding celebrations, we offer
            comprehensive photography services tailored to your needs
          </motion.p>
        </div>

        {/* ══════════ SERVICE CARDS ══════════ */}
        {/* Desktop: 4 columns grid | Mobile: horizontal scroll */}
        <div className="relative">
          {/* Mobile Nav Arrows */}
          <button
            onClick={() => scrollCards('left')}
            className="absolute -left-2 sm:left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-[#C5A059] hover:border-[#C5A059] transition-all cursor-pointer lg:hidden"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollCards('right')}
            className="absolute -right-2 sm:right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-[#C5A059] hover:border-[#C5A059] transition-all cursor-pointer lg:hidden"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>

          {/* Cards Container */}
          <div
            ref={scrollContainerRef}
            data-lenis-prevent
            className="flex lg:grid lg:grid-cols-4 gap-5 sm:gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-none pb-2 lg:pb-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {services.map((service, index) => {
              const cardImage = serviceBanners[service.slug] || service.image;

              return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 45, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.85, delay: 0.15 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => onNavigateToService && onNavigateToService(service.slug)}
                className="group relative flex-shrink-0 w-[280px] sm:w-[300px] lg:w-auto h-[460px] sm:h-[500px] lg:h-[540px] rounded-[28px] overflow-hidden cursor-pointer snap-center border border-white/[0.06] hover:border-white/[0.15] transition-all duration-500"
              >
                {/* Card Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1612] to-[#0A0A0A]">
                  {cardImage && (
                    <img
                      src={cardImage}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                      draggable={false}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10 group-hover:from-black/85 group-hover:via-black/25 transition-all duration-500" />

                {/* Subtle film grain texture overlay */}
                <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")' }} />

                {/* ── Top Row: HOT badge + Arrow ── */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                  {service.isHot ? (
                    <div className="bg-gradient-to-r from-red-500/90 to-orange-500/80 backdrop-blur-md border border-red-400/30 text-white px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] font-bold tracking-wider shadow-lg shadow-red-500/20">
                      <Flame size={13} className="fill-current text-yellow-300" />
                      HOT
                    </div>
                  ) : (
                    <div />
                  )}
                  {service.isHot && (
                    <div className="w-9 h-9 rounded-full bg-[#C5A059]/80 backdrop-blur-md flex items-center justify-center text-white shadow-lg group-hover:bg-[#C5A059] transition-colors">
                      <ArrowUpRight size={16} />
                    </div>
                  )}
                </div>

                {/* ── Bottom Content Area ── */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex flex-col z-20">
                  <div className="flex justify-between items-end gap-3 mb-5">
                    <div>
                      <h3 className="font-serif-luxury text-[1.6rem] sm:text-[1.8rem] text-white leading-tight mb-1.5 drop-shadow-md">
                        {service.title}
                      </h3>
                      <p className="font-sans text-white/60 text-[13px]">
                        {service.desc}
                      </p>
                    </div>
                    {/* Circular Nav Arrow */}
                    <div className="w-11 h-11 rounded-full border border-white/20 flex-shrink-0 flex items-center justify-center bg-white/[0.05] backdrop-blur-sm group-hover:bg-[#C5A059] group-hover:border-[#C5A059] transition-all duration-300 shadow-lg">
                      <ChevronRight size={20} className="text-white group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* SEE PHOTOS CTA */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 group-hover:border-white/20 transition-colors">
                    <span className="font-cinzel text-[11px] tracking-[0.2em] uppercase text-[#C5A059] group-hover:text-white transition-colors font-semibold">
                      VIEW GALLERY
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#C5A059]/10 flex items-center justify-center group-hover:bg-[#C5A059]/30 transition-colors">
                      <ArrowRight size={14} className="text-[#C5A059] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>

      </div>
    </section>
  );
}
