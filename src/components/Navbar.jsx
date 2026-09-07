import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Wedding Films', isVideosLink: true },
  { label: 'Services', href: '#services' },
  { label: 'Journal & Blogs', isBlogsLink: true },
  { label: 'Packages', href: '#pricing' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ onNavigateToVideos, onNavigateToAdmin, onNavigateToBlogs }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      // Check if Grid Showcase section spacer is active in viewport
      const gridElem = document.getElementById('grid-showcase-spacer');
      if (gridElem) {
        const rect = gridElem.getBoundingClientRect();
        // Hide navbar smoothly when the grid section reveal window is active
        if (rect.top < window.innerHeight - 100 && rect.bottom > 100) {
          setHidden(true);
        } else {
          setHidden(false);
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      {/* ─── Navbar ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 transform ${
        hidden
          ? 'opacity-0 -translate-y-full pointer-events-none'
          : 'opacity-100 translate-y-0'
      } ${
        menuOpen
          ? 'bg-transparent shadow-none'
          : scrolled
            ? 'bg-[#FAF7F2]/95 backdrop-blur-sm shadow-[0_1px_0_#E8DFD1]'
            : 'bg-[#FAF7F2]'
      }`}>
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 h-16 sm:h-[72px] flex items-center justify-between">
          
          {/* Left: Contact */}
          <a
            href="#contact"
            className="flex items-center gap-2 font-cinzel text-[11px] tracking-[0.18em] text-[#44403C] hover:text-[#C5A059] transition-colors uppercase"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Contact
          </a>

          {/* Center: Logo */}
          <a href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center py-1">
            <img
              src="/logo.png"
              alt="Frame Your Moments"
              className="h-14 sm:h-[68px] max-h-[68px] w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </a>

          {/* Right: Menu button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-3 cursor-pointer group"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="font-cinzel text-[11px] tracking-[0.22em] text-[#44403C] uppercase font-medium group-hover:text-[#C5A059] transition-colors">
              Menu
            </span>

            {/* Hamburger → X morph */}
            <div className="flex flex-col gap-[5px] w-6">
              <span
                className="block h-[1.5px] w-full bg-[#1C1917] group-hover:bg-[#C5A059] origin-center"
                style={{
                  transform: menuOpen ? 'translateY(3.25px) rotate(45deg)' : 'none',
                  transition: 'transform 0.35s cubic-bezier(0.76,0,0.24,1), background 0.3s',
                }}
              />
              <span
                className="block h-[1.5px] w-full bg-[#1C1917] group-hover:bg-[#C5A059] origin-center"
                style={{
                  transform: menuOpen ? 'translateY(-3.25px) rotate(-45deg)' : 'none',
                  transition: 'transform 0.35s cubic-bezier(0.76,0,0.24,1), background 0.3s',
                }}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* ─── Fullscreen Menu Overlay ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col"
          >
            {/* Overlay top — no close button here; navbar button (z-60) handles it */}
            <div className="flex items-center justify-between px-5 sm:px-10 h-16 sm:h-[72px] border-b border-[#E8DFD1] flex-shrink-0">
              <span className="font-cinzel text-[11px] tracking-[0.18em] text-[#44403C] uppercase">
                Contact
              </span>
              <img src="/logo.png" alt="FYM" className="h-14 sm:h-[68px] max-h-[68px] w-auto object-contain absolute left-1/2 -translate-x-1/2" />
              {/* Spacer to keep layout balanced */}
              <div className="w-16" />
            </div>

            {/* Menu body */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Left: Links */}
              <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 py-10 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href || '#'}
                    onClick={(e) => {
                      if (link.isVideosLink) {
                        e.preventDefault();
                        setMenuOpen(false);
                        if (onNavigateToVideos) onNavigateToVideos();
                      } else if (link.isBlogsLink) {
                        e.preventDefault();
                        setMenuOpen(false);
                        if (onNavigateToBlogs) onNavigateToBlogs();
                      } else {
                        setMenuOpen(false);
                      }
                    }}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex items-center gap-4 py-3 sm:py-4 border-b border-[#E8DFD1] hover:border-[#C5A059] transition-colors duration-300 cursor-pointer"
                  >
                    <span className="font-cinzel text-[10px] text-[#B0A898] w-6">0{i + 1}</span>
                    <span className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-[#1C1917] group-hover:text-[#C5A059] group-hover:translate-x-3 inline-block transition-all duration-300">
                      {link.label}
                    </span>
                  </motion.a>
                ))}
              </div>

              {/* Right: Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="hidden lg:flex flex-col justify-between w-80 xl:w-96 border-l border-[#E8DFD1] px-10 py-12"
              >
                <div className="space-y-8">
                  <div>
                    <p className="font-cinzel text-[9px] tracking-[0.3em] uppercase text-[#B0A898] mb-2">Studio</p>
                    <p className="font-serif-luxury text-lg text-[#1C1917]">Frame Your Moments</p>
                    <p className="font-cinzel text-[10px] text-[#8A7968] mt-1 tracking-wider">Fine Art Photography</p>
                  </div>
                  <div>
                    <p className="font-cinzel text-[9px] tracking-[0.3em] uppercase text-[#B0A898] mb-2">Destinations</p>
                    <p className="font-sans text-sm text-[#44403C] leading-relaxed">India · UAE · Europe<br />Worldwide Bookings Open</p>
                  </div>
                  <div>
                    <p className="font-cinzel text-[9px] tracking-[0.3em] uppercase text-[#B0A898] mb-2">Contact</p>
                    <p className="font-sans text-sm text-[#44403C]">hello@frameyourmoments.in</p>
                    <p className="font-sans text-sm text-[#44403C]">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex gap-5 text-[10px] font-cinzel tracking-[0.2em] uppercase text-[#8A7968]">
                  <a href="#" className="hover:text-[#C5A059] transition-colors">Instagram</a>
                  <a href="#" className="hover:text-[#C5A059] transition-colors">YouTube</a>
                  <a href="#" className="hover:text-[#C5A059] transition-colors">Pinterest</a>
                </div>
              </motion.div>
            </div>

            {/* Overlay footer */}
            <div className="px-8 sm:px-14 lg:px-20 py-4 border-t border-[#E8DFD1] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <span className="font-cinzel text-[9px] tracking-[0.25em] uppercase text-[#B0A898]">© 2026 Frame Your Moments</span>
                {onNavigateToAdmin && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigateToAdmin();
                    }}
                    className="text-[9px] font-cinzel tracking-widest uppercase text-[#B0A898] hover:text-[#C5A059] transition-colors cursor-pointer"
                  >
                    • Owner Panel
                  </button>
                )}
              </div>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="px-6 py-2.5 bg-gradient-to-r from-[#E64A6E] via-[#E8557B] to-[#D8335B] text-white font-cinzel text-[10px] tracking-[0.2em] uppercase font-bold rounded-full shadow-[0_4px_15px_rgba(230,74,110,0.3)] hover:shadow-[0_6px_20px_rgba(230,74,110,0.45)] hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                Book Your Wedding
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
