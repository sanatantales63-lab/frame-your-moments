import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2, VolumeX, Film, ArrowRight, Sparkles, Award } from 'lucide-react';

export default function FeaturedVideoBanner({ onNavigateToVideos }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section id="watch" className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-[#0A0A0A] text-white">
      
      {/* ── Background Video Layer ── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster="/client1.jpg"
          className="w-full h-full object-cover scale-105 filter brightness-[0.78] contrast-[1.05]"
        >
          <source src="/featured_wedding_film.webm" type="video/webm" />
          <source src="/featured_wedding_film.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* ── Layered Luxury Dark & Vignette Overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

      {/* Top & Bottom Soft Blend Gradients */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#0A0A0A] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />

      {/* ── Center Content Box (Matching Drishtikon Architecture) ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center py-16 flex flex-col items-center">
        
        {/* Subtitle Tag with Filigree Accents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
          <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-bold text-[#E2C275]">
            Featured Wedding Film
          </span>
        </motion.div>

        {/* Grand Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.1 }}
          className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.12] mb-5 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
        >
          Your Love. Our Lens. <br />
          <span className="italic text-[#E2C275]">A Cinematic Legacy.</span>
        </motion.h2>

        {/* Gold Center Divider Line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mb-6"
        />

        {/* Emotional Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="font-sans text-sm sm:text-base lg:text-lg text-[#E8DFD1] max-w-2xl leading-relaxed mb-4 font-light drop-shadow-md"
        >
          We don’t just document weddings — we craft emotionally rich, cinematic wedding stories that preserve what words cannot. Real moments. True connection. Forever captured.
        </motion.p>

        {/* Studio Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-cinzel text-xs sm:text-sm text-[#A8A29E] tracking-[0.18em] uppercase mb-8"
        >
          Cinematic Wedding Films & Candid Photography by Frame Your Moments
        </motion.p>

        {/* Action Button & Sound Controller */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {/* Main "Watch Videos" Button (Redirects to Videos Page) */}
          <button
            onClick={onNavigateToVideos}
            className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-full bg-gradient-to-r from-[#E64A6E] via-[#E8557B] to-[#D8335B] text-white font-cinzel text-xs sm:text-sm tracking-[0.2em] uppercase font-bold shadow-[0_8px_30px_rgba(230,74,110,0.45)] hover:shadow-[0_12px_40px_rgba(230,74,110,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Auto shine sweep animation */}
            <div className="absolute inset-0 shine-sweep pointer-events-none opacity-40" />

            <div className="w-6 h-6 rounded-full bg-white text-[#E64A6E] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
              <Play size={11} className="fill-current ml-0.5" />
            </div>
            <span>Watch Videos</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Background Audio Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            className="inline-flex items-center gap-2 px-5 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-cinzel text-[11px] tracking-widest uppercase font-semibold transition-all hover:scale-105 cursor-pointer"
          >
            {isMuted ? (
              <>
                <VolumeX size={16} className="text-[#E2C275]" />
                <span className="hidden sm:inline">Unmute Audio</span>
              </>
            ) : (
              <>
                <Volume2 size={16} className="text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Sound On</span>
              </>
            )}
          </button>
        </motion.div>

      </div>

    </section>
  );
}
