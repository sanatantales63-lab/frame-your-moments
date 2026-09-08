import React from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Heart,
  ArrowUp,
  Camera,
  Film,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { smoothScrollTo } from '../utils/smoothScroll';

export default function Footer({ onNavigateToVideos, onNavigateToAdmin, onNavigateToBlogs }) {
  const scrollToTop = () => {
    smoothScrollTo(0, 900);
  };

  return (
    <footer id="footer" className="relative bg-gradient-to-b from-[#1A060F] via-[#2A0A18] to-[#120309] text-white pt-20 sm:pt-28 pb-10 px-5 sm:px-10 lg:px-12 border-t border-[#E64A6E]/30 overflow-hidden">
      
      {/* ── Background Royal Ambient Glows (Matching Signature Button Rose & Gold) ── */}
      <div className="absolute top-0 right-1/4 w-[550px] h-[550px] bg-[#E64A6E]/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-[#C5A059]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#D8335B]/12 rounded-full blur-[160px] pointer-events-none" />

      {/* Top subtle golden-rose hairline */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E64A6E] via-[#F5D77F] to-transparent" />

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* ═══ TOP ROYAL ACCREDITATIONS & BRAND BANNER ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 35, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="pb-16 mb-16 border-b border-white/15 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left"
        >
          
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            <div className="relative group">
              <div className="absolute -inset-2 bg-[#E64A6E]/25 rounded-full blur-md group-hover:bg-[#E64A6E]/45 transition-all" />
              <img
                src="/logo.png"
                alt="Frame Your Moments"
                className="relative h-16 sm:h-20 w-auto object-contain filter drop-shadow-[0_4px_20px_rgba(230,74,110,0.35)] brightness-110"
              />
            </div>
            <div>
              <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-bold text-[#F5D77F] block mb-1">
                Fine Art Wedding Cinematography Studio
              </span>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl text-white font-light">
                Preserving Royal Legacies & Unscripted Love
              </h3>
            </div>
          </div>

          {/* Luxury Accolades Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-cinzel tracking-wider text-white">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 border border-white/20 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5D77F]" />
              <span className="text-white font-medium">EST. 2018</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 border border-white/20 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E64A6E]" />
              <span className="text-white font-medium">500+ Royal Weddings</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 border border-white/20 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-white font-medium">2026–27 Dates Open</span>
            </div>
          </div>

        </motion.div>

        {/* ═══ 4 GRAND EDITORIAL COLUMNS ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 35, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-white/15"
        >
          
          {/* ── COL 1: The Studio & Philosophy (4 Cols) ── */}
          <div className="lg:col-span-4 space-y-5">
            <h4 className="font-cinzel text-xs tracking-[0.25em] uppercase font-bold text-[#F5D77F] flex items-center gap-2">
              <span>The Studio</span>
              <span className="w-8 h-[1px] bg-[#F5D77F]/60" />
            </h4>
            
            <p className="font-sans text-sm text-white/90 leading-relaxed font-light">
              Based in Kolkata, Frame Your Moments is a premier fine-art wedding cinematography and editorial photography studio. We blend royal colors, candid warmth, and museum-grade craftsmanship across India, UAE, and worldwide destinations.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/918013346138?text=Hello%20Frame%20Your%20Moments%20Team!%20I%20would%20like%20to%20inquire%20about%20booking%20wedding%20photography."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f7a6d] text-white font-cinzel text-[10px] tracking-[0.2em] uppercase font-bold transition-all shadow-[0_4px_18px_rgba(37,211,102,0.35)] hover:scale-105"
              >
                <MessageCircle size={14} />
                <span>WhatsApp Inquiries</span>
              </a>

              <a
                href="https://www.instagram.com/frameyourmomentsofficial?stkn=eDNocDh2Z2t0d2s%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#E64A6E] text-white font-cinzel text-[10px] tracking-[0.2em] uppercase font-bold transition-all shadow-xs"
              >
                <svg className="w-3.5 h-3.5 text-[#E64A6E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                <span>Instagram</span>
              </a>

              <a
                href="https://www.facebook.com/share/1BjgBWk76r/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-[#1877F2]/25 border border-white/20 hover:border-[#1877F2] text-white font-cinzel text-[10px] tracking-[0.2em] uppercase font-bold transition-all shadow-xs"
              >
                <svg className="w-3.5 h-3.5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span>Facebook</span>
              </a>
            </div>
          </div>

          {/* ── COL 2: Explore Navigation (3 Cols) ── */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-cinzel text-xs tracking-[0.25em] uppercase font-bold text-[#F5D77F] flex items-center gap-2">
              <span>Experience</span>
              <span className="w-8 h-[1px] bg-[#F5D77F]/60" />
            </h4>
            
            <ul className="space-y-3 text-sm font-sans text-white/85">
              <li>
                <a href="#hero" className="hover:text-[#F5D77F] transition-colors flex items-center gap-2 group">
                  <ChevronRight size={13} className="text-[#F5D77F] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>Home & Showcase</span>
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#F5D77F] transition-colors flex items-center gap-2 group">
                  <ChevronRight size={13} className="text-[#F5D77F] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>Our Story & Philosophy</span>
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-[#F5D77F] transition-colors flex items-center gap-2 group">
                  <ChevronRight size={13} className="text-[#F5D77F] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>Drishtikon Grid Showcase</span>
                </a>
              </li>
              <li>
                <a
                  href="#watch"
                  onClick={(e) => {
                    if (onNavigateToVideos) {
                      e.preventDefault();
                      onNavigateToVideos();
                    }
                  }}
                  className="hover:text-[#F5D77F] transition-colors flex items-center gap-2 group cursor-pointer"
                >
                  <ChevronRight size={13} className="text-[#F5D77F] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>Cinematography & Films</span>
                </a>
              </li>
              <li>
                <a
                  href="#blogs"
                  onClick={(e) => {
                    if (onNavigateToBlogs) {
                      e.preventDefault();
                      onNavigateToBlogs();
                    }
                  }}
                  className="hover:text-[#F5D77F] transition-colors flex items-center gap-2 group cursor-pointer"
                >
                  <ChevronRight size={13} className="text-[#F5D77F] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>Journal & Wedding Stories</span>
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#F5D77F] transition-colors flex items-center gap-2 group">
                  <ChevronRight size={13} className="text-[#F5D77F] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>Wedding Packages & Pricing</span>
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-[#F5D77F] transition-colors flex items-center gap-2 group">
                  <ChevronRight size={13} className="text-[#F5D77F] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>Client Stories & Reviews</span>
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#F5D77F] transition-colors flex items-center gap-2 group text-[#F5D77F] font-medium">
                  <ChevronRight size={13} className="text-[#F5D77F] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>Check Date Availability</span>
                </a>
              </li>
            </ul>
          </div>

          {/* ── COL 3: Signature Offerings (2.5 Cols) ── */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-cinzel text-xs tracking-[0.25em] uppercase font-bold text-[#F5D77F] flex items-center gap-2">
              <span>Offerings</span>
              <span className="w-8 h-[1px] bg-[#F5D77F]/60" />
            </h4>
            
            <ul className="space-y-3 text-sm font-sans text-white/85">
              <li>
                <a href="#pricing" className="hover:text-[#F5D77F] transition-colors block">
                  Royal Bengali Weddings
                </a>
              </li>
              <li>
                <a
                  href="#watch"
                  onClick={(e) => {
                    if (onNavigateToVideos) {
                      e.preventDefault();
                      onNavigateToVideos();
                    }
                  }}
                  className="hover:text-[#F5D77F] transition-colors block cursor-pointer"
                >
                  4K Destination Cinema
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#F5D77F] transition-colors block">
                  Cinematic Pre-Weddings
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#F5D77F] transition-colors block">
                  Canvera Heirloom Albums
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#F5D77F] transition-colors block">
                  Aerial Drone Coverage
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#F5D77F] transition-colors block">
                  Bespoke Studio Packages
                </a>
              </li>
            </ul>
          </div>

          {/* ── COL 4: Studio Coordinates & Hours (2.5 Cols) ── */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-cinzel text-xs tracking-[0.25em] uppercase font-bold text-[#F5D77F] flex items-center gap-2">
              <span>Coordinates</span>
              <span className="w-8 h-[1px] bg-[#F5D77F]/60" />
            </h4>
            
            <div className="space-y-3.5 text-sm font-sans text-white/90">
              <a
                href="tel:+918013346138"
                className="flex items-center gap-3 hover:text-[#F5D77F] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-[#F5D77F] group-hover:border-[#F5D77F]/70 shrink-0">
                  <Phone size={14} />
                </div>
                <span className="text-white group-hover:text-[#F5D77F] font-medium">+91 80133 46138</span>
              </a>

              <a
                href="mailto:frameyourmoments2018@gmail.com"
                className="flex items-center gap-3 hover:text-[#F5D77F] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-[#E64A6E] group-hover:border-[#E64A6E]/70 shrink-0">
                  <Mail size={14} />
                </div>
                <span className="truncate text-white group-hover:text-[#F5D77F] font-medium">frameyourmoments2018@gmail.com</span>
              </a>

              <a
                href="https://www.google.com/maps/search/52+Mukundapur,+Kolkata-700099,+West+Bengal?entry=gmail&source=g"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-[#F5D77F] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-[#F5D77F] group-hover:border-[#F5D77F]/70 shrink-0 mt-0.5">
                  <MapPin size={14} />
                </div>
                <div className="text-xs leading-relaxed text-white/90">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-white block font-semibold text-[13px] group-hover:text-[#F5D77F] transition-colors">Kolkata Flagship Location</strong>
                    <span className="text-[10px] text-[#F5D77F]/80">↗</span>
                  </div>
                  6B/52 Mukundapur, Kolkata-700099, West Bengal<br />
                  <span className="text-white/60 text-[11px]">Destination Travel Worldwide</span>
                </div>
              </a>

              <div className="flex items-start gap-3 pt-1">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white/80 shrink-0 mt-0.5">
                  <Clock size={14} />
                </div>
                <div className="text-xs text-white/85 font-light">
                  Mon – Sun: 10:00 AM – 9:00 PM IST
                </div>
              </div>
            </div>
          </div>

        </motion.div>

        {/* ═══ VIP LOOKBOOK / WEDDING GUIDE STRIP ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 35, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#220713]/95 via-[#360D20]/95 to-[#220713]/95 border border-[#E64A6E]/40 shadow-[0_10px_35px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md"
        >
          <div className="space-y-1 text-center sm:text-left">
            <span className="font-cinzel text-[10px] tracking-[0.25em] uppercase font-bold text-[#F5D77F] block">
              VIP Wedding Concierge
            </span>
            <h4 className="font-serif-luxury text-xl sm:text-2xl text-white font-medium">
              Planning your 2026–2027 Wedding?
            </h4>
            <p className="font-sans text-xs text-white/90">
              Request our bespoke wedding lookbook & date availability checklist directly on WhatsApp.
            </p>
          </div>

          <a
            href="https://wa.me/918013346138?text=Hello%20Frame%20Your%20Moments!%20Please%20send%20me%20the%202026-2027%20Wedding%20Lookbook%20and%20Package%20Details."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#E64A6E] via-[#E8557B] to-[#D8335B] hover:from-[#d63a5e] hover:to-[#c4254d] text-white font-cinzel text-xs tracking-[0.18em] uppercase font-bold shadow-[0_6px_25px_rgba(230,74,110,0.4)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <MessageCircle size={15} />
            <span>Request Wedding Lookbook</span>
          </a>
        </motion.div>

        {/* ═══ BOTTOM BAR & BACK TO TOP BUTTON ═══ */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-white/75">
          
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 font-cinzel tracking-wider text-center sm:text-left">
            <p>© 2026 Frame Your Moments. All Rights Reserved.</p>
            <span className="hidden sm:inline text-white/30">|</span>
            <p className="text-white/90">Fine Art Photography & Royal Wedding Films</p>
            {onNavigateToAdmin && (
              <>
                <span className="hidden sm:inline text-white/30">|</span>
                <button
                  onClick={onNavigateToAdmin}
                  className="text-white/40 hover:text-[#F5D77F] transition-colors cursor-pointer text-[10px]"
                >
                  Owner Access
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-6">
            <p className="flex items-center gap-1.5 font-cinzel tracking-wider text-white/90">
              Crafted for eternal love <Heart size={12} className="text-[#E64A6E] fill-[#E64A6E]" />
            </p>

            {/* Luxury Back to Top Button */}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#F5D77F] text-[#F5D77F] hover:text-white font-cinzel text-[10px] tracking-widest uppercase font-bold transition-all cursor-pointer group shadow-xs"
            >
              <span>Top</span>
              <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
