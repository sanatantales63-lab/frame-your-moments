import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Award, Compass, Heart, ShieldCheck, ArrowUpRight, X } from 'lucide-react';
import { getAboutPhotos } from '../data/siteMediaData';

const ethosData = [
  {
    id: 'art',
    num: '01',
    title: 'Fine Art Aesthetics',
    short: 'Color-graded like museum oil paintings.',
    description: 'We blend royal golden lighting with soft editorial tones so every portrait looks like an timeless masterpiece hanging in a luxury gallery.'
  },
  {
    id: 'emotion',
    num: '02',
    title: 'Unscripted Emotions',
    short: 'No stiff poses. Only pure human warmth.',
    description: 'The real magic happens between the shots — the unscripted laughs during Haldi, the proud tear of a father, and the silent hand-squeeze.'
  },
  {
    id: 'legacy',
    num: '03',
    title: 'Eternal Heritage',
    short: 'Crafted to be cherished for generations.',
    description: 'Your wedding album is not just a digital file; it is a family heirloom designed to evoke the exact same chills 50 years from today.'
  }
];

export default function About() {
  const [activeEthos, setActiveEthos] = useState('art');
  const [videoOpen, setVideoOpen] = useState(false);
  const [aboutPhotos, setAboutPhotos] = useState({
    about_main: '',
    about_detail: '',
    about_founder: ''
  });

  useEffect(() => {
    getAboutPhotos().then((data) => {
      if (data) setAboutPhotos(data);
    });
  }, []);

  const selectedEthos = ethosData.find((e) => e.id === activeEthos) || ethosData[0];

  return (
    <section id="about" className="relative w-full bg-[#FAF7F2] py-24 sm:py-32 px-6 sm:px-12 overflow-hidden border-t border-[#E8DFD1]/60">
      
      {/* ── Dreamy Background Haze / Foggy Gradients (Matching Hero) ── */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#E64A6E]/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── Top Infinity Marquee Ticker Ribbon (Rose-Crimson Gradient with Shine Sweep & Luxury Borders) ── */}
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#E64A6E] via-[#E8557B] to-[#D8335B] text-white py-3.5 -mx-6 sm:-mx-12 mb-20 shadow-[0_10px_30px_rgba(230,74,110,0.25)] border-y border-white/20">
        
        {/* Shine Sweep Animation Layer across Ticker Ribbon */}
        <div className="absolute inset-0 shine-sweep pointer-events-none opacity-80" />

        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
          className="flex whitespace-nowrap relative z-10"
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-6 font-cinzel text-[10px] sm:text-xs tracking-[0.35em] uppercase font-bold text-white drop-shadow-sm">
              <span>✦ THE ART OF FREEZING TIME</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
              <span>ROYAL INDIAN WEDDINGS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
              <span>FINE ART CINEMATOGRAPHY</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
              <span>GLOBAL DESTINATIONS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ── LEFT COLUMN: Editorial Storytelling & Interactive Ethos ── */}
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-8"
          >
            
            {/* Bespoke Editorial Luxury Section Indicator */}
            <div className="flex items-center gap-3 font-cinzel text-[11px] tracking-[0.35em] text-[#E64A6E] uppercase font-bold">
              <span className="h-[1.5px] w-10 bg-gradient-to-r from-[#E64A6E] to-[#C5A059]" />
              <span>02 • OUR STORY & PHILOSOPHY</span>
            </div>

            {/* Main Headline */}
            <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-[#1C1917] leading-[1.12]">
              We don't just take pictures.{' '}
              <em className="font-serif-luxury italic text-[#8A7968]">We preserve the soul</em> of your story.
            </h2>

            {/* Description */}
            <p className="font-sans text-sm sm:text-base text-[#57534E] leading-relaxed">
              Founded with a passion for royal heritage and fine-art portraiture, Frame Your Moments (FYM) has spent over a decade documenting India’s most breathtaking weddings. Beyond staged poses and camera lights, we look for the unscripted poetry—the quiet tear, the joyful belly laugh, and the sacred rituals.
            </p>

            {/* Interactive Ethos Tabs (01, 02, 03) */}
            <div className="space-y-4 pt-4 border-t border-[#E8DFD1]">
              <span className="font-cinzel text-[10px] tracking-[0.25em] text-[#8A7968] uppercase block font-semibold">
                OUR THREE PILLARS OF CRAFT:
              </span>

              <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#F5EFE6] rounded-2xl border border-[#E8DFD1]">
                {ethosData.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setActiveEthos(e.id)}
                    className={`py-2.5 px-3 rounded-xl font-cinzel text-[10px] sm:text-xs tracking-wider uppercase font-bold transition-all duration-300 cursor-pointer ${
                      activeEthos === e.id
                        ? 'bg-gradient-to-r from-[#E64A6E] to-[#D8335B] text-white shadow-md'
                        : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#E8DFD1]/50'
                    }`}
                  >
                    {e.num}. {e.title.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Dynamic Ethos Box */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedEthos.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="p-6 rounded-2xl bg-white border border-[#E8DFD1] shadow-sm space-y-2 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel text-xs text-[#E64A6E] font-bold tracking-widest">
                      PILLAR {selectedEthos.num} — {selectedEthos.title}
                    </span>
                    <span className="text-[11px] font-serif-luxury italic text-[#8A7968]">
                      FYM Fine Art Standard
                    </span>
                  </div>
                  <p className="font-sans text-sm text-[#1C1917] font-medium pt-1">
                    {selectedEthos.short}
                  </p>
                  <p className="font-sans text-xs text-[#57534E] leading-relaxed">
                    {selectedEthos.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Founder Note & Film Reel CTA */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-4">
              {/* Founder signature info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#E64A6E] overflow-hidden bg-[#F5EFE6] flex items-center justify-center">
                  {aboutPhotos.about_founder ? (
                    <img
                      src={aboutPhotos.about_founder}
                      alt="Lead Photographer"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="font-serif-luxury text-lg text-[#E64A6E] font-bold">R</span>
                  )}
                </div>
                <div>
                  <h4 className="font-serif-luxury text-lg font-bold text-[#1C1917] leading-none">
                    Rishav & Team
                  </h4>
                  <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase text-[#8A7968]">
                    Founders & Lead Artists
                  </span>
                </div>
              </div>

              {/* Watch Showreel Button with Shine Sweep */}
              <button
                onClick={() => setVideoOpen(true)}
                className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-[#E64A6E] via-[#E8557B] to-[#D8335B] text-white font-cinzel text-[10px] tracking-[0.2em] uppercase font-bold rounded-full overflow-hidden shadow-[0_6px_20px_rgba(230,74,110,0.3)] hover:shadow-[0_8px_25px_rgba(230,74,110,0.45)] hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <span className="absolute inset-0 shine-sweep pointer-events-none" />
                <Play size={13} className="text-white relative z-10 fill-current" />
                <span className="relative z-10">Watch Studio Trailer</span>
              </button>
            </div>

          </motion.div>

          {/* ── RIGHT COLUMN: Dreamy Layered Photo Collage (Hero Haze Matching) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 35, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            
            {/* Main Arch Frame Photo */}
            <div className="relative w-full max-w-md aspect-[3/4] rounded-t-[140px] sm:rounded-t-[180px] rounded-b-2xl overflow-hidden border border-[#E8DFD1] shadow-2xl bg-[#F5EFE6]">
              {aboutPhotos.about_main ? (
                <img
                  src={aboutPhotos.about_main}
                  alt="FYM Wedding Story"
                  className="w-full h-full object-cover filter brightness-[0.96] hover:scale-105 transition-transform duration-1000"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-[#E8DFD1]/50 to-[#FAF7F2] flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 rounded-full border border-[#C5A059]/40 flex items-center justify-center mb-4 bg-white/40">
                    <span className="font-serif-luxury text-2xl text-[#C5A059]">✦</span>
                  </div>
                  <span className="font-cinzel text-xs text-[#8A7968] tracking-widest uppercase font-semibold">Fine Art Legacy</span>
                </div>
              )}

              {/* ✨ Dreamy Cloudy Overlays Top & Bottom (Matching Hero) */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FAF7F2] via-[#FAF7F2]/60 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/80 to-transparent pointer-events-none" />

              {/* Floating Pill Tag inside image */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/85 backdrop-blur-md border border-[#E8DFD1] shadow-lg">
                <p className="font-serif-luxury italic text-sm text-[#1C1917] text-center">
                  "Every shutter click becomes an eternal royal heirloom."
                </p>
              </div>
            </div>

            {/* Overlapping Floating Secondary Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-6 -left-2 sm:left-4 w-44 sm:w-52 aspect-[3/4] rounded-2xl overflow-hidden border-4 border-[#FAF7F2] shadow-2xl hidden sm:block bg-[#F5EFE6]"
            >
              {aboutPhotos.about_detail ? (
                <img
                  src={aboutPhotos.about_detail}
                  alt="Fine Art Bridal Detail"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1C1917]/90 to-[#2A241F] flex items-center justify-center p-4 text-center">
                  <span className="font-cinzel text-[10px] tracking-widest text-[#E2C275] uppercase">Craft & Detail</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 font-cinzel text-[9px] tracking-widest uppercase text-white font-semibold text-center">
                Henna & Details
              </span>
            </motion.div>

            {/* Floating Medal Badge (Matching Rose-Crimson Gradient with Shine Sweep) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
              className="absolute -top-6 -right-2 sm:right-4 w-28 h-28 rounded-full bg-gradient-to-r from-[#E64A6E] via-[#E8557B] to-[#D8335B] p-[2px] shadow-2xl hidden sm:block"
            >
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#E64A6E] via-[#E8557B] to-[#D8335B] overflow-hidden flex flex-col items-center justify-center p-2 text-center text-white border border-white/30">
                <span className="absolute inset-0 shine-sweep pointer-events-none opacity-80" />
                <Award size={18} className="text-white mb-1 drop-shadow-sm relative z-10" />
                <span className="font-cinzel text-[8px] tracking-widest text-white uppercase font-bold leading-tight relative z-10">
                  ESTD • 2016
                </span>
                <span className="font-cinzel text-[7px] text-white/90 tracking-widest uppercase relative z-10">
                  10+ YRS CRAFT
                </span>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>

      {/* ── Studio Showreel Video Modal ── */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAF7F2] text-[#1C1917] max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl relative p-6 sm:p-10 space-y-6 text-center"
            >
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#1C1917] text-white flex items-center justify-center hover:bg-[#E64A6E] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center justify-center gap-3 font-cinzel text-[11px] tracking-[0.3em] text-[#E64A6E] uppercase font-bold">
                <span className="h-[1.5px] w-8 bg-[#E64A6E]" />
                <span>FYM CINEMATIC SHOWREEL</span>
                <span className="h-[1.5px] w-8 bg-[#E64A6E]" />
              </div>

              <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] leading-snug font-light">
                "Experience the magic of Frame Your Moments in motion."
              </h3>

              {/* Showreel Video Container */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-inner flex items-center justify-center">
                <img src="/hero2.jpg" alt="Showreel Cover" className="w-full h-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                <div className="relative z-10 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#E64A6E] text-white flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                    <Play size={24} className="fill-current ml-1" />
                  </div>
                  <p className="font-cinzel text-xs text-white tracking-widest uppercase">
                    Playing FYM Highlight Reel
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <a
                  href="#contact"
                  onClick={() => setVideoOpen(false)}
                  className="px-8 py-3 bg-gradient-to-r from-[#E64A6E] via-[#E8557B] to-[#D8335B] text-white font-cinzel text-xs tracking-[0.2em] uppercase font-bold rounded-full shadow-lg hover:scale-105 transition-all"
                >
                  Book Your Wedding Dates
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
