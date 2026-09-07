import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  Check,
  ArrowRight,
  Film,
  Heart,
  Shield,
  ChevronLeft,
  ChevronRight,
  Camera,
  Video,
  BookOpen,
  Gem,
  Sparkles,
  Gift,
  Award,
  X,
  MessageCircle,
  Clock,
  Shirt,
  Eye,
  ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';

/* ════════════════════════════════════════════════════════════════════
   PACKAGE DATA (Extracted from official PDF specifications)
   ════════════════════════════════════════════════════════════════════ */

const CATEGORIES = [
  { id: 'both_side', label: 'Both Side', fullLabel: 'Both Side Wedding', icon: Heart, badge: '3-4 Days', color: '#E64A6E' },
  { id: 'single_side', label: 'Single Side', fullLabel: 'Single Side Wedding', icon: Camera, badge: '2-3 Days', color: '#C5A059' },
  { id: 'pre_wedding', label: 'Pre-Wedding', fullLabel: 'Pre-Wedding Shoot', icon: Film, badge: '1-2 Days', color: '#00A896' },
  { id: 'engagement', label: 'Engagement', fullLabel: 'Engagement Day', icon: Gem, badge: '1 Day', color: '#9B51E0' },
];

const PACKAGES_DATA = {
  both_side: [
    {
      id: 'bs-basic', name: 'Basic Wedding', subCat: 'both',
      tagline: 'Ideal for Both Side Celebrations',
      originalPrice: '75,000', price: '65,000', discountNote: 'Save ₹10,000',
      accent: '#C5A059', popular: false, badge: 'Save ₹10K',
      duration: '3 Days Both Side', photographers: '2 Photographers',
      cinematographers: '2 Cinematographers', drone: 'Not Included',
      photos: 'All Raw Soft Copies + 250 (125+125) Edited Pictures',
      album: '2 Plezer Album 40 Pages (20 Sheets)',
      video: '1 Reel, 1 Mint Teaser, 35 Mints Full Video',
      extraDeliverables: [],
      keyHighlights: ['3 Days Both Side Coverage', '2 Photographers + 2 Cinematographers', '2 Plezer Luxury Albums (40 Pgs)', '250 Edited Pictures + All Raw Copies', '35 Mints Cinematic Full Video + Teaser']
    },
    {
      id: 'bs-standard', name: 'Standard Wedding', subCat: 'both',
      tagline: 'Complete Family & Rituals Coverage',
      originalPrice: '85,000', price: '75,000', discountNote: 'Save ₹10,000',
      accent: '#D4AF37', popular: false, badge: 'Save ₹10K',
      duration: '3 Days Both Side', photographers: '2 Photographers',
      cinematographers: '2 Cinematographers', drone: 'Not Included',
      photos: 'All Raw Soft Copies + 400 (200+200) Edited Pictures',
      album: '2 Plezer Album 60 Pages (30 Sheets) + 2 Plezer Minibooks',
      video: '1 Reel / Highlights, 2-3 Mints Trailer, 35-45 Mints Full Video',
      extraDeliverables: ['2 Digital Albums', '2 Calendars', '1 Pen Drive 32 GB'],
      keyHighlights: ['3 Days Both Side Coverage', '2 Plezer Albums (60 Pgs) + 2 Minibooks', '400 Edited Pictures + All Raw Copies', '2 Digital Albums + 2 Calendars + 32GB Pen Drive', 'Reel + 2-3 Min Trailer + 35-45 Min Video']
    },
    {
      id: 'bs-premium', name: 'Premium Wedding', subCat: 'both',
      tagline: 'Our Most Loved Canvera Experience',
      originalPrice: '95,000', price: '85,000', discountNote: 'Save ₹10,000',
      accent: '#E64A6E', popular: true, badge: 'Most Popular',
      duration: '3 Days Both Side', photographers: '2 Photographers',
      cinematographers: '2 Cinematographers', drone: 'Not Included',
      photos: 'All Raw Soft Copies + 400 (200+200) Edited Pictures',
      album: '2 Canvera Album 60 Pages (30 Sheets) + 2 Canvera Minibooks',
      video: '2 Reels / Highlights, 2-3 Mints Trailer, 35-60 Mints Full Video',
      extraDeliverables: ['2 Digital Albums', '2 Calendars', '1 Pen Drive 64 GB'],
      keyHighlights: ['Luxury Canvera Albums (60 Pgs) + 2 Minibooks', '2 Instagram Reels / Highlights', '400 Edited Pictures + All Raw Copies', '2 Digital Albums + 2 Calendars + 64GB Pen Drive', '2-3 Min Trailer + 35-60 Min Full Video']
    },
    {
      id: 'bs-premium-plus', name: 'Premium Plus', subCat: 'both',
      tagline: 'Extended Coverage with Aerial Drone',
      originalPrice: '1,10,000', price: '1,00,000', discountNote: 'Save ₹10,000',
      accent: '#9B51E0', popular: false, badge: 'Drone Included',
      duration: '3+1 Days Both Side', photographers: '2 + 1 Photographers',
      cinematographers: '2 + 1 Cinematographers', drone: '1 Drone for Wedding Day',
      photos: 'All Raw Soft Copies + 400 (200+200) Edited Pictures',
      album: '2 Premium Canvera Album 60 Pages (30 Sheets) + 2 Canvera Minibooks',
      video: '3 Reels / Highlights, 2-3 Mints Trailer, 35-60 Mints Full Video',
      extraDeliverables: ['2 Digital Albums', '2 Calendars', '1 Pen Drive 64 GB'],
      keyHighlights: ['3+1 Days Both Side Full Coverage', '1 4K Aerial Drone for Wedding Day', '3 Photographers + 3 Cinematographers', '2 Premium Canvera Albums (60 Pgs)', '3 Reels + Trailer + 64GB Pen Drive']
    },
    {
      id: 'bs-elite', name: 'Elite Wedding', subCat: 'both',
      tagline: 'Grand Royal Cinematic Celebration',
      originalPrice: '1,30,000', price: '1,20,000', discountNote: 'Save ₹10,000',
      accent: '#C5A059', popular: false, badge: 'Royal Grandeur',
      duration: '3+1 Days Both Side', photographers: '2 + 1 Photographers',
      cinematographers: '2 + 1 Cinematographers', drone: '1 Drone for Wedding + Reception Day',
      photos: 'All Raw Soft Copies + 500 (250+250) Edited Pictures',
      album: '2 Premium Canvera Album 80 Pages (40 Sheets) + 2 Canvera Minibooks',
      video: '3 Reels / Highlights, 2-3 Mints Trailer, 35-60 Mints Full Video',
      extraDeliverables: ['2 Digital Albums', '2 Calendars', '1 Pen Drive 64 GB'],
      keyHighlights: ['Dual-Day Aerial Drone (Wedding + Reception)', '80 Pages (40 Sheets) Master Canvera Albums', '500 Edited Pictures + All Raw Copies', '3 Photographers + 3 Cinematographers', 'Complete Premium Deliverable Bundle']
    }
  ],

  single_side: [
    {
      id: 'ss-3day-basic', name: 'Basic 3-Day', subCat: '3days',
      tagline: '3 Days Single Side (Groom or Bride)',
      originalPrice: '65,000', price: '55,000', discountNote: 'Save ₹10,000',
      accent: '#C5A059', popular: false, badge: '3-Day',
      duration: '3 Days Groom / Bride Side', photographers: '1 Photographer',
      cinematographers: '1 Cinematographer', drone: 'Not Included',
      photos: 'All Raw Soft Copies + 125 Edited Pictures',
      album: '1 Plezer Album 40 Pages (20 Sheets) + 1 Plezer Minibook',
      video: '1 Reel / Highlights, 2-3 Mints Trailer, 35-45 Mints Full Video',
      extraDeliverables: ['1 Digital Album', '1 Calendar', '1 Pen Drive 32 GB'],
      keyHighlights: ['3 Days Single Side Coverage', '1 Plezer Album (40 Pgs) + 1 Minibook', '125 Edited Pictures + All Raw Copies', 'Digital Album + Calendar + 32GB Pen Drive', '1 Reel + Trailer + 35-45 Min Video']
    },
    {
      id: 'ss-2day-basic', name: 'Basic 2-Day', subCat: '2days',
      price: '40,000', tagline: 'Essential 2 Days Coverage',
      accent: '#4B5563', popular: false,
      duration: '2 Days', photographers: '1 Crop Photographer',
      cinematographers: '1 Crop Cinematographer', drone: 'Not Included',
      photos: 'All Raw Soft Copies + 125 Edited Pictures',
      album: '1 Plezer Album 40 Pages', video: '1 Mint Teaser, 35 Mints Full Video',
      extraDeliverables: [],
      keyHighlights: ['2 Days Coverage', '1 Crop Photographer + 1 Crop Cinematographer', '1 Plezer Album 40 Pages', '125 Edited Pictures + All Raw Copies', '1 Min Teaser + 35 Min Full Video']
    },
    {
      id: 'ss-2day-standard', name: 'Standard 2-Day', subCat: '2days',
      price: '45,000', tagline: 'Complete 2-Day Single Side Coverage',
      accent: '#D4AF37', popular: false,
      duration: '2 Days', photographers: '2 Crop Photographers',
      cinematographers: '2 Crop Cinematographers', drone: 'Not Included',
      photos: 'All Raw Soft Copies + 200 Edited Pictures',
      album: '1 Plezer Album 60 Pages + Minibook',
      video: '1 Reel / Highlights, 2-3 Mints Trailer, 35-45 Mints Full Video',
      extraDeliverables: ['Digital Album', 'Calendar', '32 GB Pen Drive'],
      keyHighlights: ['2 Crop Photographers + 2 Crop Cinematographers', '1 Plezer Album 60 Pages + Minibook', '200 Edited Pictures + All Raw Copies', 'Digital Album + Calendar + 32GB Pen Drive', '1 Reel + 2-3 Min Trailer + Full Video']
    },
    {
      id: 'ss-2day-premium', name: 'Premium 2-Day', subCat: '2days',
      price: '55,000', tagline: 'Full Frame High-Definition Craft',
      accent: '#E64A6E', popular: true, badge: 'Most Popular',
      duration: '2 Days', photographers: '1 Full Frame + 1 Crop Photographer',
      cinematographers: '1 Full Frame + 1 Crop Cinematographer', drone: 'Not Included',
      photos: 'All Raw Soft Copies + 200 Edited Pictures',
      album: '1 Canvera Album 60 Pages + Minibook',
      video: '2 Reels / Highlights, 2-3 Mints Trailer, 35-60 Mints Full Video',
      extraDeliverables: ['Digital Album', 'Calendar', '64 GB Pen Drive'],
      keyHighlights: ['Full Frame Sensor Master Cameras', '1 Canvera Luxury Album 60 Pages + Minibook', '2 Reels + 2-3 Min Trailer + Full Video', '200 Edited Pictures + All Raw Copies', 'Digital Album + Calendar + 64GB Pen Drive']
    },
    {
      id: 'ss-2day-premium-plus', name: 'Premium Plus 2-Day', subCat: '2days',
      price: '65,000', tagline: 'Dual Full Frame + Aerial Drone',
      accent: '#9B51E0', popular: false, badge: 'Drone Included',
      duration: '2 Days', photographers: '2 Full Frame Photographers',
      cinematographers: '2 Full Frame Cinematographers', drone: '1 Drone for Wedding Day',
      photos: 'All Raw Soft Copies + 200 Edited Pictures',
      album: '1 Premium Canvera Album 60 Pages + Minibook',
      video: '3 Reels / Highlights, 2-3 Mints Trailer, 35-60 Mints Full Video',
      extraDeliverables: ['Digital Album', 'Calendar', '64 GB Pen Drive'],
      keyHighlights: ['2 Full Frame Photographers + 2 Cinematographers', '1 4K Drone Aerial Coverage', '1 Premium Canvera Album 60 Pages', '3 Reels + Trailer + 35-60 Min Video', 'Digital Album + Calendar + 64GB Pen Drive']
    }
  ],

  pre_wedding: [
    {
      id: 'pw-basic', name: 'Basic', subCat: 'pre',
      price: '15,000', tagline: '1 Day Outdoor Romance Shoot',
      accent: '#C5A059', popular: false,
      duration: '1 Day', photographers: '1 Photographer',
      cinematographers: '1 Cinematographer', drone: 'Not Included',
      photos: 'All Raw Soft Copies + 15 Edited Pictures',
      album: 'Not Included', video: '3-4 Mints Cinematic Video',
      makeupDress: 'Not Included',
      keyHighlights: ['1 Day Outdoor Session', '1 Photographer + 1 Cinematographer', '15 High-Retouched Pictures', 'All Raw Soft Copies', '3-4 Mints Cinematic Video']
    },
    {
      id: 'pw-standard', name: 'Standard', subCat: 'pre',
      price: '20,000', tagline: 'Includes Printed Photo Book',
      accent: '#D4AF37', popular: false,
      duration: '1 Day', photographers: '1 Photographer',
      cinematographers: '1 Cinematographer', drone: 'Not Included',
      photos: 'All Raw Soft Copies + 15-20 Edited Pictures',
      album: 'Custom Photo Book', video: '3-4 Mints Cinematic Video',
      makeupDress: 'Not Included',
      keyHighlights: ['1 Day Outdoor Location Shoot', 'Custom Printed Photo Book Album', '15-20 Edited Pictures', 'All Raw Soft Copies Included', '3-4 Mints Cinematic Story Film']
    },
    {
      id: 'pw-premium', name: 'Premium', subCat: 'pre',
      price: '25,000', tagline: 'Includes Professional Makeup & Drone',
      accent: '#00A896', popular: false, badge: 'Makeup Included',
      duration: '1 Day', photographers: '1 Photographer',
      cinematographers: '1 Cinematographer', drone: '1 Drone Included',
      photos: 'All Raw Soft Copies + 20-25 Edited Pictures',
      album: 'Custom Photo Book', video: '30 Sec Teaser, 3-4 Mints Cinematic Video',
      makeupDress: 'Professional Bridal Makeup Included',
      keyHighlights: ['Professional Makeup Artist Included', '1 4K Aerial Drone Coverage', 'Custom Photo Book Album', '30 Sec Teaser + 3-4 Min Cinematic Video', '20-25 Retouched Pictures + All Raws']
    },
    {
      id: 'pw-premium-plus', name: 'Premium Plus', subCat: 'pre',
      price: '35,000', tagline: 'Complete Makeup & Designer Outfit Bundle',
      accent: '#E64A6E', popular: true, badge: 'Most Popular',
      duration: '1 Day', photographers: '1 Photographer',
      cinematographers: '1 Cinematographer', drone: '1 Drone Included',
      photos: 'All Raw Soft Copies + 25-30 Edited Pictures',
      album: 'Custom Photo Book', video: '30 Sec Teaser, 3-4 Mints Cinematic Video',
      makeupDress: 'Professional Makeup + Designer Dress Included',
      keyHighlights: ['Professional Makeup + Designer Outfits Included', '1 Aerial Drone Location Shoot', 'Custom Photo Book Album', '30 Sec Teaser + 3-4 Min Cinematic Video', '25-30 High-Retouched Pictures + All Raws']
    },
    {
      id: 'pw-elite', name: 'Elite', subCat: 'pre',
      price: '40,000', tagline: '2-Day Cinematic Fashion & Location Film',
      accent: '#C5A059', popular: false, badge: '2-Day Shoot',
      duration: '2 Days Shoot', photographers: '1 Photographer',
      cinematographers: '1 Cinematographer', drone: '1 Drone Included',
      photos: 'All Raw Soft Copies + 40-50 Edited Pictures',
      album: 'Custom Photo Book', video: '30 Sec Teaser, 3-4 Mints Cinematic Video',
      makeupDress: 'Professional Makeup + Designer Dress Included',
      keyHighlights: ['2 Days Multi-Location Shoot', 'Makeup Artist & Designer Wardrobe', '1 Aerial Drone Cinematography', '40-50 Master Retouched Pictures', 'Full Premium Pre-Wedding Album']
    }
  ],

  engagement: [
    {
      id: 'eng-basic', name: 'Engagement Package', subCat: 'eng',
      tagline: 'Complete Engagement Day Celebration',
      originalPrice: '30,000', price: '25,000', discountNote: 'Save ₹5,000',
      accent: '#E64A6E', popular: true, badge: 'Save ₹5K',
      duration: '1 Day Event', photographers: '1 Photographer',
      cinematographers: '1 Cinematographer', drone: 'Not Included',
      photos: 'All Raw Soft Copies + 125 Edited Pictures',
      album: '1 Plezer Album 40 Pages (20 Sheets) + 1 Plezer Minibook',
      video: '1 Reel / Highlights, 2-3 Mints Trailer, 35-45 Mints Full Video',
      extraDeliverables: ['1 Digital Album', '1 Calendar', '1 Pen Drive 32 GB'],
      keyHighlights: ['1 Day Full Engagement Event Coverage', '1 Photographer + 1 Cinematographer', '1 Plezer Album (40 Pgs) + 1 Minibook', '1 Reel + 2-3 Min Trailer + 35-45 Min Video', 'Digital Album + Calendar + 32GB Pen Drive']
    }
  ]
};

/* ════════════════════════════════════════
   CSS MICRO-ANIMATIONS & STYLES
   ════════════════════════════════════════ */
const pricingCSS = `
@keyframes pricingFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes revealLine {
  from { width: 0; }
  to { width: 100%; }
}
@keyframes priceCount {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes shineSlide {
  0% { left: -100%; }
  100% { left: 200%; }
}
@keyframes pulseRing {
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.15); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
}
.pkg-card-hover:hover .pkg-shine {
  animation: shineSlide 0.8s ease-in-out;
}
.pkg-card-hover {
  transform-style: preserve-3d;
  perspective: 1200px;
}
.pricing-scroll-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}
.pricing-scroll-hide::-webkit-scrollbar { display: none; }
.line-reveal { animation: revealLine 1.2s ease-out forwards; }
.pkg-float { animation: pricingFloat 6s ease-in-out infinite; }
.price-enter { animation: priceCount 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
.pulse-ring { animation: pulseRing 2s ease-out infinite; }
`;

/* ════════════════════════════════════════
   MAIN PRICING COMPONENT
   ════════════════════════════════════════ */
export default function Pricing() {
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  const [activeCategory, setActiveCategory] = useState('both_side');
  const [singleSideFilter, setSingleSideFilter] = useState('all');
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [mobileIdx, setMobileIdx] = useState(0);
  const [expandedId, setExpandedId] = useState(null);

  const activeCat = CATEGORIES.find((c) => c.id === activeCategory);

  const getFilteredPackages = useCallback(() => {
    const pkgs = PACKAGES_DATA[activeCategory] || [];
    if (activeCategory === 'single_side' && singleSideFilter !== 'all') {
      return pkgs.filter((p) => p.subCat === singleSideFilter);
    }
    return pkgs;
  }, [activeCategory, singleSideFilter]);

  const activePackages = getFilteredPackages();

  useEffect(() => {
    setMobileIdx(0);
    setExpandedId(null);
  }, [activeCategory, singleSideFilter]);

  const openWhatsApp = (pkg) => {
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 }, colors: ['#C5A059', '#E64A6E', '#D4AF37'] });
    } catch (_) {}
    const text = encodeURIComponent(
      `Hello Frame Your Moments! I am interested in booking the *${pkg.name}* package (${pkg.duration || 'Event Coverage'}) priced at ₹${pkg.price}/-. Please share availability and booking procedure.`
    );
    window.open(`https://wa.me/918013346138?text=${text}`, '_blank');
  };

  /* Mobile Carousel Controls */
  const scrollToCard = (idx) => {
    if (!carouselRef.current) return;
    const cards = carouselRef.current.children;
    if (cards[idx]) {
      cards[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setMobileIdx(idx);
    }
  };

  const onCarouselScroll = () => {
    if (!carouselRef.current) return;
    const c = carouselRef.current;
    const center = c.scrollLeft + c.offsetWidth / 2;
    let closest = 0, minD = Infinity;
    Array.from(c.children).forEach((el, i) => {
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
      if (d < minD) { minD = d; closest = i; }
    });
    setMobileIdx(closest);
  };

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative w-full pt-20 sm:pt-28 pb-10 sm:pb-14 bg-[#FAF7F2] overflow-hidden border-t border-[#E8DFD1]/60 scroll-mt-10"
    >
      <div id="packages" className="absolute -top-10" aria-hidden="true" />
      <style dangerouslySetInnerHTML={{ __html: pricingCSS }} />

      {/* Ambient Background */}
      <div className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full opacity-[0.04] pointer-events-none" style={{ background: `radial-gradient(circle, ${activeCat?.color || '#C5A059'}, transparent 70%)` }} />
      <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none bg-[#E64A6E]" style={{ filter: 'blur(120px)' }} />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-12 relative z-10">

        {/* ═══ SECTION HEADER ═══ */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-5 flex items-center justify-center gap-3"
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

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl italic text-[#1C1917] font-light mb-3"
          >
            Photography Packages
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-2 mb-5"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#E64A6E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#1C1917]/15" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="font-sans text-[#57534E] max-w-2xl leading-relaxed text-sm sm:text-base"
          >
            Select your celebration type below and discover the perfect plan — every package crafted with love, no hidden costs.
          </motion.p>
        </div>

        {/* ═══ CATEGORY SELECTOR — Immersive Pill Tabs ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 sm:mb-12"
        >
          <div className="w-full overflow-x-auto pricing-scroll-hide">
            <div className="flex items-center justify-center min-w-max px-2">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-white/80 backdrop-blur-md border border-[#E8DFD1] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  const CatIcon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-xl font-cinzel text-[9px] sm:text-[11px] tracking-[0.1em] uppercase font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                        isActive ? 'text-white' : 'text-[#8A7968] hover:text-[#1C1917]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="catPill"
                          className="absolute inset-0 rounded-xl shadow-lg"
                          style={{ background: cat.color }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <CatIcon size={13} className="relative z-10" />
                      <span className="relative z-10">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Category Title Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center mt-5 gap-3"
            >
              <span className="font-serif-luxury text-xl sm:text-2xl italic text-[#1C1917]">
                {activeCat?.fullLabel}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-cinzel tracking-wider uppercase font-bold border" style={{ color: activeCat?.color, borderColor: activeCat?.color + '40', background: activeCat?.color + '10' }}>
                {activeCat?.badge}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Sub-filter for Single Side */}
          <AnimatePresence>
            {activeCategory === 'single_side' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center mt-4 overflow-hidden"
              >
                <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#F5EFE6] border border-[#E8DFD1]">
                  {[
                    { id: 'all', label: 'All' },
                    { id: '3days', label: '3-Day' },
                    { id: '2days', label: '2-Day' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSingleSideFilter(f.id)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer ${
                        singleSideFilter === f.id
                          ? 'bg-[#1C1917] text-white shadow-sm'
                          : 'text-[#57534E] hover:bg-white/70'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ═══ PACKAGE CARDS ═══ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${singleSideFilter}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Mobile: Horizontal Snap Carousel */}
            <div className="relative lg:hidden">
              {activePackages.length > 1 && (
                <>
                  <button onClick={() => scrollToCard(Math.max(0, mobileIdx - 1))} className="absolute -left-1 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white border border-[#E8DFD1] text-[#1C1917] flex items-center justify-center hover:bg-[#C5A059] hover:text-white hover:border-[#C5A059] transition-all shadow-md cursor-pointer" aria-label="Previous">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => scrollToCard(Math.min(activePackages.length - 1, mobileIdx + 1))} className="absolute -right-1 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white border border-[#E8DFD1] text-[#1C1917] flex items-center justify-center hover:bg-[#C5A059] hover:text-white hover:border-[#C5A059] transition-all shadow-md cursor-pointer" aria-label="Next">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
              <div ref={carouselRef} onScroll={onCarouselScroll} data-lenis-prevent className="pricing-scroll-hide flex gap-5 overflow-x-auto snap-x snap-mandatory py-4 px-3">
                {activePackages.map((pkg, i) => (
                  <PackageCard key={pkg.id} pkg={pkg} index={i} isInView={isInView} onDetail={() => setSelectedPkg(pkg)} onBook={() => openWhatsApp(pkg)} isMobile catColor={activeCat?.color} expandedId={expandedId} setExpandedId={setExpandedId} />
                ))}
              </div>
              {activePackages.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  {activePackages.map((_, i) => (
                    <button key={i} onClick={() => scrollToCard(i)} className={`rounded-full transition-all duration-300 cursor-pointer ${mobileIdx === i ? 'w-8 h-2 bg-[#C5A059]' : 'w-2 h-2 bg-[#E8DFD1]'}`} />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: Grid */}
            <div className={`hidden lg:grid gap-7 items-stretch ${
              activePackages.length <= 2 ? 'grid-cols-2 max-w-3xl mx-auto' :
              activePackages.length <= 3 ? 'grid-cols-3' :
              'grid-cols-3 xl:grid-cols-5'
            }`}>
              {activePackages.map((pkg, i) => (
                <PackageCard key={pkg.id} pkg={pkg} index={i} isInView={isInView} onDetail={() => setSelectedPkg(pkg)} onBook={() => openWhatsApp(pkg)} catColor={activeCat?.color} expandedId={expandedId} setExpandedId={setExpandedId} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ═══ BOTTOM TRUST BAR ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 sm:mt-14"
        >
          <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
            <div className="flex-1 max-w-[200px] h-[1px] bg-gradient-to-r from-transparent to-[#E8DFD1]" />
            <div className="w-1.5 h-1.5 rotate-45 border border-[#C5A059]/40" />
            <div className="flex-1 max-w-[200px] h-[1px] bg-gradient-to-l from-transparent to-[#E8DFD1]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Shield, label: '100% Transparent', sub: 'No hidden taxes or extras' },
              { icon: Heart, label: 'Customizable Add-ons', sub: 'Tailored to your rituals' },
              { icon: Award, label: '4.9★ Google Rated', sub: '35+ Weddings Last Year' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-[#E8DFD1] shadow-xs group hover:border-[#C5A059]/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] flex items-center justify-center text-[#C5A059] flex-shrink-0 group-hover:bg-[#C5A059]/[0.08] transition-colors">
                  <item.icon size={18} />
                </div>
                <div className="text-left">
                  <span className="font-sans text-xs sm:text-sm font-semibold text-[#1C1917] block leading-tight">{item.label}</span>
                  <span className="font-cinzel text-[9px] tracking-wider uppercase text-[#8A7968]">{item.sub}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center font-sans text-xs text-[#8A7968] mt-6 max-w-xl mx-auto leading-relaxed">
            Need a custom package or destination booking? Call or WhatsApp us at{' '}
            <a href="tel:+918013346138" className="font-bold text-[#1C1917] hover:text-[#C5A059] transition-colors">
              +91 8013346138
            </a>
          </p>
        </motion.div>
      </div>

      {/* ═══ FULL-SCREEN DETAIL DRAWER ═══ */}
      <AnimatePresence>
        {selectedPkg && (
          <DetailDrawer pkg={selectedPkg} onClose={() => setSelectedPkg(null)} onBook={() => { setSelectedPkg(null); openWhatsApp(selectedPkg); }} />
        )}
      </AnimatePresence>
    </section>
  );
}


/* ════════════════════════════════════════
   PACKAGE CARD
   ════════════════════════════════════════ */
function PackageCard({ pkg, index, isInView, onDetail, onBook, isMobile, catColor, expandedId, setExpandedId }) {
  const isExpanded = expandedId === pkg.id;
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 20 });

  const handleMouse = (e) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const resetMouse = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.12 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={!isMobile ? { rotateX, rotateY, transformPerspective: 1200 } : undefined}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      className={`relative pkg-card-hover ${isMobile ? 'flex-shrink-0 w-[85vw] max-w-[360px] snap-center' : 'h-full'}`}
    >
      <div className={`relative rounded-3xl overflow-hidden flex flex-col w-full h-full transition-all duration-500 ${
        pkg.popular
          ? 'bg-white shadow-[0_12px_48px_-12px_rgba(230,74,110,0.2)] ring-2 ring-[#E64A6E]/20 hover:shadow-[0_20px_60px_-12px_rgba(230,74,110,0.3)]'
          : 'bg-white shadow-[0_8px_32px_-8px_rgba(0,0,0,0.06)] ring-1 ring-[#E8DFD1] hover:shadow-[0_16px_48px_-8px_rgba(197,160,89,0.15)] hover:ring-[#C5A059]/40'
      }`}>

        {/* Shine Sweep Overlay */}
        <div className="pkg-shine absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)', left: '-100%' }} />

        {/* Top Accent Bar */}
        <div className="h-1 w-full" style={{ background: pkg.popular ? 'linear-gradient(90deg, #E64A6E, #D8335B, #E64A6E)' : `linear-gradient(90deg, transparent 10%, ${pkg.accent}, transparent 90%)` }} />

        {/* Badge */}
        {pkg.badge && (
          <div className="absolute top-4 right-4 z-20">
            <span className={`px-2.5 py-1 rounded-lg font-cinzel text-[9px] tracking-[0.15em] uppercase font-bold ${
              pkg.popular
                ? 'bg-[#E64A6E] text-white shadow-[0_4px_12px_rgba(230,74,110,0.3)]'
                : 'bg-[#FAF7F2] text-[#C5A059] border border-[#E8DFD1]'
            }`}>
              {pkg.badge}
            </span>
          </div>
        )}

        {/* Header */}
        <div className="p-5 sm:p-6 pb-3">
          <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase font-bold block mb-1" style={{ color: catColor || '#8A7968' }}>
            {pkg.duration}
          </span>
          <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#1C1917] font-medium leading-snug pr-16">
            {pkg.name}
          </h3>
          <p className="font-sans text-[11px] text-[#8A7968] mt-0.5 leading-relaxed">
            {pkg.tagline}
          </p>
        </div>

        {/* Price Block */}
        <div className="px-5 sm:px-6 mb-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-[#F3ECE0] border border-[#E8DFD1]/80">
            <div className="flex items-end justify-between">
              <div>
                {pkg.originalPrice && (
                  <span className="font-sans text-[11px] text-[#8A7968] line-through block mb-0.5">
                    ₹{pkg.originalPrice}/-
                  </span>
                )}
                <div className="flex items-baseline gap-0.5">
                  <span className="font-cinzel text-sm text-[#8A7968]">₹</span>
                  <span className="font-serif-luxury text-3xl font-light leading-none price-enter" style={{ color: pkg.accent }}>
                    {pkg.price}
                  </span>
                  <span className="font-sans text-[11px] text-[#8A7968] ml-0.5">/-</span>
                </div>
              </div>
              {/* Quick stats */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <Camera size={13} className="text-[#8A7968]" />
                  <span className="text-[9px] font-sans text-[#8A7968] mt-0.5">{pkg.photographers?.split(' ')[0]}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Video size={13} className="text-[#8A7968]" />
                  <span className="text-[9px] font-sans text-[#8A7968] mt-0.5">{pkg.cinematographers?.split(' ')[0]}</span>
                </div>
                {pkg.drone && pkg.drone !== 'Not Included' && (
                  <div className="flex flex-col items-center">
                    <Sparkles size={13} className="text-[#00A896]" />
                    <span className="text-[9px] font-sans text-[#00A896] font-bold mt-0.5">4K</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key Highlights */}
        <div className="px-5 sm:px-6 pb-2 flex-1">
          <ul className="space-y-2">
            {pkg.keyHighlights.slice(0, isExpanded ? undefined : 3).map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] font-sans text-[#57534E] leading-snug">
                <Check size={13} className="shrink-0 mt-0.5" style={{ color: pkg.accent }} strokeWidth={2.5} />
                <span>{h}</span>
              </li>
            ))}
          </ul>
          {pkg.keyHighlights.length > 3 && (
            <button
              onClick={() => setExpandedId(isExpanded ? null : pkg.id)}
              className="flex items-center gap-1 mt-2 font-cinzel text-[9px] tracking-[0.15em] uppercase text-[#8A7968] hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              <ChevronDown size={12} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              <span>{isExpanded ? 'Show Less' : `+${pkg.keyHighlights.length - 3} More`}</span>
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="p-5 sm:p-6 pt-3 space-y-2">
          <button
            onClick={onBook}
            className={`w-full py-3 rounded-2xl font-cinzel text-[10px] tracking-[0.18em] uppercase font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
              pkg.popular
                ? 'bg-gradient-to-r from-[#E64A6E] via-[#E8557B] to-[#D8335B] text-white shadow-[0_8px_24px_rgba(230,74,110,0.3)] hover:shadow-[0_12px_32px_rgba(230,74,110,0.4)] hover:scale-[1.02]'
                : 'bg-[#1C1917] text-white hover:bg-[#C5A059] hover:shadow-md'
            }`}
          >
            <MessageCircle size={13} />
            <span>Book via WhatsApp</span>
          </button>
          <button
            onClick={onDetail}
            className="w-full py-2 rounded-xl flex items-center justify-center gap-1.5 font-cinzel text-[9px] tracking-[0.15em] uppercase text-[#8A7968] hover:text-[#1C1917] hover:bg-[#FAF7F2] transition-all cursor-pointer"
          >
            <Eye size={12} />
            <span>View Full Specifications</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}


/* ════════════════════════════════════════
   FULL-SCREEN DETAIL DRAWER
   ════════════════════════════════════════ */
function DetailDrawer({ pkg, onClose, onBook }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const specs = [
    { icon: Clock, label: 'Coverage Duration', value: pkg.duration },
    { icon: Camera, label: 'Photography Team', value: pkg.photographers },
    { icon: Video, label: 'Cinematography Team', value: pkg.cinematographers },
    pkg.drone && pkg.drone !== 'Not Included' && { icon: Sparkles, label: 'Aerial Drone', value: pkg.drone },
    { icon: Eye, label: 'Edited Photos', value: pkg.photos },
    pkg.album && pkg.album !== 'Not Included' && { icon: BookOpen, label: 'Albums & Books', value: pkg.album },
    { icon: Film, label: 'Films & Video', value: pkg.video },
    pkg.makeupDress && pkg.makeupDress !== 'Not Included' && { icon: Shirt, label: 'Makeup & Outfit', value: pkg.makeupDress },
    pkg.extraDeliverables?.length > 0 && { icon: Gift, label: 'Bonus Extras', value: pkg.extraDeliverables.join(' • ') },
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1C1917]/70 backdrop-blur-sm" />

      {/* Drawer Panel */}
      <motion.div
        initial={{ scale: 0.95, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 40, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full max-h-[88vh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-[#E8DFD1] overflow-hidden"
      >
        {/* Sticky Header with Close + Accent */}
        <div className="sticky top-0 z-20 bg-white flex-shrink-0">
          <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${pkg.accent}, ${pkg.accent}80, ${pkg.accent})` }} />
          <div className="flex items-center justify-between px-6 sm:px-8 py-3 border-b border-[#E8DFD1]/60">
            <span className="font-cinzel text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: pkg.accent }}>
              {pkg.duration}
            </span>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#E8DFD1] flex items-center justify-center text-[#1C1917] hover:bg-[#1C1917] hover:text-white transition-all cursor-pointer">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1" data-lenis-prevent>

        <div className="p-6 sm:p-8">
          {/* Meta */}
          <div className="flex items-center gap-2 mb-2">
            {pkg.badge && (
              <span className="px-2 py-0.5 rounded-md text-[9px] font-cinzel tracking-wider uppercase font-bold border" style={{ color: pkg.accent, borderColor: pkg.accent + '40', background: pkg.accent + '10' }}>
                {pkg.badge}
              </span>
            )}
          </div>

          <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] font-medium mb-1">
            {pkg.name}
          </h3>
          <p className="font-sans text-xs text-[#8A7968] mb-6">{pkg.tagline}</p>

          {/* Price Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-[#F3ECE0] border border-[#E8DFD1] mb-6 flex items-end justify-between">
            <div>
              <span className="font-cinzel text-[10px] tracking-[0.15em] uppercase text-[#8A7968] block mb-1">Your Investment</span>
              {pkg.originalPrice && (
                <span className="font-sans text-sm text-[#8A7968] line-through block">₹{pkg.originalPrice}/-</span>
              )}
              <div className="flex items-baseline gap-1">
                <span className="font-cinzel text-base text-[#8A7968]">₹</span>
                <span className="font-serif-luxury text-4xl font-light" style={{ color: pkg.accent }}>{pkg.price}</span>
                <span className="font-sans text-sm text-[#8A7968]">/-</span>
              </div>
            </div>
            {pkg.discountNote && (
              <span className="px-3 py-1.5 rounded-xl text-xs font-cinzel tracking-wider uppercase font-bold bg-[#00A896]/10 text-[#00A896] border border-[#00A896]/20">
                {pkg.discountNote}
              </span>
            )}
          </div>

          {/* Specifications List */}
          <h4 className="font-cinzel text-xs tracking-[0.2em] uppercase font-bold text-[#1C1917] mb-4 flex items-center gap-2">
            <div className="w-5 h-[2px] bg-[#C5A059]" />
            Complete Deliverable Breakdown
          </h4>

          <div className="space-y-0 mb-6">
            {specs.map((spec, i) => (
              <div key={i} className={`flex items-start gap-3 py-3.5 ${i < specs.length - 1 ? 'border-b border-[#E8DFD1]/60' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFD1] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <spec.icon size={14} className="text-[#C5A059]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-cinzel text-[9px] tracking-[0.15em] uppercase text-[#8A7968] block mb-0.5 font-bold">
                    {spec.label}
                  </span>
                  <span className="font-sans text-[13px] text-[#1C1917] leading-relaxed block">
                    {spec.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={onBook}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-cinzel text-[11px] tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2.5 shadow-[0_8px_24px_rgba(37,211,102,0.25)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.35)] hover:scale-[1.01] transition-all cursor-pointer"
          >
            <MessageCircle size={16} />
            <span>Book via WhatsApp (+91 8013346138)</span>
          </button>
        </div>
        </div>{/* end scrollable content */}
      </motion.div>
    </motion.div>
  );
}
